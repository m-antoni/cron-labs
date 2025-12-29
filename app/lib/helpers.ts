/* eslint-disable @typescript-eslint/no-explicit-any */

import { JobFormTypes, ScheduleType } from '@/app/types/appTypes';

export function generate32CharToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateWebsite(url: string): boolean {
  const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?.*)?(#.*)?$/i;
  return pattern.test(url);
}

// find duplicate keys
export function findDuplicateKeys(arr: any, keyName: string): string {
  const duplicates = Object.keys(
    arr.reduce((acc: any, obj: any) => {
      acc[obj[keyName]] = (acc[obj[keyName]] || 0) + 1;
      return acc;
    }, {}),
  ).filter((k) => arr.reduce((a: any, o: any) => (o[keyName] === k ? a + 1 : a), 0) > 1);

  return duplicates.join(',');
}

// check if the object has empty value
export function findKeysWithEmptyValues(arr: any, keyName: string, valueName: string): string {
  // Filter objects where keyName has value but valueName is empty
  const filtered = arr
    .filter((obj: any) => obj[keyName] && (!obj[valueName] || obj[valueName] === ''))
    .map((obj: any) => obj[keyName]); // get only the keys

  // Remove duplicates and join with comma
  return [...new Set(filtered)].join(',');
}

// return only the objects with values in an array
export function cleanArray(arr: any) {
  return arr.filter((obj: any) => obj.envKey !== '' || obj.envValue !== '');
}

export function isSingleEmpty(arr: any, a: string, b: string): boolean {
  return arr.length === 1 && !arr[0][a]?.trim() && !arr[0][b]?.trim();
}

// use for prisma response to remove the _debugInfo
export function removeDebugInfo(data: any) {
  if (!Array.isArray(data)) return data;

  const clean = data.slice(); // clone numeric items only

  if ('_debugInfo' in clean) {
    delete clean._debugInfo;
  }

  return clean;
}

// Truncates a URL and adds an ellipsis if it exceeds a certain length.
export const truncateUrl = (url: string | undefined | null, maxLength: number = 30): string => {
  if (!url) return '';

  if (url.length <= maxLength) {
    return url;
  }

  return `${url.substring(0, maxLength)}...`;
};

// format the duration value into ms or sec.
export const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

// format the job schedule
export const scheduleFormat = (job: JobFormTypes) => {
  if (job.scheduleType === ScheduleType.MINUTES) {
    // "Every 15 mins"
    return `Every ${job.intervalMinutes} Minutes`;
  }

  if (job.scheduleType === ScheduleType.DAILY) {
    // "Daily at 08:00 AM"
    return `Daily at ${job.dailyTime}`;
  }

  if (job.scheduleType === ScheduleType.MONTHLY) {
    // "Every 12th at 08:00 AM"
    return `Every ${getOrdinalSuffix(job.monthlyDay ?? 1)} at ${job.monthlyTime}`;
  }

  return 'Unknown Schedule';
};

// format day suffix
export const getOrdinalSuffix = (day: number): string => {
  if (day < 1 || day > 31) return day.toString(); // Safety check for valid dates

  const lastDigit = day % 10;
  const lastTwoDigits = day % 100;

  // Handle exceptions for 11, 12, and 13 (they always use 'th')
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${day}th`;
  }

  switch (lastDigit) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};
