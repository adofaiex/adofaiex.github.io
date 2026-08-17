---
title: "Advanced: Multi-Loader Template"
order: 20
---

# Advanced: Multi-Loader Template

[ADOFAIMod.MultiLoader](https://github.com/adofaiex/ADOFAIMod.MultiLoader) is the organization's **advanced Mod template** — a single project supporting **Unity Mod Manager / MelonLoader / BepInEx / Doorstop** simultaneously.

## Differences from the Basic Template

| | ADOFAIModTemplate | ADOFAIMod.MultiLoader |
| --- | --- | --- |
| Loaders | UnityModManager | UMM / MelonLoader / BepInEx / Doorstop |
| Use case | Quick start | Covering multiple loader ecosystems |
| Complexity | Low | Medium |

## Project Structure

```
ProjectRoot/
├── core/                                -- Shared Mod logic
│   ├── AdofaiMod.MultiLoader.Core.csproj
│   ├── IHandler.cs                      -- Loader abstraction interface
│   ├── Main.cs                          -- Entry point (Initialize)
│   ├── Settings.cs                      -- Serializable settings
│   ├── Patches.cs                       -- Harmony patches
│   └── ResourceLoader.cs                -- File loading utilities
├── loaders/
│   ├── umm/                             -- UMM adapter
│   ├── melon/                           -- MelonLoader adapter
│   ├── bepinex/                         -- BepInEx adapter
│   └── doorstop/                        -- Doorstop standalone adapter
├── scripts/
│   ├── pack.csx                         -- Release package packer
│   ├── pack.cmd / pack.ps1 / pack.sh    -- Per-platform pack scripts
├── Resources/                           -- Mod resources (text, images, etc.)
├── ADOFAIMod.targets                    -- MSBuild targets (copy, deploy)
└── Info.json                            -- UMM manifest
```

## Architecture

Each loader has its own adapter project that references the shared `core/` project. The `IHandler` interface abstracts logging, settings, and lifecycle events, making the core Mod code **independent of any specific loader**:

```
Loader project (e.g. loaders/umm/)
  └── implements IHandler
      └── calls Main.Initialize(handler)
          └── core/ code runs loader-agnostic
```

## How Each Loader Loads Mods

The four loaders discover and start Mods in **completely different** ways. The template has separate "entry" files for each loader — this section covers each one.

### UMM: Convention Directory + Static Method

UMM scans the `Mods/` directory, reads `Info.json`'s `EntryMethod`, and uses reflection to call the static `Load` method:

```
Mods/{ModName}/Info.json  →  EntryMethod: ...UmmEntry.Load
```

Entry `loaders/umm/UmmEntry.cs`:

```csharp
public static class UmmEntry
{
    public static bool Load(UnityModManager.ModEntry modEntry)
    {
        var handler = new UmmHandler(modEntry);
        return Main.Initialize(handler);
    }
}
```

`UmmHandler` forwards UMM's callbacks (`OnToggle` / `OnGUI` / `OnSaveGUI` / `OnUpdate`) to `IHandler` events in its constructor.

### BepInEx: Inherit `BaseUnityPlugin` + Attributes

BepInEx scans `BepInEx/plugins/`, identifies Mods via the **`[BepInPlugin]` attribute** in the assembly, then instantiates the plugin class inheriting `BaseUnityPlugin`:

```csharp
[BepInPlugin(ModId, "AdofaiMod.MultiLoader", "1.0.0")]
[BepInProcess("A Dance of Fire and Ice.exe")]
public class AdofaiBepInPlugin : BaseUnityPlugin
{
    private BepInHandler? _handler;

    private void Awake()
    {
        _handler = new BepInHandler(Logger);
        Main.Initialize(_handler);
        _handler.TriggerToggle(true);   // Equivalent to UMM's enable
    }

    private void Update() => _handler?.TriggerUpdate(UnityEngine.Time.deltaTime);
    private void OnGUI() => _handler?.TriggerGUI();
}
```

Key points:

- `[BepInPlugin(GUID, Name, Version)]` is BepInEx's **metadata source** (see "Modifying Mod Metadata" below)
- `[BepInProcess("...exe")]` limits which process the plugin works in
- `Awake()` is equivalent to UMM's `OnToggle(true)`; Unity's `Update()` / `OnGUI()` lifecycle is forwarded to core

### MelonLoader: Inherit `MelonMod` + Assembly-Level Attributes (Most Complex)

MelonLoader loads from the `Mods/` directory, but it identifies Mods **without reading any JSON** — instead it looks for two **assembly-level attributes** in the assembly:

```csharp
[assembly: MelonInfo(typeof(AdofaiMelonMod), "AdofaiMod.MultiLoader", "1.0.0", "Your Name")]
[assembly: MelonGame("7th Beat Games", "A Dance of Fire and Ice")]

public class AdofaiMelonMod : MelonMod
{
    public override void OnInitializeMelon()
    {
        _handler = new MelonHandler(this);
        Main.Initialize(_handler);
        _handler.TriggerToggle(true);
    }

    public override void OnUpdate() => _handler?.TriggerUpdate(UnityEngine.Time.deltaTime);
    public override void OnGUI() => _handler?.TriggerGUI();
}
```

MelonLoader's biggest differences from other loaders:

- **Assembly-level attributes** (`[assembly: ...]`) are written outside the class, belonging to the entire DLL, not a specific class
- `[assembly: MelonInfo(type, name, version, author)]` — metadata, startup class, and version are all here
- `[assembly: MelonGame("developer", "game name")]` — declares which game this is for; wrong names cause Melon to refuse loading
- `MelonMod`'s lifecycle methods (`OnInitializeMelon` / `OnUpdate` / `OnGUI`) are called by MelonLoader
- `MelonHandler`'s logging goes through `MelonLogger`, and settings are stored in `UserData/` (working directory) — different paths from UMM/BepInEx
- MelonLoader bundles **HarmonyX** (not original Harmony 2), so patch code must follow [HarmonyX Compatibility](#harmonyx-compatibility)

### MelonLoader Directory Structure (Mods / Plugins / UserLibs)

MelonLoader creates multiple directories under the game root, **each with its own purpose** — don't mix them up:

```
<game root>/
├── Mods/            ← MelonMod (game mods) go here
│   └── {ModName}.dll
├── Plugins/         ← MelonPlugin (plugins) go here
│   └── {PluginName}.dll
├── UserLibs/        ← Third-party DLLs your Mod depends on go here
│   └── Newtonsoft.Json.dll
├── UserData/        ← Config files (e.g. the template's settings.json)
├── Libraries/       ← MelonLoader's official libraries (don't touch)
└── MelonLoader/     ← MelonLoader core, Logs/ directory
```

| Directory | What goes there | When loaded |
| --- | --- | --- |
| `Mods/` | DLLs with `MelonMod` subclasses | **Game mods**: loaded on game start, unloaded on game exit |
| `Plugins/` | DLLs with `MelonPlugin` subclasses | **Plugins**: loaded earlier than Mods, independent lifecycle |
| `UserLibs/` | Third-party dependency libraries (non-game, non-Melon) | Auto-resolved at startup, available to all Mods/Plugins |
| `Libraries/` | MelonLoader official libraries | Managed internally by MelonLoader |
| `UserData/` | Runtime data, configs | Your code reads/writes |

**Difference between MelonMod and MelonPlugin** (most confusing for beginners):

| | MelonMod | MelonPlugin |
| --- | --- | --- |
| Inherits | `MelonMod` | `MelonPlugin` |
| Location | `Mods/` | `Plugins/` |
| Semantics | A **game** mod, starts/stops with the game | A **framework**-level plugin, extends MelonLoader itself |
| Common uses | Modify gameplay, UI, add features | Provide shared libraries, register tools, handle framework events |

> Our MultiLoader template is a "game mod", so it inherits **`MelonMod` and goes in `Mods/`**. Only consider MelonPlugin when you need to provide **cross-Mod shared libraries** or hook MelonLoader's own lifecycle.

**UserLibs is a "shared repository" for dependencies**: if multiple Melons depend on the same third-party DLL (like `Newtonsoft.Json`), put one copy in `UserLibs/` and all Mods/Plugins can automatically reference it — **no need for each Mod to bundle its own copy**. This is why the Melon loader's dependencies in the multi-loader template follow the `UserLibs` approach.

::: tip Where does the template's Melon loader deploy to?
When building with `-p:Loader=ML`, the output is deployed to `GameDir/Mods/` (see [Build & Deploy](#build-and-deploy)). If dependencies need to be shared, additionally copy third-party DLLs to `GameDir/UserLibs/`.
:::

### Doorstop: No Loader, Self-Starting

Doorstop is not a "Mod loader" — it's a **native proxy**: it first loads the assembly and entry point specified in `doorstop_config.ini`, then we manually attach a component to the Unity scene:

```csharp
public static class DoorstopEntry
{
    public static void EntryPoint()
    {
        var go = new GameObject("AdofaiMod_Doorstop");
        Object.DontDestroyOnLoad(go);
        go.AddComponent<DoorstopComponent>();
    }
}
```

`doorstop_config.ini` handles "finding the right entry point":

```ini
[General]
assembly=AdofaiMod.MultiLoader.Loader.Doorstop.dll
entry_point=AdofaiMod.MultiLoader.Loaders.DoorstopEntry.EntryPoint
```

- No "enable/disable" concept — loading takes effect immediately (`Awake` calls `TriggerToggle(true)` directly)
- Logging goes directly through `UnityEngine.Debug.Log`

## How the Template Handles It

The template's core approach is the **`IHandler` abstraction**: each loader writes an `XxxHandler` implementing `IHandler`, and core code only knows `IHandler` — completely unaware of which loader it's running on.

| `IHandler` Member | UMM Source | BepInEx Source | MelonLoader Source | Doorstop Source |
| --- | --- | --- | --- | --- |
| `ModId` / `ModVersion` | `Info.json` | `[BepInPlugin]` | `MelonInfo` | Hardcoded constant |
| `ModPath` | `ModEntry.Path` | `Paths.PluginPath` | Current working directory | DLL's directory |
| `Log` / `Warning` / `Error` | `Logger` | `ManualLogSource` | `MelonLogger` | `Debug.Log*` |
| Settings I/O | `entry.Path/Config/*.json` | `Paths.ConfigPath/*.json` | `UserData/*.json` | `Config/*.json` next to DLL |
| Lifecycle events | `OnToggle/OnGUI/OnSaveGUI/OnUpdate` | `Awake/Update/OnGUI` | `OnInitializeMelon/OnUpdate/OnGUI` | `Awake/Update/OnGUI` |

The entry flow is always the same: **loader → new XxxHandler → `Main.Initialize(handler)` → forward lifecycle → core written once**. When adding a new feature, only modify core/ and Patches.cs — all four loaders get it.

Settings are all stored as JSON: `IHandler.LoadSettings<T>()` / `SaveSettings<T>()` are implemented by each Handler using its own loader's path, and core's `Settings` class is defined once.

## Modifying Mod Metadata

**Info.json is only read by UMM.** BepInEx, MelonLoader, and Doorstop don't recognize it. So "changing the name, version, or author" must be handled per loader:

| Metadata | UMM | BepInEx | MelonLoader |
| --- | --- | --- | --- |
| Name / Version / Author | `Info.json` | `[BepInPlugin]` params | `[assembly: MelonInfo]` params |
| Target process / game | None | `[BepInProcess]` | `[assembly: MelonGame]` |
| Project version | csproj `<Version>` | csproj `<Version>` | csproj `<Version>` |

::: tip The template's "one change" magic
When creating a project with `dotnet new adofaiml -n MyMod -a "YourName" -v 2.0.0`, the template automatically replaces **placeholders** (`Your Name`, `1.0.0`) across `Info.json`, `[BepInPlugin]`, `[assembly: MelonInfo]`, and `csproj <Version>` — so **setting the name and version at creation time** is the easiest approach.
:::

After modifying metadata, verify separately:

- **UMM**: check the name / version in the Mod list
- **BepInEx**: check `BepInEx/LogOutput.log` or the plugins directory
- **MelonLoader**: check MelonLoader's loading log (at `MelonLoader/Latest.log` in the game directory)

## Prerequisites

- .NET SDK 6.0 or higher
- Steam version of ADOFAI

::: tip
Loader dependencies (MelonLoader, BepInEx, UnityModManager, Harmony) are bundled in the template's `lib/ModManager/` — **no need to install any loader for building**. You only need the game's `GameExePath` for referencing Unity engine and game assemblies.
:::

## Installing the Template

```bash
# Install from a local repo copy (recommended)
dotnet new install path/to/ADOFAIMod.MultiLoader

# Or install from a packaged NuGet package
dotnet pack path/to/AdofaiMod.MultiLoader.Template.csproj -o path/to/dist
dotnet new install path/to/dist/AdofaiMod.MultiLoader.1.0.0.nupkg
```

After installation, the template is named `adofaiml`. To uninstall:

```bash
dotnet new uninstall ADOFAIMod.MultiLoader
```

### Visual Studio / JetBrains Rider

After installing the template, create a new project and search for **ADOFAI** or **adofaiml** — the wizard provides checkboxes for each loader.

## Creating a Project

### Command Line

```bash
# Include all four loaders (default)
dotnet new adofaiml -n MyMod

# Select loaders (turn off the ones you don't need)
dotnet new adofaiml -n MyMod --bepinex false --doorstop false

# Specify author and description
dotnet new adofaiml -n MyMod -a "YourName" -d "My first ADOFAI mod"
```

### Parameter Reference

| Short | Long | Description |
| --- | --- | --- |
| `-n` | `--name` | Project name (i.e. Mod name) |
| `-a` | `--author` | Author name |
| `-d` | `--description` | Mod description |
| `-v` | `--version` | Initial version (default 1.0.0) |
| `-um` | `--umm` | Include UMM loader (default true) |
| `-ml` | `--melon` | Include MelonLoader (default true) |
| `-bx` | `--bepinex` | Include BepInEx (default true) |
| `-ds` | `--doorstop` | Include Doorstop (default true) |

## Pointing to Your Game (`.env`)

The game path is read from the `.env` file in the project root (git-ignored), so local install paths never enter version control:

```bash
# Copy the example and fill in your path
cp .env.example .env

# .env
ADOFAI_GAME_PATH=C:\Games\ADOFAI\ADanceOfFireAndIce.exe   # Default (all loaders)
ADOFAI_GAME_PATH_UMM=...\ADanceOfFireAndIce.exe            # UMM only
ADOFAI_GAME_PATH_ML=...\ADanceOfFireAndIce.exe             # MelonLoader only
ADOFAI_GAME_PATH_BEPINEX=...\ADanceOfFireAndIce.exe        # BepInEx only
ADOFAI_GAME_PATH_DOORSTOP=...\ADanceOfFireAndIce.exe       # Doorstop only
```

Each loader falls back to `ADOFAI_GAME_PATH` when its own key is empty — a single default value suffices.

### Path Resolution Order

Each loader tries in order: its own `.env` key → `ADOFAI_GAME_PATH` → `ADOFAI_GAME_PATH_<LOADER>` environment variable → `-p:GameExePath=...`. This lets different loaders point to different game installs (e.g. different ADOFAI versions).

## Build and Deploy

```bash
# Build and deploy to the specified loader's game directory, then launch the game
dotnet build -p:Loader=UMM          # UMM      → GameDir/Mods/{ModName}/
dotnet build -p:Loader=ML           # Melon    → GameDir/Mods/
dotnet build -p:Loader=BepInEx      # BepInEx  → GameDir/BepInEx/plugins/{ModName}/
dotnet build -p:Loader=Doorstop     # Doorstop → GameDir/

# Build and deploy, but don't launch the game
dotnet build -p:Loader=UMM -p:AutoLaunchGame=false

# Release: build only (no deploy/launch), output flat to out/
dotnet build -c Release
```

### Per-Loader Deploy Directories

| Loader | Target directory |
| --- | --- |
| `UMM` | `GameDir/Mods/{ModName}/` |
| `ML` | `GameDir/Mods/` |
| `BepInEx` | `GameDir/BepInEx/plugins/{ModName}/` |
| `Doorstop` | `GameDir/` (root, alongside doorstop_config.ini) |

### Output Directory

Regardless of which loader you build, `out/` collects all artifacts in a flat layout:

```
out/
├── {ModName}.Core.dll
├── {ModName}.Loader.UMM.dll        (if UMM was built)
├── {ModName}.Loader.Melon.dll      (if Melon was built)
├── {ModName}.Loader.BepInEx.dll    (if BepInEx was built)
├── {ModName}.Loader.Doorstop.dll   (if Doorstop was built)
├── Info.json                        (only when UMM is built)
├── doorstop_config.ini              (only when Doorstop is built)
└── Resources/
```

## Creating Release Packages

Requires `dotnet script` (install: `dotnet tool install -g dotnet-script`).

```bash
# First build Release artifacts, then pack
scripts/pack.cmd      # Windows
scripts/pack.sh       # Linux/macOS
scripts/pack.ps1      # PowerShell
```

Generates per-loader ZIPs in `dist/`:

| File | Structure (relative to game root) |
| --- | --- |
| `{ModName}_umm.zip` | `Mods/{ModName}/` flat |
| `{ModName}_melon.zip` | `Mods/` flat |
| `{ModName}_bepinex.zip` | `BepInEx/plugins/{ModName}/` flat |
| `{ModName}_doorstop.zip` | Root flat (includes doorstop_config.ini) |

## HarmonyX Compatibility

The multi-loader ecosystem has two Harmony versions: **Harmony 2** (commonly used by UMM) and **HarmonyX** (bundled with MelonLoader / BepInEx). For a single Mod to run on all four loaders, patch code must work on both.

::: warning Principle: Only use shared APIs
HarmonyX **added** some APIs on top of Harmony 2, and also **removed** some APIs (e.g. `HarmonyCategory`). Therefore, multi-loader Mod patch code should **only use the API subset shared between Harmony 2 and HarmonyX**.
:::

### Safe Usage

```csharp
// ✅ Both support: regular patches
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
public static class MyPatch
{
    public static void Prefix() { /* ... */ }
    public static void Postfix() { /* ... */ }
}

// ✅ Both support: PatchAll / UnpatchAll
harmony.PatchAll(Assembly.GetExecutingAssembly());
harmony.UnpatchAll(entry.Info.Id);

// ✅ Both support: magic parameters (__instance / __result / __state / ___field)
public static void Postfix(ref float __result) { /* ... */ }
```

### Patterns to Avoid

- **`HarmonyCategory` / category-related APIs**: removed in HarmonyX, using them causes compilation failure
- **HarmonyX-specific APIs** (e.g. HarmonyX-exclusive patch options): don't exist in Harmony 2 (UMM)
- **JIT-detail-dependent Transpilers**: the two Harmony versions have subtle IL generation differences — Transpiler matching should be as loose as possible (see [Transpiler Practice](./harmony-transpiler-practice.md))

### How to Verify

1. Run on both **UMM** (Harmony 2) and **MelonLoader / BepInEx** (HarmonyX)
2. Use `GetPatchInfo` to confirm patches are applied correctly (see [Patch Lifecycle](./harmony-lifecycle.md))
3. Build for each loader separately in CI — see [GitHub Actions Auto Build](./github-actions.md)

> The Harmony version bundled in the template's `lib/ModManager/` is the compatibility target — no need to decide the version yourself.

## What You Learned

- The multi-loader template's directory structure and architecture (core + per-loader adapters)
- The `IHandler` abstraction decouples core code from loaders
- Creating projects with `dotnet new adofaiml` and configuring game paths via `.env`
- **How the four loaders load Mods**: UMM (Info.json + static method), BepInEx (`BaseUnityPlugin` + `[BepInPlugin]`), MelonLoader (`MelonMod` + assembly-level `[MelonInfo]`/`[MelonGame]`), Doorstop (doorstop_config.ini + manual component attachment)
- **MelonLoader directory structure**: `Mods/` (MelonMod), `Plugins/` (MelonPlugin), `UserLibs/` (shared dependency libraries), `UserData/` (configs), `Libraries/` (official libraries)
- Build/deploy methods and release packaging for each loader
- **Mod metadata differences**: Info.json is only read by UMM; BepInEx/MelonLoader use attributes
- **HarmonyX compatibility: only use APIs shared between Harmony 2 and HarmonyX**

## Next Step

Extend capabilities with the Mod API → [Advanced: Mod API](./sarcary.md)
