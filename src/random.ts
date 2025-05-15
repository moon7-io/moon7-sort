import { Comparator } from "./types";

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
