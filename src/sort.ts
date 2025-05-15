import { ascending } from "./basic";
import { isNativeSortStable } from "./internal";
import { Comparator } from "./types";
import { mergeSort } from "~/sorters/mergesort";

/**
 * Sorts elements in an array in-place.
 *
 * This function applies a stable sort algorithm. It uses the browser's native
 * Array.sort if it's stable, or falls back to mergeSort otherwise.
 * The sort is performed in-place, modifying the original array.
 *
 * @typeParam T - The type of elements to sort
 * @param arr - The array to sort (will be modified in-place)
 * @param cmp - The comparator function to determine order (defaults to ascending)
 * @returns The sorted array (same reference as input)
 *
 * @example
 * ```typescript
 * // Sort numbers
 * sort([3, 1, 4, 2]); // [1, 2, 3, 4]
 *
 * // Sort with a custom comparator
 * sort([3, 1, 4, 2], (a, b) => b - a); // [4, 3, 2, 1]
 * ```
 */
export function sort<T>(arr: T[], cmp: Comparator<T> = ascending): T[] {
    if (isNativeSortStable()) {
        return arr.sort(cmp);
    }
    return mergeSort(arr, cmp);
}
