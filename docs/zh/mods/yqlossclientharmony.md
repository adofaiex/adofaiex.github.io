---
title: YqlossClientHarmony
order: 3
---

# YqlossClientHarmony

> 开源 ADOFAI 修复、特效去除、回放 Mod。
>
> 项目地址：<https://github.com/adofaiex/YqlossClientHarmony>

## 功能

- 修复致命装饰物在 no fail 模式下导致失败的问题
- 修复 Set Input 事件导致关卡无法游玩
- 修复保存的 `.adofai` 文件 JSON 格式错误
- 防止误退出游戏
- 游戏结束播放音效
- **特效去除**（Effect Remover）
- **回放**（Replay）

## 使用方法

1. 安装 [UnityModManager](https://www.nexusmods.com/site/mods/21)
2. 在 [Releases](https://github.com/adofaiex/YqlossClientHarmony/releases) 下载最新构建
3. 通过 UMM 安装，或解压到 `A Dance of Fire and Ice/Mods/YqlossClientHarmony/`
4. 启动游戏，UMM 设置（默认 `Ctrl+F10`）中启用相应功能

## 教程：录制回放

1. 在 YCH 设置中启用 **YCH** 与 **Replay**（录制）
2. 游玩关卡，回放将被录制

## 教程：播放回放

1. 在 YCH 设置中启用 **YCH** 与 **Replay**
2. 在关卡编辑器中打开关卡，点击 **Load Replay**，选择回放文件（`.ychreplay.gz` 或 `.ychreplaygz`）
3. 将游戏设置调整为与录制者一致（**Async Input 除外**）
4. 点击 **Jump to Start**，开始游玩

## 疑难解答

**「!!!」出现在 Mod 名称旁？**

你下载的可能是从源码直接构建的版本。请从 [Releases](https://github.com/adofaiex/YqlossClientHarmony/releases) 下载正式发布版。

**回放时星球与地板不同步？**

回放时请**关闭 KeyboardChatterBlocker**。

**KeyboardChatterBlocker 与回放录制器不兼容？**

只有部分版本兼容，官方测试过的为 **0.0.10**（0.0.7 不兼容）。

**DLC 支持情况？**

目前对 DLC 支持不完善，如有相关问题可在仓库 Issues 反馈。