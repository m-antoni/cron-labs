import { useState } from 'react';
import {
  cleanArray,
  findDuplicateKeys,
  findKeysWithEmptyValues,
  validateWebsite,
} from '@/app/lib/helpers';
import { useRouter } from 'next/navigation';
import { AppFormProps, AppTypes, EnvItem } from '../types/appTypes';
import { createAppAction, updateAppAction } from '../actions/app';

export function useSaveForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>(['']);
  const router = useRouter();

  const saveForm = async (payload: AppFormProps['appInfo'] & { env: EnvItem[] }, id?: string) => {
    const errorMessages: string[] = [];

    if (!payload.appName || payload.appName.length < 2)
      errorMessages.push('App Name is required and must be at least 2 characters.');
    if (payload.appName.length > 50) errorMessages.push('App Name must not exceed 50 characters.');
    if (payload.technology && payload.technology.length < 2)
      errorMessages.push('Technology must be at least 2 characters.');
    if (payload.github && !validateWebsite(payload.github))
      errorMessages.push('Github is not a valid URL.');
    if (payload.url && !validateWebsite(payload.url))
      errorMessages.push('App URL is not a valid URL.');
    if (payload.description && payload.description.length < 2)
      errorMessages.push('Description must be at least 2 characters.');
    if (payload.description.length > 150)
      errorMessages.push('Description must not exceed 150 characters.');

    // env validations
    const duplicateKeys = findDuplicateKeys(payload.env, 'envKey');
    if (duplicateKeys) errorMessages.push(`Duplicate environment keys: "${duplicateKeys}"`);
    const emptyValues = findKeysWithEmptyValues(payload.env, 'envKey', 'envValue');
    if (emptyValues) errorMessages.push(`Environment variables with empty value: "${emptyValues}"`);

    setErrors(errorMessages);
    // ** send errors
    if (errorMessages.length > 0) return;

    setLoading(true);

    // ** restructured the final payload
    const finalPayload = { ...payload, env: cleanArray(payload.env) };

    let result;
    if (id) {
      // UPDATE existing app
      result = await updateAppAction(id, finalPayload);
    } else {
      // CREATE new app
      result = await createAppAction(finalPayload);
    }

    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
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
