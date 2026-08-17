---
title: JipperKeyViewer
order: 5
---

# JipperKeyViewer

> ADOFAI **按键显示** Mod：实时显示按键按下、KPS 统计与雨滴特效。支持 **UnityModManager** 与 **MelonLoader**，界面支持中 / 英 / 韩三语。
>
> 项目地址：<https://github.com/adofaiex/JipperKeyViewer>

## 版本

| 版本 | 说明 |
| --- | --- |
| **JipperKeyViewer** | 标准版，从 `keyviewer_resources` AssetBundle 加载资源 |
| **JipperKeyViewer-FileBased** | 直接从 PNG/OTF 文件加载图片/字体，无需 AssetBundle |

两个版本功能完全一致，均支持 UMM 与 MelonLoader。

## 特性

- **布局**：8K / 10K / 12K / 14K / 16K / 20K / 24K，以及完整 **108 键**物理键盘，脚键 2K–16K
- KPS 统计与总按键计数，每键独立 KPS
- **雨滴特效**：松开按键时平滑淡出；**鬼键雨滴**只触发雨滴、不显示
- 每排雨滴独立控制（速度、高度、开关）
- 每键独立颜色、自动彩虹 KV；KPS / Total 独立颜色
- **标准按键宽度**：宽窄混排后排统一为 50px
- **108 键全键盘**：完整 QWERTY + 小键盘，整块可移动
- KPS/Total 文本居中（随数值变长自动重排）
- 流媒体模式（隐藏 KPS/Total）、千分位格式化
- 字体样式（粗体/斜体/下划线）、自定义字体（把 `.ttf/.otf` 放入 `CustomFont/` 自动识别）
- 归一化自定义位置（0–1），自动适配任意分辨率
- 按键绑定修改与自定义文本标签
- 对象池与合并渲染，热路径零 GC 分配

## 安装

### Unity Mod Manager

1. 安装 [UMM](https://www.nexusmods.com/site/mods/21)
2. 从 [Releases](https://github.com/adofaiex/JipperKeyViewer/releases) 下载 **UMM** 版本
3. 通过 UMM 安装，或解压到 `ADOFAI/Mods/JipperKeyViewer/`

### MelonLoader

1. 安装 [MelonLoader](https://melonwiki.xyz/)
2. 从 Releases 下载 **MelonLoader** 版本
3. 解压到 `ADOFAI/Mods/JipperKeyViewer-melon/`
4. 游戏内按 **F7** 打开设置（可改键）

## 疑难解答

> 📝 待补充（欢迎在仓库 Issues 中反馈）