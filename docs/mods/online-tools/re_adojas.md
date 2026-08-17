---
title: "Re_ADOJAS: Chart Player"
order: 3
---

# Re_ADOJAS: Chart Player

[Re_ADOJAS](/tools/re_adojas/) is a lightweight ADOFAI chart player based on [ADOFAI-JS](../../libs/adofai-js/), supporting multi-platform operation.

## Features

- **Chart loading**: supports `.adofai`, `.json`, `.zip` level files
- **Rendering**: WebGL and WebGPU (experimental), Web Worker multi-threaded rendering
- **Themes**: Light / Dark / Follow System
- **Media import**: audio, video background, decoration images, background images
- **Performance**: adjustable target frame rate, sync/async rendering, multiple level loading methods
- **Visual effects**: planet trail, hit sounds, chart info indicators (TBPM / CBPM / Map Time / Tiles)
- **Other**: fullscreen mode, FPS display, performance monitor panel
- **Internationalization**: Simplified Chinese, English, Japanese

## Steps

1. Open [Re_ADOJAS](/tools/re_adojas/)
2. Load a chart file (you can drag it directly into the window)
3. If needed, import audio, video background, and other resources
4. Start playback

## Tips

- For large charts, use Worker or async loading methods
