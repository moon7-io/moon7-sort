import { ascending } from "~/basic";
import { Comparator } from "~/types";

export function insertionSort<T>(arr: T[], cmp: Comparator<T> = ascending): T[] {
    if (arr.length <= 1) {
        return arr;
    }
    insertionRangeSort(arr, 0, arr.length - 1, cmp);
    return arr;
}

/**
 * Performs insertion sort on a slice of the array.
 *
 * @param a - The array to sort
 * @param lo - The start index (inclusive)
 * @param hi - The end index (inclusive)
 * @param cmp - The comparator function
 * @internal
 */
export function insertionRangeSort<T>(a: T[], lo: number, hi: number, cmp: Comparator<T>): void {
    for (let i = lo + 1; i <= hi; i++) {
        let j = i;
        while (j > lo) {
            if (cmp(a[j], a[j - 1]) < 0) {
                const tmp = a[j - 1];
                a[j - 1] = a[j];
                a[j] = tmp;
            } else break;
            j--;
        }
    }
}
