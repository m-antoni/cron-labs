'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { revalidatePath } from 'next/cache';
import { ExecutionLogResponse } from '@/app/types/appTypes';

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
          app: { userId: session.user.id, isEnabled: true },
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
    console.error('Get Execution Logs with total jobs Error', error);
    return { success: false, error: 'Failed to fetch the Execution Logs with total jobs ' };
  }
}

// ** Get Executionlogs with Pagination
export async function getExecutionLogs(page: number = 1): Promise<ExecutionLogResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { executionLogs: [], totalCount: 0, totalPages: 0, error: 'Unauthorized' };
  }

  try {
    const pageSize = 15; // static page size
    const skip = (page - 1) * pageSize;
    const userFilter = { app: { userId: session.user.id, isEnabled: true } };

    const [executionLogs, totalCount] = await Promise.all([
      prisma.executionLog.findMany({
        where: userFilter,
        include: { app: true },
        skip: skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.executionLog.count({ where: userFilter }),
    ]);

    return {
      executionLogs: executionLogs as any,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      success: true,
    };
  } catch (error) {
    console.error('Get Execution Logs Error', error);
    return { executionLogs: [], totalCount: 0, totalPages: 0, error: 'Failed to fetch logs' };
  }
}
