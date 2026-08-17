---
title: EditorTweaks.BetterZip
order: 15
---

# ADOFAI.EditorTweaks.BetterZip

> Standalone chart archive Mod, version `1.0.0`. Handles reading/exporting **ZIP, ADOZIP, 7z, RAR, TAR, GZip, BZip2, XZ, CAB** and other formats, legacy ZIP filename encoding, and archive security checks.
>
> Project: <https://github.com/adofaiex/ADOFAI.EditorTweaks.BetterZip>

::: tip
This project **does not include** editor optimizations, video rendering, Web UI, or FFmpeg, and does not depend on the other two EditorTweaks Mods ([ADOFAI.EditorTweaks](./adofai-editor-tweaks.md), [ADOFAI.EditorTweaks.ChartRendering](./adofai-editor-tweaks-chartrendering.md)).
:::

## Features

- Multi-format archive reading/exporting: ZIP, ADOZIP, 7z, RAR, TAR, GZip, BZip2, XZ, CAB
- **Legacy ZIP filename encoding** handling (fixes garbled filenames)
- **Archive security checks**

## UMM Settings

The UMM panel only provides legacy ZIP filename encoding mode:

| Mode | Description |
| --- | --- |
| `Auto` | Auto-detect |
| `CP949` | Korean (common in older versions) |
| `GB18030` | Simplified Chinese |
| `Shift-JIS` | Japanese |
| `CP437` | DOS Latin character set |

## Building (Developers)

```powershell
dotnet build ADOFAI.EditorTweaks.BetterZip.csproj -c Debug
dotnet build ADOFAI.EditorTweaks.BetterZip.csproj -c Release
```

- Output in `out/` and `Build/`
- Deploy directory: `Mods/ADOFAI.EditorTweaks.BetterZip/`
- Release package additionally includes `SharpSevenZip.dll`, license, and `ThirdParty/7-Zip/x64/7z.dll`

## Troubleshooting

> 📝 To be supplemented (feel free to report in the repository Issues)
