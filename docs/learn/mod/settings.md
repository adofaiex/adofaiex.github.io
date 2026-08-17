---
title: Settings System
order: 17
---

# Settings System

A proper Mod usually needs configurable options. The template provides a complete settings system based on UMM.

## Settings Class: Settings.cs

Inherit from `UnityModManager.ModSettings` — defined properties are automatically persisted to a local config file:

```csharp
using UnityModManagerNet;

namespace MyFirstMod
{
    public class Settings : UnityModManager.ModSettings
    {
        public bool EnableFeature { get; set; } = true;
        public float Sensitivity { get; set; } = 1f;

        public static Settings Load(UnityModManager.ModEntry entry)
        {
            return (Settings)Read<Settings>(entry);
        }

        public override void Save(UnityModManager.ModEntry entry)
        {
            Write(this, entry);
        }
    }
}
```

Key points:

- Properties must be **read-write** — UMM uses reflection to read and write them
- Default values are initialized at declaration
- The config file is stored in the Mod's local config directory; updating the Mod won't overwrite it

## Wiring to the Main Class

In `Main.Load`, load settings and bind callbacks:

```csharp
public static bool Load(UnityModManager.ModEntry modEntry)
{
    Settings = Settings.Load(modEntry);
    modEntry.OnGUI = Settings.OnGUI;
    modEntry.OnSaveGUI = Settings.OnSaveGUI;
    // ...
    return true;
}
```

- `OnGUI`: draws the settings panel
- `OnSaveGUI`: saves settings

## Using in Game

1. After enabling the Mod, press `Ctrl+F10` to open UMM settings
2. Find your Mod in the Mod list
3. Adjust options and save

## Config File Persistence

`Settings.Load` reads the existing config file; `Save` writes it. UMM calls `OnSaveGUI` when the player clicks save or exits, which triggers `Save`.

## Common Issues

### Settings not saving?

Make sure `OnSaveGUI` is bound to `Settings.OnSaveGUI`, and that `Settings.Save` is called correctly.

### Type not supported?

UMM's `ModSettings` supports common types (`bool`, `int`, `float`, `string`, enums). For complex types, break them into simple properties or serialize manually.

## What You Learned

- How to define and persist Mod settings
- How settings are bound to the main class
- Config file reading and saving

## Next Step

Learn to draw the settings UI → [Drawing the Settings UI](./settings-ui.md)
