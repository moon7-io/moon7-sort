import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { group, sort, ascending, by, descending } from "~/index";
import * as internal from "~/internal";

describe("sort", () => {
    test("sorts an array of numbers", () => {
        const nums = [3, 1, 4, 2];
        expect(sort(nums)).toEqual([1, 2, 3, 4]);
    });

    test("sorts an array of strings", () => {
        const strs = ["foo", "bar", "baz"];
        expect(sort(strs)).toEqual(["bar", "baz", "foo"]);
    });

    test("sorts with custom comparator", () => {
        const nums = [3, 1, 4, 2];
        expect(sort(nums, descending)).toEqual([4, 3, 2, 1]);
    });

    test("sorts from Set", () => {
        const numSet = new Set([3, 1, 4, 2]);
        expect(sort([...numSet])).toEqual([1, 2, 3, 4]);
    });

    test("sorts from Map keys", () => {
        const map = new Map<number, string>([
            [3, "three"],
            [1, "one"],
            [4, "four"],
            [2, "two"],
        ]);
        expect(sort([...map.keys()])).toEqual([1, 2, 3, 4]);
    });

    test("sorts from Map values", () => {
        const map = new Map<string, string>([
            ["a", "foo"],
            ["b", "bar"],
            ["c", "baz"],
        ]);
        expect(sort([...map.values()])).toEqual(["bar", "baz", "foo"]);
    });

    test("sorts objects by property", () => {
        const people = [
            { name: "Alice", age: 30 },
            { name: "Bob", age: 25 },
            { name: "Charlie", age: 35 },
        ];
        expect(
            sort(
                people,
                by(p => p.age)
            )
        ).toEqual([
            { name: "Bob", age: 25 },
            { name: "Alice", age: 30 },
            { name: "Charlie", age: 35 },
        ]);
    });

    test("combines with other sorting utilities", () => {
        const items = [
            { category: "A", value: 3 },
            { category: "B", value: 1 },
            { category: "A", value: 5 },
            { category: "B", value: 4 },
        ];

        // Group by category, then sort by value
        expect(
            sort(
                items,
                group(
                    item => item.category,
                    ascending,
                    by(item => item.value)
                )
            )
        ).toEqual([
            { category: "A", value: 3 },
            { category: "A", value: 5 },
            { category: "B", value: 1 },
            { category: "B", value: 4 },
        ]);
    });

    test("handles empty arrays", () => {
        expect(sort([])).toEqual([]);
        expect(sort([])).toEqual([]);
    });

    describe("sort with non-stable native sort", () => {
        beforeEach(() => {
            vi.spyOn(internal, "isNativeSortStable").mockReturnValue(false);
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        test("uses mergeSort when browser's sort is not stable", () => {
            const nums = [3, 1, 4, 2];
            const result = sort(nums);

            // We're testing that the sort works correctly when isNativeSortStable is false
            // This will trigger the mergeSort branch
            expect(result).toEqual([1, 2, 3, 4]);

            // Also test with custom comparator
            const reversed = sort([3, 1, 4, 2], (a, b) => b - a);
            expect(reversed).toEqual([4, 3, 2, 1]);
        });

        test("sorts arrays with mergeSort when browser's sort is not stable", () => {
            const set = new Set([3, 1, 4, 2]);
            const result = sort([...set]);
            expect(result).toEqual([1, 2, 3, 4]);
        });
    });
});
