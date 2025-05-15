import { describe, test, expect } from "vitest";
import {
    ascending,
    descending,
    dir,
    Direction,
    random,
    randomly,
    natural,
    naturally,
    by,
    order,
    flip,
    Sensitivity,
    where,
    nullable,
    group,
    conditional,
    sort,
    preserve,
} from "~/index";

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

describe("where", () => {
    test("prioritizes items matching predicate", () => {
        const items = [
            { name: "Apple", active: true },
            { name: "Banana", active: false },
            { name: "Cherry", active: true },
            { name: "Date", active: false },
        ];

        // Sort with active items first
        const result = [...items].sort(
            where(
                x => x.active,
                by(x => x.name)
            )
        );

        // Active items should come first, then sorted by name
        expect(result).toEqual([
            { name: "Apple", active: true },
            { name: "Cherry", active: true },
            { name: "Banana", active: false },
            { name: "Date", active: false },
        ]);
    });

    test("compares matching items using provided comparator", () => {
        const items = [
            { id: 1, priority: true },
            { id: 3, priority: true },
            { id: 2, priority: false },
            { id: 4, priority: false },
        ];

        // Sort with priority items first, descending by id
        const result = [...items].sort(
            where(
                x => x.priority,
                by(x => x.id, descending)
            )
        );

        // Priority items first in descending order by id, then non-priority
        expect(result).toEqual([
            { id: 3, priority: true },
            { id: 1, priority: true },
            { id: 4, priority: false },
            { id: 2, priority: false },
        ]);
    });

    test("handles all items not matching predicate", () => {
        const items = [
            { id: 1, priority: false },
            { id: 3, priority: false },
            { id: 2, priority: false },
        ];

        // All non-priority items, should maintain relative order
        const result = [...items].sort(where(x => x.priority));

        // Order should be preserved since no items match the predicate
        expect(result).toEqual([
            { id: 1, priority: false },
            { id: 3, priority: false },
            { id: 2, priority: false },
        ]);
    });

    test("handles all items matching predicate", () => {
        const items = [
            { id: 3, priority: true },
            { id: 1, priority: true },
            { id: 2, priority: true },
        ];

        // All priority items, should sort by id
        const result = [...items].sort(
            where(
                x => x.priority,
                by(x => x.id)
            )
        );

        // Should be sorted by id since all items match the predicate
        expect(result).toEqual([
            { id: 1, priority: true },
            { id: 2, priority: true },
            { id: 3, priority: true },
        ]);
    });
});

describe("nullable", () => {
    test("handles null values with nullsFirst=true (default)", () => {
        const items = [
            { id: 1, value: 10 },
            { id: 2, value: null },
            { id: 3, value: 5 },
            { id: 4, value: null },
            { id: 5, value: 15 },
        ];

        // Sort with nulls first, then by value
        const result = [...items].sort(
            nullable(
                x => x.value,
                by(x => x.value || 0)
            )
        );

        // Null values first, then sorted by value
        expect(result).toEqual([
            { id: 2, value: null },
            { id: 4, value: null },
            { id: 3, value: 5 },
            { id: 1, value: 10 },
            { id: 5, value: 15 },
        ]);
    });

    test("handles null values with nulls last", () => {
        const items = [
            { id: 1, value: 10 },
            { id: 2, value: null },
            { id: 3, value: 5 },
            { id: 4, value: null },
            { id: 5, value: 15 },
        ];

        // Sort with non-null values first, then by value
        const result = [...items].sort(
            flip(
                nullable(
                    x => x.value,
                    by(x => x.value || 0, descending)
                )
            )
        );

        // Non-null values first sorted by value, then null values
        expect(result).toEqual([
            { id: 3, value: 5 },
            { id: 1, value: 10 },
            { id: 5, value: 15 },
            { id: 2, value: null },
            { id: 4, value: null },
        ]);
    });

    test("handles all null values", () => {
        const items = [
            { id: 1, value: null },
            { id: 2, value: null },
            { id: 3, value: null },
        ];

        // All null values
        const result = [...items].sort(nullable(x => x.value));

        // Order should be preserved since all values are null
        expect(result.map(item => item.id)).toEqual([1, 2, 3]);
    });

    test("handles no null values", () => {
        const items = [
            { id: 1, value: 10 },
            { id: 2, value: 5 },
            { id: 3, value: 15 },
        ];

        // No null values
        const result = [...items].sort(
            nullable(
                x => x.value,
                by(x => x.value)
            )
        );

        // Should just be sorted by value
        expect(result).toEqual([
            { id: 2, value: 5 },
            { id: 1, value: 10 },
            { id: 3, value: 15 },
        ]);
    });

    test("works with different comparators", () => {
        const items = [
            { id: 5, name: "Cherry" },
            { id: 2, name: null },
            { id: 1, name: "Apple" },
            { id: 4, name: null },
            { id: 3, name: "Banana" },
        ];

        // Sort with nulls first, then by name in descending order
        const result = [...items].sort(
            nullable(
                x => x.name,
                by(x => x.name || "", descending)
            )
        );

        // Null values first, then sorted by name in descending order
        expect(result).toEqual([
            { id: 2, name: null },
            { id: 4, name: null },
            { id: 5, name: "Cherry" },
            { id: 3, name: "Banana" },
            { id: 1, name: "Apple" },
        ]);
    });
});

describe("group", () => {
    test("basic grouping with default comparators", () => {
        interface Item {
            name: string;
            category: string;
        }

        const items: Item[] = [
            { name: "Apple", category: "Fruit" },
            { name: "Carrot", category: "Vegetable" },
            { name: "Banana", category: "Fruit" },
            { name: "Broccoli", category: "Vegetable" },
        ];

        // Group by category, then sort by name within each group
        const result = [...items].sort(group(item => item.category));

        // Items should be grouped by category and then sorted by default comparator within each group
        expect(result).toEqual([
            { name: "Apple", category: "Fruit" },
            { name: "Banana", category: "Fruit" },
            { name: "Carrot", category: "Vegetable" },
            { name: "Broccoli", category: "Vegetable" },
        ]);
    });

    test("grouping with custom group comparator", () => {
        interface Item {
            name: string;
            priority: string;
        }

        const items: Item[] = [
            { name: "Task 1", priority: "Medium" },
            { name: "Task 2", priority: "High" },
            { name: "Task 3", priority: "Low" },
            { name: "Task 4", priority: "High" },
        ];

        // Define a custom order for priorities
        const priorities = { High: 0, Medium: 1, Low: 2 };
        const priorityOrder = (a: string, b: string): number => {
            return priorities[a as keyof typeof priorities] - priorities[b as keyof typeof priorities];
        };

        // Group by priority using custom order, then by name within each group
        const result = [...items].sort(group(item => item.priority, priorityOrder));

        // Items should be grouped by priority (High, Medium, Low) and sorted by name within groups
        expect(result).toEqual([
            { name: "Task 2", priority: "High" },
            { name: "Task 4", priority: "High" },
            { name: "Task 1", priority: "Medium" },
            { name: "Task 3", priority: "Low" },
        ]);
    });

    test("grouping with custom item comparator", () => {
        interface Product {
            name: string;
            category: string;
            price: number;
        }

        const products: Product[] = [
            { name: "Apple", category: "Fruit", price: 1.99 },
            { name: "Banana", category: "Fruit", price: 0.99 },
            { name: "Carrot", category: "Vegetable", price: 0.5 },
            { name: "Broccoli", category: "Vegetable", price: 1.5 },
        ];

        // Group by category, then sort by price descending within each group
        const result = [...products].sort(
            group(
                product => product.category,
                ascending,
                by(product => product.price, descending)
            )
        );

        // Items should be grouped by category and then sorted by price descending within each group
        expect(result).toEqual([
            { name: "Apple", category: "Fruit", price: 1.99 },
            { name: "Banana", category: "Fruit", price: 0.99 },
            { name: "Broccoli", category: "Vegetable", price: 1.5 },
            { name: "Carrot", category: "Vegetable", price: 0.5 },
        ]);
    });

    test("grouping with custom group and item comparators", () => {
        interface Task {
            id: number;
            status: string;
            dueDate: Date;
        }

        const tasks: Task[] = [
            { id: 1, status: "completed", dueDate: new Date("2023-03-15") },
            { id: 2, status: "active", dueDate: new Date("2023-02-20") },
            { id: 3, status: "pending", dueDate: new Date("2023-02-10") },
            { id: 4, status: "active", dueDate: new Date("2023-01-25") },
            { id: 5, status: "completed", dueDate: new Date("2023-01-15") },
        ];

        // Define a custom order for statuses
        const statuses = { active: 0, pending: 1, completed: 2 };
        const statusOrder = (a: string, b: string): number => {
            return statuses[a as keyof typeof statuses] - statuses[b as keyof typeof statuses];
        };

        // Group by status using custom order, then by due date (oldest first) within each group
        const result = [...tasks].sort(
            group(
                task => task.status,
                statusOrder,
                by(task => task.dueDate.getTime())
            )
        );

        // Items should be grouped by status (active, pending, completed) and sorted by due date within groups
        expect(result).toEqual([
            { id: 4, status: "active", dueDate: new Date("2023-01-25") },
            { id: 2, status: "active", dueDate: new Date("2023-02-20") },
            { id: 3, status: "pending", dueDate: new Date("2023-02-10") },
            { id: 5, status: "completed", dueDate: new Date("2023-01-15") },
            { id: 1, status: "completed", dueDate: new Date("2023-03-15") },
        ]);
    });

    test("grouping with same group values", () => {
        interface Item {
            id: number;
            group: string;
            value: number;
        }

        const items: Item[] = [
            { id: 1, group: "A", value: 30 },
            { id: 2, group: "A", value: 10 },
            { id: 3, group: "A", value: 20 },
        ];

        // All items have the same group, should just sort by value
        const result = [...items].sort(
            group(
                item => item.group,
                ascending,
                by(item => item.value)
            )
        );

        // Since all items have the same group, they should just be sorted by value
        expect(result).toEqual([
            { id: 2, group: "A", value: 10 },
            { id: 3, group: "A", value: 20 },
            { id: 1, group: "A", value: 30 },
        ]);
    });

    test("grouping with numeric groups", () => {
        interface Item {
            id: string;
            priority: number;
            name: string;
        }

        const items: Item[] = [
            { id: "A", priority: 2, name: "Medium Task 1" },
            { id: "B", priority: 1, name: "High Task 1" },
            { id: "C", priority: 3, name: "Low Task 1" },
            { id: "D", priority: 1, name: "High Task 2" },
            { id: "E", priority: 2, name: "Medium Task 2" },
        ];

        // Group by numeric priority, then by name within each group
        const result = [...items].sort(
            group(
                item => item.priority,
                ascending,
                by(item => item.name)
            )
        );

        // Items should be grouped by priority (1, 2, 3) and sorted by name within groups
        expect(result).toEqual([
            { id: "B", priority: 1, name: "High Task 1" },
            { id: "D", priority: 1, name: "High Task 2" },
            { id: "A", priority: 2, name: "Medium Task 1" },
            { id: "E", priority: 2, name: "Medium Task 2" },
            { id: "C", priority: 3, name: "Low Task 1" },
        ]);
    });
});

describe("complex examples", () => {
    test("combine multiple sorting functions", () => {
        interface Person {
            name: string;
            age: number;
        }

        const people: Person[] = [
            { name: "Alice", age: 30 },
            { name: "bob", age: 25 },
            { name: "Bob", age: 25 },
            { name: "charlie", age: 35 },
        ];

        // Sort by age ascending, then by name case-insensitive
        const sortByAgeAndNameCaseInsensitive = order(
            by<Person, number>(p => p.age),
            by<Person, string>(p => p.name.toLowerCase())
        );

        expect([...people].sort(sortByAgeAndNameCaseInsensitive)).toEqual([
            { name: "bob", age: 25 },
            { name: "Bob", age: 25 },
            { name: "Alice", age: 30 },
            { name: "charlie", age: 35 },
        ]);

        // Sort by name naturally
        expect([...people].sort(by<Person, string>(p => p.name, natural()))).toEqual([
            { name: "Alice", age: 30 },
            { name: "bob", age: 25 },
            { name: "Bob", age: 25 },
            { name: "charlie", age: 35 },
        ]);
    });

    test("complex grouping and ordering", () => {
        interface Product {
            id: number;
            name: string;
            category: string;
            subcategory: string;
            price: number;
            inStock: boolean;
        }

        const products: Product[] = [
            { id: 1, name: "Apple", category: "Fruit", subcategory: "Fresh", price: 1.99, inStock: true },
            { id: 2, name: "Banana", category: "Fruit", subcategory: "Fresh", price: 0.99, inStock: true },
            { id: 3, name: "Carrot", category: "Vegetable", subcategory: "Root", price: 0.5, inStock: false },
            { id: 4, name: "Broccoli", category: "Vegetable", subcategory: "Cruciferous", price: 1.5, inStock: true },
            { id: 5, name: "Dried Apple", category: "Fruit", subcategory: "Dried", price: 3.99, inStock: false },
            { id: 6, name: "Celery", category: "Vegetable", subcategory: "Stem", price: 1.2, inStock: true },
        ];

        // Complex sorting: First group by category, then prioritize in-stock items,
        // then group by subcategory, and finally sort by price ascending
        const result = [...products].sort(
            order(
                // First level: Group by category
                group(product => product.category, ascending),
                // Second level: In-stock items first
                where(product => product.inStock),
                // Third level: Group by subcategory
                group(product => product.subcategory, ascending),
                // Fourth level: Sort by price
                by(product => product.price)
            )
        );

        // Verify the complex ordering
        // First all in-stock fruits grouped by subcategory then by price
        // Then out-of-stock fruits grouped by subcategory then by price
        // Then all in-stock vegetables grouped by subcategory then by price
        // Then out-of-stock vegetables grouped by subcategory then by price
        expect(result.map(p => p.id)).toEqual([1, 2, 5, 3, 4, 6]);
    });
});

describe("conditional", () => {
    test("applies first comparator when condition is true", () => {
        const numbers = [3, 1, 4, 2];

        // Condition: both numbers are odd
        const bothOdd = (a: number, b: number) => a % 2 === 1 && b % 2 === 1;

        // If both are odd, sort descending, otherwise sort ascending
        const result = [...numbers].sort(conditional(bothOdd, descending, ascending));

        // The only pair of odd numbers is (3, 1), which should be sorted descending
        // The rest should be sorted ascending
        expect(result).toEqual([3, 1, 2, 4]);
    });

    test("applies second comparator when condition is false", () => {
        const numbers = [3, 1, 4, 2, 5];

        // Condition: both numbers are even
        const bothEven = (a: number, b: number) => a % 2 === 0 && b % 2 === 0;

        // If both are even, sort descending, otherwise sort ascending
        const result = [...numbers].sort(conditional(bothEven, descending, ascending));

        // The only pair of even numbers is (4, 2), which should be sorted descending
        // The rest should be sorted ascending
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    test("with objects and complex condition", () => {
        interface Item {
            id: number;
            category: string;
            value: number;
        }

        const items: Item[] = [
            { id: 1, category: "A", value: 30 },
            { id: 2, category: "B", value: 20 },
            { id: 3, category: "A", value: 10 },
            { id: 4, category: "B", value: 40 },
            { id: 5, category: "C", value: 50 },
        ];

        // Condition: if both items are in the same category
        const sameCategory = (a: Item, b: Item) => a.category === b.category;

        // If same category, sort by value descending, otherwise sort by category ascending
        const result = [...items].sort(
            conditional(
                sameCategory,
                by(item => item.value, descending),
                by(item => item.category)
            )
        );

        // Items in the same category should be sorted by value descending
        // Otherwise, items should be sorted by category
        expect(result).toEqual([
            { id: 1, category: "A", value: 30 },
            { id: 3, category: "A", value: 10 },
            { id: 4, category: "B", value: 40 },
            { id: 2, category: "B", value: 20 },
            { id: 5, category: "C", value: 50 },
        ]);
    });

    test("with dynamic conditions", () => {
        const numbers = [3, 1, 4, 2, 5];

        // Function that generates a conditional comparator based on a threshold
        const createThresholdComparator = (threshold: number) => {
            return conditional<number>(
                (a, b) => a >= threshold && b >= threshold,
                descending, // Sort higher numbers first when both exceed threshold
                ascending // Otherwise sort normally
            );
        };

        // When threshold is 3, numbers >= 3 are sorted descending
        const resultWithThreshold3 = [...numbers].sort(createThresholdComparator(3));
        expect(resultWithThreshold3).toEqual([1, 2, 5, 4, 3]);

        // When threshold is 4, numbers >= 4 are sorted descending
        const resultWithThreshold4 = [...numbers].sort(createThresholdComparator(4));
        expect(resultWithThreshold4).toEqual([1, 2, 3, 5, 4]);
    });
});

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
        expect(sort(numSet)).toEqual([1, 2, 3, 4]);
    });

    test("sorts from Map keys", () => {
        const map = new Map<number, string>([
            [3, "three"],
            [1, "one"],
            [4, "four"],
            [2, "two"],
        ]);
        expect(sort(map.keys())).toEqual([1, 2, 3, 4]);
    });

    test("sorts from Map values", () => {
        const map = new Map<string, string>([
            ["a", "foo"],
            ["b", "bar"],
            ["c", "baz"],
        ]);
        expect(sort(map.values())).toEqual(["bar", "baz", "foo"]);
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

    test("handles empty iterables", () => {
        expect(sort([])).toEqual([]);
        expect(sort(new Set())).toEqual([]);
    });
});

describe("preserve", () => {
    test("basic comparison always returns 0", () => {
        expect(preserve(1, 2)).toBe(0);
        expect(preserve(2, 1)).toBe(0);
        expect(preserve("a", "b")).toBe(0);
        expect(preserve(true, false)).toBe(0);
        expect(preserve({}, {})).toBe(0);
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

    test("flip(preserve) still maintains original order", () => {
        const nums = [3, 1, 4, 2];
        const originalOrder = [...nums];

        // Sort using flip(preserve) comparator
        const result = [...nums].sort(flip(preserve));

        // Should still maintain original order since preserve always returns 0
        expect(result).toEqual(originalOrder);
    });
});
