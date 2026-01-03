import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { formatDuration } from '@/app/lib/helpers';

export async function GET(request: Request) {
  // Check the authorization header to ensure the request comes from cron-job.org or Postman
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Parse query parameters for force mode (Manual testing like POSTMAN)
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';

  const now = new Date();

  try {
    // Fetch only enabled apps and include their custom headers
    const appsToTrigger = await prisma.app.findMany({
      where: { isEnabled: true },
      include: { headers: true },
    });

    // Determine which apps or jobs are due for execution
    const activeTasks = appsToTrigger.filter((app) => {
      // If the 'force' parameter is passed via API, trigger the job immediately regardless of schedule
      if (force) return true;

      // Identify the target timezone for this specific job, defaulting to Manila if none exists
      const jobTz = app.timezone || 'Asia/Manila';

      // Convert the global server time into a localized date string and back into a Date object
      // This ensures we are checking the "Midnight" relative to the user's location, not the server's location
      const localDate = new Date(new Date().toLocaleString('en-US', { timeZone: jobTz }));

      // Extract hours, minutes, and the day of the month from the localized date
      const currentHr = localDate.getHours();
      const currentMin = localDate.getMinutes();
      const currentDay = localDate.getDate();

      // Check if the job has been run before
      const lastRun = app.lastRunAt ? new Date(app.lastRunAt) : null;
      let ranToday = false;

      if (lastRun) {
        // Convert the previous run time into the job's local timezone for a fair comparison
        const lastRunLocal = new Date(lastRun.toLocaleString('en-US', { timeZone: jobTz }));

        // Compare the last run date with the current localized date to see if they match
        // This prevents a "Daily" job from running twice within the same calendar day in that timezone
        ranToday =
          lastRunLocal.getDate() === currentDay &&
          lastRunLocal.getMonth() === localDate.getMonth() &&
          lastRunLocal.getFullYear() === localDate.getFullYear();

        // Safety buffer: If the job ran less than 45 seconds ago, block it
        // This prevents multiple triggers if the cron hits the API several times in one minute
        if ((new Date().getTime() - lastRun.getTime()) / 1000 < 45) return false;
      }

      // Logic for jobs scheduled to run every X minutes
      if (app.scheduleType === 'MINUTES' && app.intervalMinutes) {
        // Use the absolute global time (minutes since 1970) to check if the interval is met
        const totalMinutes = Math.floor(new Date().getTime() / 60000);
        return totalMinutes % app.intervalMinutes === 0;
      }

      // Logic for jobs scheduled to run once every day
      if (app.scheduleType === 'DAILY' && app.dailyTime) {
        // Break down the "HH:mm" string into numbers for comparison
        const [targetHr, targetMin] = app.dailyTime.split(':').map(Number);

        // Check if the current localized time is at or past the user's scheduled time
        const isTimeReached =
          currentHr > targetHr || (currentHr === targetHr && currentMin >= targetMin);

        // Run only if the time is reached and the job hasn't successfully completed earlier today
        return isTimeReached && !ranToday;
      }

      // Logic for jobs scheduled once a month on a specific day
      if (app.scheduleType === 'MONTHLY' && app.monthlyDay && app.monthlyTime) {
        const [targetHr, targetMin] = app.monthlyTime.split(':').map(Number);

        // Check if the localized time is at or past the target time
        const isTimeReached =
          currentHr > targetHr || (currentHr === targetHr && currentMin >= targetMin);

        // Only trigger if the current day matches the target day (e.g., the 15th)
        // and the time is reached, and it hasn't run yet today
        return currentDay === app.monthlyDay && isTimeReached && !ranToday;
      }

      // If none of the conditions above are met, do not trigger the task
      return false;
    });

    if (activeTasks.length === 0) {
      console.log('--- No tasks are due for execution at this time ---');
    }

    // Execute tasks
    const results = await Promise.allSettled(
      activeTasks.map(async (app) => {
        // Log starting attempt for debugging
        // console.log(`[Triggering] App: ${app.appTitle} | URL: ${app.url}`);

        // Update lastRunAt immediately to "lock" the job
        await prisma.app.update({
          where: { id: app.id },
          data: { lastRunAt: new Date() },
        });

        const start = Date.now();
        try {
          // Convert DB headers to a key-value object
          const customHeaders = app.headers.reduce((acc, h) => {
            if (h.headerKey?.trim()) {
              acc[h.headerKey] = h.headerValue || '';
            }
            return acc;
          }, {} as Record<string, string>);

          // Perform the fetch
          const res = await fetch(app.url, {
            method: app.method || 'GET',
            headers: customHeaders,
          });

          const duration = Date.now() - start;

          // SAFE BODY HANDLING:
          // We wrap res.text() in a catch to prevent it from breaking the log creation
          const text = await res.text().catch(() => 'No readable response body');
          const responseBody = text.slice(0, 500);

          // Create the execution log
          return await prisma.executionLog.create({
            data: {
              appId: app.id,
              status: res.status,
              success: res.ok,
              duration: duration,
              responseBody: responseBody,
            },
          });
        } catch (err) {
          console.error(`Fetch error for ${app.appTitle}:`, err);
          // Log network failures (e.g., URL doesn't exist)
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

    // Final Summaries for Terminal
    const summary = results.map((res, index) => ({
      'Cron Job': activeTasks[index]?.appTitle || 'Unknown',
      Status: res.status === 'fulfilled' ? '✅ Code Ran' : '❌ Code Crashed',
      HTTP: res.status === 'fulfilled' ? (res.value as any).status : 'N/A',
      Duration: res.status === 'fulfilled' ? formatDuration((res.value as any).duration) : 'N/A',
      Result: res.status === 'fulfilled' && (res.value as any).success ? 'SUCCESS' : 'FAIL',
    }));

    // Log in Table view
    if (summary.length > 0) {
      console.table(summary);
    }

    return NextResponse.json({
      processed: activeTasks.length,
      timestamp: now.toISOString(),
      summary: summary,
    });
  } catch (error) {
    console.error('CRITICAL CRON ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
