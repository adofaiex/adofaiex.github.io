---
title: JipperOverlayer
order: 6
---

# JipperOverlayer

> ADOFAI 游戏内**屏幕叠加** Mod：实时显示进度、准确率、BPM、连击与判定等信息。支持 **Unity Mod Manager** 与 **MelonLoader**，设置界面支持英 / 韩 / 中三语。
>
> 项目地址：<https://github.com/adofaiex/JipperOverlayer>

## 特性

- **实时叠加**：进度、准确率（Accuracy / XAccuracy）、音乐/地图时间、检查点、最佳纪录
- **BPM 显示**：地板 BPM、当前 BPM、KPS，带伪 BPM 检测
- **连击计数**：动画连击显示 + 颜色渐变
- **判定显示**：Miss / Bad / Good / Perfect 等命中细分
- **时间缩放**：当前 timing scale 百分比
- **尝试次数追踪**：每张地图的尝试次数（持久化存储）
- **进度条**：可视进度指示
- **Jongyeol 模式**：扩展叠加，含 FPS、状态、死亡次数、起始位置、时值分析、隐藏调试文本
- **双人支持**：多人各自显示
- **文本效果**：全局阴影（TMP Underlay）与描边，RGBA 颜色选择器、宽度/柔化滑块
- **分区字体**：每个叠加位独立字体与字号（Main / BPM / Judgement / Combo / Timing / Attempt）
- **UI 补丁开关**：测试版水印、关卡名位置、自动文本重排可独立开关
- **颜色编辑器**：所有叠加色的交互式渐变编辑器
- **XPerfect 集成**：可选增强完美显示（需 [XPerfect](https://github.com/8100print/XPerfect)）

## 安装

### Unity Mod Manager

1. 安装 [UMM](https://www.nexusmods.com/site/mods/21)
2. 从 [Releases](https://github.com/adofaiex/JipperOverlayer/releases) 下载 **UMM** 版本
3. 通过 UMM 安装，或解压到 `ADOFAI/Mods/JipperOverlayer/`

### MelonLoader

1. 安装 [MelonLoader](https://melonwiki.xyz/)
2. 下载 **MelonLoader** 版本
3. 解压到 `ADOFAI/Mods/JipperOverlayer-melon/`
4. 游戏内按 **F7** 打开设置（可改键）

## 要求

- Steam 版 ADOFAI
- UnityModManager 0.22.14+ **或** MelonLoader
- 支持游戏版本 v136 与 v141+

## 疑难解答

> 📝 待补充（欢迎在仓库 Issues 中反馈）