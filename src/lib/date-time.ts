/**
 * Datetime utility functions for handling conversion between UTC (database) and local time (frontend)
 */

/**
 * Converts a UTC date string from the database to a local timezone date object
 * @param utcDateString - UTC date string from database
 * @returns Date object in local timezone
 */
export function utcToLocal(utcDateString: string | Date): Date {
  return new Date(utcDateString);
}

/**
 * Formats a date for frontend display in the local timezone
 * @param utcDateString - UTC date string from database
 * @param options - Intl.DateTimeFormatOptions for customizing the format
 * @returns Formatted date string in local timezone
 */
export function formatLocalDateTime(
  utcDateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
  }
): string {
  const localDate = utcToLocal(utcDateString);
  return new Intl.DateTimeFormat(undefined, options).format(localDate);
}

/**
 * Converts a local date to UTC for sending to the backend
 * @param localDate - Local date (can be Date object or string)
 * @returns ISO string in UTC format ready to be sent to the backend
 */
export function localToUtc(localDate: Date | string): string {
  const date = typeof localDate === 'string' ? new Date(localDate) : localDate;
  return date.toISOString();
}

/**
 * Formats a date in ISO format (UTC) for API requests
 * @param date - Date to format (can be in any timezone)
 * @returns ISO string in UTC format
 */
export function toUtcIsoString(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString();
}