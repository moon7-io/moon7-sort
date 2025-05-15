import { describe, test, expect } from "vitest";
import { natural, naturally, Sensitivity } from "~/index";

describe("natural", () => {
    test("natural ordering of strings with numbers", () => {
        const strs = ["foo10", "foo2", "foo1"];
        expect([...strs].sort(natural())).toEqual(["foo1", "foo2", "foo10"]);
    });

    test("naturally constant uses default sensitivity", () => {
        const strs = ["foo10", "foo2", "foo1"];
        expect([...strs].sort(naturally)).toEqual(["foo1", "foo2", "foo10"]);

        // Should be equivalent to natural() with default settings
        const naturallyResult = [...strs].sort(naturally);
        const naturalResult = [...strs].sort(natural());
        expect(naturallyResult).toEqual(naturalResult);
    });

    test("case sensitivity options", () => {
        const strs = ["a", "á", "A", "b"];

        // base: a == á, a == A
        expect([...strs].sort(natural(Sensitivity.Base))).toEqual(["a", "á", "A", "b"]);

        // accent: a != á, a == A
        const accentSorted = [...strs].sort(natural(Sensitivity.Accent));
        // Just check that 'á' is sorted separately from 'a'
        const aIndex = accentSorted.indexOf("a");
        const accIndex = accentSorted.indexOf("á");
        expect(aIndex).not.toBe(accIndex - 1);
        expect(aIndex).not.toBe(accIndex + 1);

        // case: a == á, a != A
        const caseSorted = [...strs].sort(natural(Sensitivity.Case));
        // Check A and a are not adjacent
        expect(caseSorted.indexOf("A") !== caseSorted.indexOf("a") - 1).toBeTruthy();

        // variant: a != á, a != A
        const variantSorted = [...strs].sort(natural(Sensitivity.Variant));
        // Check all items are separated
        expect(new Set(variantSorted).size).toBe(strs.length);
    });
});
