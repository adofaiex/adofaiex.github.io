---
title: Minimal Example
order: 4
---

# Your First Mod

This chapter uses the official template to write a minimal Mod that UMM can load — from scratch.

## Template Structure

```
MyFirstMod/
├── MyFirstMod.csproj     # Project file
├── src/
│   ├── Main.cs           # Main Mod class
│   ├── Settings.cs       # Mod settings class
│   ├── Patches.cs        # Harmony patches
│   └── ResourceLoader.cs # Resource loader
├── Info.json             # UMM Mod info file
└── Properties/
    └── AssemblyInfo.cs   # Assembly info
```

## Understanding the Entry Point: Main.cs

UMM starts your Mod through the static `Load` method:

```csharp
using System.Reflection;
using HarmonyLib;
using UnityModManagerNet;

namespace MyFirstMod
{
    public static class Main
    {
        public static UnityModManager.ModEntry? Mod { get; private set; }
        public static Harmony? Harmony { get; private set; }
        public static Settings Settings { get; private set; } = null!;

        public static bool Load(UnityModManager.ModEntry modEntry)
        {
            Mod = modEntry;
            Settings = Settings.Load(modEntry);

            modEntry.OnToggle = OnToggle;
            modEntry.OnGUI = Settings.OnGUI;
            modEntry.OnSaveGUI = Settings.OnSaveGUI;

            Harmony = new Harmony(modEntry.Info.Id);
            modEntry.Logger.Log("Mod loaded");
            return true;
        }

        private static bool OnToggle(UnityModManager.ModEntry modEntry, bool value)
        {
            if (value)
            {
                modEntry.Logger.Log("Mod enabled");
                Harmony?.PatchAll(Assembly.GetExecutingAssembly());
            }
            else
            {
                modEntry.Logger.Log("Mod disabled");
                Harmony?.UnpatchAll(modEntry.Info.Id);
            }
            return true;
        }
    }
}
```

## Writing Info.json

UMM reads `Info.json` to identify your Mod. It tells UMM: what the Mod is called, and how to load it. **Without it, the Mod won't be recognized.**

Create `Info.json` in the project root:

```json
{
  "Id": "MyFirstMod",
  "DisplayName": "My First Mod",
  "Author": "you",
  "Version": "1.0.0",
  "ManagerVersion": "0.27.0",
  "AssemblyName": "MyFirstMod.dll",
  "EntryMethod": "MyFirstMod.Main.Load",
  "HomePage": "https://github.com/adofaiex/MyFirstMod"
}
```

| Field | Meaning |
| --- | --- |
| `Id` | Unique Mod identifier — must not conflict with other Mods |
| `DisplayName` | Name shown in the UMM list |
| `Author` | Author name |
| `Version` | Version number — follow semantic versioning |
| `ManagerVersion` | Minimum required UMM version |
| `AssemblyName` | Filename of the compiled DLL |
| `EntryMethod` | Entry method, format `Namespace.Class.Method` |
| `HomePage` | Homepage / repository URL (optional) |

> `EntryMethod` must point to the static `Load` method of the `Main` class — UMM uses it to start the Mod.

## Key Points

- **`Load`** — Called when UMM loads the Mod; returning `true` means success
- **`OnToggle`** — Called when the player enables/disables the Mod in UMM; on enable, `PatchAll` applies all Harmony patches
- **`ModEntry`** — The entry object carrying Mod info, logging, and callback interfaces
- **`Info.json`** — The manifest file UMM uses to identify the Mod; `EntryMethod` and `AssemblyName` must match reality

## What You Learned

- The template project structure
- The meaning of each `Info.json` field
- The UMM Mod lifecycle: `Load` → `OnToggle`

## Next Step

Learn to compile, deploy, and debug your Mod → [Build, Deploy & Debug](./build-debug.md)
