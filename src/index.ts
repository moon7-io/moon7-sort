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

export * from "./types";
export * from "./basic";
export * from "./complex";
export * from "./random";
export * from "./strings";
export * from "./sort";
