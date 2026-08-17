---
title: Iris
order: 4
---

# Iris

> A **visual effects** Mod for ADOFAI, built on the [ADOFAIMod.MultiLoader](https://github.com/adofaiex/ADOFAIMod.MultiLoader) template, supporting **Unity Mod Manager / MelonLoader / BepInEx**.
>
> Project: <https://github.com/adofaiex/Iris>

## Features

- **Post-processing effects** — Bloom / Tonemapping / Color Grading (GPU post-processing, loaded from asset bundle)
- **Menu skins** — Replace menu backgrounds with images or videos, per-scene settings or slideshow playback, with full color/transform control
- **Track customization** — Recolor menu floor tracks (adjust brightness/opacity per RGB channel)

## Usage

> 📝 Release installation instructions to be supplemented (the repository currently targets source builds, see the build method below)

## Building from Source

Prerequisites: .NET SDK 6.0+, Steam version of ADOFAI

```bash
# 1. Point to your game (this file is git-ignored)
cp .env.example .env
# Edit .env, set ADOFAI_GAME_PATH to your game executable path

# 2. Build the shader bundle in Unity:
#    Open UnityProject, run menu item "Iris/Build Asset Bundle"
#    (outputs to Resources/iris_shaders)

# 3. Build and deploy (add -p:AutoLaunchGame=false to skip launching the game)
```

## Troubleshooting

> 📝 To be supplemented (feel free to report in the repository Issues)
