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
 * nums.sort(dir(Direction.Ascending));
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
 * data.sort(flip(by(x => x.year)));
 *
 * // sort by year, with a variable that controls ascending/descending
 * data.sort(flip(by(x => x.year), isAscending));
 * // alternatively,
 * data.sort(by(x => x.year, isAscending ? ascending : descending));
 *
 * // sort by year, then by month
 * data.sort(order(by(x => x.year), by(x => x.month)));
 *
 * // sort by year, then by month, but with results in reverse order
 * data.sort(flip(order(by(x => x.year), by(x => x.month))));
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
    return a === b ? 0 : a > b ? -1 : 1;
}

/**
 * A comparator that always returns 1, preserving the original order of elements
 *
 * This comparator can be used when you want to maintain the original order of elements
 * in scenarios like group sorting, where you want to group items but not change their
 * relative positions within groups.
 *
 * @example
 * // Preserve original order when sorting
 * const array = [3, 1, 4, 2];
 * array.sort(preserve);
 * // Result: [3, 1, 4, 2] (unchanged)
 *
 * @example
 * // Group by category, but keep the original order within each group
 * items.sort(group(item => item.category, ascending, preserve));
 */
export const preserve: Comparator<any> = () => 1;

/**
 * A comparator that always returns -1, reverses the original order of elements
 *
 * This comparator can be used when you want to reverse the original order of elements
 * in scenarios like group sorting, where you want to group items but not change their
 * relative positions within groups.
 *
 * @example
 * // Preserve original order when sorting
 * const array = [3, 1, 4, 2];
 * array.sort(reverse);
 * // Result: [2, 4, 1, 3]
 *
 * @example
 * // Group by category, but reverses the original order within each group
 * items.sort(group(item => item.category, ascending, reverses));
 */
export const reverse: Comparator<any> = () => -1;

/**
 * Enumeration representing sorting directions
 *
 * This enum provides semantic values for ascending and descending sort order.
 * The numerical values are chosen so that truthy values (Ascending = 1) correspond
 * to ascending order, and falsy values (Descending = 0) correspond to descending order.
 *
 * @example
 * // Sort numbers in ascending order
 * numbers.sort(dir(Direction.Ascending));
 *
 * @example
 * // Sort numbers in descending order
 * numbers.sort(dir(Direction.Descending));
 */
export enum Direction {
    /**
     * Represents descending sort order (largest to smallest)
     */
    Descending = 0,

    /**
     * Represents ascending sort order (smallest to largest)
     */
    Ascending = 1,
}

/**
 * Creates a comparator that sorts in the specified direction
 *
 * @typeParam T - The type of values being compared
 * @param isAscending - Direction to sort in
 * @returns A comparator function that sorts in the specified direction
 *
 * @remarks
 * This is an overloaded function that accepts either a boolean or a Direction enum value.
 * The implementation treats any truthy value as ascending and any falsy value as descending.
 */
export function dir<T>(isAscending: boolean | Direction): Comparator<T> {
    return !!isAscending ? ascending : descending;
}

/**
 * Creates a comparator that sorts randomly
 *
 * @typeParam T - The type of values being compared
 * @param p - The probability threshold, defaults to 0.5 for even distribution
 * @returns A comparator function that produces random sorting
 *
 * @remarks
 * **CAVEAT**: This method has a bias and does not produce a uniformly random permutation.
 * For proper shuffling, consider using Fisher-Yates algorithm instead.
 * This function is provided for quick randomization, not for statistically sound shuffling.
 *
 * @example
 * // Sort numbers in random order
 * const nums = [1, 2, 3, 4, 5];
 * nums.sort(random(0.5));
 */
export function random<T>(p: number = 0.5): Comparator<T> {
    return () => Math.random() - p;
}

/**
 * Pre-configured random sort comparator with default probability threshold
 *
 * This constant provides a convenient way to randomly sort arrays without specifying parameters
 *
 * @remarks
 * **CAVEAT**: Like the random() function, this constant produces biased results and does not create
 * uniformly distributed permutations. For cryptographically sound or statistically correct shuffling,
 * use the Fisher-Yates algorithm instead. This is intended for simple randomization only.
 *
 * @example
 * // Sort an array in random order
 * numbers.sort(randomly);
 */
export const randomly = random(0.5);

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
 * Pre-configured natural sort comparator with default sensitivity settings
 *
 * This constant provides a convenient way to use natural sorting without specifying parameters
 *
 * @example
 * // Sort strings naturally
 * strings.sort(naturally);
 *
 * @example
 * // Use in combination with other functions
 * objects.sort(by(x => x.filename, naturally));
 */
export const naturally = natural();

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
 * Creates a comparator that flips the result of another comparator
 *
 * @typeParam T - The type of values being compared
 * @param fn - The comparator to flip
 * @param ignore - When true, returns the original comparator without flipping
 * @returns A comparator function with flipped results (unless ignore is true)
 */
export function flip<T>(fn: Comparator<T>, ignore?: boolean): Comparator<T> {
    return ignore ? fn : (a, b) => -fn(a, b);
}
