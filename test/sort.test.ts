import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import {
    group,
    sort,
    ascending,
    by,
    descending,
    nativeSort,
    mergeSort,
    quickSort,
    timSort,
    insertionSort,
    preserve,
    reverse,
} from "~/index";
import { type Sorter } from "~/internal";
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

describe("sort algorithms", () => {
    const sorters: { name: string; sorter: Sorter<any> }[] = [
        { name: "nativeSort", sorter: nativeSort },
        { name: "insertionSort", sorter: insertionSort },
        { name: "mergeSort", sorter: mergeSort },
        { name: "quickSort", sorter: quickSort },
        { name: "timSort", sorter: timSort },
    ];

    for (const { name, sorter } of sorters) {
        describe(`${name}`, () => {
            test("empty array remains empty", () => {
                const arr: number[] = [];
                expect(sorter(arr)).toEqual([]);
            });

            test("single element array remains unchanged", () => {
                const arr = [42];
                expect(sorter(arr)).toEqual([42]);
            });

            test("sorts numbers in ascending order by default", () => {
                const arr = [3, 1, 4, 2];
                expect(sorter(arr)).toEqual([1, 2, 3, 4]);
            });

            test("sorts numbers in descending order with custom comparator", () => {
                const arr = [3, 1, 4, 2];
                expect(sorter(arr, descending)).toEqual([4, 3, 2, 1]);
            });

            test("sorts strings in alphabetical order", () => {
                const arr = ["foo", "bar", "baz"];
                expect(sorter(arr)).toEqual(["bar", "baz", "foo"]);
            });

            test("handles array with duplicate values", () => {
                const arr = [3, 1, 3, 2, 1, 2];
                expect(sorter(arr)).toEqual([1, 1, 2, 2, 3, 3]);
            });

            for (const cmp of [ascending, descending]) {
                test(`handles large arrays (${cmp.name})`, () => {
                    const size = 1000;
                    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * size));
                    expect(sorter(arr.slice(), cmp)).toEqual(nativeSort(arr.slice(), cmp));
                });
            }

            test("performs correctly on already sorted array", () => {
                const arr = [1, 2, 3, 4, 5];
                expect(sorter(arr)).toEqual([1, 2, 3, 4, 5]);
            });

            test("performs correctly on reverse sorted array", () => {
                const arr = [5, 4, 3, 2, 1];
                expect(sorter(arr)).toEqual([1, 2, 3, 4, 5]);
            });
        });
    }
});

describe("stable sort algorithms", () => {
    const sorters: { name: string; sorter: Sorter<any> }[] = [
        { name: "nativeSort", sorter: nativeSort },
        { name: "insertionSort", sorter: insertionSort },
        { name: "mergeSort", sorter: mergeSort },
        { name: "timSort", sorter: timSort },
    ];

    for (const { name, sorter } of sorters) {
        describe(`${name}`, () => {
            for (const cmp of [ascending, descending, preserve, reverse]) {
                test(`handles large arrays (${cmp.name})`, () => {
                    const size = 1000;
                    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * size));
                    expect(sorter(arr.slice(), cmp)).toEqual(nativeSort(arr.slice(), cmp));
                });

                test("sort stability check", () => {
                    expect(internal.isSorterStable(sorter, nativeSort)).toBe(true);
                });
            }
        });
    }
});
