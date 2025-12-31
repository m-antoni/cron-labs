'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { revalidatePath } from 'next/cache';
import { AppFormProps } from '@/app/types/appTypes';

// ** --- CREATE ---
export async function createJobAction(data: AppFormProps) {
  try {
    // Get the current user session
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const result = await prisma.app.create({
      data: {
        appTitle: data.appTitle,
        url: data.url,
        description: data.description,
        isEnabled: data.isEnabled,
        scheduleType: data.scheduleType,
        intervalMinutes: data.intervalMinutes,
        dailyTime: data.dailyTime,
        monthlyDay: data.monthlyDay,
        monthlyTime: data.monthlyTime,
        notifyOnFailure: data.notifyOnFailure,
        notifyOnRecovery: data.notifyOnRecovery,
        notificationEmail: data.notificationEmail,
        userId: session.user.id,
        envVariables:
          data.env && data.env.length > 0
            ? {
                create: data.env.map((item) => ({
                  envKey: item.envKey,
                  envValue: item.envValue,
                })),
              }
            : undefined, // Prisma skips this field entirely if it's undefined
      },
      include: {
        envVariables: true,
      },
    });

    revalidatePath('/jobs');
    return { success: true, data: result };
  } catch (error) {
    console.error('Create Error:', error);
    return { success: false, error: 'Failed to create app' };
  }
}

// ** --- READ JOBS ---
export async function getJobsAction(take = 10) {
  try {
    // Get the current user session
    const session = await auth();
    if (!session?.user?.id) return null;

    const apps = await prisma.app.findMany({
      // Filter so the user ONLY sees their own apps
      where: { userId: session.user.id },
      include: { envVariables: true },
      skip: 0,
      take,
      orderBy: { createdAt: 'desc' },
    });

    revalidatePath(`/jobs`);
    return apps || null;
  } catch (error) {
    console.error('Fetch Error:', error);
    return [];
  }
}

// ** --- READ (SINGLE) ---
export async function getSingleJobAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const app = await prisma.app.findUnique({
      where: {
        id,
        userId: session.user.id, // Security: Ensure the user owns the app they are trying to view
      },
      include: { envVariables: true },
    });

    revalidatePath(`/job/${id}/view`);
    return app;
  } catch (error) {
    console.error('Error fetching app:', error);
    return null;
  }
}

// ** --- UPDATE ---
export async function updateJobAction(data: AppFormProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const safeEnv = data.env || [];
    const envData = safeEnv.map(({ envKey, envValue }) => ({ envKey, envValue }));

    const result = await prisma.app.update({
      where: {
        id: data.id,
        userId: session.user.id, // Security: Prevent updating apps that don't belong to you
      },
      data: {
        appTitle: data.appTitle,
        url: data.url,
        description: data.description,
        isEnabled: data.isEnabled,
        scheduleType: data.scheduleType,
        intervalMinutes: data.intervalMinutes,
        dailyTime: data.dailyTime,
        monthlyDay: data.monthlyDay,
        monthlyTime: data.monthlyTime,
        notifyOnFailure: data.notifyOnFailure,
        notifyOnRecovery: data.notifyOnRecovery,
        notificationEmail: data.notificationEmail,
        userId: session.user.id,
        envVariables: {
          deleteMany: {},
          create: envData,
        },
      },
      include: { envVariables: true },
    });

    revalidatePath(`/jobs`);
    return { success: true, data: result };
  } catch (error) {
    console.error('Update Error:', error);
    return { success: false, error: 'Failed to update app' };
  }
}

// ** --- DELETE ---
export async function deleteJobAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    await prisma.app.delete({
      where: {
        id,
        userId: session.user.id, // Security: Prevent deleting apps that don't belong to you
      },
    });

    revalidatePath('/jobs');
    return { success: true };
  } catch (error) {
    console.error('Delete Error:', error);
    return { success: false, error: 'Failed to delete app' };
  }
}

// ** -- Enabled or Disabled a Job
export async function isEnableJobAction(id: string) {
  // check user
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    // first fetch the current job and check the enabled column
    const currentJob = await prisma.app.findUnique({
      where: { id, userId: session.user.id },
      select: { isEnabled: true },
    });

    if (!currentJob) return { success: false, error: 'Job Not Found' };

    // then update to true or false
    const isEnabled = await prisma.app.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        isEnabled: !currentJob.isEnabled,
      },
    });

    revalidatePath('/jobs');
    return { success: true, isEnabled };
  } catch (error) {
    console.log('Error to enabled/disabled a job', error);
    return { success: false, error: 'Failed to update job enabled/disabled' };
  }
}
