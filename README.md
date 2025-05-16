# 🌙 @moon7/sort

[![npm version](https://img.shields.io/npm/v/@moon7/sort.svg)](https://www.npmjs.com/package/@moon7/sort)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A lightweight, functional utility library providing composable sorting functions for arrays and collections in JavaScript and TypeScript applications.

## ✨ Features

- 🧱 **Basic Comparators** - Ascending, descending, and random sorting functions
- 🏷️ **Property-based Sorting** - Sort by specific object properties
- 🧩 **Composable API** - Combine multiple sort criteria effortlessly
- 🧶 **Natural Sorting** - Intelligent string sorting with proper handling of numbers
- ⛓️ **Chaining** - Order, group, and prioritize items with composable functions

## 📦 Installation

```bash
# Using npm
npm install @moon7/sort

# Using yarn
yarn add @moon7/sort

# Using pnpm
pnpm add @moon7/sort
```

## 🧠 Motivation

Sorting functions in JavaScript compare two values and return a numeric result: negative (-1) when the first value is less than the second, positive (1) when greater, and zero (0) when they're equal.

```typescript
// A sorting function's type signature
type Comparator<T> = (a: T, b: T) => number;

// Common imperative sorting pattern
numberList.sort((a, b) => a - b);
```

While simple cases are straightforward, complex sorting logic can quickly become unwieldy when written imperatively. This library takes a functional approach, providing composable building blocks that you can combine to create sophisticated sorting behaviors with minimal code.

```typescript
import { ascending, descending } from "@moon7/sort";

// Simple sorting using ascending/descending comparators
list.sort(ascending);

// How it works:
// const ascending: Comparator<T> = (a, b) => a === b ? 0 : a < b ? -1 : 1;
// const descending: Comparator<T> = (a, b) => a === b ? 0 : a < b ? 1 : -1;
```

Most functions in this library are higher-order functions - they accept other functions as arguments and return new functions, enabling powerful composition patterns.

```typescript
import { by, descending, naturally, flip } from "@moon7/sort";

// Sort by name, ascending (ascending is default)
list.sort(by(x => x.name));

// Sort by name, descending
list.sort(by(x => x.name, descending));

// Sort by name, using natural string sorting
list.sort(by(x => x.name, naturally));

// Sort by name, using natural string sorting, descending
list.sort(by(x => x.name, flip(naturally)));

// How it works:
// `by` takes a mapping function and an optional comparator, returning a new comparator
// const by = (map, cmp: Comparator<T> = ascending): Comparator<T> => (a, b) => cmp(map(a), map(b));
```

Here's an example where you can combine multiple sorting criteria. Notice how this reads like a clear *declaration* of your sorting requirements.

```typescript
import { by, order, naturally, descending } from "@moon7/sort";

// Sort by name naturally, then by age descending, then by lastLogin
list.sort(
    order(
        by(x => x.name, naturally),
        by(x => x.age, descending),
        by(x => x.lastLogin),
    )
);

// How it works:
// `order` takes multiple comparators and returns a new comparator that applies them in sequence
```

Traditional imperative approach would require nested if statements or complex logic. With functional composition, we can express the sorting intent declaratively.

## 🚀 Usage

### 🧱 Basic Sorting

```typescript
import { ascending, descending, preserve, dir, Direction, random, randomly } from '@moon7/sort';

// Sort an array in ascending order
const numbers = [3, 1, 4, 2];
numbers.sort(ascending);
// [1, 2, 3, 4]

// Sort in descending order
numbers.sort(descending);
// [4, 3, 2, 1]

// Sort using a direction enum
numbers.sort(dir(Direction.Ascending));  // ascending
numbers.sort(dir(Direction.Descending)); // descending

// Sort using any truthy values
numbers.sort(dir(true)); // ascending
numbers.sort(dir(0)); // descending

// Sort in random order
// Note: this has bias, not for statistical applications
numbers.sort(random(0.5));

// Same as above, with default probability threshold
numbers.sort(randomly);

// Sort using the identity function, which retains existing order
numbers.sort(preserve);

// Sort using the inverse identity function, which reverses the array
numbers.sort(reverse);
```

> ⚠️ **Note**: The `random()` and `randomly` functions produce biased results and are not suitable for
> statistical or cryptographic applications. For proper random shuffling, use the Fisher-Yates algorithm instead.

The `preserve` comparator always returns 1, which maintains the original order when used with JavaScript's Array.sort(). It serves as an *identity function* for comparators - useful when working with higher-order functions that require a comparator parameter, but you want to maintain the original order.

The `reverse` comparator always returns -1, which reverses the original order when used with Array.sort(). This provides a simple way to reverse an array without changing its relative ordering logic otherwise.

> ⚠️ **Note on Stability**: The `preserve` and `reverse` comparators require a stable sorting algorithm to work correctly. Before ES2019, JavaScript's native `Array.prototype.sort()` wasn't guaranteed to be stable, with behavior varying across engines. For consistent results:
> 
> - Use an ES2019+ environment where stable sorting is guaranteed
> - Or use this library's `sort()` function, which automatically detects and uses your engine's stable sort implementation or falls back to our stable `mergeSort()` implementation
> - Or directly use `mergeSort()`, which is always stable regardless of environment

Check out the practical examples in the [Advanced Sorting](#%EF%B8%8F-advanced-sorting) section below to see these in action.

### 🔍 Sorting Objects by Properties

```typescript
import { by, order, descending } from '@moon7/sort';

const people = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 30 }
];

// Sort by age (ascending by default)
people.sort(by(p => p.age));
// [
//     { name: 'Bob', age: 25 },
//     { name: 'Alice', age: 30 },
//     { name: 'Charlie', age: 30 }
// ]

// Sort by age descending
people.sort(by(p => p.age, descending));

// Sort by age, then by name descending
people.sort(order(
    by(p => p.age),
    by(p => p.name, descending)
));
// [
//     { name: 'Bob', age: 25 },
//     { name: 'Charlie', age: 30 },
//     { name: 'Alice', age: 30 }
// ]
```

### 📊 Natural Sorting

```typescript
import { natural, naturally, by, Sensitivity } from '@moon7/sort';

const versions = ['v1.10', 'v1.2', 'v1.1'];

// Sort with natural comparison (1.2 comes before 1.10)
versions.sort(natural());
// ['v1.1', 'v1.2', 'v1.10']

// Using pre-configured naturally constant (same as natural() with default settings)
versions.sort(naturally);
// ['v1.1', 'v1.2', 'v1.10']

// Sort strings differently based on their case sensitivity
const names = ['alice', 'Alice', 'bob', 'Bob'];
names.sort(natural(Sensitivity.Case));
// ['alice', 'Alice', 'bob', 'Bob']

// Sort objects with string properties using natural sort
const files = [
    { name: 'file10.txt' },
    { name: 'file2.txt' }
];
files.sort(by(f => f.name, naturally));
// [
//     { name: 'file2.txt' },
//     { name: 'file10.txt' }
// ]
```

### ⛓️ Advanced Sorting

```typescript
import { where, nullable, group, flip, conditional, preserve } from '@moon7/sort';

// Sort active items first, then by name
const items = [
    { name: 'Task 1', active: false },
    { name: 'Task 2', active: true },
    { name: 'Task 3', active: false },
    { name: 'Task 4', active: true },
];
items.sort(where(x => x.active, by(x => x.name)));
// [
//     { name: 'Task 2', active: true },
//     { name: 'Task 4', active: true },
//     { name: 'Task 1', active: false },
//     { name: 'Task 3', active: false },
// ]

// Preserve original order when sorting
const nums = [3, 1, 4, 2];
nums.sort(preserve);
// [3, 1, 4, 2] (unchanged)

// Reverse original order when sorting
nums.sort(reverse);
// [2, 4, 1, 3] (reversed)

// Group by category, but preserve original order within each group
const categoryItems = [
    { id: 1, category: 'A' },
    { id: 2, category: 'B' },
    { id: 3, category: 'A' },
];
categoryItems.sort(group(item => item.category, ascending, preserve));
// [
//     { id: 1, category: 'A' },
//     { id: 3, category: 'A' },
//     { id: 2, category: 'B' },
// ]

// Sort with null values first
const products = [
    { name: 'Product A', price: 10 },
    { name: 'Product B', price: null }
];
products.sort(nullable(p => p.price));
// [
//     { name: 'Product B', price: null },
//     { name: 'Product A', price: 10 }
// ]

// Group items by status, then sort by date within groups
const tasks = [
    { status: 'pending', created: new Date(2023, 1, 1) },
    { status: 'active', created: new Date(2023, 2, 1) },
    { status: 'active', created: new Date(2023, 1, 15) }
];
tasks.sort(group(
    x => x.status,
    // active at the top, archived at the bottom
    by(status => ['active', 'pending', 'archived'].indexOf(status)),
    // within each group, sort by created
    by(x => x.created)
));
// [
//     { status: 'active', created: new Date(2023, 1, 15) },
//     { status: 'active', created: new Date(2023, 2, 1) },
//     { status: 'pending', created: new Date(2023, 1, 1) }
// ]

// Conditional sorting
const numbers = [-5, -2, 3, 1];
numbers.sort(conditional(
  (a, b) => a < 0 && b < 0,  // If both numbers are negative
  descending,                // Sort negative numbers in descending order
  ascending                  // Sort other numbers in ascending order
));
// [-2, -5, 1, 3]
```

## 🧮 Sorting Algorithms

This library provides three main sorting functions, each with different characteristics to suit various use cases:

### `sort(arr, cmp?)`

The recommended general-purpose sorting function that sorts arrays in-place. It intelligently selects the best available stable sorting implementation:

```typescript
import { sort } from '@moon7/sort';

// Sort an array using the optimal stable sorting algorithm
const sorted = sort([3, 1, 4, 2]);
```

- **In-place Operation**: Modifies and sorts the original array directly
- **Algorithm Selection**: Uses the native `Array.prototype.sort()` if your JavaScript environment has a stable implementation (ES2019+), otherwise falls back to `mergeSort`
- **Stability**: Always stable, meaning equal elements maintain their relative order
- **Use Cases**: Best default choice when you need deterministic behavior across all environments

### `mergeSort(arr, cmp?)`

A stable, in-place implementation of the merge sort algorithm:

```typescript
import { mergeSort } from '@moon7/sort';

// Sort directly with mergeSort
const sorted = mergeSort([3, 1, 4, 2]);
```

- **Algorithm**: Hybrid merge sort with insertion sort for small subarrays
- **Performance**: O(n log n) time complexity with consistent performance regardless of input distribution
- **Stability**: Always stable (equal elements maintain their relative order)
- **Memory Usage**: O(n) auxiliary space in the worst case
- **Use Cases**: When stability is essential, or when sorting nearly-sorted or reversed arrays

### `quickSort(arr, cmp?)`

An optimized, in-place implementation of the quicksort algorithm:

```typescript
import { quickSort } from '@moon7/sort';

// Sort directly with quickSort
const sorted = quickSort([3, 1, 4, 2]);
```

- **Algorithm**: Three-way partitioning quicksort with median-of-three pivot selection and insertion sort for small subarrays
- **Performance**: O(n log n) average time complexity, potentially O(n²) in worst case (but rare due to optimizations)
- **Stability**: Not stable (equal elements may change their relative order)
- **Memory Usage**: O(log n) auxiliary space for recursion in average case
- **Best For**: Random data, arrays with duplicates, and moderately sized arrays
- **Not Ideal For**: Fully reversed arrays or when stability is required

According to benchmarks, `quickSort` outperforms the other sorting functions in most scenarios, except when dealing with fully reversed data where `mergeSort` or native sort is faster. Run `pnpm benchmarks` to see benchmarks.

## 📚 API Reference

The library provides these key functions:

| API                                        | Description                                                      |
| ------------------------------------------ | ---------------------------------------------------------------- |
| **🧮 Sorting Functions**                    |                                                                  |
| `sort(arr, cmp?)`                          | In-place stable sort (native or mergeSort fallback)              |
| `mergeSort(arr, cmp?)`                     | Stable in-place sort with optimization for small arrays          |
| `quickSort(arr, cmp?)`                     | Fast in-place sort, not stable but generally more efficient      |
| **🏷️ Enums**                                |                                                                  |
| `Direction.Ascending`                      | Enum value representing ascending sort order                     |
| `Direction.Descending`                     | Enum value representing descending sort order                    |
| `Sensitivity.Base`                         | Enum value for different bases unequal, cases/accents equal      |
| `Sensitivity.Accent`                       | Enum value for accents/bases unequal, cases equal                |
| `Sensitivity.Case`                         | Enum value for cases/bases unequal, accents equal                |
| `Sensitivity.Variant`                      | Enum value for all variations considered unequal                 |
| **🧱 Basic Comparators**                    |                                                                  |
| `ascending`                                | Compares values in ascending order                               |
| `descending`                               | Compares values in descending order                              |
| `preserve`                                 | Identity comparator that preserves original order                |
| `reverse`                                  | Comparator that reverses the original order                      |
| `dir(isAscending)`                         | Creates a comparator for a specific direction                    |
| **🎲 Shuffle Comparators**                  |                                                                  |
| `random(p)`                                | Creates a comparator that sorts randomly with given probability  |
| `randomly`                                 | Pre-configured random sort comparator with p=0.5                 |
| **🧶 String Comparators**                   |                                                                  |
| `natural(sensitivity?)`                    | Creates a comparator for natural string sorting                  |
| `naturally`                                | Pre-configured natural sort comparator with default settings     |
| **🧩 Complex Comparators**                  |                                                                  |
| `by(map, cmp?)`                            | Creates a comparator based on a property or derived value        |
| `order(...fns)`                            | Combines multiple comparators in sequence                        |
| `where(predicate, cmp?)`                   | Creates a comparator that prioritizes items matching a predicate |
| `nullable(get, cmp?)`                      | Creates a comparator that prioritizes null/undefined values      |
| `group(selector, groupOrder?, itemOrder?)` | Groups items and orders both groups and items within groups      |
| `conditional(condition, ifTrue, ifFalse)`  | Selects between comparators based on a condition                 |
| `flip(fn, ignore?)`                        | Flips the result of another comparator                           |


Note that all **comparators** are functions in the form of `(a, b) => number`, which is omitted in the table above for brevity. For example, `ascending` is actually a function `ascending(a, b)`.

Likewise, `by(map, cmp?)` is a function `by(map, cmp?)(a, b)`, as it is a higher-order comparator. Any parameter that expects a comparator can accept these functions directly.

## 🔗 Related Libraries

| Library                                                     | Description                                                                | npm                                                                                                             |
| ----------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [@moon7/async](https://github.com/moon7-io/moon7-async)     | Asynchronous utilities for promises, semaphores, and concurrent operations | [![npm version](https://img.shields.io/npm/v/@moon7/async.svg)](https://www.npmjs.com/package/@moon7/async)     |
| [@moon7/bits](https://github.com/moon7-io/moon7-bits)       | Bit manipulation utilities and binary operations                           | [![npm version](https://img.shields.io/npm/v/@moon7/bits.svg)](https://www.npmjs.com/package/@moon7/bits)       |
| [@moon7/inspect](https://github.com/moon7-io/moon7-inspect) | Runtime type checking with powerful, composable type inspectors            | [![npm version](https://img.shields.io/npm/v/@moon7/inspect.svg)](https://www.npmjs.com/package/@moon7/inspect) |
| [@moon7/result](https://github.com/moon7-io/moon7-result)   | Functional error handling with Result and Maybe types                      | [![npm version](https://img.shields.io/npm/v/@moon7/result.svg)](https://www.npmjs.com/package/@moon7/result)   |
| [@moon7/signals](https://github.com/moon7-io/moon7-signals) | Reactive programming with Signals, Sources, and Streams                    | [![npm version](https://img.shields.io/npm/v/@moon7/signals.svg)](https://www.npmjs.com/package/@moon7/signals) |

## 🤝 Contributing

We welcome contributions from everyone! See our [contributing guide](https://github.com/moon7-io/.github/blob/main/CONTRIBUTING.md) for more details on how to get involved. Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE file](https://github.com/moon7-io/moon7-sort/blob/main/LICENSE) for details.

## 🌟 Acknowledgements

Created and maintained by [Munir Hussin](https://github.com/profound7).

The `mergeSort` algorithm ([source code](https://github.com/moon7-io/moon7-sort/blob/main/src/sorters/mergesort.ts)) is ported from [Haxe](https://github.com/HaxeFoundation/haxe/blob/development/std/haxe/ds/ArraySort.hx)
