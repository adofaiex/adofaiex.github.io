---
title: Iris
order: 4
---

# Iris

> 为 ADOFAI 提供**视觉特效**的 Mod，基于 [ADOFAIMod.MultiLoader](https://github.com/adofaiex/ADOFAIMod.MultiLoader) 模板构建，支持 **Unity Mod Manager / MelonLoader / BepInEx** 三种加载器。
>
> 项目地址：<https://github.com/adofaiex/Iris>

## 特性

- **后处理特效** — Bloom / Tonemapping / Color Grading（GPU 后处理，加载自 asset bundle）
- **菜单皮肤** — 用图片或视频替换菜单背景，支持按场景设置或幻灯片播放，带完整的颜色/变换控制
- **轨道自定义** — 为菜单地板轨道重新着色（按 RGB 通道调节亮度/不透明度）

## 使用方法

> 📝 发行版安装说明待补充（仓库目前面向源码构建，可参考下方构建方式）

## 从源码构建

前置：.NET SDK 6.0+、Steam 版 ADOFAI

```bash
# 1. 指向你的游戏（该文件已被 git 忽略）
cp .env.example .env
# 编辑 .env，设置 ADOFAI_GAME_PATH 为游戏可执行文件路径

# 2. 在 Unity 中构建着色器包：
#    打开 UnityProject，运行菜单项 "Iris/Build Asset Bundle"
#    （输出到 Resources/iris_shaders）

# 3. 构建并部署（加 -p:AutoLaunchGame=false 可跳过启动游戏）
```

## 疑难解答

> 📝 待补充（欢迎在仓库 Issues 中反馈）