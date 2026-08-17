---
title: NotEnoughAccuracy
order: 9
---

# NotEnoughAccuracy

> Think XPerfect still isn't strict enough? **Not Enough Accuracy (NEAcc / NEA)** takes every millisecond into calculation, giving you the most precise gameplay accuracy.
>
> Project: <https://github.com/adofaiex/NotEnoughAccuracy>

::: warning
**This Mod does not affect ADOFAI's judgment!** It is just another way of calculating accuracy.
:::

## Accuracy Algorithm

### Tiles (total count)

Total tiles = VE + EP + PP + LP + VL + FailMiss − Midspins, where each midspin counts as only one tile.

### Per-Tile Score

Only the judgment that pushes you forward is considered:

- Missed tile in no-fail mode: `-100`
- Otherwise: `max(100 − |x|, 0)`, where `x` is the **millisecond deviation** from the precise timing of the tile (regardless of the actual judgment)

I.e.: base score per tile is 100, each millisecond of deviation costs 1 point (down to 0); misses in no-fail mode score -100.

### Extra Penalties

- Each TooEarly / TooLate: extra **−50**
- Each FailOverload: extra **−100**

### Total Accuracy

```
TotalScores = sum of all scores above (can be negative)
NEAccuracy% = TotalScores / Tiles
```

## License

GPL v3
