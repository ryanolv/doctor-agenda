import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Converts a time string in "HH:mm:ss" format from UTC to "America/Sao_Paulo" timezone.
 * @param time - The time string in "HH:mm:ss" format.
 * @returns The converted time string in "HH:mm:ss" format.
 */

export function convertTimeToTimezone(time: string): string {
  return dayjs
    .utc(`1970-01-01T${time}Z`)
    .tz("America/Sao_Paulo")
    .format("HH:mm:ss");
}

/**
 * Converts a time string in "HH:mm:ss" format from "America/Sao_Paulo" timezone to UTC.
 * @param time - The time string in "HH:mm:ss" format.
 * @returns The converted time string in UTC in "HH:mm:ss" format.
 */

export function convertTimeToUtcTimezone(time: string): string {
  return dayjs
    .tz(`1970-01-01T${time}`, "America/Sao_Paulo")
    .utc()
    .format("HH:mm:ss");
}

/**
 * Converts a date string in "YYYY-MM-DD" format to "DD/MM/YYYY" format
 * in the "America/Sao_Paulo" timezone.
 * @param date - The date string in "YYYY-MM-DD" format.
 * @returns The converted date string in "DD/MM/YYYY" format.
 */

export function convertDateToLocalTimezone(date: string): string {
  return dayjs(date).tz("America/Sao_Paulo").format("DD/MM/YYYY");
}

/**
 * Converts a date string in "DD/MM/YYYY" format to UTC timezone in "YYYY-MM-DD" format.
 * @param date - The date string in "DD/MM/YYYY" format.
 * @returns The converted date string in UTC timezone in "YYYY-MM-DD" format.
 */

export function convertDateToUtcTimezone(date: string): string {
  return dayjs(date, "DD/MM/YYYY").utc().format("YYYY-MM-DD");
}

/**
 * Converts a date and time string to a Date object in UTC timezone.
 * @param date - The date string in "YYYY-MM-DD" format.
 * @param time - The time string in "HH:mm:ss" format.
 * @returns A Date object representing the date and time in UTC timezone.
 */

export function convertDateTimeToUtcTimezone(date: string, time: string): Date {
  return dayjs.utc(`${date}T${time}`).toDate();
}

/**
 * Converts a Date object to a string in "HH:mm:" format in UTC timezone.
 * @param date - The Date object to convert.
 * @returns The converted date string in "HH:mm:" format in "America/Sao_Paulo" timezone.
 */

export function convertDateToTimeString(date: Date): string {
  return dayjs(date).tz("America/Sao_Paulo").format("HH:mm");
}
