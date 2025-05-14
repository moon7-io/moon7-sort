/**
 * Utility module for sorting arrays.
 * By default, ascending order is assumed.
 * See examples below on how to compose these functions.
 *
 * @packageDocumentation
 * @module sort
 * @author Munir Hussin
 *
 * @example
 * let nums = [3, 2, ...];
 * let strs = ["foo", "bar", ...];
 * let data = [{ year: 2018, month: 3 }, ...];
 *
 * // sort in ascending order
 * nums.sort(ascending);
 *
 * // sort in descending order
 * nums.sort(descending);
 *
 * // sort in ascending or descending order
 * nums.sort(dir(ASC));
 *
 * // sort in random order
 * nums.sort(random());
 *
 * // sort by year, ascending
 * data.sort(by(x => x.year));
 * // alternatively,
 * data.sort(by(x => x.year, ascending));
 *
 * // sort by year, descending
 * data.sort(by(x => x.year, descending));
 * // alternatively,
 * data.sort(reverse(by(x => x.year)));
 *
 * // sort by year, with a variable that controls ascending/descending
 * data.sort(reverse(by(x => x.year), isAscending));
 * // alternatively,
 * data.sort(by(x => x.year, isAscending ? ascending : descending));
 *
 * // sort by year, then by month
 * data.sort(order(by(x => x.year), by(x => x.month)));
 *
 * // sort by year, then by month, but with results in reverse order
 * data.sort(reverse(order(by(x => x.year), by(x => x.month))));
 *
 * // sort by nullable year, with null values at the top
 * data.sort(by(x => x.year || Number.NEGATIVE_INFINITY));
 *
 * // sort by natural case (for array of strings)
 * data.sort(natural());
 * data.sort(by(x => x.name, natural()));
 */

/**
 * A Comparator is a function that takes in 2 arguments and:
 * - returns 0 if they're equal
 * - a positive number if the first argument is larger
 * - a negative number if the first argument is smaller
 *
 * @typeParam T - The type of values being compared
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Type representing string-like values that can be used in comparisons
 *
 * @remarks
 * Includes actual strings and objects that can be coerced to strings
 */
export type StringLike =
    | string
    | { toString(): string }
    | { valueOf(): string }
    | { [Symbol.toPrimitive](hint: "string"): string };

/**
 * Type representing number-like values that can be used in comparisons
 *
 * @remarks
 * Includes actual numbers and objects that can be coerced to numbers
 */
export type NumberLike = number | { valueOf(): number } | { [Symbol.toPrimitive](hint: "number"): number };

/**
 * Type representing bigint-like values that can be used in comparisons
 *
 * @remarks
 * Includes actual bigints and objects that can be coerced to bigints
 */
export type BigIntLike = bigint | { valueOf(): bigint };

/**
 * Type representing values that can be ordered
 */
export type Ordinal = StringLike | NumberLike | BigIntLike;

/**
 * Constant representing ascending sort order
 */
export const ASC = true;

/**
 * Constant representing descending sort order
 */
export const DESC = false;

/**
 * Creates a sorted array from an iterable using the provided comparator
 *
 * @typeParam T - The type of elements in the iterable
 * @param items - The iterable to sort
 * @param cmp - The comparator function to use for sorting (defaults to ascending)
 * @returns A new sorted array containing all elements from the iterable
 *
 * @example
 * // Sort an array of numbers
 * const result = sort([3, 1, 4, 2]);
 * // result: [1, 2, 3, 4]
 *
 * @example
 * // Sort an array of objects by a property
 * const people = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }];
 * const result = sort(people, by(x => x.age));
 * // result: [{ name: 'Bob', age: 25 }, { name: 'Alice', age: 30 }]
 *
 * @example
 * // Sort a Set in descending order
 * const result = sort(new Set([3, 1, 4, 2]), descending);
 * // result: [4, 3, 2, 1]
 */
export function sort<T>(items: Iterable<T>, cmp: Comparator<T> = ascending): T[] {
    return [...items].sort(cmp);
}

/**
 * Compares two values in ascending order
 *
 * @typeParam T - The type of values being compared
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns Negative number if a < b, positive number if a > b, zero if equal
 */
export function ascending<T>(a: T, b: T): number {
    return a === b ? 0 : a < b ? -1 : 1;
}

/**
 * Compares two values in descending order
 *
 * @typeParam T - The type of values being compared
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns Negative number if a > b, positive number if a < b, zero if equal
 */
export function descending<T>(a: T, b: T): number {
    return -ascending(a, b);
}

/**
 * Creates a comparator that sorts in the specified direction
 *
 * @typeParam T - The type of values being compared
 * @param isAscending - When true, sorts in ascending order; when false, in descending order
 * @returns A comparator function that sorts in the specified direction
 */
export function dir<T>(isAscending: boolean): Comparator<T> {
    return isAscending ? ascending : descending;
}

/**
 * Creates a comparator that sorts randomly
 *
 * @typeParam T - The type of values being compared
 * @returns A comparator function that produces random sorting
 */
export function random<T>(): Comparator<T> {
    return () => Math.random() - 0.5;
}

/**
 * String comparison sensitivity options for natural sort comparisons
 *
 * Controls how string comparisons handle differences in character base,
 * accents, and letter case.
 *
 * @see {@link natural}
 */
export const enum Sensitivity {
    /**
     * Different base characters are unequal, but different cases or accents are considered equal
     * Example: a != b, a == á, a == A
     */
    Base = "base",

    /**
     * Different base characters or accents are unequal, but different cases are considered equal
     * Example: a != b, a != á, a == A
     */
    Accent = "accent",

    /**
     * Different base characters or cases are unequal, but different accents are considered equal
     * Example: a != b, a == á, a != A
     */
    Case = "case",

    /**
     * All variations are considered unequal (base, accent, case)
     * Example: a != b, a != á, a != A
     */
    Variant = "variant",
}

/**
 * Creates a natural sort comparator for strings, where numeric parts are sorted numerically
 * For example, "foo10" comes after "foo2" in natural sort order
 *
 * @param sensitivity - Controls how strings are compared (case, accents, etc.)
 * @returns A comparator function for natural string sorting
 */
export function natural(sensitivity: Sensitivity = Sensitivity.Base): Comparator<string> {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity });
    return collator.compare;
}

/**
 * Creates a comparator that compares values based on a mapped property or derived value
 *
 * @typeParam T - The type of values being compared
 * @typeParam S - The type of the mapped values (defaults to number)
 * @param map - Function that extracts the value to compare
 * @param cmp - Comparator to use for the mapped values (defaults to ascending)
 * @returns A comparator function that compares based on the mapped values
 */
export function by<T, S extends Ordinal = number>(map: (v: T) => S, cmp: Comparator<S> = ascending): Comparator<T> {
    return (a, b) => cmp(map(a), map(b));
}

/**
 * Creates a comparator that only considers items matching a predicate
 *
 * @typeParam T - The type of values being compared
 * @param predicate - Function that determines if items should be compared
 * @param cmp - Base comparator for matching items
 * @returns A comparator that only compares items matching the predicate
 *
 * @example
 * // Sort by active status first, then by name
 * items.sort(order(
 *   where(x => x.active, descending), // Active items first
 *   by(x => x.name) // Then by name
 * ));
 */
export function where<T>(predicate: (value: T) => boolean, cmp: Comparator<T> = ascending): Comparator<T> {
    return group(predicate, (a, b) => (a === b ? 0 : a ? -1 : 1), cmp);
}

/**
 * Creates a comparator that groups items by a selector function
 *
 * @typeParam T - The type of values being compared
 * @typeParam G - The type of the grouping key
 * @param selector - Function that determines which group an item belongs to
 * @param groupOrder - Comparator for ordering the groups
 * @param itemOrder - Comparator for ordering items within groups
 * @returns A comparator that orders by group first, then by the itemOrder
 *
 * @example
 * // Group by status, then sort by date within each group
 * items.sort(group(
 *   x => x.status,
 *   by(status => ['active', 'pending', 'archived'].indexOf(status)),
 *   by(x => x.created)
 * ));
 */
export function group<T, G extends Ordinal>(
    selector: (item: T) => G,
    groupOrder: Comparator<G> = ascending,
    itemOrder: Comparator<T> = ascending
): Comparator<T> {
    return (a, b) => {
        const groupA = selector(a);
        const groupB = selector(b);

        const groupResult = groupOrder(groupA, groupB);
        if (groupResult !== 0) return groupResult;

        return itemOrder(a, b);
    };
}

/**
 * Creates a comparator that chooses between two comparators based on a condition
 *
 * @typeParam T - The type of values being compared
 * @param condition - Function that determines which comparator to use
 * @param ifTrue - Comparator to use when condition returns true
 * @param ifFalse - Comparator to use when condition returns false
 * @returns A comparator that conditionally applies one of the two comparators
 *
 * @example
 * // Sort numbers differently if they're both negative
 * numbers.sort(conditional(
 *   (a, b) => a < 0 && b < 0,
 *   descending,  // Sort negative numbers in descending order
 *   ascending    // Sort other numbers in ascending order
 * ));
 */
export function conditional<T>(
    condition: (a: T, b: T) => boolean,
    ifTrue: Comparator<T>,
    ifFalse: Comparator<T>
): Comparator<T> {
    return (a, b) => (condition(a, b) ? ifTrue(a, b) : ifFalse(a, b));
}

/**
 * Creates a comparator that prioritizes items with null/undefined property values
 *
 * @typeParam T - The type of objects being compared
 * @typeParam U - The type of the extracted property
 * @param get - Function that extracts the property to check for null/undefined
 * @param cmp - Base comparator for non-null property values
 * @returns A comparator that prioritizes items with null/undefined property values
 *
 * @example
 * // Sort items with null price first
 * items.sort(nullable(x => x.price));
 *
 * @example
 * // Sort by category, with null categories first, then by price descending
 * items.sort(order(
 *   nullable(x => x.category),
 *   by(x => x.price, descending)
 * ));
 */
export function nullable<T, U>(get: (v: T) => U | null | undefined, cmp: Comparator<T> = ascending): Comparator<T> {
    return where(x => get(x) == null, cmp);
}

/**
 * Creates a comparator that tries multiple comparators in sequence
 * If the first comparator returns 0 (equal), it tries the next one, and so on
 *
 * @typeParam T - The type of values being compared
 * @param fns - Array of comparator functions to try in sequence
 * @returns A combined comparator function
 */
export function order<T>(...fns: Comparator<T>[]): Comparator<T> {
    return (a, b) => {
        for (const fn of fns) {
            const cmp = fn(a, b);
            if (cmp !== 0) return cmp;
        }
        return 0;
    };
}

/**
 * Creates a comparator that reverses the result of another comparator
 *
 * @typeParam T - The type of values being compared
 * @param fn - The comparator to reverse
 * @param ignore - When true, returns the original comparator without reversal
 * @returns A comparator function with reversed results (unless ignore is true)
 */
export function reverse<T>(fn: Comparator<T>, ignore?: boolean): Comparator<T> {
    return ignore ? fn : (a, b) => -fn(a, b);
}
