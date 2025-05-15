import { describe, test, expect } from "vitest";
import { ascending, random, randomly } from "~/index";

describe("random", () => {
    test("randomizes an array", () => {
        // Mock Math.random to ensure it actually shuffles
        const originalRandom = Math.random;
        let callCount = 0;
        Math.random = () => {
            callCount++;
            // Return values that will definitely shuffle the array
            return callCount % 2 === 0 ? 0.8 : 0.2;
        };

        try {
            const nums = [1, 2, 3, 4, 5];
            const sorted = [...nums].sort(random());

            // Ensure it has the same elements (but in different order)
            expect(sorted).toHaveLength(nums.length);
            expect([...sorted].sort(ascending)).toEqual(nums);

            // Verify the order has changed
            const isSameOrder = nums.every((num, i) => sorted[i] === num);
            expect(isSameOrder).toBe(false);
        } finally {
            // Restore original Math.random
            Math.random = originalRandom;
        }
    });

    test("randomly constant uses the default probability", () => {
        // Mock Math.random to ensure it actually shuffles
        const originalRandom = Math.random;
        let callCount = 0;
        Math.random = () => {
            callCount++;
            // Return values that will definitely shuffle the array
            return callCount % 2 === 0 ? 0.8 : 0.2;
        };

        try {
            const nums = [1, 2, 3, 4, 5];
            const sorted = [...nums].sort(randomly);

            // Ensure it has the same elements (but in different order)
            expect(sorted).toHaveLength(nums.length);
            expect([...sorted].sort(ascending)).toEqual(nums);

            // Verify the order has changed
            const isSameOrder = nums.every((num, i) => sorted[i] === num);
            expect(isSameOrder).toBe(false);

            // Should be equivalent to random() with default settings
            const randomlyResult = [...nums].sort(randomly);
            const randomResult = [...nums].sort(random(0.5));

            // Reset the mock to ensure consistent results for this comparison
            callCount = 0;

            // The behavior should be the same, though the actual results will be random
            expect(randomlyResult.length).toEqual(randomResult.length);
            expect([...randomlyResult].sort(ascending)).toEqual([...randomResult].sort(ascending));
        } finally {
            // Restore original Math.random
            Math.random = originalRandom;
        }
    });
});
