/**
 * This module contains internal utilities that are not part of the public API.
 * Do not use these functions directly in application code.
 */

import { descending } from "~/basic";
import { mergeSort } from "~/sort";
import { Comparator } from "~/types";

type Sorter<T> = (items: T[], cmp?: Comparator<T>) => T[];

interface Item {
    val: number;
    index: number;
}

// cache
let _isNativeSortStable: boolean | null = null;

/**
 * Tests if the browser's native Array.sort implementation is stable.
 *
 * @remarks
 * This is an internal API. It should not be used directly in application code.
 *
 * @returns True if the browser's native sort is stable
 * @internal
 */
export function isNativeSortStable(): boolean {
    if (_isNativeSortStable == null) {
        _isNativeSortStable = checkSortStability((a, cmp) => a.sort(cmp));
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
export function checkSortStability(sorter: Sorter<Item>, size = 40): boolean {
    const arr: Item[] = [];

    for (let i = 0; i < size; i++) {
        arr.push({ val: Math.floor(Math.random() * 5), index: i });
    }

    const actual = sorter(arr.slice(), descending).map(item => item.index);
    const expected = mergeSort(arr.slice(), descending).map(item => item.index);
    return isArrayEqual(expected, actual);
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
