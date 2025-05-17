/**
 * This module contains internal utilities that are not part of the public API.
 * Do not use these functions directly in application code.
 */

import { ascending, descending, preserve, reverse } from "~/basic";
import { mergeSort, nativeSort } from "~/sort";
import { Comparator } from "~/types";

export type Sorter<T> = (items: T[], cmp?: Comparator<T>) => T[];

interface Item {
    val: number;
    index: number;
}

// cache
let _isNativeSortStable: boolean | null = null;

/**
 * Tests if the browser's native Array.sort implementation is stable.
 * Will only run once and cache the result for future calls.
 *
 * @returns True if the browser's native sort is stable
 * @internal
 */
export function isNativeSortStable(): boolean {
    if (_isNativeSortStable == null) {
        _isNativeSortStable = isSorterStable(nativeSort, mergeSort);
    }
    return _isNativeSortStable;
}

/**
 * Tests if a sorting function preserves the relative order of equal elements.
 *
 * @remarks
 * The size cannot be too small, as some sorters will fallback to insertion sort
 * when the array is small, which is stable by definition.
 *
 * @param sorter - The sorting function to test
 * @param size - The size of the array to generate for testing
 * @returns True if the sorter maintains the relative order of equal elements (stable)
 * @internal
 */
export function isSorterStable(actualSorter: Sorter<Item>, expectedSorter: Sorter<Item>, size = 50): boolean {
    const arr: Item[] = [];
    const n = Math.max(Math.floor(size / 2), 5); // ensure duplicates, and no more than 5

    for (let i = 0; i < size; i++) {
        arr.push({ val: Math.floor(Math.random() * n), index: i });
    }

    // test with all 4 core comparators
    for (const cmp of [ascending, descending, preserve, reverse]) {
        const actual = actualSorter(arr.slice(), cmp).map(item => item.index);
        const expected = expectedSorter(arr.slice(), cmp).map(item => item.index);
        if (!isArrayEqual(expected, actual)) {
            return false;
        }
    }
    return true;
}

/**
 * Compares two arrays of numbers for equality.
 *
 * @remarks
 * This is an internal API. It should not be used directly in application code.
 *
 * @param expected - The first array to compare
 * @param actual - The second array to compare
 * @returns True if the arrays are equal (same length and all elements match)
 * @internal
 */
export function isArrayEqual(expected: number[], actual: number[]): boolean {
    if (expected.length !== actual.length) {
        return false;
    }
    for (let i = 0; i < expected.length; i++) {
        if (expected[i] !== actual[i]) {
            return false;
        }
    }
    return true;
}
