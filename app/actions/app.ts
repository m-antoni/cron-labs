'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth'; // Adjust this path to your auth.ts
import { revalidatePath } from 'next/cache';
import { AppFormProps } from '../types/appTypes';

// ** --- CREATE ---
export async function createAppAction(data: AppFormProps) {
  // return;
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
        // Use the name from your Schema: 'envVariables'
        envVariables: {
          create: data.env.map((item) => ({
            envKey: item.envKey,
            envValue: item.envValue,
          })),
        },
      },
      include: {
        envVariables: true, // Update this to match the relation name too
      },
    });

    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Create Error:', error);
    return { success: false, error: 'Failed to create app' };
  }
}

// ** --- READ ---
export async function getAppsAction() {
  try {
    // Get the current user session
    const session = await auth();
    if (!session?.user?.id) return [];

    const apps = await prisma.app.findMany({
      // Filter so the user ONLY sees their own apps
      where: { userId: session.user.id },
      include: { envVariables: true },
      skip: 0,
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    return apps;
  } catch (error) {
    console.error('Fetch Error:', error);
    return [];
  }
}

// ** --- READ (SINGLE) ---
export async function getSingleAppAction(id: string) {
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

    return app || null;
  } catch (error) {
    console.error('Error fetching app:', error);
    return null;
  }
}

// ** --- UPDATE ---
export async function updateAppAction(data: AppFormProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const envData = data.env.map(({ envKey, envValue }) => ({ envKey, envValue }));

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

    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Update Error:', error);
    return { success: false, error: 'Failed to update app' };
  }
}

// ** --- DELETE ---
export async function deleteAppAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    await prisma.app.delete({
      where: {
        id,
        userId: session.user.id, // 2. Security: Prevent deleting apps that don't belong to you
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete Error:', error);
    return { success: false, error: 'Failed to delete app' };
  }
}

// ** --- TOGGLE ENABLE CRON JOB ---
export async function toggleAppAction(appId: string, currentState: boolean) {
  await prisma.app.update({
    where: { id: appId },
    data: { isEnabled: !currentState },
  });
  revalidatePath('/dashboard');
}
