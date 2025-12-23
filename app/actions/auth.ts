'use server';

import { signIn, signOut } from '@/app/lib/auth';

export const signInWithGoogle = async () => {
  await signIn('google', { redirectTo: '/dashboard' });
};

export const signInWithGithub = async () => {
  await signIn('github', { redirectTo: '/dashboard' });
};
export const signInWithFacebook = async () => {
  await signIn('facebook', { redirectTo: '/dashboard' });
};

export const signOutProvider = async () => {
  await signOut({ redirectTo: '/auth/sign-in' });
};
