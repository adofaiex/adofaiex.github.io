---
title: Re_ADOJAS：谱面播放器
order: 3
---

# Re_ADOJAS：谱面播放器

[Re_ADOJAS](/tools/re_adojas/) 是一个基于 [ADOFAI-JS](../../libs/adofai-js/) 的轻量级 ADOFAI 谱面播放器，支持多平台运行。

## 功能一览

- **谱面加载**：支持 `.adofai`、`.json`、`.zip` 关卡文件
- **渲染**：WebGL 与 WebGPU（实验性），支持 Web Worker 多线程渲染
- **主题**：浅色 / 深色 / 跟随系统
- **媒体导入**：音频、视频背景、装饰图片、背景图片
- **性能**：可调节目标帧率，同步 / 异步渲染，多种关卡加载方式
- **视觉效果**：星球拖尾、打击音效、谱面信息指示（TBPM / CBPM / Map Time / Tiles）
- **其他**：全屏模式、FPS 显示、性能监控面板
- **国际化**：简体中文、英语、日语

## 使用步骤

1. 打开 [Re_ADOJAS](/tools/re_adojas/)
2. 加载谱面文件（可直接拖入窗口）
3. 如有需要，导入音频、视频背景等资源
4. 开始播放

## 提示

- 大谱面建议使用 Worker 或异步加载方式
