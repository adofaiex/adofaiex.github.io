---
title: FrequencyTrack
order: 8
---

# FrequencyTrack

**Frequency Track Laying Tool** — An ADOFAI editor Mod. Automatically lays down tiles on the track based on frequency (pitch), supporting three generation methods: **fixed frequency segments**, **glissando (frequency gradient)**, and **noise segments**, with **auto speed adjustment** so pitch matches BPM precisely (0 error).

> Part of the **EditorExtensions** mod (Unity Mod Manager format) in the `adofaiex/ADOFAIMods` repository. FreqTrack was co-developed by StArray and AI assistance.

## Installation & Enabling

1. Place the compiled `EditorExtensions` Mod in ADOFAI's `Mods` directory
2. Open **Mod Settings** in-game (Unity Mod Manager window)
3. Check **Enable FreqTrack**
4. Optional: switch between **English / Chinese** language; check **Enable FreqTrack Logs** for detailed debug logs (off by default)

::: tip
Switching the language refreshes panel text in real time (including font: SourceSans3 for English / Source Han Sans for Chinese).
:::

## Opening the Panel

In the ADOFAI editor, the FreqTrack panel automatically shows/hides when you **toggle angle input mode** (`ToggleAngleInputMode`, the "Angle" button in the bottom-left of the editor).

The panel requires **selecting a starting tile** — generated tiles are inserted after the currently selected tile.

## Panel Interface

| Control | Description |
| --- | --- |
| Collapse button `▼ / ▶` | Expand / collapse panel content |
| **Outer ring** | When enabled, uses the outer ring (large circle) angle formula for generation — larger circles at higher frequencies |
| **Beats** | When enabled, the count input is in **beats**; when disabled, in **tiles** |
| **Start pitch** | Equal-tempered pitch dropdown (C0~B8, A4=440Hz) — selecting auto-fills the frequency |
| **Frequency** | Start frequency (Hz), manually editable |
| **End pitch** | Glissando end pitch dropdown |
| **End frequency** | Glissando end frequency (Hz) |
| **Count** | Beats toggle off = target tile count; on = target beat count |
| **Insert beat interval** | Insert a "jump marker pair" every N beats (0 = no insertion), rhythm unchanged |
| **Glissando easing** | Easing function for frequency change during glissando (30 options) |
| **Apply pitch** | Generate a **fixed frequency** tile segment at the current frequency |
| **Glissando** | **Gradient** from start frequency to end frequency |
| **Generate noise** | Generate a noise segment with random per-tile offset around the current frequency |

## Core Concepts

### Frequency, BPM, and Tiles

- **Frequency (Hz) = tiles per second = display BPM ÷ 60**. Example: 120 BPM → 2 tiles/sec → 2Hz
- Beats per tile `TileBeats(entry, exit)` is determined by the entry/exit angle difference: `((180-(exit-entry)) mod 360 + 360) mod 360 / 180`

### Auto Speed Adjustment

Regardless of the current BPM, the Mod writes a `SetSpeed` event at the segment start:

```
newBpm = hz × 60 × TileBeats(0, segAngle)
```

This ensures **the pitch heard in-game is exactly equal to the input frequency** (0 error). For outer rings, beats per tile is naturally doubled, so display BPM is consistent between inner and outer rings.

### Angle Formula

- Inner ring: `segAngle = 180 - 180 × (hzFormBPM × bpmFactor) / hz`
- Outer ring: `segAngle = 180 - 360 × (hzFormBPM × bpmFactor) / hz`
- `hzFormBPM` = current BPM ÷ 60; `bpmFactor` = fold multiplier with base 2 (ensures the angle falls within a reasonable range)

### Pitch Selector

Based on **equal temperament**, referencing A4 = 440Hz, range C0 (16.352Hz) ~ B8 (7902.133Hz). Selecting a pitch auto-fills the corresponding frequency, which can also be fine-tuned manually.

## Feature Details

### Apply Pitch — Fixed Frequency Segment

1. Select a starting tile
2. Choose a **start pitch** or directly enter a **frequency**
3. Set the **count** (tiles or beats)
4. Optional: set **insert beat interval** (must be ≥1 integer)
5. Optional: enable **outer ring**
6. Click **Apply Pitch**

Result: generates a constant-frequency tile segment after the selected tile, with auto speed adjustment — pitch exactly equals the input frequency.

::: warning
When frequency ≤ 0 or input is empty, it won't execute and only shows a prompt (to avoid producing NaN tiles).
:::

### Glissando — Frequency Gradient Segment

1. Select a starting tile
2. Set **start frequency** and **end frequency** (end pitch / end frequency input)
3. Set the **count** (target tiles or beats)
4. Choose a **glissando easing** function (default Linear)
5. Optional: **insert beat interval**, **outer ring**
6. Click **Glissando**

Result: tile angles gradient continuously from start frequency to end frequency following the easing curve, creating a smooth glissando effect.

- **By beats**: generates up to the target beat count
- **By tiles**: generates up to the target tile count
- Speed factor folds at the **lower frequency** of both ends, ensuring pitch matches throughout

### Generate Noise

1. Select a starting tile
2. Set **start frequency** and **count** (tiles or beats)
3. Optional: **outer ring**
4. Click **Generate Noise**

Result: centered on the current frequency's base angle, **each tile randomly offsets ±25°**, generating a segment that sounds like noise (rhythm / frequency base still matches the input).

### Insert Beat Interval Markers

Inserts a "jump marker pair" every specified number of beats: first jumps to a special angle `target`, then falls back to a 180° rotated position.

- The marker pair's total duration **exactly equals** one normal tile (rhythm completely unchanged)
- Commonly used to create "percussion" or marker points in sustained tones / glissandos
- 0 means no insertion; inputs < 1 are treated as 1, non-integers are auto-rounded

## Glissando Easing Functions (30)

| Type | Functions |
| --- | --- |
| Linear | Linear |
| Sine | InSine / OutSine / InOutSine |
| Quadratic | InQuad / OutQuad / InOutQuad |
| Cubic | InCubic / OutCubic / InOutCubic |
| Quartic | InQuart / OutQuart / InOutQuart |
| Quintic | InQuint / OutQuint / InOutQuint |
| Exponential | InExpo / OutExpo / InOutExpo |
| Circular | InCirc / OutCirc / InOutCirc |
| Back | InBack / OutBack / InOutBack |
| Elastic | InElastic / OutElastic / InOutElastic |
| Bounce | InBounce / OutBounce |

- **In**: slow→fast; **Out**: fast→slow; **InOut**: slow at both ends, fast in the middle
- Easing applies to the **frequency** (Hz) linear interpolation: `freq(t) = startHz + (endHz - startHz) × Ease(t)`
- Choosing elastic / bounce causes the frequency to briefly **exceed the end value** before bouncing back — great for exaggerated glissando effects

## Language & Settings

| Setting | Description |
| --- | --- |
| English / Chinese | Switch panel language (real-time refresh, including font) |
| Enable FreqTrack | Master toggle — when off, panel is hidden and features are disabled |
| Enable QuickOpen / DisableLimit | Other feature toggles in the same Mod |
| Enable FreqTrack Logs | Output detailed apply/glissando/noise logs, marker timestamps, panel layout (off by default, for debugging) |

## Tips & Common Issues

- **Pitch inaccurate?** Confirm the frequency input is correct — the Mod auto-adjusts speed (SetSpeed), and in-game display BPM = frequency × 60. Enable logs to see `speed: newBpm=..., freq≈...Hz` for verification
- **Only a few tiles generated?** When count is 0 or empty: apply/noise defaults to 1 tile, glissando to 32 tiles
- **Want to create percussion/markers?** Use **insert beat interval** — rhythm stays completely unchanged
- **Outer ring vs inner ring?** Outer ring doubles beats per tile — same frequency means fewer outer ring revolutions and larger visuals; pitch is identical
- **Glissando not gliding?** Confirm end frequency differs from start; choosing non-linear easing (e.g. elastic/bounce) can enhance the gradient feel
- **Panel not appearing?** Toggle the "angle input mode" switch once in the editor, or confirm the Mod master toggle is enabled
- **Logs not outputting?** Check "Enable FreqTrack Logs" in Mod settings

## Related

- Repository: [adofaiex/ADOFAIMods](https://github.com/adofaiex/ADOFAIMods) (EditorExtensions + InformationDisplay)
- Other editor enhancements (CustomRotateAngle / DisableLimit / QuickOpen) are also in this repository, installed together with EditorExtensions
