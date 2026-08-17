---
title: Spectre
order: 12
---

# Spectre

> An ADOFAI **replay Mod**, built with Harmony and UnityModManager, for precise keyboard input recording and playback.
>
> Project: <https://github.com/adofaiex/Spectre>

## Features

### Replay System

**Recording**

- Captures every keyboard event (press/release) with precise song-position timestamps
- Per-floor hit context: angle, overload, auto-status, no-fail protection, free-roam section
- Hit margin distribution and X-accuracy tracking
- Optional: keyboard sound recording via microphone (saved as `.wav` alongside the replay)
- Late-save, fail-save, auto-save modes
- Manual save before exiting a level

**Playback**

- Floor-by-floor replay with exact angle/auto/overload restoration
- Full-run and checkpoint-based playback
- Fast-forward to starting checkpoint
- Legacy hit detection engine (switchable)
- Data integrity verification on load (hash checks for floor path, speed, time, pitch, BPM)

### Effect Remover

- **Planet**: Orbit, Scale, Radius
- **Track**: Animations, Positions, Moves, Colors
- **DLC**: Hold Sounds, Hide Icons
- **Misc**: Remove All Decorations (or keep conditional-tag-protected ones), Reset Track Opacity, Reset Track Animation, Reset Track Color, Set Camera Zoom

Override settings: `Remove All Decorations` (clears all decorations except those tagged by conditional events), `Set Camera Zoom` (overrides camera zoom 100–1000), `Reset Track Animation/Color`. Works in both game and editor; editor save buttons are disabled while effect removal is active (configurable).

### Key Remapping

Remap key codes at runtime via the `Options.UI` tab. Useful for custom keyboard layouts or cross-platform input handling.

### Audio Recording

Record keyboard sounds via connected microphone. Volume and offset adjustable. Audio saved alongside replay file and validated by hash on playback.

## Installation

1. Install [UnityModManager](https://www.nexusmods.com/site/mods/21) for ADOFAI
2. Place `Spectre.dll` in `UnityModManager/ADofAI/Mods/Spectre/`
3. Launch the game and enable Spectre in the mod manager

## Configuration

`Configs.json` is auto-generated next to the DLL on first launch. All settings are exposed in the in-game UI (toggle from UnityModManager mod list).

Settings are organized into 6 tabs:

- **Save Settings** — auto-save, complete-save, late-save, fail-save, manual-save, backup, legacy engine, don't save on auto/miss
- **Replaying Settings** — playback speed, save button position, key limit
- **Audio Record Settings** — keyboard sound recording, volume, microphone device, offset
- **Mod UI** — text size, language, key remapping
- **Debug Settings** — key validation, debug mode, skip verification
- **Effect Remover** — per-effect toggles

## Related

- Replay format reference and Harmony patching utilities: [YqlossClientHarmony](./yqlossclientharmony.md)
- Another ADOFAI replay Mod: [Creplay-mod](https://github.com/potatoonadofai/Creplay-mod)
