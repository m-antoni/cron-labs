import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const now = new Date();
  // Ensure we compare HH:mm consistently
  const currentTimeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  try {
    const appsToTrigger = await prisma.app.findMany({
      where: { isEnabled: true },
    });

    const activeTasks = appsToTrigger.filter((app) => {
      if (app.scheduleType === 'MINUTES' && app.intervalMinutes) {
        // Use total minutes from epoch to handle intervals correctly across hour boundaries
        const totalMinutes = Math.floor(now.getTime() / 60000);
        return totalMinutes % app.intervalMinutes === 0;
      }

      if (app.scheduleType === 'DAILY' && app.dailyTime === currentTimeStr) return true;

      if (
        app.scheduleType === 'MONTHLY' &&
        app.monthlyDay === now.getDate() &&
        app.monthlyTime === currentTimeStr
      )
        return true;

      return false;
    });

    // Execute triggers AND Log results
    const results = await Promise.allSettled(
      activeTasks.map(async (app) => {
        const start = Date.now();
        try {
          const res = await fetch(app.url, { method: 'GET' });
          const duration = Date.now() - start;

          // SAVE TO YOUR NEW EXECUTIONLOG MODEL
          return await prisma.executionLog.create({
            data: {
              appId: app.id,
              status: res.status,
              success: res.ok,
              duration: duration,
              responseBody: await res.text().then((t) => t.slice(0, 500)), // Limit size
            },
          });
        } catch (err) {
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

    return NextResponse.json({ triggered: activeTasks.length });
  } catch (error) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
