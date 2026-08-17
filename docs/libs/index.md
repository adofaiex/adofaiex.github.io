---
title: Library Documentation
order: 4
---

# Library Documentation

The organization has developed multiple level parsing and processing libraries for ADOFAI, covering TypeScript, C#, C++, Kotlin, and other languages. Here is the documentation maintained for each library.

## Level Processing Libraries

| Library | Language | Description |
| --- | --- | --- |
| [ADOFAI-JS](./adofai-js/) | TypeScript | Zero-dependency ADOFAI level library, usable in both browsers and Node |
| [SharpFAI](./sharpfai/) | C# | ADOFAI level parsing library, supports parsing, editing, and exporting |
| [AdoCpp](./adocpp/) | C++ | ADOFAI level parsing and generation |
| [adofai-json-parser](./adofai-json-parser/) | Kotlin | ADOFAI level JSON parser |

## Basic Concepts

Before getting started, we recommend reading [Understanding Level Files](./level-format.md) to learn about the structure of `.adofai` files.

## Practical Examples

- [Practical: Removing Level Effects](./example-remove-effects.md) — A complete workflow using multiple libraries together

## Library Interoperability

- [Re_ADOJAS](https://github.com/adofaiex/Re_ADOJAS) (chart player) is built on **ADOFAI-JS**, try it in the [User Guide](../mods/online-tools/re_adojas.md)
- **SharpFAI** and **AdoCpp** are commonly used as the underlying parsing layer for Mods or tools
