import { describe, test, expect } from "vitest";
import { quickSort, timSort, mergeSort, nativeSort } from "~/index";
import { isSorterStable, isNativeSortStable, isArrayEqual } from "~/internal";

describe("isSorterStable", () => {
    test("identifies nativeSort as stable", () => {
        expect(isSorterStable(nativeSort, mergeSort)).toBe(true);
    });

    test("identifies mergeSort as stable (32 or less)", () => {
        expect(isSorterStable(mergeSort, nativeSort, 16)).toBe(true);
    });

    test("identifies mergeSort as stable (more than 32)", () => {
        expect(isSorterStable(mergeSort, nativeSort, 64)).toBe(true);
    });

    test("identifies timSort as stable (32 or less)", () => {
        expect(isSorterStable(timSort, nativeSort, 16)).toBe(true);
    });

    test("identifies timSort as stable (more than 32)", () => {
        expect(isSorterStable(timSort, nativeSort, 64)).toBe(true);
    });

    test("identifies quickSort as unstable", () => {
        expect(isSorterStable(quickSort, nativeSort)).toBe(false);
    });
});

describe("isNativeSortStable", () => {
    test("checks if the browser's native sort is stable", () => {
        // This just verifies the function runs without error
        const result = isNativeSortStable();
        expect(typeof result).toBe("boolean");
    });

    test("is consistent across multiple calls", () => {
        // The result should be deterministic for a given browser
        const firstCall = isNativeSortStable();
        const secondCall = isNativeSortStable();

        expect(secondCall).toBe(firstCall);
    });
});

describe("isArrayEqual", () => {
    test("returns true for identical arrays", () => {
        const a = [1, 2, 3, 4, 5];
        const b = [1, 2, 3, 4, 5];
        expect(isArrayEqual(a, b)).toBe(true);
    });

    test("returns false for arrays with different length", () => {
        const a = [1, 2, 3, 4, 5];
        const b = [1, 2, 3, 4];
        expect(isArrayEqual(a, b)).toBe(false);
    });

    test("returns false for arrays with same length but different elements", () => {
        const a = [1, 2, 3, 4, 5];
        const b = [1, 2, 3, 5, 4];
        expect(isArrayEqual(a, b)).toBe(false);
    });

    test("works with empty arrays", () => {
        expect(isArrayEqual([], [])).toBe(true);
    });

    test("works with single element arrays", () => {
        expect(isArrayEqual([42], [42])).toBe(true);
        expect(isArrayEqual([42], [43])).toBe(false);
    });
});
