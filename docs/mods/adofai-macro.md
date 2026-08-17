---
title: ADOFAIMacro
order: 13
---

# ADOFAIMacro

> A UnityModManager (UMM) Mod for _A Dance of Fire and Ice_ that provides more **stable, adjustable, and filterable** auto-input capabilities, covering scenarios from "direct judgment triggering" to "system-level key simulation".
>
> Project: <https://github.com/adofaiex/ADOFAIMacro>

## Features

- **Auto-trigger**: parses chart floor timestamps, sends keys with high-precision timing on a worker thread
- **Trigger modes**:
  - **Judgment trigger** (`SimulateKeyPress = false`): worker thread counts → main thread `controller.Hit()`
  - **Key simulation** (`SimulateKeyPress = true`): worker thread calls `SendKey()` to simulate system-level key input
- **Macro key modes**:
  - **Simple rotation** (`EnableTechniqueSimulation = false`): `MacroKeys` list cycles, with `_pendingKey` anti-overlap
  - **Technique simulation** (`EnableTechniqueSimulation = true`): left/right hand alternation, configurable keys and order, BPM slicing, long-press handling, same-key correction
- **Per-level technique config**: save independent technique parameters per level, auto-load on entry; supports per-floor interval overrides
- **Time offset fine-tuning**: millisecond-level offset, real-time adjustment with `Ctrl + Left/Right` / `Left/Right` in-game
- **Key filter system**: blacklist/whitelist mode, sync (KeyCode bitmap) and async (VK code array) independent filtering
- **SkyHook async input**: `NtUserInjectKeyboard` and other low-level injection paths, for high-frequency / complex environments
- **Death key**: configurable post-death key and trigger delay (SkyHook mode only)
- **Multilingual UI**: Chinese / English

## Operating Modes

### Direct Hit Mode (`SimulateKeyPress = false`)

Macro triggers directly hit game logic. Short chain, controllable latency — suitable for pure macro judgment scenarios.

### Key Simulation Mode (`SimulateKeyPress = true`)

Converts macro triggers to system-level key input. Options:

- **SendInput path** (compatibility-first)
- **SkyHook path** (lower-level, for complex / high-frequency environments)

### SkyHook + InputMode

When `SkyHookMode = true`, you can select the input mode: `Auto` (auto-select), `NtUserInjectKeyboard` (low-level injection), `NtUserSendInput` (intermediate path), `SendInput` (standard, best compatibility). Start with `Auto` and switch if conflicts arise.

## Installation

### Prerequisites

- UnityModManager installed and working
- ADOFAI can load Mods via UMM

### Steps

1. Compile the project to get `ADOFAIMacro.dll` (and related dependencies)
2. Place in the `Mods/ADOFAIMacro` directory:
   - `ADOFAIMacro.dll`
   - `Newtonsoft.Json.dll` (if not in the game directory)
   - `Localization/` folder (with `zh-CN.json`, `en-US.json`)
   - Native DLLs (e.g. `InputSystem.dll`, `TechniqueSimulator.dll`)
3. Launch the game and enable `ADOFAIMacro` in the UMM panel

## Settings

| Setting | Description |
| --- | --- |
| `Macro` | Master macro toggle |
| `MacroKeys` | Macro key sequence, comma-separated (e.g. `D,F,J,K`) |
| `SimulateKeyPress` | Use system key simulation instead of direct Hit |
| `SkyHookMode` | Use SkyHook path for key simulation |
| `InputMode` | Auto / NtInject / NtSendInput / SendInput |
| `TimeOffset` | Macro trigger time offset (-100 ~ 100 ms) |
| `EnableKeyAdjust` | Allow `Ctrl + Arrow keys` adjustment in-game |
| `AdjustStep` | Step per hotkey adjustment (0.1 ~ 10) |
| `EnableArrowTimeAdjust` | Allow Left/Right keys for quick delay adjustment |
| `HighPrecisionAsync` | Experimental high-precision async toggle |
| `EnableDeathKey` / `DeathKeyDelay` / `DeathKeyInput` | Post-death auto key (requires SkyHook mode) |
| `EnableKeyFilter` / `FilterMode` / `FilteredKeys` / `FilteredAsyncKeys` | Key filtering (0=blacklist, 1=whitelist) |

Key strings support `A-Z`, `0-9`, `F1-F12`, `SPACE`, `ENTER`, `ESC`, `CTRL`, `ALT`, arrow keys, and hex virtual key codes (e.g. `0x41`).

## Runtime Hotkeys

- **Ctrl + Left/Right arrow**: adjust offset by `AdjustStep`
- **Left/Right arrow**: fine-tune delay directly (controlled by `EnableArrowTimeAdjust`)

## Recommended Configurations

| Scenario | Recommendation |
| --- | --- |
| Stability (beginner) | `SimulateKeyPress = false`, `TimeOffset = 0` start, fine-tune gradually |
| Compatibility (multi-software) | `SimulateKeyPress = true`, `SkyHookMode = false`, SendInput path, enable `EnableKeyFilter` if needed |
| High-frequency (advanced) | `SimulateKeyPress = true`, `SkyHookMode = true`, `InputMode = Auto` start, then fine-tune `TimeOffset` and `AdjustStep` |

## Troubleshooting

- **Macro on but no response?** Check in order: enabled in UMM, `Macro` is on, `MacroKeys` format is correct, try switching `SkyHookMode` / `InputMode`
- **Intermittent triggers / missed keys?** Adjust `TimeOffset` (1ms steps); try `SkyHookMode` for high-frequency; enable `EnableKeyFilter` to block conflicts
- **Death key not working?** Confirm `SkyHookMode` is on, `EnableDeathKey` is enabled, `DeathKeyInput` is a valid key name or code
