import { Comparator } from "./types";

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
