import { describe, test, expect } from "vitest";
import { ascending, by, descending, dir, Direction, flip, group, naturally, order, preserve, reverse } from "~/index";

describe("ascending", () => {
    test("basic comparison", () => {
        expect(ascending(1, 2)).toBeLessThan(0);
        expect(ascending(2, 1)).toBeGreaterThan(0);
        expect(ascending(1, 1)).toBe(0);
    });

    test("sorting numbers", () => {
        const nums = [3, 1, 4, 2];
        expect([...nums].sort(ascending)).toEqual([1, 2, 3, 4]);
    });

    test("sorting strings", () => {
        const strs = ["foo", "bar", "baz"];
        expect([...strs].sort(ascending)).toEqual(["bar", "baz", "foo"]);
    });
});

describe("descending", () => {
    test("basic comparison", () => {
        expect(descending(1, 2)).toBeGreaterThan(0);
        expect(descending(2, 1)).toBeLessThan(0);
        expect(Math.abs(descending(1, 1))).toBe(0);
    });

    test("sorting numbers", () => {
        const nums = [3, 1, 4, 2];
        expect([...nums].sort(descending)).toEqual([4, 3, 2, 1]);
    });

    test("sorting strings", () => {
        const strs = ["foo", "bar", "baz"];
        expect([...strs].sort(descending)).toEqual(["foo", "baz", "bar"]);
    });
});

describe("dir", () => {
    test("ascending direction", () => {
        const nums = [3, 1, 4, 2];
        expect([...nums].sort(dir(Direction.Ascending))).toEqual([1, 2, 3, 4]);
    });

    test("descending direction", () => {
        const nums = [3, 1, 4, 2];
        expect([...nums].sort(dir(Direction.Descending))).toEqual([4, 3, 2, 1]);
    });
});

describe("preserve", () => {
    test("basic comparison always returns 1", () => {
        expect(preserve(1, 2)).toBe(1);
        expect(preserve(2, 1)).toBe(1);
        expect(preserve("a", "b")).toBe(1);
        expect(preserve(true, false)).toBe(1);
        expect(preserve({}, {})).toBe(1);
    });

    test("sorting with preserve maintains original order", () => {
        const nums = [3, 1, 4, 2];
        const originalOrder = [...nums];

        // Sort using preserve comparator
        const result = [...nums].sort(preserve);

        // Should maintain original order
        expect(result).toEqual(originalOrder);
    });

    test("can be used in composition with other comparators", () => {
        const items = [
            { id: 1, category: "A" },
            { id: 2, category: "B" },
            { id: 3, category: "A" },
        ];

        // Group by category, but don't order items within groups
        const result = [...items].sort(group(item => item.category, ascending, preserve));

        // Items should be grouped by category but maintain original order within groups
        // IDs 1 and 3 are in category A, ID 2 is in category B
        expect(result.map(item => item.id)).toEqual([1, 3, 2]);
    });

    test("flip(preserve) reverses original order", () => {
        const nums = [3, 1, 4, 2];

        // Sort using flip(preserve) comparator
        const result = [...nums].sort(flip(preserve));

        // Should reverse the original order
        expect(result).toEqual([2, 4, 1, 3]);
    });
});

describe("reverse", () => {
    test("basic comparison always returns -1", () => {
        expect(reverse(1, 2)).toBe(-1);
        expect(reverse(2, 1)).toBe(-1);
        expect(reverse("a", "b")).toBe(-1);
        expect(reverse(true, false)).toBe(-1);
        expect(reverse({}, {})).toBe(-1);
    });

    test("sorting with reverse reverses original order", () => {
        const nums = [3, 1, 4, 2];

        // Sort using reverse comparator
        const result = [...nums].sort(reverse);

        // Should reverse the original order
        expect(result).toEqual([2, 4, 1, 3]);
    });

    test("can be used in composition with other comparators", () => {
        const items = [
            { id: 1, category: "A" },
            { id: 2, category: "B" },
            { id: 3, category: "A" },
        ];

        // Group by category, but reverse the order within groups
        const result = [...items].sort(group(item => item.category, ascending, reverse));

        // Items should be grouped by category but reverse order within groups
        // IDs 1 and 3 are in category A, ID 2 is in category B
        expect(result.map(item => item.id)).toEqual([3, 1, 2]);
    });

    test("flip(reverse) maintains original order", () => {
        const nums = [3, 1, 4, 2];
        const originalOrder = [...nums];

        // Sort using flip(reverse) comparator
        const result = [...nums].sort(flip(reverse));

        // Should maintain the original order since flip negates -1 to 1
        expect(result).toEqual(originalOrder);
    });
});

describe("by", () => {
    test("sort objects by a property", () => {
        const data = [
            { year: 2019, month: 3 },
            { year: 2018, month: 12 },
            { year: 2018, month: 1 },
        ];

        // Sort by year (ascending by default)
        expect([...data].sort(by(x => x.year))).toEqual([
            { year: 2018, month: 12 },
            { year: 2018, month: 1 },
            { year: 2019, month: 3 },
        ]);

        // Sort by year explicitly ascending
        expect([...data].sort(by(x => x.year, ascending))).toEqual([
            { year: 2018, month: 12 },
            { year: 2018, month: 1 },
            { year: 2019, month: 3 },
        ]);

        // Sort by year descending
        expect([...data].sort(by(x => x.year, descending))).toEqual([
            { year: 2019, month: 3 },
            { year: 2018, month: 12 },
            { year: 2018, month: 1 },
        ]);
    });

    test("sort with nullable values", () => {
        const data = [{ year: 2019 }, { year: null }, { year: 2018 }];

        expect([...data].sort(by(x => x.year || Number.NEGATIVE_INFINITY))).toEqual([
            { year: null },
            { year: 2018 },
            { year: 2019 },
        ]);
    });

    test("sort with reverse natural order", () => {
        const files = [{ name: "file1.txt" }, { name: "file10.txt" }, { name: "file2.txt" }];

        // Sort by name using reversed natural order
        expect([...files].sort(by(f => f.name, flip(naturally)))).toEqual([
            { name: "file10.txt" },
            { name: "file2.txt" },
            { name: "file1.txt" },
        ]);
    });
});

describe("order", () => {
    test("sort by multiple criteria", () => {
        const data = [
            { year: 2018, month: 12 },
            { year: 2019, month: 3 },
            { year: 2018, month: 1 },
        ];

        // Sort by year, then by month
        expect(
            [...data].sort(
                order(
                    by(x => x.year),
                    by(x => x.month)
                )
            )
        ).toEqual([
            { year: 2018, month: 1 },
            { year: 2018, month: 12 },
            { year: 2019, month: 3 },
        ]);
    });

    test("empty comparator array returns 0", () => {
        expect(order()(1, 2)).toBe(0);
    });
});

describe("flip", () => {
    test("flip a comparator", () => {
        const nums = [3, 1, 4, 2];
        expect([...nums].sort(flip(ascending))).toEqual([4, 3, 2, 1]);
    });

    test("flip with ignore flag", () => {
        const nums = [3, 1, 4, 2];
        expect([...nums].sort(flip(ascending, true))).toEqual([1, 2, 3, 4]);
    });

    test("flip a composite comparator", () => {
        const data = [
            { year: 2018, month: 12 },
            { year: 2019, month: 3 },
            { year: 2018, month: 1 },
        ];

        // Flip the order of: sort by year, then by month
        expect(
            [...data].sort(
                flip(
                    order(
                        by(x => x.year),
                        by(x => x.month)
                    )
                )
            )
        ).toEqual([
            { year: 2019, month: 3 },
            { year: 2018, month: 12 },
            { year: 2018, month: 1 },
        ]);
    });

    test("flip with variable condition", () => {
        const nums = [3, 1, 4, 2];
        const isAscending = true;

        expect([...nums].sort(flip(ascending, isAscending))).toEqual([1, 2, 3, 4]);
        expect([...nums].sort(flip(ascending, !isAscending))).toEqual([4, 3, 2, 1]);
    });
});
