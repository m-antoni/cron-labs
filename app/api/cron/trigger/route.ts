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

  // Calculate total minutes since epoch to handle intervals consistently
  const totalMinutes = Math.floor(now.getTime() / 60000);

  // Use UTC values for comparison
  const currentHour = now.getUTCHours();
  const currentMin = now.getUTCMinutes();
  const currentDay = now.getUTCDate();
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();

  try {
    // Fetch only enabled apps and include their custom headers
    const appsToTrigger = await prisma.app.findMany({
      where: { isEnabled: true },
      include: { headers: true },
    });

    // Determine which apps are due for execution
    const activeTasks = appsToTrigger.filter((app) => {
      // If force=true is passed, we ignore all schedule logic and run everything enabled
      if (force) return true;

      const lastRun = app.lastRunAt ? new Date(app.lastRunAt) : new Date(0);
      const secondsSinceLastRun = (now.getTime() - lastRun.getTime()) / 1000;

      // GLOBAL SAFETY: Skip if it ran less than 45 seconds ago to prevent double-firing
      if (secondsSinceLastRun < 45) return false;

      const ranToday =
        lastRun.getUTCDate() === currentDay &&
        lastRun.getUTCMonth() === currentMonth &&
        lastRun.getUTCFullYear() === currentYear;

      // Minutes Schedule
      if (app.scheduleType === 'MINUTES' && app.intervalMinutes) {
        if (app.intervalMinutes === 1) return true;
        const isDueNow = totalMinutes % app.intervalMinutes === 0;
        const wasDueLastMin = (totalMinutes - 1) % app.intervalMinutes === 0;
        return isDueNow || wasDueLastMin;
      }

      // Daily Schedule
      if (app.scheduleType === 'DAILY' && app.dailyTime) {
        const [targetHr, targetMin] = app.dailyTime.split(':').map(Number);
        const isTimeReached =
          currentHour > targetHr || (currentHour === targetHr && currentMin >= targetMin);
        return isTimeReached && !ranToday;
      }

      // Monthly Schedule
      if (app.scheduleType === 'MONTHLY' && app.monthlyDay === currentDay && app.monthlyTime) {
        const [targetHr, targetMin] = app.monthlyTime.split(':').map(Number);
        const isTimeReached =
          currentHour > targetHr || (currentHour === targetHr && currentMin >= targetMin);
        return isTimeReached && !ranToday;
      }

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
