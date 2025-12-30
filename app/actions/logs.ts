'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth'; // Adjust this path to your auth.ts
import { revalidatePath } from 'next/cache';

// ** ---  Get the ExecutionLogs, Total Jobs, Success, Failed ---
export async function getDashboardAction(take = 10) {
  try {
    // get the current session
    const session = await auth();
    if (!session?.user?.id) return [];

    // Get the start of the current day (00:00:00)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [executionLogs, getJobs, getSuccess, getFailed] = await prisma.$transaction([
      // Fetch the executionlogs for the table
      prisma.executionLog.findMany({
        where: {
          app: { userId: session.user.id },
        },
        include: {
          app: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take,
      }),

      // Total active jobs
      prisma.app.count({ where: { userId: session.user.id, isEnabled: true } }),

      // Today's Success jobs
      prisma.executionLog.count({
        where: {
          app: { userId: session.user.id },
          success: true,
          createdAt: {
            gte: startOfToday,
          },
        },
      }),

      // Today's Failed jobs
      prisma.executionLog.count({
        where: {
          app: { userId: session.user.id },
          success: false,
          createdAt: {
            gte: startOfToday,
          },
        },
      }),
    ]);

    const responsePayload = {
      executionLogs,
      getJobs,
      getSuccess,
      getFailed,
    };

    revalidatePath('/dashboard');
    return responsePayload;
  } catch (error) {
    console.error('Get Schedules Error', error);
    return { success: false, error: 'Failed to fetch the schedules' };
  }
}
