import dayjs from 'dayjs';
import { AppFormProps, ScheduleType } from '@/app/types/appTypes';

/**
 * Formats a date into a human-readable string
 * Example output: "Dec 21, 2025 14:13"
 * formatDate(app.createdAt, "YYYY-MM-DD"); // 2025-12-21
 * formatDate(app.createdAt, "DD MMM YYYY hh:mm A"); // 21 Dec 2025 02:13 PM
 *
 *
 * @param date - Date object or ISO string
 * @param format - optional dayjs format string
 * @returns formatted date string
 */

export const formatDate = (date: string | Date, format = 'MMM DD, YYYY HH:mm A') => {
  return dayjs(date).format(format);
};

/**
 * Returns formatted date or "NEVER RUN" if the log or date is missing
 */
export const formatLastRun = (createdAt: Date | string | undefined | null): string => {
  // 1. Check if the value exists
  if (!createdAt) {
    return 'NEVER RUN';
  }

  // 2. Format the date
  // We wrap it in new Date() to handle both Date objects and ISO strings
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(createdAt));
};

/**
 * Calculates the next scheduled run based on a log's createdAt
 * and the application's schedule configuration.
 */
export const calculateNextRun = (logCreatedAt: Date | string, app: AppFormProps): string => {
  const lastRun = new Date(logCreatedAt);
  const nextRun = new Date(lastRun);

  const { scheduleType, intervalMinutes, dailyTime, monthlyDay, monthlyTime } = app;

  switch (scheduleType as ScheduleType) {
    case 'MINUTES':
      // Add X minutes to the last run time
      nextRun.setMinutes(lastRun.getMinutes() + (intervalMinutes || 0));
      break;

    case 'DAILY':
      // Set to tomorrow at the specific dailyTime (HH:mm)
      const [dHours, dMins] = (dailyTime || '00:00').split(':').map(Number);
      nextRun.setDate(lastRun.getDate() + 1);
      nextRun.setHours(dHours, dMins, 0, 0);
      break;

    case 'MONTHLY':
      // Set to next month on the specific monthlyDay at monthlyTime
      const [mHours, mMins] = (monthlyTime || '00:00').split(':').map(Number);
      nextRun.setMonth(lastRun.getMonth() + 1);
      nextRun.setDate(monthlyDay || 1);
      nextRun.setHours(mHours, mMins, 0, 0);
      break;

    default:
      return 'N/A';
  }

  // Format the calculated date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(nextRun);
};
