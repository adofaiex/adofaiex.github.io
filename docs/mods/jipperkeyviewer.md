---
title: JipperKeyViewer
order: 5
---

# JipperKeyViewer

> An ADOFAI **key viewer** Mod: real-time key press display, KPS stats, and raindrop effects. Supports **UnityModManager** and **MelonLoader**, with UI in Chinese / English / Korean.
>
> Project: <https://github.com/adofaiex/JipperKeyViewer>

## Versions

| Version | Description |
| --- | --- |
| **JipperKeyViewer** | Standard version, loads resources from `keyviewer_resources` AssetBundle |
| **JipperKeyViewer-FileBased** | Loads images/fonts directly from PNG/OTF files, no AssetBundle needed |

Both versions have identical functionality and support UMM and MelonLoader.

## Features

- **Layouts**: 8K / 10K / 12K / 14K / 16K / 20K / 24K, and full **108-key** physical keyboard, foot pedal 2K–16K
- KPS stats and total key count, independent KPS per key
- **Raindrop effects**: smooth fade-out on key release; **ghost key raindrops** trigger raindrops only without showing the key
- Independent raindrop control per row (speed, height, on/off)
- Independent color per key, auto-rainbow KV; independent KPS / Total colors
- **Standard key widths**: mixed wide/narrow rows unified to 50px
- **108-key full keyboard**: complete QWERTY + numpad, movable as a block
- KPS/Total text centered (auto-rearranges as numbers grow)
- Streaming mode (hide KPS/Total), thousand-separator formatting
- Font styles (bold/italic/underline), custom fonts (put `.ttf/.otf` in `CustomFont/` for auto-detection)
- Normalized custom position (0–1), auto-adapts to any resolution
- Key binding changes and custom text labels
- Object pooling and merged rendering, zero GC allocation in hot paths

## Installation

### Unity Mod Manager

1. Install [UMM](https://www.nexusmods.com/site/mods/21)
2. Download the **UMM** version from [Releases](https://github.com/adofaiex/JipperKeyViewer/releases)
3. Install via UMM, or extract to `ADOFAI/Mods/JipperKeyViewer/`

### MelonLoader

1. Install [MelonLoader](https://melonwiki.xyz/)
2. Download the **MelonLoader** version from Releases
3. Extract to `ADOFAI/Mods/JipperKeyViewer-melon/`
4. Press **F7** in-game to open settings (rebindable)

## Troubleshooting

> 📝 To be supplemented (feel free to report in the repository Issues)
