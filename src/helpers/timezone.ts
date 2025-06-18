import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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
