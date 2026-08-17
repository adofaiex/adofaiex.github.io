---
title: What is a Mod
order: 2
---

# What is a Mod

A Mod is a modification to a game. In ADOFAI, Mods usually exist as **UnityModManager (UMM)** plugins that extend the game's behavior, visuals, and data.

## What Mods Can Do

Examples from real projects in this organization:

| Mod | What it does |
| --- | --- |
| [Iridium](https://github.com/adofaiex/Iridium) | Optimization Mod for ADOFAI, improves performance |
| [YqlossClientHarmony](https://github.com/adofaiex/YqlossClientHarmony) | Fixes fatal decorations, effect removal, replay recording |
| [Iris](https://github.com/adofaiex/Iris) | Provides visual effects for the game |
| [JipperKeyViewer](https://github.com/adofaiex/JipperKeyViewer) | Key viewer |
| [ADOFAI.EditorTweaks](https://github.com/adofaiex/ADOFAI.EditorTweaks) | Editor enhancements |

## How Mods Work

The vast majority of ADOFAI Mods rely on two things:

1. **UnityModManager (UMM)** — loads Mods, manages enable/disable, provides a settings UI
2. **Harmony** — a runtime patching library that can intercept and modify game methods without touching the game's source code

## What You Can Build

With these two tools, you can build a rich variety of features:

- Remove or add visual effects
- Recording and replay
- Performance optimization
- Draw in-game UI
- Extend the editor's capabilities

::: warning Red lines
Please do NOT create Mods that **break the vanilla game's balance** (e.g. altering hit judgement or accuracy calculation). The game's judgement system is officially off-limits, and this tutorial will not cover such practices. See [Mod Development Guidelines](./guidelines.md) for more.
:::

## Next Step

With your environment ready, write your first Mod → [Minimal Example](./first-mod.md)
