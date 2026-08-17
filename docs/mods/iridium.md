---
title: Iridium
order: 2
---

# Iridium

> An **optimization Mod** for _A Dance of Fire and Ice_, focused on performance, visual customization, and compatibility.
>
> Project: <https://github.com/adofaiex/Iridium>

## Features

### Performance Optimization

- Rendering efficiency improvements, reducing stutter
- Decoration texture compression, frame-by-frame loading (with progress)
- Move Track / Move Decorations optimization (with freeroam support)
- Particle optimization (object pooling / culling / LOD)
- DOTween tuning, custom easing engine
- Async input optimization, improving judgment precision

### UI & Visuals

- Remove news panel, hide beta watermark, adjust auto-demo text position
- Editor countdown display
- Lobby music: switch background music by BPM, support custom music paths
- Judgment text customization (e.g. "Perfect", "Too Early"), with rich text tags and offset display
- Hit sound pitch follows music

### Editor Enhancements

- Performance optimization for insert/delete operations on large levels (10k+ floors)
- Custom hotkeys for decorations and floors
- Auto-demo preview supports pause / resume

### Compatibility & Fixes

- Ignore missing third-party Mod dependencies when loading levels (restores `requiredMods` on save)
- Temporarily register unknown CustomEvents to avoid load crashes
- Legacy level behavior options (Flash, Camera Relative, etc.)
- Fix portal soft-lock, hairpin beat detection, editor replay error tracking

### Patch Modes

- **IL Transpiler**: performance-first
- **Prefix/Postfix**: compatibility-first

## Installation

### Prerequisites

- [UnityModManager](https://www.nexusmods.com/site/mods/21) installed
- ADOFAI installed

::: warning
For ADOFAI 2.10.0 and above, use **UnityModManager 0.32.5.0 or later**, otherwise crashes may occur.
:::

### Steps

1. Go to [Releases](https://github.com/Xbodwf/Iridium/releases), download the build **matching your game version** (each Release provides builds for multiple versions)
2. Extract to `A Dance of Fire and Ice/Mods/Iridium` (create the directory if it doesn't exist)
3. Launch the game; if the game is already running, restart it first

### Supported Game Versions

| Game Version | Branch |
| --- | --- |
| ADOFAI v2 | `v2` branch |
| ADOFAI v3 | `v3` branch |

::: danger
Do not run Iridium on ADOFAI **2.9.7 or below**, except for versions specifically tuned for older game versions.
:::

## Settings

After launch, the v3 settings are displayed in pages: **General / Optimizer / Editor / Compatibility / Audio** in the UMM settings panel (default `Ctrl+F10`).

## Troubleshooting

> 📝 To be supplemented (feel free to report in the repository Issues)

## Related

- Other loading methods: [MelonLoader](https://github.com/Xbodwf/Iridium/blob/main/docs/loader/melonloader.md) / [BepInEx](https://github.com/Xbodwf/Iridium/blob/main/docs/loader/bepinex.md)
