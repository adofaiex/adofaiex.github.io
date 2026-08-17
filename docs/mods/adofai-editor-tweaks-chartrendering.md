---
title: EditorTweaks.ChartRendering
order: 16
---

# ADOFAI.EditorTweaks.ChartRendering

> Standalone chart **video rendering** Mod, version `1.0.0`. Handles camera/gameplay capture, audio capture, FFmpeg encoding, render progress, cancellation, selected segment rendering, video background render sync, diagnostic logging, and public rendering API v1.
>
> Project: <https://github.com/adofaiex/ADOFAI.EditorTweaks.ChartRendering>

## Features

- Camera / gameplay capture
- Audio capture
- FFmpeg encoding
- Render progress, cancellation
- Selected segment rendering
- Video background render sync
- Diagnostic logging
- Public rendering API v1

## Hotkey

The UMM panel only handles the hotkey for opening the Web UI, default **`Ctrl+Shift+E`**.

Render settings, progress, and FFmpeg help remain in the current Web UI; the page only retains rendering-related features.

## Public API

- Namespace remains `ADOFAI.EditorTweaks.Api.Rendering`
- Assembly is `ADOFAI.EditorTweaks.ChartRendering.dll`
- **No legacy assembly forwarding layer** — callers must reference and install this Mod separately

## Building (Developers)

```powershell
dotnet build ADOFAI.EditorTweaks.ChartRendering.csproj -c Debug
dotnet build ADOFAI.EditorTweaks.ChartRendering.csproj -c Release
```

- Output in `out/` and `Build/`
- Deploy directory: `Mods/ADOFAI.EditorTweaks.ChartRendering/`
- Release package includes Web UI, FFmpeg, and rendering resources

## Troubleshooting

> 📝 To be supplemented (feel free to report in the repository Issues)
