import { Comparator, Ordinal } from "./types";

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
