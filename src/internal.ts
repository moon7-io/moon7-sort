/**
 * This module contains internal utilities that are not part of the public API.
 * Do not use these functions directly in application code.
 */

import { Comparator } from "./types";

type Sorter<T> = (items: T[], cmp?: Comparator<T>) => void;

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
 * This is an internal API that is only exported for testing purposes.
 * It should not be used directly in application code.
 *
 * @param sorter - The sorting function to test
 * @returns True if the sorter maintains the relative order of equal elements (stable)
 * @internal
 */
export function checkSortStability(sorter: Sorter<Item>): boolean {
    const arr: Item[] = [
        { val: 2, index: 0 },
        { val: 1, index: 1 },
        { val: 2, index: 2 },
        { val: 3, index: 3 },
    ];
    sorter(arr, (a, b) => a.val - b.val);
    const actual = arr.map(x => x.index).join(",");
    return actual === "1,0,2,3";
}
