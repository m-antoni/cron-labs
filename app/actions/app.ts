'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth'; // Adjust this path to your auth.ts
import { revalidatePath } from 'next/cache';

// ** --- CREATE ---
export async function createAppAction(data: {
  appName: string;
  url: string;
  technology: string;
  github: string;
  description: string;
  env: { envKey: string; envValue: string }[];
}) {
  try {
    // Get the current user session
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const result = await prisma.app.create({
      data: {
        appName: data.appName,
        url: data.url,
        technology: data.technology,
        github: data.github,
        description: data.description,
        userId: session.user.id, // Link the app to the logged-in user
        env: {
          create: data.env,
        },
      },
      include: { env: true },
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
      include: { env: true },
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
      include: { env: true },
    });

    return app || null;
  } catch (error) {
    console.error('Error fetching app:', error);
    return null;
  }
}

// ** --- UPDATE ---
export async function updateAppAction(
  id: string,
  data: {
    appName: string;
    url: string;
    technology: string;
    github: string;
    description: string;
    env: { envKey: string; envValue: string }[];
  },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const envData = data.env.map(({ envKey, envValue }) => ({ envKey, envValue }));

    const result = await prisma.app.update({
      where: {
        id,
        userId: session.user.id, // Security: Prevent updating apps that don't belong to you
      },
      data: {
        appName: data.appName,
        url: data.url,
        technology: data.technology,
        github: data.github,
        description: data.description,
        env: {
          deleteMany: {},
          create: envData,
        },
      },
      include: { env: true },
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
