import { format,isValid, parse } from "date-fns";

/**
 * Validates if a date string is in the format "dd/MM/yyyy" and represents a valid date.
 * @param dateString - The date string to validate.
 * @returns True if the date string is valid, false otherwise.
 */

export const isValidDate = (dateString: string) => {
  const date = parse(dateString, "dd/MM/yyyy", new Date());
  return isValid(date) && format(date, "dd/MM/yyyy") === dateString;
};

/**
 * Checks if a date string in the format "dd/MM/yyyy" is not in the future.
 * @param dateString - The date string to check.
 * @returns True if the date is not in the future, false otherwise.
 */

export const dateIsNotInFuture = (dateString: string) => {
  const date = parse(dateString, "dd/MM/yyyy", new Date());
  const today = new Date();
  return date <= today;
};
