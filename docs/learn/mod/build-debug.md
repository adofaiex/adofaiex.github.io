---
title: "Build, Deploy & Debug"
order: 5
---

# Build, Deploy & Debug

You've written the code — now how do you get it running in the game?

## Compiling

Use Visual Studio / Rider or the command line:

```bash
dotnet build -c Debug
```

The template project references **DLLs from the game directory**, so before building make sure:

- The game has been set up with UMM (injected)
- The assembly paths in `.csproj` exist (usually `$(ADOFAI_PATH)` or a relative path)

## Deploying: Put the Output in Mods

The template usually has "auto-copy after build" configured:

```
MyFirstMod.dll  →  ADOFAI/Mods/MyFirstMod/
Info.json       →  ADOFAI/Mods/MyFirstMod/
```

If the template doesn't auto-deploy, copy manually. **When publishing, you also need to put these two files together.**

## Verifying in Game

1. Launch the game and open the UMM interface (default `Ctrl+F10`)
2. Find MyFirstMod in the Mod list and check the enable box
3. Watch the log for `Mod loaded` output
4. If your Mod isn't in the list, check:
   - Does `Info.json`'s `AssemblyName` match the actual DLL filename
   - Is `EntryMethod` in the format `Namespace.Class.Load`
   - Was the compiled output actually copied to `Mods/`

## Debugging Tips

### 1. Use Logs to Locate Problems

```csharp
modEntry.Logger.Log($"Current value: {value}");   // Output to UMM interface
```

### 2. Hot Reload After Changes

UMM supports **disabling then re-enabling** a Mod in-game: uncheck then recheck it in the UMM interface. This applies new code without restarting the game (provided you've recompiled and overwritten the DLL).

### 3. Check Player.log on Crash

Exceptions thrown by your Mod are written to the game log (see [Getting to Know UMM](./umm.md) for log location). When you see `NullReferenceException`, first check:

- Did you access `Settings` before `OnToggle`
- Does your Harmony patch signature match the target method

### 4. Attach a Debugger (Optional)

In your IDE, use "Attach to Process" and select `A Dance of Fire and Ice.exe` to set breakpoints directly in C# code. Note: you need to compile in **Debug configuration**, and the game must be running first.

## What You Learned

- How to compile and deploy a Mod to the game directory
- How to enable, verify, and hot-reload a Mod in-game
- How to troubleshoot using logs and `Player.log`

## Next Step

Learn to modify game behavior with Harmony → [Harmony Introduction](./harmony.md)
