---
title: Understanding UMM
order: 3
---

# Understanding UnityModManager (UMM)

Before writing your first Mod, let's understand how UMM "plugs" Mods into the game.

## What is UMM

**UnityModManager** is a general-purpose Mod loader for Unity games. Through runtime injection it loads Mod DLLs into the game process and handles:

- Discovering all Mods under the `Mods/` directory
- Identifying each Mod via its `Info.json`
- Enabling / disabling Mods (via `OnToggle`)
- Providing a settings panel (`Ctrl+F10`)
- Logging and displaying Mod logs

## Mod Directory Structure

```
ADOFAI/
├── Mods/
│   └── MyFirstMod/            # one folder per Mod
│       ├── MyFirstMod.dll     # compiled output
│       └── Info.json          # manifest file
```

> UMM identifies a Mod by the combination of "folder name / `Info.json` / DLL". All three are required.

## How UMM Loads a Mod

1. UMM scans every folder under `Mods/`
2. Reads `Info.json` and finds `EntryMethod` (e.g. `MyFirstMod.Main.Load`)
3. Invokes the static `Load(UnityModManager.ModEntry)` method via reflection
4. `Load` returning `true` means success; returning `false` marks the Mod as failed
5. When the player enables the Mod, UMM calls `OnToggle(entry, true)`

## ModEntry: Your Interface to UMM

`ModEntry` is the "liaison object" UMM hands to you; frequently used members:

| Member | Description |
| --- | --- |
| `Info` | Parsed `Info.json` (Id, Version, Author, etc.) |
| `Logger.Log(msg)` | Log a message to the UMM interface |
| `OnToggle` | Enable/disable callback; the Mod's on/off logic goes here |
| `OnGUI` | Settings panel drawing callback |
| `OnSaveGUI` | Settings saving callback |
| `Path` | The Mod's on-disk directory (for configs, resources) |
| `Error(msg)` | Log an error and mark the Mod as failed |

## Where the Logs Go

- Press `Ctrl+F10` in game to open the UMM interface; logs are visible at the bottom right
- Both `Logger.Log` and `Debug.Log` end up in the game log file
- On Windows the game log lives at `%APPDATA%\..\LocalLow\7th Beat Games\A Dance of Fire and Ice\Player.log`

## What You Learned

- How UMM discovers and loads Mods
- The Mod directory structure and the role of `Info.json`
- What interfaces `ModEntry` provides
- Where to find logs

## Next Step

Write a minimal loadable Mod from the template → [Minimal Example](./first-mod.md)
