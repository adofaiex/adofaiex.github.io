---
title: Iridium
order: 2
---

# Iridium

> 面向《冰与火之舞》的**优化 Mod**，聚焦性能、视觉自定义与兼容性。
>
> 项目地址：<https://github.com/adofaiex/Iridium>

## 特性

### 性能优化

- 渲染效率优化，减少卡顿
- 装饰纹理压缩、逐帧加载（带进度）
- Move Track / Move Decorations 优化（支持 freeroam）
- 粒子优化（对象池 / 剔除 / LOD）
- DOTween 调优、自定义缓动引擎
- 异步输入优化，提升判定精度

### 界面与视觉

- 移除新闻面板、隐藏测试版水印、调整自动演示文本位置
- 编辑器显示倒计时
- 大厅音乐：按 BPM 切换背景音乐，支持自定义音乐路径
- 判定文本自定义（如「Perfect」「Too Early」），支持富文本标签与偏移显示
- 打击音效音高跟随音乐

### 编辑器增强

- 大关卡（1 万+ 地板）的插入/删除操作性能优化
- 装饰与地板的自定义快捷键
- 自动演示预览支持暂停 / 恢复

### 兼容性与修复

- 忽略缺失的三方 Mod 依赖加载谱面（保存时恢复 `requiredMods`）
- 未知自定义事件（CustomEvent）临时注册，避免加载崩溃
- 旧版本关卡行为选项（Flash、Camera Relative 等）
- 修复传送门软锁、发卡弯节拍检测、编辑器回放错误追踪

### 补丁模式

- **IL Transpiler**：性能优先
- **Prefix/Postfix**：兼容优先

## 安装

### 前置

- 已安装 [UnityModManager](https://www.nexusmods.com/site/mods/21)
- 已安装 ADOFAI

::: warning
ADOFAI 2.10.0 及以上版本请使用 **UnityModManager 0.32.5.0 或更高**，否则可能崩溃。
:::

### 步骤

1. 前往 [Releases](https://github.com/Xbodwf/Iridium/releases)，下载**与你游戏版本匹配**的构建（每个 Release 提供多个版本的构建）
2. 解压到 `A Dance of Fire and Ice/Mods/Iridium`（目录不存在则创建）
3. 启动游戏；若游戏已在运行，请先重启

### 支持的游戏版本

| 游戏版本 | 分支 |
| --- | --- |
| ADOFAI v2 | `v2` 分支 |
| ADOFAI v3 | `v3` 分支 |

::: danger
除专门为旧版本游戏调校的版本外，请勿在 ADOFAI **2.9.7 及以下**运行 Iridium。
:::

## 设置

启动后在 UMM 设置界面（默认 `Ctrl+F10`）中，v3 的设置按 **General / Optimizer / Editor / Compatibility / Audio** 分页展示。

## 疑难解答

> 📝 待补充（欢迎在仓库 Issues 中反馈）

## 相关

- 其他加载方式：[MelonLoader](https://github.com/Xbodwf/Iridium/blob/main/docs/loader/melonloader.md) / [BepInEx](https://github.com/Xbodwf/Iridium/blob/main/docs/loader/bepinex.md)