---
title: infer | Conditional Types | TypeScript
description: A detailed discussion, concepts and examples on the `infer' keyword with conditional types.
---

# infer keyword | TypeScript

[TypeScript 2.8 introduced Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html), and with it, the `infer` keyword.

In this post, we'll investigate how to understand and use the `infer` keyword through several examples.
We'll create and use *type utilities* for this purpose.

**INFO**: Utility types, or type helpers (like `ReturnType<T>` or `Nullable<T>`) **work on types**.
They take and return types. They do not take or return values.
They work on *type context*, not in *expression (value) context*.

## ReturnType

The `infer` keyword can only be used with conditional types.
The quintessential example of it  is use is with the utility type `ReturnType`:

```typescript
type ReturnType<T> =
  T extends (...args: any[]) => infer R
  ? R
  : any;
```

Given some type `T`, if it looks like a function, then return its inferred return type `R`; otherwise return `any`.

### Some Details

Technically, `(...args: any[])` and `(...args: any)` are the same thing.
By definition, `any` being a *top type* which includes all types in the known and unknown universes, also also includes `any[]` (or `Array<any>`)
. However, `any[]` more correctly **conveys intent** that we are dealing with an array of arguments.

Also, we could probably write the utility type `ReturnType<T>` to return `unknown` instead of `any`:

```typescript
type ReturnType<T> =
  T extends (...args: any[]) => infer R
  ? R
  : unknown;
```

Or even `never` (the empty type/set ∅):

```typescript
type ReturnType<T> =
  T extends (...args: any[]) => infer R
  ? R
  : never;
```

The difference would be when passing something that was NOT a function.

## Back to ReturnType

One very important thing to note is that `ReturnType<T>` **takes a type**, not a value.

```typescript
type F1 = ReturnType<() => void>;
// → void

type F2 = ReturnType<() => string | string[] | undefined>;
// → string | string[] | undefined
```

Note the type parameter passed to `ReturnType<T>`.
We are passing a **type**, not a value. Both `() => void` and `() => string | string[] | undefined` are function types, not function values.

- [TS Playground function type](https://www.typescriptlang.org/play?#code/PTBQIAkIgIIQQVwC4AsD2AnAXBAYgU3QDsBDQgE1QgCFiBnW1cYaCZRRAB1sxADMCS5VACM6DAHRk8AN2ABjVIUTE5iMJBhtO3PgNIVR9VOIDmAS0QAbYsPFnUwKdLQB3RA6YstXHsBf-JGVd3QNkmUFBEAE8OPAgAJTxEAB4AFQA+CABeUAgIVIg8AA9EPHJaCAAKcRridBNuCFIogG0AXQBKbMyzQn50BNyIAH5BvOx4QgBrQlQXQgBuCOjY3ABGbISk5MqurMzpVDMydKXIPIA9YeWYuJwAJk3ElN3uiFpEdF6TCAAfd8+33afwgkykvF6eBOZ2Yl2uQA)

We can pass a function value and see it does not work:

```typescript
/**
 * Retrieves the value of the property `age` on the given object.
 *
 * @param o Any object that contains the property `age`.
 * @return The age or `undefined` if not available.
 */
function getAge(o: { age?: number }): number | undefined {
  return o?.age;
}

type GetAgeReturnType = ReturnType<getAge>;
//
// ERROR:
//
// 'getAge' refers to a value, but is being used as a type here.
//
```

OK, we need to provide the *type* of  `getAge()`.
Well, we can use `typeof` type operator, which in `TypeScript` can also be used in *type context* (not only in *expression context*) to get the type of the function:

```typescript
type GetAgeReturnType = ReturnType<typeof getAge>;
// → number | undefined
```

- [TS Playground typeof function value](https://www.typescriptlang.org/play?#code/PTBQIAkIgIIQQVwC4AsD2AnAXBAYgU3QDsBDQgE1QgCFiBnW1cYaCZRRAB1sxADMCS5VACM6DAHRk8AN2ABjVIUTE5iMJBhtO3PgNIVR9VOIDmAS0QAbYsPFnUwKdLQB3RA6YstXHsBf-JGVd3QNkmUFBEAE8OPAgAJTxEAB4AFQA+CABeUAgIVIg8AA9EPHJaCAAKcRridBNuCFIogG0AXQBKbMyzQn50BNyIAH5BvOx4QgBrQlQXQgBuCOAAKhXclYSk9DMZPAqUOOliS3g41F4IQ4gOdFRY9GiIAANiEzxniEUr5DjzaTKX2EACs8KpxBsIJCAAIcOrEAC2XzghCiQNBqh+xEQEAUSmIvQOvxudweT1e72eEIgm2h6CS8CI+WJb3OA2ekykvF6eDInzMl1mOOIxzM1mEljw1JWYF4k1U9kIEHeiFg70qqGwAG8mu9hthCPAEcICBAAL4dA1Gk0DAA+EE5eG5hF5EC1Q3piEZStQw3ErKWZoi0ViEAA4kk1XhEl6iKkYnEslsUiG8BdlZH3uklpA8gA9YagIA)

## Examples Explained

### FirstArg Type Utility

Here we have a utility type that returns the type of the first argument of the given function type:

```typescript
type FirstArg<FnType> =
  FnType extends (p1: infer P1, ...args: any[]) => any
  ? P1
  : never;
```

`FirstArg` utility type takes a type (not a value), and try to see if it looks like a function type.
Note that it tries to match a first argument `p1` plus any potential remaining arguments `...args` and the return `any`.
The remaining arguments and the return type must be there to satisfy the required syntax, but what matters is the portion `p1: infer P1`.
If it successfully matches a function type, then the conditional returns the inferred type `P1`, otherwise, return `never`.

The identifiers `p1` and `P1` could be any other names, like simply `p` and `P`, or `first` and `First`, `foo` and `Bar`, etc.

Let's see what happens if we pass types that are NOT function types:

```typescript
type T0 = FirstArg<string>;

type T1 = FirstArg<number | null | undefined>;

type T2 = FirstArg<Record<string, number>>;
```

Since the provided types are not function types, the conditional fails to match a function type, and `T0`, `T1` and `T2` are all of the type `never`.
There is no way to infer the first parameter of something that is not even a function.

What about this:

```typescript
type T3 = FirstArg<() => void>;
```

We do pass it a function type, except it has no arguments. `never` is returned only if what we pass is not a function type.
Here, it **is** a function type. But it is impossible infer a first parameter that doesn't exist.
TypeScript infers it as unknown in this case.

Finally, some examples that actually return the type of the first argument:

```typescript
type T4 = FirstArg<(x: number) => void>;

type T5 = FirstArg<(xs: number[], s: string) => void>;

declare function g(s: string, n: number): void;

type T6 = FirstArg<typeof g>;
```

These all return the type of the first argument correctly.
Special note to `T6`.
Remember that we must provide a type, not a value.
That is why we use `typeof g` here.

- [TS Playground FirstArg](https://www.typescriptlang.org/play?#code/PTBQIAkIgIIQQVwC4AsD2AnAXBAYgU3QDsBDQgE1QgCFiBnW1cYaCZRRAB1sxADMCS5VACM6DAHRk8AN2ABjVIUTE5iMJBhtO3PgNIVR9VOIDmAS0QAbYsPFnUwKdLQB3RA6YstXHsBf-JGVd3QNkmUFBEAE8OPFwzdFpEWHQTAB4cQgAVGLwAPggAXlAIXGzciDwAD0Q8cloIAAoOAEZsM0J+dAgABRaAGghxYeJU7ghSKIBtAF0ASiKCyZKIAH5elpXsQhkCAG4I6NiILIAGIvjE5NS0pPQOkzyDyIqsloucBKSU9MJ4AFthAQIAAfCB-SyWUEQeDkPC8Dp4MhPQ6vABMHy+13SACU8Ap0GRboh7oQTIM-oCCHkUajjlkAMyYq4-NKNBaFArSVBmZHPI5xLIAFmZ3xujSq2wBQPQHK5PL5dMFAFZRdi2VVxpSZbNBuM7g85RBubzaVI5NZ0HFeLDVPZCBATI19SSHhSpVTZdgTWR+a8AGxq1kC1C8R0ooA)

### ItemType Type Utility

Recall that we can write array types in two ways, one using bracket syntax, the other using generic syntax:

```typescript
let xs: number[];
let ys: Array<string>;
```

If we have an array `xs`, and want to infer the type of the elements, we can create a generic utility type — let's call it `ArrayItemType` — which uses a combination of a generic type parameter and `infer`.

Bracket syntax:

```typescript
type ArrayItemType<T> = T extends (infer ItemType)[] ? Item : unknown;
```

Note that instead of  `type[]` syntax, we use `(infer ItemType)[]` (note the parenthesis an the brackets outside the parenthesis).
The `(infer ItemType)` thing stands for `type` in `type[]`.
In other words, `(infer ItemType)` is the `string` in  `string[]` or `number` in `number[]`.

![TypeScript infer keyword diagram](infer.assets/infer-array-item-type.png)

Generic syntax:

```typescript
type ArrayItemType<T> = T extends Array<infer Item> ? Item : unknown;
```

In any case, we now have a generic that extracts the type of the elements of an array:

```typescript
let xs: string[];
let ys: Array<Record<string, number>>;
let jedis: Array<{ name: string, level: number }>;

type T1 = ArrayItemType<string[]>;

type T2 = ArrayItemType<typeof xs>;

type T3 = ArrayItemType<typeof ys>;

type T4 = ArrayItemType<typeof jedis>
```

- `T1` is `string`. We are passing an explicit type.
- `T2` is also `string`.
  We are using the value `xs` but in combination with `typeof`.
  Remember: type utilities take (work on) types, not values.
- `T3` is of type `{ [k: string] :number }`.
  Again we use a *value* with `typeof`.
- `T4` is of type `{ name: string, age: number }`.
  We are getting the type of the array items, and each array item an object with the properties `name` and `age` whose types are `string` and `number` respectively.

**NOTE**: Arrays must have elements of homogeneous types (unlike tuples).
Our utility type works on these sorts of arrays, not tuples.

- [TS Playground for ArrayItemType](https://www.typescriptlang.org/play?#code/PTBQIAkIgIIQQVwC4AsD2AnAXBAYgU3QDsBDQgE1QgCFiBnW1cYaCZRRAB1sxADMCS5VACM6DAHRk8AN2ABjVIUTE5iMCFBMmEAKq08EVLwgADAJaF+6ExADWeAJ4B3DGQiJKc9HmKIDxdwcOAyQzABszRAd3ZF9tb0R4IloYgyjg1IhIvABbFKMIUkL0dGIHcS1QMLxECAAPbghaRHQLAHMAbQBdAG4qmogHRtgSsoAeACU8BXQyMebWwjaAGghCeBzhAgA+bb7q2oArPDIzYdGHMYBvNeIcvGwF9tXq6Tww7HXNgggAXz3NOkDCNSg4AJJ+HIAFSCeDGUO2EAAvBAoRA8HU-OQUgAKCxWCAQ3IASm6EAA-ITIRBsPBCLZCKgnIQ+togVTcjDgvDESi0RisWQUiDxvifkScojKRKaRA6QymSzAbDUQBGZFwC4Srlwp5LboA0DsqEAJg1IvBkJ1YyBBQahuNAGZzVqrbCbbCCkMHSqoQAWF2g7Xu23GY6nWgAoA).

## References

- [TypeScript 2.8 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)
- [TypeScript typeof type operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
