import { ascending } from "~/basic";
import { Comparator } from "~/types";

export function nativeSort<T>(arr: T[], cmp: Comparator<T> = ascending): T[] {
    return arr.sort(cmp);
}
