import { describe, test, expect } from "vitest";
import { mergeSort, quickSort } from "~/index";
import { checkSortStability, isNativeSortStable } from "~/internal";

describe("checkSortStability", () => {
    test("identifies mergeSort as stable", () => {
        const isStable = checkSortStability((a, cmp) => mergeSort(a, cmp));
        expect(isStable).toBe(true);
    });

    test.skip("identifies quickSort as unstable", () => {
        const isStable = checkSortStability((a, cmp) => quickSort(a, cmp));
        expect(isStable).toBe(false);
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
