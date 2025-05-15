/**
 * Benchmarks for comparing different sorting algorithms performance.
 * This file measures the performance of native JavaScript sort, mergeSort,
 * and quickSort implementations under various conditions.
 */
import { bench, run, barplot, summary } from "mitata";
import { mergeSort, quickSort } from "~/index";

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

const createMode = [
    { fn: createRandomArray, label: "Random" },
    { fn: createNearlySortedArray, label: "Nearly Sorted" },
    { fn: createReversedArray, label: "Reversed" },
    { fn: createDuplicatesArray, label: "Duplicates" },
    { fn: createEqualArray, label: "Equal" },
];

// const sizes = [10, 100, 1000];
const sizes = [10_000, 100_000];

for (const size of sizes) {
    for (const { fn: create, label } of createMode) {
        benchmark(() => {
            const values = create(size);

            bench(`Native sort (${label}, ${size})`, () => {
                const arr = [...values];
                arr.sort((a, b) => a - b);
            });

            bench(`MergeSort (${label}, ${size})`, () => {
                const arr = [...values];
                mergeSort(arr);
            });

            bench(`QuickSort (${label}, ${size})`, () => {
                const arr = [...values];
                quickSort(arr);
            });
        });
    }
}

await run();
