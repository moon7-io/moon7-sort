import { describe, test, expect } from "vitest";
import { ascending, by, descending, nativeSort } from "~/index";

describe("nativeSort", () => {
    test("sorts an array of numbers", () => {
        const nums = [3, 1, 4, 2];
        expect(nativeSort(nums)).toEqual([1, 2, 3, 4]);
    });

    test("sorts an array of strings", () => {
        const strs = ["foo", "bar", "baz"];
        expect(nativeSort(strs)).toEqual(["bar", "baz", "foo"]);
    });

    test("sorts with custom comparator", () => {
        const nums = [3, 1, 4, 2];
        expect(nativeSort(nums, descending)).toEqual([4, 3, 2, 1]);
    });

    test("works with default ascending comparator", () => {
        const nums = [3, 1, 4, 2];
        expect(nativeSort(nums, ascending)).toEqual([1, 2, 3, 4]);
    });

    test("sorts objects by property", () => {
        const people = [
            { name: "Alice", age: 30 },
            { name: "Bob", age: 25 },
            { name: "Charlie", age: 35 },
        ];
        expect(
            nativeSort(
                people,
                by(p => p.age)
            )
        ).toEqual([
            { name: "Bob", age: 25 },
            { name: "Alice", age: 30 },
            { name: "Charlie", age: 35 },
        ]);
    });

    test("handles empty arrays", () => {
        expect(nativeSort([])).toEqual([]);
    });
});
