import { useState } from 'react';
import {
  cleanArray,
  findDuplicateKeys,
  findKeysWithEmptyValues,
  validateEmail,
  validateWebsite,
} from '@/app/lib/helpers';
import { useRouter } from 'next/navigation';
import { AppFormProps } from '@/app/types/appTypes';
import { createJobAction, updateJobAction } from '@/app/actions/jobs';
import { useTimezone } from './useTimezone';

export function useSaveForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>(['']);
  const router = useRouter();
  const { timezone } = useTimezone();

  const saveForm = async (payload: AppFormProps) => {
    const errorMessages: string[] = [];

    // App Name validation
    if (!payload.appTitle || payload.appTitle.length < 2)
      errorMessages.push('App Name is required and must be at least 2 characters.');
    if (payload.appTitle.length > 50) errorMessages.push('App Name must not exceed 50 characters.');

    // App URL validation
    if (!payload.url) errorMessages.push('App URL is required.');
    if (payload.url && !validateWebsite(payload.url))
      errorMessages.push('App URL is not a valid URL.');

    // App description
    if (payload.description && payload.description.length < 2)
      errorMessages.push('App Description must at least 2 characters');
    if (payload.description && payload.description.length > 150)
      errorMessages.push("App Description shouldn't be greater than 150 characters.");

    // Notification Email validation
    if (payload.notificationEmail && !validateEmail(payload.notificationEmail)) {
      errorMessages.push('Notification email is not valid.');
    }

    // ENV validation
    const duplicateKeys = findDuplicateKeys(payload.env, 'envKey');

    if (duplicateKeys) errorMessages.push(`Duplicate environment keys: "${duplicateKeys}"`);
    const emptyValues = findKeysWithEmptyValues(payload.env, 'envKey', 'envValue');
    if (emptyValues) errorMessages.push(`Environment variables with empty value: "${emptyValues}"`);

    // ** send errors
    setErrors(errorMessages);
    if (errorMessages.length > 0) return;

    // ** SEND DATA TO NEON DATABASE
    setLoading(true);

    // ** remove the empty  key value pairs
    payload.env = cleanArray(payload.env);
    payload.headers = cleanArray(payload.headers);

    // ** This will set the dynamic timezone
    payload.timezone = timezone;

    let result;

    // console.log(payload);

    if (payload.id) {
      // ** UPDATE existing app
      result = await updateJobAction(payload);
    } else {
      // ** CREATE new app
      result = await createJobAction(payload);
    }

    setLoading(false);

    if (result.success) {
      router.push('/jobs');
    } else {
      alert('Error: ' + result.error);
    }
  };

  return {
    saveForm,
    loading,
    errors,
  };
}
