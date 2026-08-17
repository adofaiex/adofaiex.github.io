---
title: JustEnoughAccuracy
order: 10
---

# JustEnoughAccuracy

> A new **angle-level accuracy judgment** (JEA) — reads the same hit data as the official judgment but grades it with its own fixed scoring table, **coexisting with and never affecting** the original judgment. Supports viewing judgment details and exporting gameplay data.
>
> Project: <https://github.com/adofaiex/JustEnoughAccuracy>

## Features

1. **New `JEA` accuracy** — a separate accuracy independent from the official judgment
2. **Detailed results viewer** — after each level, open a window to view per-tile details, search and scroll through the whole session
3. **Export & share** — export the session to a `.yaml` file or an interactive `.html` chart

## Judgment Mechanism

JEA is a fixed **point-allocation** judgment:

- Each tile's raw **angle deviation is normalized to a reference BPM** (`deviation × 100 / BPM`), so the same timing error in milliseconds grades identically on any chart
- The normalized deviation is graded against a **fixed band table**, with **linear interpolation** between neighboring anchors — so every point value (95, 97, 98.4, …) is reachable, not just the anchors

| Normalized Deviation | Score |
| --- | --- |
| ≤ 1.7° | 100 |
| 2.0° | 96 |
| 2.4° | 92 |
| 2.8° | 88 |
| 3.2° | 84 |
| 3.6° | 80 |
| 4.0° | 75 |
| 4.5° | 70 |
| 5.0° | 62 |
| 5.5° | 54 |
| 6.0° | 46 |
| 6.6° | 36 |
| 7.2° | 26 |
| 8.0° | 15 |
| > 8.0° | 0 |

### Other Rules

- **Combo**: consecutive tiles scoring ≥ 50 build a combo. The combo is for display only — it **does not multiply**, so JEA accuracy is capped at 100%
- **Empty-press tolerance**: mirrors the official `consecutiveMultipressCounter > 8` rule — the first 8 consecutive empty presses are forgiven, after which each costs −100 and resets the combo
- **Miss / overload**: each failed tile scores −100

```
JEA Acc = TotalScore / (Tiles × 100)   (up to 4 decimal places)
```

## Export

Exported files are written to `<mod directory>/reports`.

## Requirements

- Supported loaders: UnityModManager, MelonLoader, BepInEx
- Game version: ≥ 3.1.0

## Integration

Install [NotEnoughAccuracy](./not-enough-accuracy.md) (NEA) — its data will also be displayed in the detail viewer and exports.
