import { ascending } from "~/basic";
import { Comparator } from "~/types";

/**
 * Implements a highly optimized QuickSort algorithm to sort arrays in-place.
 *
 * This implementation includes several optimizations:
 * - Median-of-three pivot selection to avoid worst-case performance on sorted/reversed arrays
 * - 3-way partitioning for efficient handling of arrays with duplicate values
 * - Small array optimization using insertion sort for subarrays below a threshold size
 *
 * While this implementation is generally faster than mergeSort for most data distributions,
 * it does not guarantee stability (equal elements may not maintain their original order).
 *
 * @typeParam T - The type of elements to sort
 * @param arr - The array to sort (will be modified in-place)
 * @param cmp - The comparator function to determine order (defaults to ascending)
 * @param insertionThreshold - Size threshold below which insertion sort is used (defaults to 12)
 * @returns The sorted array (same reference as input)
 *
 * @example
 * ```typescript
 * // Sort numbers in-place
 * const nums = [3, 1, 4, 2];
 * quickSort(nums);
 * console.log(nums); // [1, 2, 3, 4]
 *
 * // Sort with custom comparator
 * const data = [3, 1, 4, 2];
 * quickSort(data, (a, b) => b - a);
 * console.log(data); // [4, 3, 2, 1]
 * ```
 *
 * @remarks
 * The algorithm performs particularly well on:
 * - Random data distributions
 * - Arrays with many duplicate values (using 3-way partitioning)
 * - Nearly sorted arrays (using median-of-three pivot selection)
 *
 * For fully reversed data arrays, benchmarks show that the native JavaScript
 * sort and mergeSort tend to perform better. Consider using those alternatives
 * if you're primarily sorting reversed data.
 */
export function quickSort<T>(arr: T[], cmp: Comparator<T> = ascending, insertionThreshold = 12): T[] {
    if (arr.length <= 1) {
        return arr;
    }
    quickSortHelper(arr, 0, arr.length - 1, cmp, insertionThreshold);
    return arr;
}

function quickSortHelper<T>(a: T[], lo: number, hi: number, cmp: Comparator<T>, threshold: number): void {
    if (lo < hi) {
        // If the array is small, use insertion sort
        // This is a common optimization for quicksort to improve performance on small arrays
        if (hi - lo < threshold) {
            for (let i = lo + 1; i <= hi; i++) {
                let j = i;
                while (j > lo) {
                    if (cmp(a[j], a[j - 1]) < 0) {
                        const tmp = a[j - 1];
                        a[j - 1] = a[j];
                        a[j] = tmp;
                    } else break;
                    j--;
                }
            }
            return;
        }

        // Choose pivot using median of three
        // This is a common optimization to avoid worst-case scenarios when the array is already sorted or nearly sorted
        const pivotIndex = medianOfThree(a, lo, hi, cmp);
        const pivot = a[pivotIndex];

        // Move pivot to starting position
        const tmp = a[lo];
        a[lo] = a[pivotIndex];
        a[pivotIndex] = tmp;

        // 3-way partitioning to handle duplicates
        // Partition the array into three sections: < pivot, = pivot, > pivot
        // This is a Dijkstra's Dutch National Flag algorithm adaptation
        // that efficiently handles arrays with many duplicate values by
        // creating three partitions instead of two.

        let lt = lo; // Less than: arr[lo..lt-1] < pivot
        let gt = hi; // Greater than: arr[gt+1..hi] > pivot
        let i = lo + 1; // Current element to examine: arr[lt..i-1] = pivot

        while (i <= gt) {
            const comp = cmp(a[i], pivot);
            if (comp < 0) {
                // Current element is less than pivot, move to left section
                const tmp = a[lt];
                a[lt] = a[i];
                a[i] = tmp;
                lt++;
                i++;
            } else if (comp > 0) {
                // Current element is greater than pivot, move to right section
                const tmp = a[i];
                a[i] = a[gt];
                a[gt] = tmp;
                gt--;
                // Don't increment i here since we need to examine the swapped element
            } else {
                // Current element equals pivot, keep in middle section
                i++;
            }
        }

        // Recursively sort the left and right sections
        quickSortHelper(a, lo, lt - 1, cmp, threshold);
        quickSortHelper(a, gt + 1, hi, cmp, threshold);
    }
}

/**
 * Selects a good pivot using the median-of-three method.
 *
 * This function finds the median value among the first, middle, and last elements
 * of the array segment. Using this median as the pivot helps avoid the worst-case
 * O(n²) performance for already sorted or reverse-sorted arrays.
 *
 * @param arr - The array being sorted
 * @param lo - The lower bound of the current segment
 * @param hi - The upper bound of the current segment
 * @param cmp - The comparator function
 * @returns The index of the selected pivot (positioned at hi-1)
 */
function medianOfThree<T>(arr: T[], lo: number, hi: number, cmp: Comparator<T>): number {
    const mid = Math.floor((lo + hi) / 2);

    // Sort lo, mid, hi elements
    if (cmp(arr[mid], arr[lo]) < 0) {
        const tmp = arr[lo];
        arr[lo] = arr[mid];
        arr[mid] = tmp;
    }

    if (cmp(arr[hi], arr[lo]) < 0) {
        const tmp = arr[lo];
        arr[lo] = arr[hi];
        arr[hi] = tmp;
    }

    if (cmp(arr[hi], arr[mid]) < 0) {
        const tmp = arr[mid];
        arr[mid] = arr[hi];
        arr[hi] = tmp;
    }

    // Move pivot (median) to hi-1 position
    const tmp = arr[mid];
    arr[mid] = arr[hi - 1];
    arr[hi - 1] = tmp;

    return hi - 1; // Return index of pivot
}
