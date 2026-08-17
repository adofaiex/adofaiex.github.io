---
title: ADOFAIMacro
order: 13
---

# ADOFAIMacro

> 用于《冰与火之舞》的 UnityModManager（UMM）模组，提供更**稳定、可调、可过滤**的自动输入能力，覆盖从「直接判定触发」到「系统级按键模拟」的多种场景。
>
> 项目地址：<https://github.com/adofaiex/ADOFAIMacro>

## 功能

- **自动触发**：解析谱面地板时间戳，工作线程高精度定时发送按键
- **触发模式**：
  - **判定触发**（`SimulateKeyPress = false`）：工作线程计数 → 主线程 `controller.Hit()`
  - **按键模拟**（`SimulateKeyPress = true`）：工作线程调用 `SendKey()` 模拟系统级按键
- **宏按键模式**：
  - **简单轮转**（`EnableTechniqueSimulation = false`）：`MacroKeys` 列表循环，带 `_pendingKey` 防重叠
  - **手法模拟**（`EnableTechniqueSimulation = true`）：左右手交替、可配置按键与顺序、BPM 分片、长按处理、同键修正
- **关卡特定手法配置**：为不同关卡保存独立的手法参数，进入自动加载；支持按 floor 区间覆盖设置
- **时间偏移微调**：毫秒级偏移，游戏中 `Ctrl + 左右键` / `左右键` 实时调参
- **按键过滤系统**：黑白名单模式，同步（KeyCode 位图）与异步（VK 码数组）独立过滤
- **SkyHook 异步输入**：`NtUserInjectKeyboard` 等底层注入路径，适合高频 / 复杂环境
- **死亡后自动按键（Death Key）**：可配置死亡后按键与触发延迟（仅 SkyHook 模式生效）
- **多语言 UI**：中文 / English

## 工作模式

### 直接 Hit 模式（`SimulateKeyPress = false`）

宏触发时直接命中游戏逻辑。链路短、延迟可控，适合纯宏判定场景。

### 按键模拟模式（`SimulateKeyPress = true`）

把宏触发转换为系统层按键输入，可选：

- **SendInput 路径**（兼容性优先）
- **SkyHook 路径**（更偏底层，适合复杂 / 高频环境）

### SkyHook + InputMode

`SkyHookMode = true` 时可选择输入模式：`Auto`（自动选择）、`NtUserInjectKeyboard`（底层注入）、`NtUserSendInput`（中间路径）、`SendInput`（标准方式，兼容性最好）。建议从 `Auto` 开始，遇冲突再逐项切换。

## 安装

### 前置

- 已安装并可正常运行 UnityModManager
- ADOFAI 可通过 UMM 加载模组

### 步骤

1. 编译项目得到 `ADOFAIMacro.dll`（及相关依赖）
2. 在 `Mods/ADOFAIMacro` 目录放入：
   - `ADOFAIMacro.dll`
   - `Newtonsoft.Json.dll`（若游戏目录没有）
   - `Localization/` 文件夹（含 `zh-CN.json`、`en-US.json`）
   - 原生 DLL（如 `InputSystem.dll`、`TechniqueSimulator.dll`）
3. 启动游戏，在 UMM 面板中启用 `ADOFAIMacro`

## 设置项

| 设置项 | 说明 |
| --- | --- |
| `Macro` | 宏总开关 |
| `MacroKeys` | 宏按键序列，英文逗号分隔（如 `D,F,J,K`） |
| `SimulateKeyPress` | 是否用系统按键模拟替代直接 Hit |
| `SkyHookMode` | 按键模拟时是否使用 SkyHook 路径 |
| `InputMode` | Auto / NtInject / NtSendInput / SendInput |
| `TimeOffset` | 宏触发时间偏移（-100 ~ 100 ms） |
| `EnableKeyAdjust` | 允许游戏中 `Ctrl + 方向键` 调整 |
| `AdjustStep` | 每次热键调整步长（0.1 ~ 10） |
| `EnableArrowTimeAdjust` | 允许左右键快速调整延迟 |
| `HighPrecisionAsync` | 实验性高精度异步开关 |
| `EnableDeathKey` / `DeathKeyDelay` / `DeathKeyInput` | 死亡后自动按键（需 SkyHook 模式） |
| `EnableKeyFilter` / `FilterMode` / `FilteredKeys` / `FilteredAsyncKeys` | 按键过滤（0=黑名单，1=白名单） |

按键字符串支持 `A-Z`、`0-9`、`F1-F12`、`SPACE`、`ENTER`、`ESC`、`CTRL`、`ALT`、方向键以及十六进制虚拟键码（如 `0x41`）。

## 运行时快捷键

- **Ctrl + 左/右方向键**：按 `AdjustStep` 调整偏移
- **左右方向键**：直接微调延迟（受 `EnableArrowTimeAdjust` 控制）

## 推荐配置

| 场景 | 建议 |
| --- | --- |
| 追求稳定（入门） | `SimulateKeyPress = false`，`TimeOffset = 0` 起步，逐步微调 |
| 追求兼容（多软件并行） | `SimulateKeyPress = true`、`SkyHookMode = false`、SendInput 路径，必要时开 `EnableKeyFilter` |
| 高频场景（进阶） | `SimulateKeyPress = true`、`SkyHookMode = true`、`InputMode = Auto` 起步，再微调 `TimeOffset` 与 `AdjustStep` |

## 疑难解答

- **宏开了但没反应？** 依次检查：UMM 中已启用、`Macro` 打开、`MacroKeys` 格式正确、必要时切换 `SkyHookMode` / `InputMode`
- **有时触发、有时漏键？** 调整 `TimeOffset`（每次 1ms 微调）；高频场景尝试 `SkyHookMode`；开启 `EnableKeyFilter` 屏蔽冲突
- **死亡后按键不生效？** 确认 `SkyHookMode` 已开启、`EnableDeathKey` 启用、`DeathKeyInput` 是有效按键名或键码