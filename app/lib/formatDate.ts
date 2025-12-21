import dayjs from 'dayjs';

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

export function formatDate(date: string | Date, format = 'MMM DD, YYYY HH:mm') {
  return dayjs(date).format(format);
}
