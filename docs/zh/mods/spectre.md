---
title: Spectre
order: 12
---

# Spectre

> ADOFAI **回放 Mod**，基于 Harmony 与 UnityModManager 构建，精确录制与回放键盘输入。
>
> 项目地址：<https://github.com/adofaiex/Spectre>

## 特性

### 回放系统

**录制**

- 捕获每个键盘事件（按下/松开），带精确的歌曲位置时间戳
- 逐块记录命中上下文：角度、过载、自动状态、no-fail 保护、free-roam 段
- 命中分布与 X-accuracy 追踪
- 可选：通过麦克风录制键盘音效（随回放以 `.wav` 保存）
- 晚存 / 失败存 / 自动存三种存档模式
- 退出关卡前手动保存

**回放**

- 逐块回放，精确还原角度 / 自动 / 过载状态
- 支持整段回放与检查点回放
- 快进到起始检查点
- 可选旧版命中检测引擎
- 加载时校验数据完整性（对地板路径、速度、时间、音高、BPM 做哈希校验）

### 特效去除（Effect Remover）

- **星球**：轨道（Orbit）、缩放（Scale）、半径（Radius）
- **轨道**：动画、位置、移动、颜色
- **DLC**：长按音效（Hold Sounds）、隐藏图标（Hide Icons）
- **其他**：移除所有装饰（或保留受条件事件标记的）、重置轨道透明度 / 动画 / 颜色、设置相机缩放

覆盖设置：`Remove All Decorations`（清除除条件事件标记外的所有装饰）、`Set Camera Zoom`（覆盖相机缩放 100–1000）、`Reset Track Animation/Color`。游戏与编辑器均可用；特效去除激活时编辑器保存按钮被禁用（可配置）。

### 按键重映射

通过 `Options.UI` 页签在运行时重映射按键，适合自定义键盘布局或跨平台输入处理。

### 音频录制

通过连接的麦克风录制键盘音效，音量与偏移可调。音频与回放文件一同保存，回放时按哈希校验。

## 安装

1. 为 ADOFAI 安装 [UnityModManager](https://www.nexusmods.com/site/mods/21)
2. 把 `Spectre.dll` 放到 `UnityModManager/ADofAI/Mods/Spectre/`
3. 启动游戏，在 Mod 管理器中启用 Spectre

## 配置

首次启动时在 DLL 旁自动生成 `Configs.json`，所有设置均可在游戏内 UI 中调整（从 UnityModManager Mod 列表打开）。

设置分为 6 个页签：

- **Save Settings** —— 自动存、完成存、晚存、失败存、手动存、备份、旧版引擎、auto/miss 时不保存
- **Replaying Settings** —— 回放速度、保存按钮位置、按键上限
- **Audio Record Settings** —— 键盘音效录制、音量、麦克风设备、偏移
- **Mod UI** —— 字号、语言、按键重映射
- **Debug Settings** —— 按键校验、调试模式、跳过校验
- **Effect Remover** —— 逐项特效开关

## 相关

- 回放格式参考与 Harmony 补丁工具：[YqlossClientHarmony](./yqlossclientharmony.md)
- 另一个 ADOFAI 回放 Mod：[Creplay-mod](https://github.com/potatoonadofai/Creplay-mod)