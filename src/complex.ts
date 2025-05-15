import { ascending } from "./basic";
import { Comparator, Ordinal } from "./types";

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
