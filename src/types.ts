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
