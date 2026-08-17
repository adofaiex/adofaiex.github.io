---
title: 库文档
order: 4
---

# 库文档

组织内为 ADOFAI 开发了多个关卡解析与处理库，覆盖 TypeScript、C#、C++、Kotlin 等语言。这里是为每个库单独维护的文档。

## 关卡处理库

| 库 | 语言 | 简介 |
| --- | --- | --- |
| [ADOFAI-JS](./adofai-js/) | TypeScript | 零依赖的 ADOFAI 关卡库，可在浏览器与 Node 中使用 |
| [SharpFAI](./sharpfai/) | C# | ADOFAI 关卡解析库，支持解析、编辑与导出 |
| [AdoCpp](./adocpp/) | C++ | ADOFAI 关卡解析与生成 |
| [adofai-json-parser](./adofai-json-parser/) | Kotlin | ADOFAI 关卡 JSON 解析器 |

## 基础概念

开始之前，建议先阅读[认识关卡文件](./level-format.md)，了解 `.adofai` 文件的结构。

## 实战示例

- [实战：去除关卡特效](./example-remove-effects.md) —— 综合使用多个库的完整流程

## 库之间的联动

- [Re_ADOJAS](https://github.com/adofaiex/Re_ADOJAS)（谱面播放器）基于 **ADOFAI-JS** 构建，可在[使用指南](../mods/online-tools/re_adojas.md)中体验
- **SharpFAI**、**AdoCpp** 常被用作 Mod 或工具的底层解析层