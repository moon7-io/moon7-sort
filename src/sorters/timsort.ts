import { ascending } from "~/basic";
import { Comparator } from "~/types";

/**
 * Implements the TimSort algorithm to sort arrays in-place.
 *
 * TimSort is a hybrid stable sorting algorithm derived from merge sort and
 * insertion sort, designed to perform well on many kinds of real-world data.
 * It was implemented by Tim Peters for Python's sorting function in 2002, and
 * is now used in Java, Android, and many other platforms as the standard sorting
 * algorithm.
 *
 * Key features of this implementation:
 * - Natural run detection and merging for optimal performance on partially sorted data
 * - Galloping mode for efficiently merging runs with large differences
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
 * TimSort performs particularly well on:
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
        insertionSort(arr, lo, hi, cmp);
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
export function getMinimumRunLength(n: number): number {
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

/**
 * Threshold for switching to galloping mode
 * When this many consecutive elements come from the same run,
 * the algorithm switches to galloping mode.
 */
const MIN_GALLOP = 7;

/**
 * Performs insertion sort on a slice of the array.
 *
 * @param a - The array to sort
 * @param lo - The start index (inclusive)
 * @param hi - The end index (inclusive)
 * @param cmp - The comparator function
 * @internal
 */
export function insertionSort<T>(a: T[], lo: number, hi: number, cmp: Comparator<T>): void {
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
}

/**
 * Locates the position at which to insert the specified key into the specified sorted range
 * using binary search. This is the galloping binary search used in TimSort's galloping mode.
 *
 * @param key - The element to search for
 * @param arr - The array to search in
 * @param base - The starting index of the range to search
 * @param len - The length of the range to search
 * @param hint - The index to start the search at
 * @param cmp - The comparator function to determine order
 * @returns The insertion point for the key in the range
 * @internal
 */
export function gallopLeft<T>(key: T, arr: T[], base: number, len: number, hint: number, cmp: Comparator<T>): number {
    let lastOffset = 0;
    let offset = 1;
    let maxOffset = len;

    // Find a range containing the insertion point using exponential search
    if (cmp(key, arr[base + hint]) > 0) {
        // Gallop right until arr[base + hint + lastOffset] < key <= arr[base + hint + offset]
        maxOffset = len - hint;
        while (offset < maxOffset && cmp(key, arr[base + hint + offset]) > 0) {
            lastOffset = offset;
            offset = offset * 2 + 1;
            /* v8 ignore start */
            if (offset <= 0) {
                // Integer overflow - rare but possible
                offset = maxOffset;
            }
            /* v8 ignore stop */
        }
        if (offset > maxOffset) {
            offset = maxOffset;
        }

        // Adjust offsets relative to hint
        lastOffset += hint;
        offset += hint;
    } else {
        // Gallop left until arr[base + hint - offset] < key <= arr[base + hint - lastOffset]
        maxOffset = hint + 1;
        while (offset < maxOffset && cmp(key, arr[base + hint - offset]) <= 0) {
            lastOffset = offset;
            offset = offset * 2 + 1;
            /* v8 ignore start */
            if (offset <= 0) {
                // Integer overflow
                offset = maxOffset;
            }
            /* v8 ignore stop */
        }
        /* v8 ignore start */
        if (offset > maxOffset) {
            offset = maxOffset;
        }
        /* v8 ignore stop */

        // Adjust offsets relative to hint
        const temp = lastOffset;
        lastOffset = hint - offset;
        offset = hint - temp;
    }

    // Fine-tune with binary search
    lastOffset++;
    while (lastOffset < offset) {
        const m = lastOffset + ((offset - lastOffset) >>> 1);
        if (cmp(key, arr[base + m]) > 0) {
            lastOffset = m + 1;
        } else {
            offset = m;
        }
    }
    return offset;
}

/**
 * Similar to gallopLeft but finds the position of the rightmost element
 * less than the key in a sorted array.
 *
 * @param key - The element to search for
 * @param arr - The array to search in
 * @param base - The starting index of the range to search
 * @param len - The length of the range to search
 * @param hint - The index to start the search at
 * @param cmp - The comparator function to determine order
 * @returns The count of elements less than key in the range
 * @internal
 */
export function gallopRight<T>(key: T, arr: T[], base: number, len: number, hint: number, cmp: Comparator<T>): number {
    let lastOffset = 0;
    let offset = 1;
    let maxOffset = len;

    // Find a range containing the insertion point using exponential search
    if (cmp(key, arr[base + hint]) < 0) {
        // Gallop left until arr[base + hint - offset] <= key < arr[base + hint - lastOffset]
        maxOffset = hint + 1;
        while (offset < maxOffset && cmp(key, arr[base + hint - offset]) < 0) {
            lastOffset = offset;
            offset = offset * 2 + 1;
            /* v8 ignore start */
            if (offset <= 0) {
                // Integer overflow
                offset = maxOffset;
            }
            /* v8 ignore stop */
        }
        /* v8 ignore start */
        if (offset > maxOffset) {
            offset = maxOffset;
        }
        /* v8 ignore stop */

        // Adjust offsets relative to hint
        const temp = lastOffset;
        lastOffset = hint - offset;
        offset = hint - temp;
    } else {
        // Gallop right until arr[base + hint + lastOffset] <= key < arr[base + hint + offset]
        maxOffset = len - hint;
        while (offset < maxOffset && cmp(key, arr[base + hint + offset]) >= 0) {
            lastOffset = offset;
            offset = offset * 2 + 1;
            /* v8 ignore start */
            if (offset <= 0) {
                // Integer overflow
                offset = maxOffset;
            }
            /* v8 ignore stop */
        }
        if (offset > maxOffset) {
            offset = maxOffset;
        }

        // Adjust offsets relative to hint
        lastOffset += hint;
        offset += hint;
    }

    // Fine-tune with binary search
    lastOffset++;
    while (lastOffset < offset) {
        const m = lastOffset + ((offset - lastOffset) >>> 1);
        if (cmp(key, arr[base + m]) < 0) {
            offset = m;
        } else {
            lastOffset = m + 1;
        }
    }
    return offset;
}

// optimization: keep this outside of merge to avoid a lot of allocations
const leftArr: any[] = [];
const rightArr: any[] = [];

/**
 * Merges two adjacent runs in-place with galloping mode optimization.
 *
 * @param arr - The array containing the runs
 * @param left - Start index of the first run
 * @param mid - End index of the first run (inclusive)
 * @param right - End index of the second run (inclusive)
 * @param cmp - The comparator function
 * @internal
 */
export function merge<T>(arr: T[], left: number, mid: number, right: number, cmp: Comparator<T>): void {
    // If the runs are already in order, no need to merge
    if (cmp(arr[mid], arr[mid + 1]) <= 0) {
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

    // Counters for galloping mode
    let leftRunCount = 0;
    let rightRunCount = 0;

    // Merge with galloping mode
    while (i < len1 && j < len2) {
        if (cmp(leftArr[i], rightArr[j]) <= 0) {
            // Taking element from left run
            arr[k++] = leftArr[i++];
            leftRunCount++;
            rightRunCount = 0;

            // Check if we should switch to galloping mode
            if (leftRunCount >= MIN_GALLOP) {
                // Enter galloping mode for the left run
                const advanceCount = gallopRight(rightArr[j], leftArr, i, len1 - i, 0, cmp);

                // Copy elements from left run in bulk
                for (let c = 0; c < advanceCount && i < len1; c++) {
                    arr[k++] = leftArr[i++];
                }

                leftRunCount = 0;
            }
        } else {
            // Taking element from right run
            arr[k++] = rightArr[j++];
            rightRunCount++;
            leftRunCount = 0;

            // Check if we should switch to galloping mode
            if (rightRunCount >= MIN_GALLOP) {
                // Enter galloping mode for the right run
                const advanceCount = gallopLeft(leftArr[i], rightArr, j, len2 - j, 0, cmp);

                // Copy elements from right run in bulk
                for (let c = 0; c < advanceCount && j < len2; c++) {
                    arr[k++] = rightArr[j++];
                }

                rightRunCount = 0;
            }
        }
    }

    // Copy the remaining elements from leftArr, if any
    while (i < len1) {
        arr[k++] = leftArr[i++];
    }

    // Copy the remaining elements from rightArr, if any
    while (j < len2) {
        arr[k++] = rightArr[j++];
    }
}
