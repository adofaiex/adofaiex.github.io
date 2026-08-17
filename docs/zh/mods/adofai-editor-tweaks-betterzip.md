---
title: EditorTweaks.BetterZip
order: 15
---

# ADOFAI.EditorTweaks.BetterZip

> 独立的谱面压缩包 Mod，版本 `1.0.0`。只负责 **ZIP、ADOZIP、7z、RAR、TAR、GZip、BZip2、XZ、CAB** 等归档的读取 / 导出、旧 ZIP 文件名编码和压缩包安全检查。
>
> 项目地址：<https://github.com/adofaiex/ADOFAI.EditorTweaks.BetterZip>

::: tip
本项目**不包含**编辑器优化、视频渲染、Web UI 或 FFmpeg，也不依赖另外两个 EditorTweaks Mod（[ADOFAI.EditorTweaks](./adofai-editor-tweaks.md)、[ADOFAI.EditorTweaks.ChartRendering](./adofai-editor-tweaks-chartrendering.md)）。
:::

## 功能

- 多种归档格式的读取 / 导出：ZIP、ADOZIP、7z、RAR、TAR、GZip、BZip2、XZ、CAB
- **旧 ZIP 文件名编码**处理（解决乱码文件名）
- **压缩包安全检查**

## UMM 设置

UMM 面板只提供旧 ZIP 文件名编码模式：

| 模式 | 说明 |
| --- | --- |
| `Auto` | 自动检测 |
| `CP949` | 韩文（旧版常见） |
| `GB18030` | 简体中文 |
| `Shift-JIS` | 日文 |
| `CP437` | DOS 拉丁字符集 |

## 构建（开发者）

```powershell
dotnet build ADOFAI.EditorTweaks.BetterZip.csproj -c Debug
dotnet build ADOFAI.EditorTweaks.BetterZip.csproj -c Release
```

- 产物在 `out/` 和 `Build/`
- 部署目录：`Mods/ADOFAI.EditorTweaks.BetterZip/`
- 发行包额外包含 `SharpSevenZip.dll`、许可证与 `ThirdParty/7-Zip/x64/7z.dll`

## 疑难解答

> 📝 待补充（欢迎在仓库 Issues 中反馈）