import { format, parseISO } from "date-fns";
import { DateConfig } from "../interfaces";

/**
 * Formats a value as a date if it's a valid date and a format is provided
 * Otherwise returns the original value or label if available
 *
 * @param value - The value to format (could be a date, string, or any other value)
 * @param dateConfig - Optional date configuration with format string
 * @param dataPoint - Optional data point object that might contain a label property
 * @returns Formatted date string or original value
 */
export function formatDate(
  value: any,
  dateConfig?: DateConfig,
  dataPoint?: Record<string, any>,
): string {
  if (dataPoint?.label) {
    return dataPoint.label;
  }

  if (dateConfig?.format) {
    try {
      // Check if it's already a Date object
      if (value instanceof Date) {
        return format(value, dateConfig.format);
      }

      // Check if it's an ISO date string
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return format(parseISO(value), dateConfig.format);
      }
    } catch (error) {}
  }

  return value;
}
