---
title: Packaging & Publishing
order: 22
---

# Packaging & Publishing

After writing your code, package and publish your Mod so more players can use it. Please read the [Development Guidelines](./guidelines.md) before publishing.

## 1. Verify Info.json

`Info.json` is the Mod info file UMM reads — it was already written in [Minimal Example](./first-mod.md). Before publishing, double-check `EntryMethod`, `AssemblyName`, and `Version`.

## 2. Compile & Deploy

The template supports auto-deploy: after building, the output is placed in the game's Mods folder, ready for in-game testing.

For manual deployment, place the compiled output in:

```
ADOFAI/Mods/MyFirstMod/
```

The release package should include:

- `MyFirstMod.dll` (compiled output)
- `Info.json`
- Usage instructions (README)
- Other dependency DLLs (if any)

## 3. Publish to GitHub Release

1. Push your code to your GitHub repository
2. Create a **Release** on the repository page
3. Upload the compiled DLL and usage instructions

> Common pitfall: players may mistakenly download the "source code zip" and fail to load it. Always upload compiled artifacts to the Release.

## 4. Share on Mod Platforms

You can also publish on the organization's Mod platform [modrift.org](https://modrift.org) to help more players discover your work.

## 5. Auto-Build with GitHub Actions

Manually compiling, packaging, and uploading Releases is tedious. You can use GitHub Actions to automate this on push — see [GitHub Actions Auto Build](./github-actions.md).

## What You Learned

- What files the release package should contain
- Publishing Mods via GitHub Release
- Entry point for auto-build

## Series Complete 🎉

You've completed the full ADOFAI Mod development workflow. Next, you can:

- Explore the [Library Docs](../../libs/) to process level files with code
- Try the [Online Tools](../../mods/online-tools/), or contribute your Mod tutorials to the [User Guide](../../mods/)
