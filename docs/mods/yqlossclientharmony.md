---
title: YqlossClientHarmony
order: 3
---

# YqlossClientHarmony

> Open-source ADOFAI fix, effect removal, and replay Mod.
>
> Project: <https://github.com/adofaiex/YqlossClientHarmony>

## Features

- Fix fatal decorations causing failure in no-fail mode
- Fix Set Input events making levels unplayable
- Fix JSON format errors in saved `.adofai` files
- Prevent accidental game exit
- Play sound effect on game over
- **Effect Remover**
- **Replay**

## Usage

1. Install [UnityModManager](https://www.nexusmods.com/site/mods/21)
2. Download the latest build from [Releases](https://github.com/adofaiex/YqlossClientHarmony/releases)
3. Install via UMM, or extract to `A Dance of Fire and Ice/Mods/YqlossClientHarmony/`
4. Launch the game, enable the corresponding features in UMM settings (default `Ctrl+F10`)

## Tutorial: Recording a Replay

1. Enable **YCH** and **Replay** (recording) in YCH settings
2. Play a level — the replay will be recorded

## Tutorial: Playing a Replay

1. Enable **YCH** and **Replay** in YCH settings
2. Open a level in the level editor, click **Load Replay**, and select a replay file (`.ychreplay.gz` or `.ychreplaygz`)
3. Adjust game settings to match the recorder's settings (**except Async Input**)
4. Click **Jump to Start** and begin playing

## Troubleshooting

**"!!!" appears next to the Mod name?**

You may have downloaded a build compiled directly from source. Please download the official release from [Releases](https://github.com/adofaiex/YqlossClientHarmony/releases).

**Planets and floors out of sync during replay?**

Turn off **KeyboardChatterBlocker** during replay.

**KeyboardChatterBlocker incompatible with replay recorder?**

Only certain versions are compatible — the officially tested version is **0.0.10** (0.0.7 is incompatible).

**DLC support?**

DLC support is currently incomplete. If you encounter related issues, please report them in the repository Issues.
