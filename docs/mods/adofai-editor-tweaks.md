---
title: ADOFAI.EditorTweaks
order: 7
---

# ADOFAI.EditorTweaks

> Editor and game optimization Mod, current version `1.4.7`.
>
> Project: <https://github.com/adofaiex/ADOFAI.EditorTweaks>

## Features

- **Numeric input box drag adjustment**: configurable step and decimal places
- **Decoration dragging**: Camera / CameraAspect decoration dragging, move snapping and pivot display fixes
- **Video background sync**: video background syncs with music during normal gameplay
- **Instant editor preference saving**
- **Duplicate image error deduplication**
- **UMM settings panel**

## Differences from Related Projects

It is **completely independent** from [ADOFAI.EditorTweaks.BetterZip](./adofai-editor-tweaks-betterzip.md) and [ADOFAI.EditorTweaks.ChartRendering](./adofai-editor-tweaks-chartrendering.md) — it doesn't depend on their DLLs, source code, or config. This project **does not include** chart video rendering, FFmpeg, Web UI, archive handling, or extra settings sync.

## Installation

Download the release package from [Releases](https://github.com/adofaiex/ADOFAI.EditorTweaks/releases), extract to:

```text
Mods/ADOFAI.EditorTweaks/
```

After launching the game, configure via the UMM settings panel (default `Ctrl+F10`).

## Troubleshooting

> 📝 To be supplemented (feel free to report in the repository Issues)

## Related Documentation

- [User Manual](https://github.com/adofaiex/ADOFAI.EditorTweaks/blob/main/Doc/README.md)
- [Feature Notes](https://github.com/adofaiex/ADOFAI.EditorTweaks/blob/main/Doc/NumericDrag.md): numeric drag / decoration selection / video background sync / editor preferences
