import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Main formatter: Converts UTC to local job timezone
 */
export const formatDate = (
  date: string | Date | null,
  format = 'MMM DD, YYYY hh:mm A',
  tz = 'Asia/Manila',
) => {
  if (!date) return 'n/a';

  try {
    // Ensure we use the tz provided, or fallback to Manila
    const targetTz = tz || 'Asia/Manila';
    return dayjs.utc(date).tz(targetTz).format(format);
  } catch (error) {
    console.error('Format Error:', error);
    return 'n/a';
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
export const calculateNextRun = (logCreatedAt: Date | string | null, app: any): string => {
  // FALLBACK LOGIC:
  // 1. Use the specific log date if available
  // 2. Otherwise use the app's lastRunAt
  // 3. Otherwise use the app's creation date
  const referenceDate = logCreatedAt || app.lastRunAt || app.createdAt;

  if (!referenceDate) return 'N/A';

  const tz = app.timezone || 'Asia/Manila';
  let nextRun = dayjs.utc(referenceDate).tz(tz);

  const { scheduleType, intervalMinutes, dailyTime, monthlyDay, monthlyTime } = app;

  if (scheduleType === 'MINUTES') {
    // Add the minutes to the reference date
    nextRun = nextRun.add(intervalMinutes || 0, 'minute');
  } else if (scheduleType === 'DAILY') {
    const [dHours, dMins] = (dailyTime || '00:00').split(':').map(Number);
    nextRun = nextRun.hour(dHours).minute(dMins).second(0);

    // If the calculated time is in the past compared to the reference, add a day
    if (nextRun.isBefore(dayjs.utc(referenceDate).tz(tz))) {
      nextRun = nextRun.add(1, 'day');
    }
  } else if (scheduleType === 'MONTHLY') {
    const [mHours, mMins] = (monthlyTime || '00:00').split(':').map(Number);
    nextRun = nextRun
      .date(monthlyDay || 1)
      .hour(mHours)
      .minute(mMins)
      .second(0);

    if (nextRun.isBefore(dayjs.utc(referenceDate).tz(tz))) {
      nextRun = nextRun.add(1, 'month');
    }
  } else {
    return 'N/A';
  }

  return nextRun.format('MMM DD, YYYY hh:mm A');
};
