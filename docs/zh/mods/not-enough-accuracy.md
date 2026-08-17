---
title: NotEnoughAccuracy
order: 9
---

# NotEnoughAccuracy

> 觉得 XPerfect 还不够严格？**Not Enough Accuracy（NEAcc / NEA）** 把每一毫秒都纳入计算，给出最精确的游玩精度。
>
> 项目地址：<https://github.com/adofaiex/NotEnoughAccuracy>

::: warning
**本 Mod 不影响 ADOFAI 的判定！** 它只是另一种计算精度的方式。
:::

## 精度算法

### Tiles（总块数）

总块数 = VE + EP + PP + LP + VL + FailMiss − 中旋（Midspin），每个中旋只算一块。

### 每块得分

只考虑能把你「向前推进」的判定：

- 未开启 no fail 时**漏块**：`-100`
- 其余情况：`max(100 − |x|, 0)`，其中 `x` 是该块相对精确时机的**毫秒偏差**（与实际判定无关）

即：每块基础分 100 分，每偏差 1 毫秒扣 1 分，最多扣到 0 分；no fail 模式下漏块记 -100。

### 额外扣分

- 每个 TooEarly / TooLate 额外扣 **50**
- 每个 FailOverload 额外扣 **100**

### 总精度

```
TotalScores = 上述所有得分之和（可为负）
NEAccuracy% = TotalScores / Tiles
```

## 许可

GPL v3