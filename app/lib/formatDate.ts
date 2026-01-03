import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Main formatter: Converts UTC to local job timezone
 */
export const formatDate = (
  date: string | Date,
  format = 'MMM DD, YYYY hh:mm A',
  tz = 'Asia/Manila',
) => {
  if (!date) return 'n/a';
  try {
    return dayjs.utc(date).tz(tz).format(format);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * ALIAS for formatDate to fix the Dashboard import error
 */
export const formatLastRun = (date: string | Date, tz = 'Asia/Manila') => {
  return formatDate(date, 'MMM DD, YYYY hh:mm A', tz);
};

/**
 * Calculates the next scheduled run
 */
export const calculateNextRun = (logCreatedAt: Date | string, app: any): string => {
  if (!logCreatedAt || !app) return 'N/A';

  const tz = app.timezone || 'Asia/Manila';
  let nextRun = dayjs.utc(logCreatedAt).tz(tz);

  const { scheduleType, intervalMinutes, dailyTime, monthlyDay, monthlyTime } = app;

  if (scheduleType === 'MINUTES') {
    nextRun = nextRun.add(intervalMinutes || 0, 'minute');
  } else if (scheduleType === 'DAILY') {
    const [dHours, dMins] = (dailyTime || '00:00').split(':').map(Number);
    nextRun = nextRun.hour(dHours).minute(dMins).second(0).add(1, 'day');
  } else if (scheduleType === 'MONTHLY') {
    const [mHours, mMins] = (monthlyTime || '00:00').split(':').map(Number);
    nextRun = nextRun
      .date(monthlyDay || 1)
      .hour(mHours)
      .minute(mMins)
      .second(0)
      .add(1, 'month');
  } else {
    return 'N/A';
  }

  return nextRun.format('MMM DD, YYYY hh:mm A');
};
