---
title: Troubleshooting
order: 25
---

# Troubleshooting

## Load Failure

**Symptom**: Your Mod doesn't appear in the UMM list, or shows as failed to load.

**Troubleshooting**:

1. Does `Info.json`'s `AssemblyName` match the actual DLL filename
2. Is `EntryMethod` in the format `Namespace.Class.Load`
3. Was the DLL actually copied to the `Mods/MyFirstMod/` directory
4. Does `Load` return `true`
5. Check the UMM log for error messages

## Patches Not Taking Effect

**Symptom**: You wrote a Harmony patch, but the game behavior hasn't changed.

**Troubleshooting** (see [Patch Lifecycle](./harmony-lifecycle.md)):

1. The class must be `public static class` with `[HarmonyPatch]`
2. Was `PatchAll` called in `OnToggle(true)`
3. Do the target method/class/parameter types exactly match (watch for overloads)
4. Use `GetPatchInfo` to check if patches were actually applied
5. Was the target method already called before the Mod was enabled

## NullReferenceException

**Symptom**: `NullReferenceException` in the log.

**Troubleshooting**:

1. Did you access `Settings` before `OnToggle`
2. Could `__instance` be null (static method or null reference)
3. Decompile to confirm the actual field/property names of the target method

## Transpiler Crash or Unexpected Behavior

**Symptom**: After applying a Transpiler, the game crashes or behaves strangely.

**Troubleshooting** (see [Transpiler Practice](./harmony-transpiler-practice.md)):

1. Use dnSpy to view the target method's real IL, confirming the matched instruction sequence exists
2. Degrade gracefully on match failure (`IsValid` check), don't throw directly
3. First add logging to output the instruction sequence and verify each one

## Settings Not Saved

**Symptom**: Settings revert to defaults after restarting the game.

**Troubleshooting**:

1. Is `OnSaveGUI` bound to `Settings.OnSaveGUI`
2. Is `Settings.Save` being called
3. Are the property types supported by UMM

## CI Build Failure

**Symptom**: GitHub Actions reports it can't find DLLs.

**Troubleshooting** (see [GitHub Actions Auto Build](./github-actions.md)):

1. Does the private lib repository directory structure match `HintPath`
2. Was the `LIBS_PAT` Secret created and spelled correctly
3. Does the PAT have `contents: Read` permission
4. Will the local path `Condition` be overridden in CI

## Game Crash

**Symptom**: The game crashes immediately after enabling the Mod.

**Troubleshooting**:

1. Check the last exception stack trace in `Player.log`
2. Disable all Mods and enable them one by one to bisect
3. If it points to your patch, use a `Finalizer` to catch exceptions and avoid crashing
4. Confirm you haven't included game binaries in the build output (this causes load conflicts)

## What You Learned

- First-line troubleshooting approach for common problems
- Which detailed chapter each issue maps to

## Series Complete 🎉

You've completed the full ADOFAI Mod development workflow. Next, you can:

- Explore the [Library Docs](../../libs/) to process level files with code
- Try the [Online Tools](../../mods/online-tools/), or contribute your Mod tutorials to the [User Guide](../../mods/)
