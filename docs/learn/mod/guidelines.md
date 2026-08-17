---
title: Development Guidelines
order: 24
---

# Development Guidelines

Before publishing your Mod, please read and follow these guidelines. They protect players, protect developers, and protect the ecosystem.

## 1. Don't Break Original Game Balance

::: warning Red Line
Do not create Mods that **break original game balance**, such as modifying judgment, accuracy calculation, damage values, or other content affecting the core game experience. Game judgment is an official red line.
:::

- This tutorial **will not** cover how to modify judgment, and you should not promote such features on any channel
- If you want players to get better score displays, refer to the organization's [NotEnoughAccuracy](../../mods/not-enough-accuracy.md), [JustEnoughAccuracy](../../mods/just-enough-accuracy.md) — accuracy statistics solutions that **don't affect original judgment**

## 2. Credit AI-Generated Content

If you use AI to generate code, documentation, or assets, note it in the repository.

```markdown
<!-- This module was AI-assisted ([tool/model name]), please review manually before use -->
```

Why:

- Ensures code quality and credibility
- Respects contributors and users
- The organization's ecosystem values transparency and trust

## 3. Don't Lock Level Content

::: danger
You must not mark levels or other content as "requires your Mod to open."
:::

- Level files belong to their creators and should not be held hostage by a Mod
- Your Mod can **enhance** the experience, but not **kidnap** content
- Mods published on modrift.org follow the same principle

## 4. Don't Distribute Original Game Binaries

::: danger
Mod artifacts and source repositories **must not contain original game binary files** (`Assembly-CSharp.dll`, `UnityEngine.dll`, etc.) — they are copyright-protected.
:::

- For original DLLs needed at compile time, use the **private lib repository** approach (see [GitHub Actions Auto Build](./github-actions.md))
- Build artifacts (Release zips) should only contain your Mod files — don't include game DLLs
- Decompiling game binaries is for understanding and debugging only — do not distribute

## 5. Other Quality Requirements

- **Testing**: features must be tested; verify in a clean environment before publishing
- **Comments**: code should have good comments (especially AI-generated parts)
- **Data safety**: persisted data should be stored in the Mod's local config directory to prevent being overwritten on update
- **Robustness**: proper error handling — don't let a single error crash the Mod (see [Finalizer Patch](./harmony-finalizer.md))
- **Collaboration**: if extending an existing Mod's functionality, prefer submitting a PR to the original project

## What You Learned

- Four uncrossable red lines (balance / credit AI / no content locking / no binaries)
- Basic quality and collaboration requirements

## Next Step

Running into problems? See [Troubleshooting](./troubleshooting.md)
