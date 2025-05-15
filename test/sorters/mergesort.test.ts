import { describe, test, expect } from "vitest";
import { mergeSort, descending, preserve, reverse } from "~/index";

describe("mergeSort", () => {
    test("empty array remains empty", () => {
        const arr: number[] = [];
        mergeSort(arr);
        expect(arr).toEqual([]);
    });

    test("single element array remains unchanged", () => {
        const arr = [42];
        mergeSort(arr);
        expect(arr).toEqual([42]);
    });

    test("sorts numbers in ascending order by default", () => {
        const arr = [3, 1, 4, 2];
        mergeSort(arr);
        expect(arr).toEqual([1, 2, 3, 4]);
    });

    test("sorts numbers in descending order with custom comparator", () => {
        const arr = [3, 1, 4, 2];
        mergeSort(arr, descending);
        expect(arr).toEqual([4, 3, 2, 1]);
    });

    test("sorts strings in alphabetical order", () => {
        const arr = ["foo", "bar", "baz"];
        mergeSort(arr);
        expect(arr).toEqual(["bar", "baz", "foo"]);
    });

    test("handles edge case with array size near threshold (12)", () => {
        const arr = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        mergeSort(arr);
        expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });

    test("sorts array with duplicate values", () => {
        const arr = [3, 1, 3, 2, 1, 2];
        mergeSort(arr);
        expect(arr).toEqual([1, 1, 2, 2, 3, 3]);
    });

    test("handles large arrays", () => {
        // Create an array of 1000 random numbers
        const size = 1000;
        const randomArr = Array.from({ length: size }, () => Math.floor(Math.random() * size));

        // Create a sorted version using the native sort for comparison
        const expectedArr = [...randomArr].sort((a, b) => a - b);

        // Sort using stableSort
        mergeSort(randomArr);

        // Compare results
        expect(randomArr).toEqual(expectedArr);
    });

    test("performs correctly on already sorted array", () => {
        const arr = [1, 2, 3, 4, 5];
        mergeSort(arr);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    test("performs correctly on reverse sorted array", () => {
        const arr = [5, 4, 3, 2, 1];
        mergeSort(arr);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    test("small array (below threshold of 12) - multiple identical elements", () => {
        const arr = [5, 3, 3, 1, 4, 3, 2];
        mergeSort(arr);
        expect(arr).toEqual([1, 2, 3, 3, 3, 4, 5]);
    });

    test("small array (exactly at threshold of 12)", () => {
        // Array with exactly 12 elements
        const arr = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        mergeSort(arr);
        expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });

    test("array just above threshold (13 elements)", () => {
        // Array with 13 elements, just above the threshold
        const arr = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        mergeSort(arr);
        expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    });

    test("preserves original order when using preserve comparator", () => {
        const arr = [3, 1, 4, 2, 5];
        const original = [...arr];
        mergeSort(arr, preserve);
        expect(arr).toEqual(original);
    });

    test("reverses original order when using reverse comparator", () => {
        const arr = [3, 1, 4, 2, 5];
        const reversed = [...arr].reverse();
        mergeSort(arr, reverse);
        expect(arr).toEqual(reversed);
    });

    test("stable sort with preserve in complex scenario", () => {
        interface Person {
            name: string;
            team: string;
            id: number;
        }

        const people: Person[] = [
            { name: "Alice", team: "Red", id: 1 },
            { name: "Bob", team: "Blue", id: 2 },
            { name: "Charlie", team: "Red", id: 3 },
            { name: "David", team: "Blue", id: 4 },
        ];

        // Using preserve should not change anything
        mergeSort(people, preserve);

        // Verify original order is maintained
        expect(people.map(p => p.id)).toEqual([1, 2, 3, 4]);
    });

    test("stable sort with reverse in complex scenario", () => {
        interface Person {
            name: string;
            team: string;
            id: number;
        }

        const people: Person[] = [
            { name: "Alice", team: "Red", id: 1 },
            { name: "Bob", team: "Blue", id: 2 },
            { name: "Charlie", team: "Red", id: 3 },
            { name: "David", team: "Blue", id: 4 },
        ];

        // Using reverse should reverse the entire array
        mergeSort(people, reverse);

        // Verify order is reversed
        expect(people.map(p => p.id)).toEqual([4, 3, 2, 1]);
    });
});
