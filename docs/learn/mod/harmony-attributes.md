---
title: HarmonyPatch Details
order: 11
---

# HarmonyPatch Details

The `[HarmonyPatch]` attribute is the entry point for declaring patches. It has many syntax forms — previous chapters only used the most basic one.

## Declaring the Target Class

```csharp
// Patch an entire class (all marked methods within the class)
[HarmonyPatch(typeof(SomeGameClass))]
public static class SomeClass_Patches
{
    [HarmonyPatch(nameof(SomeGameClass.MethodA))]
    public static void PrefixA() { /* ... */ }

    [HarmonyPatch(nameof(SomeGameClass.MethodB))]
    public static void PrefixB() { /* ... */ }
}
```

> The `[HarmonyPatch(typeof(X))]` on the patch class is just the "default target"; method-level `[HarmonyPatch]` specifies the exact method.

## Specifying the Method

```csharp
// Method name
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]

// String form (not recommended, breaks on rename)
[HarmonyPatch(typeof(SomeGameClass), "SomeMethod")]
```

## Specifying Overloads (Parameter Types)

The game often has same-name overloads — you need to specify parameter types:

```csharp
// Only patch void SomeMethod(int)
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod),
    new Type[] { typeof(int) })]

// Note: new Type[0] means the parameterless overload
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod),
    new Type[0])]
```

## Patching Constructors

```csharp
[HarmonyPatch(typeof(SomeGameClass), MethodType.Constructor)]
public static class Ctor_Patches
{
    public static void Postfix(SomeGameClass __instance)
    {
        // Executes after construction is complete
    }
}
```

> `MethodType.Constructor` patches constructors. Constructors with parameters also need parameter types specified.

## Patching Properties (getter / setter)

```csharp
[HarmonyPatch(typeof(SomeGameClass), "SomeProperty", MethodType.Getter)]
public static class Getter_Postfix
{
    public static void Postfix(ref int __result) { /* ... */ }
}

[HarmonyPatch(typeof(SomeGameClass), "SomeProperty", MethodType.Setter)]
public static class Setter_Prefix
{
    public static void Prefix(int value) { /* ... */ }
}
```

## Priority and Execution Order

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
[HarmonyPriority(Priority.First)]
public static class Early_Prefix { /* ... */ }
```

- `Priority.High / Normal / Low / First / Last`
- Same priority follows class declaration order

## Explicitly Declaring Patch Type

The patch method name determines the type (`Prefix` / `Postfix` / `Finalizer` / `Transpiler`). You can also use any name and annotate explicitly:

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
public static class MyPatch
{
    [HarmonyPrefix]
    public static void Before() { /* Equivalent to Prefix */ }
}
```

> A patch class can have multiple different methods, each annotated with `[HarmonyPrefix]` / `[HarmonyPostfix]` / `[HarmonyFinalizer]` / `[HarmonyTranspiler]`.

## Selecting Targets at Runtime

`[HarmonyPatch]` is only for static targets. For dynamic targets, use manual patching (see [Manual Patching](./harmony-manual.md)).

## What You Learned

- The various target syntaxes of `[HarmonyPatch]`: methods, overloads, constructors, properties
- Combining class-level + method-level patches
- `[HarmonyPriority]` and explicit patch type annotations

## Next Step

Learn how patches are applied and removed → [Patch Lifecycle](./harmony-lifecycle.md)
