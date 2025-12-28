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

  // Format current time as HH:mm (24-hour) for database comparison
  const currentTimeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  try {
    // Fetch only the apps that the user has explicitly enabled
    const appsToTrigger = await prisma.app.findMany({
      where: { isEnabled: true },
    });

    // Determine which apps are due for execution based on their specific schedules
    const activeTasks = appsToTrigger.filter((app) => {
      // Minutes Schedule: Checks if current or previous minute matches interval
      // This "buffer" ensures we don't miss tasks since cron-job.org runs every 2 mins
      if (app.scheduleType === 'MINUTES' && app.intervalMinutes) {
        if (app.intervalMinutes === 1) return true;
        const isDueNow = totalMinutes % app.intervalMinutes === 0;
        const wasDueLastMin = (totalMinutes - 1) % app.intervalMinutes === 0;
        return isDueNow || wasDueLastMin;
      }

      // Daily Schedule: Matches the current hour and minute string
      if (app.scheduleType === 'DAILY' && app.dailyTime === currentTimeStr) {
        return true;
      }

      // Monthly Schedule: Matches specific day of the month and time
      if (
        app.scheduleType === 'MONTHLY' &&
        app.monthlyDay === now.getDate() &&
        app.monthlyTime === currentTimeStr
      ) {
        return true;
      }

      return false;
    });

    // Execute all due tasks simultaneously without letting one failure stop the rest
    const results = await Promise.allSettled(
      activeTasks.map(async (app) => {
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
      time: currentTimeStr,
    });
  } catch (error) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
