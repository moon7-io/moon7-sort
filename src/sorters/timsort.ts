import { ascending } from "~/basic";
import { Comparator } from "~/types";

/**
 * Implements the TimSort algorithm to sort arrays in-place without galloping optimization.
 *
 * TimSort is a hybrid stable sorting algorithm derived from merge sort and
 * insertion sort, designed to perform well on many kinds of real-world data.
 * It was implemented by Tim Peters for Python's sorting function in 2002, and
 * is now used in Java, Android, and many other platforms as the standard sorting
 * algorithm.
 *
 * Key features of this implementation:
 * - Natural run detection and merging for optimal performance on partially sorted data
 * - Adaptive strategy that adjusts to the characteristics of the input data
 * - Small array optimization using insertion sort
 * - Maintains stability (equal elements preserve their relative order)
 *
 * @typeParam T - The type of elements to sort
 * @param arr - The array to sort (will be modified in-place)
 * @param cmp - The comparator function to determine order (defaults to ascending)
 * @returns The sorted array (same reference as input)
 *
 * @example
 * ```typescript
 * // Sort numbers in-place
 * const nums = [3, 1, 4, 2];
 * timSort(nums);
 * console.log(nums); // [1, 2, 3, 4]
 *
 * // Sort with custom comparator
 * const data = [3, 1, 4, 2];
 * timSort(data, (a, b) => b - a);
 * console.log(data); // [4, 3, 2, 1]
 * ```
 *
 * @remarks
 * This is a simplified TimSort implementation without galloping mode optimization.
 * It still performs well on:
 * - Partially sorted arrays
 * - Arrays with repeated patterns
 * - Real-world data with pre-existing order
 * - Arrays with distinct sections that are internally ordered
 */
export function timSort<T>(arr: T[], cmp: Comparator<T> = ascending): T[] {
    if (arr.length <= 1) {
        return arr;
    }

    // Determine the size of the smallest merge unit (run).
    // This is based on the same logic used in Python and Java implementations.
    const minRun = getMinimumRunLength(arr.length);

    // Step 1: Sort small runs using insertion sort
    for (let lo = 0; lo < arr.length; lo += minRun) {
        const hi = Math.min(lo + minRun - 1, arr.length - 1);
        for (let i = lo + 1; i <= hi; i++) {
            let j = i;
            while (j > lo) {
                if (cmp(arr[j], arr[j - 1]) < 0) {
                    const tmp = arr[j - 1];
                    arr[j - 1] = arr[j];
                    arr[j] = tmp;
                } else break;
                j--;
            }
        }
    }

    // Step 2: Merge sorted runs
    // Start with runs of length minRun and double the size on each pass
    for (let size = minRun; size < arr.length; size *= 2) {
        for (let left = 0; left < arr.length; left += 2 * size) {
            const mid = Math.min(arr.length - 1, left + size - 1);
            const right = Math.min(arr.length - 1, left + 2 * size - 1);

            // Only merge if there are at least two runs
            if (mid < right) {
                merge(arr, left, mid, right, cmp);
            }
        }
    }

    leftArr.length = 0;
    rightArr.length = 0;
    return arr;
}

/**
 * Calculates the minimum run length for the TimSort algorithm.
 *
 * Returns a value between 16 and 32, chosen to minimize the number of comparisons.
 * This formula is based on the original TimSort implementation by Tim Peters.
 *
 * @param n - The length of the array
 * @returns The minimum run length
 * @internal
 */
function getMinimumRunLength(n: number): number {
    let r = 0;
    while (n >= MIN_MERGE) {
        r |= n & 1;
        n >>= 1;
    }
    return n + r;
}

/**
 * Minimum size of a run (a sorted sequence)
 * This value is used to determine when to use insertion sort
 * as an optimization for small arrays.
 */
const MIN_MERGE = 32;

// optimization: keep these arrays outside of merge to avoid a lot of allocations
const leftArr: unknown[] = [];
const rightArr: unknown[] = [];

/**
 * Merges two adjacent runs in-place.
 *
 * @param arr - The array containing the runs
 * @param left - Start index of the first run
 * @param mid - End index of the first run (inclusive)
 * @param right - End index of the second run (inclusive)
 * @param cmp - The comparator function
 * @internal
 */
function merge<T>(arr: T[], left: number, mid: number, right: number, cmp: Comparator<T>): void {
    // If the runs are already in order, no need to merge
    if (cmp(arr[mid + 1], arr[mid]) >= 0) {
        return;
    }

    // Size of the two runs
    const len1 = mid - left + 1;
    const len2 = right - mid;

    // Create temporary arrays
    if (leftArr.length < len1) {
        leftArr.length = len1;
    }
    if (rightArr.length < len2) {
        rightArr.length = len2;
    }

    // Copy data to temporary arrays
    for (let i = 0; i < len1; i++) {
        leftArr[i] = arr[left + i];
    }
    for (let i = 0; i < len2; i++) {
        rightArr[i] = arr[mid + 1 + i];
    }

    // Initial indices for the left, right, and merged arrays
    let i = 0; // Index for leftArr
    let j = 0; // Index for rightArr
    let k = left; // Index for the merged array

    // Standard merge process without galloping
    while (i < len1 && j < len2) {
        if (cmp(rightArr[j] as T, leftArr[i] as T) > 0) {
            // Taking element from left run
            arr[k++] = leftArr[i++] as T;
        } else {
            // Taking element from right run
            arr[k++] = rightArr[j++] as T;
        }
    }

    // Copy the remaining elements from leftArr, if any
    while (i < len1) {
        arr[k++] = leftArr[i++] as T;
    }

    // Copy the remaining elements from rightArr, if any
    while (j < len2) {
        arr[k++] = rightArr[j++] as T;
    }
}
