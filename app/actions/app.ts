'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { removeDebugInfo } from '../lib/helpers';
import { AppFormProps, AppTypes } from '../types/appTypes';

// ** --- CREATE ---
// Saves a new app and its associated environment variables array
export async function createAppAction(data: {
  appName: string;
  url: string;
  technology: string;
  github: string;
  description: string;
  env: { envKey: string; envValue: string }[];
}) {
  try {
    const result = await prisma.app.create({
      data: {
        appName: data.appName,
        url: data.url,
        technology: data.technology,
        github: data.github,
        description: data.description,
        env: {
          create: data.env, // Automatically maps the array to the EnvVar table
        },
      },
      include: { env: true }, // Returns the new app with its variables
    });

    revalidatePath('/'); // Updates the UI instantly
    return { success: true, data: result };
  } catch (error) {
    console.error('Create Error:', error);
    return { success: false, error: 'Failed to create app' };
  }
}

// ** --- READ ---
// Fetches all apps and "includes" their environment variables
export async function getAppsAction() {
  try {
    return await prisma.app.findMany({
      include: { env: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Create Error:', error);
    return { success: false, error: 'Failed to create app' };
  }
}

// ** --- READ (SINGLE) ---
// Fetches one app by its ID, including all its environment variables
export async function getSingleAppAction(id: string) {
  try {
    const app = await prisma.app.findUnique({
      where: { id },
      include: { env: true }, // This ensures your envArray is populate
    });

    if (!app) return null;
    return app;
  } catch (error) {
    console.error('Error fetching app:', error);
    throw new Error('Could not find the requested application.');
  }
}

// ** --- UPDATE ---
// Deletes existing variables and re-inserts new ones to sync the UI state
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
  console.log(id);
  console.log(data);
  //   return;
  try {
    // restructure a new envData without the appId and Id
    const envData = data.env.map(({ envKey, envValue }) => ({ envKey, envValue }));

    const result = await prisma.app.update({
      where: { id },
      data: {
        appName: data.appName,
        url: data.url,
        technology: data.technology,
        github: data.github,
        description: data.description,
        env: {
          deleteMany: {}, // remove existing env vars
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
    await prisma.app.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Update Error:', error);
    return { success: false, error: 'Failed to update app' };
  }
}
