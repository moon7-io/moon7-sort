/**
 * Benchmarks for comparing different sorting algorithms performance.
 * This file measures the performance of native JavaScript sort, mergeSort,
 * and quickSort implementations under various conditions.
 */
import { bench, run, barplot, summary } from "mitata";
import { nativeSort, mergeSort, quickSort, timSort } from "~/index";

const benchmark = (fn: () => void) => barplot(() => summary(() => fn()));

function createRandomArray(size: number, max = size): number[] {
    return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

// Creates a nearly sorted array (sorted with ~5% of elements out of order)
function createNearlySortedArray(size: number): number[] {
    const arr = Array.from({ length: size }, (_, i) => i);
    // Swap ~5% of elements to make it nearly sorted
    const swaps = Math.floor(size * 0.05);
    for (let i = 0; i < swaps; i++) {
        const a = Math.floor(Math.random() * size);
        const b = Math.floor(Math.random() * size);
        const tmp = arr[a];
        arr[a] = arr[b];
        arr[b] = tmp;
    }
    return arr;
}

// Creates an array sorted in reverse order
function createReversedArray(size: number): number[] {
    return Array.from({ length: size }, (_, i) => size - i - 1);
}

// Creates an array with many duplicate values
function createDuplicatesArray(size: number): number[] {
    // Create an array with only 10 distinct values
    return Array.from({ length: size }, () => Math.floor(Math.random() * 10));
}

// Creates an array with equal values (worst case for some algorithms)
function createEqualArray(size: number): number[] {
    return Array.from({ length: size }, () => 42); // All elements are equal
}

const modes = [
    { create: createRandomArray, label: "Random" },
    { create: createNearlySortedArray, label: "Nearly Sorted" },
    { create: createReversedArray, label: "Reversed" },
    { create: createDuplicatesArray, label: "Duplicates" },
    { create: createEqualArray, label: "Equal" },
];

// const sizes = [10, 100, 1000];
const sizes = [10, 100, 1000, 10_000, 100_000];

const sorters = [
    { sort: nativeSort, label: "Native Sort" },
    { sort: mergeSort, label: "Merge Sort" },
    { sort: quickSort, label: "Quick Sort" },
    { sort: timSort, label: "Tim Sort" },
];

function verify(expected: number[], actual: number[]) {
    if (expected.length !== actual.length) {
        throw new Error("Array lengths do not match");
    }
    for (let i = 0; i < expected.length; i++) {
        if (expected[i] !== actual[i]) {
            throw new Error(`Arrays differ at index ${i}: ${expected[i]} !== ${actual[i]}`);
        }
    }
}

for (const size of sizes) {
    for (const { create, label } of modes) {
        benchmark(() => {
            const values = create(size);
            const expected = [...values].sort((a, b) => a - b);
            const actuals: (null | number[])[] = [null, null, null, null];

            for (const { sort, label: sorterLabel } of sorters) {
                bench(`${sorterLabel} (${label}, ${size})`, () => {
                    const arr = [...values];
                    sort(arr);
                    verify(expected, arr);
                });
            }
        });
    }
}

await run();
