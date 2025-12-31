import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  // Check the authorization header to ensure the request comes from cron-job.org
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const now = new Date();

  // Calculate total minutes since epoch to handle intervals consistently
  const totalMinutes = Math.floor(now.getTime() / 60000);

  // Use UTC values for comparison to match Vercel and cron-job.org server times
  const currentHour = now.getUTCHours();
  const currentMin = now.getUTCMinutes();
  const currentDay = now.getUTCDate();
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();

  try {
    // Fetch only the apps that the user has explicitly enabled
    const appsToTrigger = await prisma.app.findMany({
      where: { isEnabled: true },
    });

    // Determine which apps are due for execution based on their specific schedules
    const activeTasks = appsToTrigger.filter((app) => {
      const lastRun = app.lastRunAt ? new Date(app.lastRunAt) : new Date(0);

      // Check if the job has already successfully executed today (UTC)
      const ranToday =
        lastRun.getUTCDate() === currentDay &&
        lastRun.getUTCMonth() === currentMonth &&
        lastRun.getUTCFullYear() === currentYear;

      // Minutes Schedule: Checks if current or previous minute matches interval
      // This "buffer" ensures we don't miss tasks since cron-job.org runs every 2 mins
      if (app.scheduleType === 'MINUTES' && app.intervalMinutes) {
        if (app.intervalMinutes === 1) return true;
        const isDueNow = totalMinutes % app.intervalMinutes === 0;
        const wasDueLastMin = (totalMinutes - 1) % app.intervalMinutes === 0;
        return isDueNow || wasDueLastMin;
      }

      // Daily Schedule: Checks if current time is past the scheduled time and hasn't run today
      // This stateful check prevents missing the job if the trigger is slightly late
      if (app.scheduleType === 'DAILY' && app.dailyTime) {
        const [targetHr, targetMin] = app.dailyTime.split(':').map(Number);
        const isTimeReached =
          currentHour > targetHr || (currentHour === targetHr && currentMin >= targetMin);

        return isTimeReached && !ranToday;
      }

      // Monthly Schedule: Matches specific day of the month and time reached
      if (app.scheduleType === 'MONTHLY' && app.monthlyDay === currentDay && app.monthlyTime) {
        const [targetHr, targetMin] = app.monthlyTime.split(':').map(Number);
        const isTimeReached =
          currentHour > targetHr || (currentHour === targetHr && currentMin >= targetMin);

        return isTimeReached && !ranToday;
      }

      return false;
    });

    // Execute all due tasks simultaneously without letting one failure stop the rest
    const results = await Promise.allSettled(
      activeTasks.map(async (app) => {
        // Mark the job as executed immediately to prevent overlap from subsequent pings
        await prisma.app.update({
          where: { id: app.id },
          data: { lastRunAt: new Date() },
        });

        const start = Date.now();
        try {
          // Perform the actual ping to the external application URL
          const res = await fetch(app.url, { method: 'GET' });
          const duration = Date.now() - start;

          // Record a successful execution log in the database
          return await prisma.executionLog.create({
            data: {
              appId: app.id,
              status: res.status,
              success: res.ok,
              duration: duration,
              responseBody: await res.text().then((t) => t.slice(0, 500)),
            },
          });
        } catch (err) {
          // Record a failed execution log if the URL is unreachable
          return await prisma.executionLog.create({
            data: {
              appId: app.id,
              status: 500,
              success: false,
              errorMessage: err instanceof Error ? err.message : 'Fetch Failed',
            },
          });
        }
      }),
    );

    return NextResponse.json({
      processed: activeTasks.length,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
