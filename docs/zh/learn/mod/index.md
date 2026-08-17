---
title: 从这里开始
order: 1
---

# 从这里开始

欢迎来到 ADOFAI Mod 开发教程。这个系列将引导你**循序渐进**地开发一个 _A Dance of Fire and Ice_（ADOFAI）的 Mod。

整个系列共 26 章，分为五个阶段：

| 阶段 | 章节 | 你能得到什么 |
| --- | --- | --- |
| ☕ 前置 | 0 | C# 基础速成（零基础补课） |
| 🚀 入门 | 1~5 | 环境、UMM 原理、第一个 Mod、调试 |
| 🧩 Harmony | 6~16 | 补丁全系列（含 Transpiler、Reverse Patch） |
| 🛠️ 实战 | 17~19 | 设置界面、定位目标方法 |
| 🚢 进阶发布 | 20~25 | 多加载器、Mod API、CI/CD、规范 |

在开始之前，希望你能具备以下基础知识：

1. **没学过 C#？** 先读[《C# 基础速成》](./csharp-basics.md)，把第 0 章过一遍
2. 有一定的 **Git、GitHub** 使用经验

## 环境准备

### 1. 准备游戏

- 从 Steam 购买并安装 _A Dance of Fire and Ice_
- 确保游戏可以正常启动

### 2. 安装 UnityModManager

1. 下载 [UnityModManager](https://www.nexusmods.com/site/mods/21)（0.27.0 或更高版本）
2. 运行 UMM，在游戏列表中选择 ADOFAI
3. 点击 **Install** 将 UMM 注入游戏

### 3. 安装开发工具

- **Visual Studio 2019+** 或 **JetBrains Rider**
- **.NET Framework 4.8.1 Developer Pack**
- **Harmony 2.3.3**

### 4. 获取官方模板

组织提供了两个 Mod 模板，本系列将使用第一个：

| 模板 | 说明 |
| --- | --- |
| [ADOFAIModTemplate](https://github.com/adofaiex/ADOFAIModTemplate) | 基础模板，本系列的主角 |
| [ADOFAIMod.MultiLoader](https://github.com/adofaiex/ADOFAIMod.MultiLoader) | 多加载器进阶模板，见[进阶章节](./multiloader.md) |

克隆并安装基础模板：

```bash
git clone https://github.com/adofaiex/ADOFAIModTemplate.git
cd ADOFAIModTemplate

# 安装为本地模板（从仓库目录）
dotnet new install path\to\ADOFAIModTemplate
# 或从 NuGet 包安装
dotnet new install path\to\StArray.ADOFAIModTemplate.1.0.0.nupkg
```

### 5. 验证环境

用模板创建项目测试：

```bash
dotnet new ADOFAIModTemplate --name MyFirstMod
```

如果生成了包含 `src/Main.cs`、`src/Settings.cs`、`src/Patches.cs` 的项目结构，说明环境就绪。

## 调试你的 Mod

- UMM 采用运行时注入机制，调试时需要启动游戏本体
- 在 UMM 界面（默认 `Ctrl+F10`）中启用 / 禁用 Mod
- 观察游戏日志确认加载是否成功

## 开发原则

感谢你为 ADOFAI 生态做出贡献，开发 Mod 请遵守以下原则：

- 功能需经过测试
- 需包含良好的注释
- 持久化数据请存放于 Mod 的本地配置目录，防止更新时被覆盖
- 良好的错误处理机制，不要让 Mod 因一个错误而崩溃
- 如果是扩展现有 Mod 的功能，优先向原项目提交 PR

## 章节

完整章节列表如下，建议按顺序阅读：

| # | 章节 | 内容 |
| --- | --- | --- |
| 0 | [C# 基础速成](./csharp-basics.md) | 零基础补课（可选） |
| 1 | [从这里开始](./index.md) | 环境准备、章节地图 |
| 2 | [什么是 Mod](./what-is-mod.md) | Mod 能做什么、开发红线 |
| 3 | [认识 UMM](./umm.md) | UMM 原理、Mod 目录、ModEntry |
| 4 | [最小实例](./first-mod.md) | Info.json + Main.cs，第一个 Mod |
| 5 | [编译、部署与调试](./build-debug.md) | 编译、热重载、看日志 |
| 6 | [Harmony 入门](./harmony.md) | 四种补丁类型总览 |
| 7 | [Prefix 补丁](./harmony-prefix.md) | 拦截方法、修改参数 |
| 8 | [Postfix 补丁](./harmony-postfix.md) | 修改返回值、`__state` |
| 9 | [Finalizer 补丁](./harmony-finalizer.md) | 异常处理 |
| 10 | [魔法参数详解](./harmony-magic-params.md) | `__instance` / `__result` / `__state` |
| 11 | [HarmonyPatch 详解](./harmony-attributes.md) | 目标写法、优先级 |
| 12 | [补丁生命周期](./harmony-lifecycle.md) | PatchAll / 优先级 |
| 13 | [Transpiler 入门](./harmony-transpiler.md) | IL 是什么 |
| 14 | [Transpiler 实战](./harmony-transpiler-practice.md) | CodeMatcher |
| 15 | [手动补丁](./harmony-manual.md) | 动态打补丁 |
| 16 | [Reverse Patch](./harmony-reverse.md) | 反向调用游戏方法 |
| 17 | [设置系统](./settings.md) | 定义并持久化设置 |
| 18 | [绘制设置界面](./settings-ui.md) | IMGUI 界面 |
| 19 | [定位目标方法](./finding-methods.md) | dnSpy / ILSpy |
| 20 | [进阶：多加载器模板](./multiloader.md) | UMM / Melon / BepInEx / Doorstop |
| 21 | [进阶：Mod API](./sarcary.md) | Sarcary 公共 API |
| 22 | [打包与发布](./publish.md) | Release 与发布 |
| 23 | [GitHub Actions 自动构建](./github-actions.md) | CI/CD、私有 lib 仓库 |
| 24 | [模组开发规范](./guidelines.md) | 红线与质量要求 |
| 25 | [常见问题与排查](./troubleshooting.md) | FAQ |
