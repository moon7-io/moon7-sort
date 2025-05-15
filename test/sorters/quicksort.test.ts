import { describe, test, expect } from "vitest";
import { quickSort, descending } from "~/index";

describe("quickSort", () => {
    test("empty array remains empty", () => {
        const arr: number[] = [];
        quickSort(arr);
        expect(arr).toEqual([]);
    });

    test("single element array remains unchanged", () => {
        const arr = [42];
        quickSort(arr);
        expect(arr).toEqual([42]);
    });

    test("sorts numbers in ascending order by default", () => {
        const arr = [3, 1, 4, 2];
        quickSort(arr);
        expect(arr).toEqual([1, 2, 3, 4]);
    });

    test("sorts numbers in descending order with custom comparator", () => {
        const arr = [3, 1, 4, 2];
        quickSort(arr, descending);
        expect(arr).toEqual([4, 3, 2, 1]);
    });

    test("sorts strings in alphabetical order", () => {
        const arr = ["foo", "bar", "baz"];
        quickSort(arr);
        expect(arr).toEqual(["bar", "baz", "foo"]);
    });

    test("handles array with duplicate values", () => {
        const arr = [3, 1, 3, 2, 1, 2];
        quickSort(arr);
        expect(arr).toEqual([1, 1, 2, 2, 3, 3]);
    });

    test("handles large arrays", () => {
        // Create an array of 1000 random numbers
        const size = 1000;
        const randomArr = Array.from({ length: size }, () => Math.floor(Math.random() * size));

        // Create a sorted version using the native sort for comparison
        const expectedArr = [...randomArr].sort((a, b) => a - b);

        // Sort using quickSort
        quickSort(randomArr);

        // Compare results
        expect(randomArr).toEqual(expectedArr);
    });

    test("performs correctly on already sorted array", () => {
        const arr = [1, 2, 3, 4, 5];
        quickSort(arr);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    test("performs correctly on reverse sorted array", () => {
        const arr = [5, 4, 3, 2, 1];
        quickSort(arr);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });
});
