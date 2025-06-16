import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import classNames from "classnames";

/**
 * Utility function to combine and conditionally apply Tailwind CSS classes.
 * It merges classes, deduplicates them, and resolves conflicts.
 *
 * @param  {...any} inputs - The classes to be merged and combined.
 * @returns {string} The resulting merged and combined class string.
 */
export function cn(...inputs) {
  return twMerge(clsx(classNames(inputs)));
}
