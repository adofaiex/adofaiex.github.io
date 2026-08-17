---
title: Getting Started
order: 1
---

# Getting Started

Welcome to the ADOFAI Mod development tutorial. This series will guide you **step by step** through building a Mod for _A Dance of Fire and Ice_ (ADOFAI).

The series has 26 chapters organized into five stages:

| Stage | Chapters | What you get |
| --- | --- | --- |
| ☕ Prerequisites | 0 | C# basics crash course (for complete beginners) |
| 🚀 Getting Started | 1–5 | Environment, how UMM works, your first Mod, debugging |
| 🧩 Harmony | 6–16 | The full patch series (incl. Transpiler, Reverse Patch) |
| 🛠️ Practice | 17–19 | Settings UI, locating target methods |
| 🚢 Advanced & Publishing | 20–25 | Multi-loader, Mod API, CI/CD, guidelines |

Before you begin, you should have the following background:

1. **Never learned C#?** Read [C# Basics Crash Course](./csharp-basics.md) first — go through chapter 0
2. Some experience with **Git and GitHub**

## Environment Setup

### 1. Prepare the game

- Purchase and install _A Dance of Fire and Ice_ on Steam
- Make sure the game launches correctly

### 2. Install UnityModManager

1. Download [UnityModManager](https://www.nexusmods.com/site/mods/21) (0.27.0 or newer)
2. Run UMM and select ADOFAI in the game list
3. Click **Install** to inject UMM into the game

### 3. Install development tools

- **Visual Studio 2019+** or **JetBrains Rider**
- **.NET Framework 4.8.1 Developer Pack**
- **Harmony 2.3.3**

### 4. Get the official template

The organization provides two Mod templates; this series uses the first one:

| Template | Description |
| --- | --- |
| [ADOFAIModTemplate](https://github.com/adofaiex/ADOFAIModTemplate) | Base template, the star of this series |
| [ADOFAIMod.MultiLoader](https://github.com/adofaiex/ADOFAIMod.MultiLoader) | Advanced multi-loader template, see the [advanced chapter](./multiloader.md) |

Clone and install the base template:

```bash
git clone https://github.com/adofaiex/ADOFAIModTemplate.git
cd ADOFAIModTemplate

# Install as a local template (from the repo directory)
dotnet new install path\to\ADOFAIModTemplate
# Or install from the NuGet package
dotnet new install path\to\StArray.ADOFAIModTemplate.1.0.0.nupkg
```

### 5. Verify the environment

Create a test project from the template:

```bash
dotnet new ADOFAIModTemplate --name MyFirstMod
```

If the generated project contains `src/Main.cs`, `src/Settings.cs`, and `src/Patches.cs`, your environment is ready.

## Debugging Your Mod

- UMM uses runtime injection; debugging requires launching the game itself
- Enable / disable Mods in the UMM overlay (default `Ctrl+F10`)
- Check the game log to confirm the Mod loaded successfully

## Development Principles

Thank you for contributing to the ADOFAI ecosystem. Please follow these principles when developing Mods:

- Test your features
- Include good comments
- Store persistent data in the Mod's local config directory so updates don't overwrite it
- Handle errors gracefully — never let a single failure crash the whole Mod
- If you're extending an existing Mod, prefer submitting a PR to the original project

## Chapters

The full chapter list is below; reading in order is recommended:

| # | Chapter | Content |
| --- | --- | --- |
| 0 | [C# Basics Crash Course](./csharp-basics.md) | Catch-up for beginners (optional) |
| 1 | [Getting Started](./index.md) | Environment setup, chapter map |
| 2 | [What is a Mod](./what-is-mod.md) | What Mods can do, red lines |
| 3 | [Understanding UMM](./umm.md) | How UMM works, Mod directory, ModEntry |
| 4 | [Minimal Example](./first-mod.md) | Info.json + Main.cs, your first Mod |
| 5 | [Build, Deploy & Debug](./build-debug.md) | Compiling, hot reload, reading logs |
| 6 | [Harmony Introduction](./harmony.md) | Overview of the four patch types |
| 7 | [Prefix Patches](./harmony-prefix.md) | Intercepting methods, modifying parameters |
| 8 | [Postfix Patches](./harmony-postfix.md) | Modifying return values, `__state` |
| 9 | [Finalizer Patches](./harmony-finalizer.md) | Exception handling |
| 10 | [Magic Parameters](./harmony-magic-params.md) | `__instance` / `__result` / `__state` |
| 11 | [HarmonyPatch In Depth](./harmony-attributes.md) | Target syntax, priorities |
| 12 | [Patch Lifecycle](./harmony-lifecycle.md) | PatchAll / priorities |
| 13 | [Transpiler Introduction](./harmony-transpiler.md) | What IL is |
| 14 | [Transpiler in Practice](./harmony-transpiler-practice.md) | CodeMatcher |
| 15 | [Manual Patching](./harmony-manual.md) | Dynamic patching |
| 16 | [Reverse Patch](./harmony-reverse.md) | Calling game methods in reverse |
| 17 | [Settings System](./settings.md) | Defining and persisting settings |
| 18 | [Drawing the Settings UI](./settings-ui.md) | IMGUI interface |
| 19 | [Locating Target Methods](./finding-methods.md) | dnSpy / ILSpy |
| 20 | [Advanced: Multi-Loader Template](./multiloader.md) | UMM / Melon / BepInEx / Doorstop |
| 21 | [Advanced: Mod API](./sarcary.md) | The Sarcary public API |
| 22 | [Packaging & Publishing](./publish.md) | Releases and publishing |
| 23 | [GitHub Actions CI](./github-actions.md) | CI/CD, private lib repositories |
| 24 | [Mod Development Guidelines](./guidelines.md) | Red lines and quality requirements |
| 25 | [FAQ & Troubleshooting](./troubleshooting.md) | FAQ |
