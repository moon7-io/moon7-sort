/**
 * The mergeSort implementation is ported from Haxe's ArraySort:
 * https://github.com/HaxeFoundation/haxe/blob/development/std/haxe/ds/ArraySort.hx
 *
 * Original code is under MIT license:
 * Copyright (c) 2005-2023 Haxe Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */

import { ascending } from "~/basic";
import { Comparator } from "~/types";

/**
 * Performs an in-place stable sort on an array using the merge sort algorithm.
 *
 * This implementation uses a hybrid approach that falls back to insertion sort
 * for small arrays (less than 12 elements) for better performance. The algorithm
 * guarantees stability, meaning that equal elements maintain their relative order.
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
 * mergeSort(nums);
 * console.log(nums); // [1, 2, 3, 4]
 *
 * // Sort with custom comparator
 * const data = [3, 1, 4, 2];
 * mergeSort(data, (a, b) => b - a);
 * console.log(data); // [4, 3, 2, 1]
 * ```
 */
export function mergeSort<T>(arr: T[], cmp: Comparator<T> = ascending): T[] {
    rec(arr, cmp, 0, arr.length);
    return arr;
}

function rec<T>(a: T[], cmp: Comparator<T>, lo: number, hi: number) {
    const middle = (lo + hi) >> 1;
    if (hi - lo < 12) {
        if (hi <= lo) return;
        for (let i = lo + 1; i < hi; i++) {
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
    rec(a, cmp, lo, middle);
    rec(a, cmp, middle, hi);
    doMerge(a, cmp, lo, middle, hi, middle - lo, hi - middle);
}

function doMerge<T>(a: T[], cmp: Comparator<T>, from: number, pivot: number, to: number, len1: number, len2: number) {
    let first_cut, second_cut, len11, len22, new_mid;
    if (len1 == 0 || len2 == 0) return;
    if (len1 + len2 == 2) {
        if (cmp(a[pivot], a[from]) < 0) {
            const tmp = a[pivot];
            a[pivot] = a[from];
            a[from] = tmp;
        }
        return;
    }
    if (len1 > len2) {
        len11 = len1 >> 1;
        first_cut = from + len11;
        second_cut = lower(a, cmp, pivot, to, first_cut);
        len22 = second_cut - pivot;
    } else {
        len22 = len2 >> 1;
        second_cut = pivot + len22;
        first_cut = upper(a, cmp, from, pivot, second_cut);
        len11 = first_cut - from;
    }
    rotate(a, first_cut, pivot, second_cut);
    new_mid = first_cut + len22;
    doMerge(a, cmp, from, first_cut, new_mid, len11, len22);
    doMerge(a, cmp, new_mid, second_cut, to, len1 - len11, len2 - len22);
}

function rotate<T>(a: T[], from: number, mid: number, to: number): void {
    if (from == mid || mid == to) return;
    let n = gcd(to - from, mid - from);
    while (n-- != 0) {
        const val = a[from + n];
        const shift = mid - from;
        let p1 = from + n;
        let p2 = from + n + shift;
        while (p2 != from + n) {
            a[p1] = a[p2];
            p1 = p2;
            if (to - p2 > shift) p2 += shift;
            else p2 = from + (shift - (to - p2));
        }
        a[p1] = val;
    }
}

function gcd(m: number, n: number): number {
    while (n != 0) {
        const t = m % n;
        m = n;
        n = t;
    }
    return m;
}

function upper<T>(a: T[], cmp: Comparator<T>, from: number, to: number, val: number): number {
    let len = to - from;
    let half;
    let mid;
    while (len > 0) {
        half = len >> 1;
        mid = from + half;
        if (cmp(a[val], a[mid]) < 0) {
            len = half;
        } else {
            from = mid + 1;
            len = len - half - 1;
        }
    }
    return from;
}

function lower<T>(a: T[], cmp: Comparator<T>, from: number, to: number, val: number): number {
    let len = to - from;
    let half;
    let mid;
    while (len > 0) {
        half = len >> 1;
        mid = from + half;
        if (cmp(a[mid], a[val]) < 0) {
            from = mid + 1;
            len = len - half - 1;
        } else {
            len = half;
        }
    }
    return from;
}
