---
title: "Practical: Removing Level Effects"
order: 2
---

# Practical: Removing Level Effects

This example uses multiple libraries together to complete the full workflow of "read level → remove effect events → export."

## Scenario

Many players want "no-effect" versions of charts for practice. The approach: remove all visual effect events (such as `MoveDecorations`, `ScreenScroll`, etc.).

> Online version: [NoEffect Tool](../mods/online-tools/noeffect.md)
> In-game version: [YqlossClientHarmony](../mods/yqlossclientharmony.md)

## Implementation with ADOFAI-JS (TypeScript)

```ts
import { Level } from 'adofai'

const level = new Level(raw)
await level.load()

// Use built-in preset to remove all effects in one step
level.clearEffect('preset_noeffect')

// Or custom filter: exclude only specified effect events
level.clearEvent({ type: 'exclude', events: ['Flash', 'Bloom'] })

// Export
const out = level.export('string', 0, true)
fs.writeFileSync('no-effect.adofai', out)
```

## Implementation with SharpFAI (C#)

```csharp
var level = new Level("input.adofai");

// Remove all visual effects (including decorations)
level.RemoveVFXs(includeDecorations: true);

level.Save("no-effect.adofai");
```

> The exact API may vary between versions; please refer to the corresponding library's documentation.

## Export and Verify

1. Place the exported file into ADOFAI's level directory
2. Load it in-game and confirm that effects have been removed without affecting gameplay judgment

## What You Learned

- The complete "read → filter → export" workflow
- The basic approach to effect removal (preset filtering / conditional filtering)
