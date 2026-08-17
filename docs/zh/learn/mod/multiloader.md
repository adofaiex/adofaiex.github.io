---
title: 进阶：多加载器模板
order: 20
---

# 进阶：多加载器模板

[ADOFAIMod.MultiLoader](https://github.com/adofaiex/ADOFAIMod.MultiLoader) 是组织的**进阶 Mod 模板**，一个项目同时支持 **Unity Mod Manager / MelonLoader / BepInEx / Doorstop** 四种加载器。

## 与基础模板的区别

| | ADOFAIModTemplate | ADOFAIMod.MultiLoader |
| --- | --- | --- |
| 加载器 | UnityModManager | UMM / MelonLoader / BepInEx / Doorstop |
| 适合场景 | 快速入门 | 需要覆盖多个加载器生态 |
| 复杂度 | 低 | 中 |

## 项目结构

```
ProjectRoot/
├── core/                                -- 共享的 Mod 逻辑
│   ├── AdofaiMod.MultiLoader.Core.csproj
│   ├── IHandler.cs                      -- 加载器抽象接口
│   ├── Main.cs                          -- 入口点（Initialize）
│   ├── Settings.cs                      -- 可序列化设置
│   ├── Patches.cs                       -- Harmony 补丁
│   └── ResourceLoader.cs                -- 文件加载工具
├── loaders/
│   ├── umm/                             -- UMM 适配器
│   ├── melon/                           -- MelonLoader 适配器
│   ├── bepinex/                         -- BepInEx 适配器
│   └── doorstop/                        -- Doorstop 独立启动适配器
├── scripts/
│   ├── pack.csx                         -- 发行包打包器
│   ├── pack.cmd / pack.ps1 / pack.sh    -- 各平台打包脚本
├── Resources/                           -- Mod 资源（文本、图片等）
├── ADOFAIMod.targets                    -- MSBuild 目标（复制、部署）
└── Info.json                            -- UMM 清单
```

## 架构

每个加载器有自己的适配器项目，引用共享的 `core/` 项目。`IHandler` 接口抽象了日志、设置与生命周期事件，使核心 Mod 代码**不依赖任何具体加载器**：

```
Loader project (e.g. loaders/umm/)
  └── implements IHandler
      └── calls Main.Initialize(handler)
          └── core/ code runs loader-agnostic
```

## 各加载器如何加载 Mod

四种加载器发现、启动 Mod 的方式**完全不同**。模板为每种加载器写了独立的「入口」文件，本节逐一说明。

### UMM：约定目录 + 静态方法

UMM 扫面 `Mods/` 目录，读取 `Info.json` 的 `EntryMethod`，用反射调用静态 `Load` 方法：

```
Mods/{ModName}/Info.json  →  EntryMethod: ...UmmEntry.Load
```

入口 `loaders/umm/UmmEntry.cs`：

```csharp
public static class UmmEntry
{
    public static bool Load(UnityModManager.ModEntry modEntry)
    {
        var handler = new UmmHandler(modEntry);
        return Main.Initialize(handler);
    }
}
```

`UmmHandler` 在构造函数里把 UMM 的回调（`OnToggle` / `OnGUI` / `OnSaveGUI` / `OnUpdate`）转发为 `IHandler` 的事件。

### BepInEx：继承 `BaseUnityPlugin` + 特性

BepInEx 扫描 `BepInEx/plugins/`，通过程序集里的 **`[BepInPlugin]` 特性**识别 Mod，然后实例化继承 `BaseUnityPlugin` 的插件类：

```csharp
[BepInPlugin(ModId, "AdofaiMod.MultiLoader", "1.0.0")]
[BepInProcess("A Dance of Fire and Ice.exe")]
public class AdofaiBepInPlugin : BaseUnityPlugin
{
    private BepInHandler? _handler;

    private void Awake()
    {
        _handler = new BepInHandler(Logger);
        Main.Initialize(_handler);
        _handler.TriggerToggle(true);   // 相当于 UMM 的启用
    }

    private void Update() => _handler?.TriggerUpdate(UnityEngine.Time.deltaTime);
    private void OnGUI() => _handler?.TriggerGUI();
}
```

要点：

- `[BepInPlugin(GUID, Name, Version)]` 是 BepInEx 的**元数据来源**（见下文「元数据」）
- `[BepInProcess("...exe")]` 限定插件只在哪个进程生效
- `Awake()` 相当于 UMM 的 `OnToggle(true)`；Unity 的 `Update()` / `OnGUI()` 生命周期被转发给 core

### MelonLoader：继承 `MelonMod` + 程序集级特性（最复杂）

MelonLoader 从 `Mods/` 目录加载，但它识别 Mod **不看任何 JSON**，而是看程序集里两个**程序集级特性**：

```csharp
[assembly: MelonInfo(typeof(AdofaiMelonMod), "AdofaiMod.MultiLoader", "1.0.0", "Your Name")]
[assembly: MelonGame("7th Beat Games", "A Dance of Fire and Ice")]

public class AdofaiMelonMod : MelonMod
{
    public override void OnInitializeMelon()
    {
        _handler = new MelonHandler(this);
        Main.Initialize(_handler);
        _handler.TriggerToggle(true);
    }

    public override void OnUpdate() => _handler?.TriggerUpdate(UnityEngine.Time.deltaTime);
    public override void OnGUI() => _handler?.TriggerGUI();
}
```

MelonLoader 与其它加载器差异最大的地方：

- **程序集级特性**（`[assembly: ...]`）写在类外面，属于整个 DLL，而不是某个类
- `[assembly: MelonInfo(类型, 名字, 版本, 作者)]` —— 元数据、启动类、版本全部在这里
- `[assembly: MelonGame("开发者", "游戏名")]` —— 声明适配哪个游戏；写错名字 Melon 会拒绝加载
- `MelonMod` 的生命周期方法（`OnInitializeMelon` / `OnUpdate` / `OnGUI`）由 MelonLoader 调用
- `MelonHandler` 的日志走 `MelonLogger`，设置文件存 `UserData/`（工作目录），与 UMM/BepInEx 的路径都不同
- MelonLoader 自带 **HarmonyX**（不是原版 Harmony 2），所以补丁代码要遵守[与 HarmonyX 的兼容性](#与-harmonyx-的兼容性)

### MelonLoader 的目录结构（Mods / Plugins / UserLibs）

MelonLoader 在游戏根目录下创建多个目录，**各自有各自的用途**，别放错了：

```
<游戏根目录>/
├── Mods/            ← MelonMod（游戏 Mod）放这里
│   └── {ModName}.dll
├── Plugins/         ← MelonPlugin（插件）放这里
│   └── {PluginName}.dll
├── UserLibs/        ← 你的 Mod 依赖的第三方 DLL 放这里
│   └── Newtonsoft.Json.dll
├── UserData/        ← 配置文件（如模板的 settings.json）
├── Libraries/       ← MelonLoader 自带的官方库（别动）
└── MelonLoader/     ← MelonLoader 本体、Logs/ 日志
```

| 目录 | 放什么 | 什么时候加载 |
| --- | --- | --- |
| `Mods/` | `MelonMod` 子类的 DLL | **游戏 Mod**：随游戏启动加载，随游戏卸载 |
| `Plugins/` | `MelonPlugin` 子类的 DLL | **插件**：比 Mods 更早加载，生命周期独立 |
| `UserLibs/` | 第三方依赖库（非游戏、非 Melon） | 启动时自动解析，Mod/Plugin 都能引用 |
| `Libraries/` | MelonLoader 官方库 | MelonLoader 内部管理 |
| `UserData/` | 运行时数据、配置 | 你的代码自己读写 |

**MelonMod 与 MelonPlugin 的区别**（新手最容易混）：

| | MelonMod | MelonPlugin |
| --- | --- | --- |
| 继承 | `MelonMod` | `MelonPlugin` |
| 放哪 | `Mods/` | `Plugins/` |
| 语义 | **游戏**的 Mod，随游戏启停 | **框架**级插件，扩展 MelonLoader 本身 |
| 常见用途 | 改游戏玩法、UI、增添功能 | 提供公共库、注册工具、处理框架事件 |

> 我们的 MultiLoader 模板做的是「游戏 Mod」，所以继承 **`MelonMod`、放在 `Mods/`**。只有当你需要提供**跨 Mod 共享的库**或钩 MelonLoader 自身的生命周期时，才考虑 MelonPlugin。

**UserLibs 是依赖库的「公共仓库」**：如果多个 Melon 依赖同一个第三方 DLL（比如 `Newtonsoft.Json`），把它放进 `UserLibs/` 一份，所有 Mod/Plugin 都能自动引用，**不用每个 Mod 各自打包一份**。这正是多加载器模板里 Melon 加载器的依赖走 `UserLibs` 思路的原因。

::: tip 模板的 Melon 加载器部署到哪？
用 `-p:Loader=ML` 构建时，产物会部署到 `GameDir/Mods/`（见[构建与部署](#构建与部署)）。如果依赖需要共享，把第三方 DLL 额外复制到 `GameDir/UserLibs/`。
:::

### Doorstop：无加载器，自己启动

Doorstop 不是「Mod 加载器」，而是一个**原生代理**：它先加载 `doorstop_config.ini` 指定的程序集和入口点，再由我们手动把组件挂到 Unity 场景里：

```csharp
public static class DoorstopEntry
{
    public static void EntryPoint()
    {
        var go = new GameObject("AdofaiMod_Doorstop");
        Object.DontDestroyOnLoad(go);
        go.AddComponent<DoorstopComponent>();
    }
}
```

`doorstop_config.ini` 负责「找对入口」：

```ini
[General]
assembly=AdofaiMod.MultiLoader.Loader.Doorstop.dll
entry_point=AdofaiMod.MultiLoader.Loaders.DoorstopEntry.EntryPoint
```

- 没有「启用/禁用」概念，加载即生效（`Awake` 里直接 `TriggerToggle(true)`）
- 日志直接走 `UnityEngine.Debug.Log`

## 模板是怎么处理的

模板的核心思路是 **`IHandler` 抽象**：每种加载器写一个 `XxxHandler` 实现 `IHandler`，core 代码只认识 `IHandler`，完全不知道自己在哪个加载器上跑。

| `IHandler` 成员 | UMM 来源 | BepInEx 来源 | MelonLoader 来源 | Doorstop 来源 |
| --- | --- | --- | --- | --- |
| `ModId` / `ModVersion` | `Info.json` | `[BepInPlugin]` | `MelonInfo` | 写死常量 |
| `ModPath` | `ModEntry.Path` | `Paths.PluginPath` | 当前工作目录 | DLL 所在目录 |
| `Log` / `Warning` / `Error` | `Logger` | `ManualLogSource` | `MelonLogger` | `Debug.Log*` |
| 设置存取 | `entry.Path/Config/*.json` | `Paths.ConfigPath/*.json` | `UserData/*.json` | DLL 旁 `Config/*.json` |
| 生命周期事件 | `OnToggle/OnGUI/OnSaveGUI/OnUpdate` | `Awake/Update/OnGUI` | `OnInitializeMelon/OnUpdate/OnGUI` | `Awake/Update/OnGUI` |

入口流程都是一致的：**加载器 → new XxxHandler → `Main.Initialize(handler)` → 转发生命周期 → core 只写一遍**。新增一个功能时，只改 core/ 和 Patches.cs，四个加载器全部生效。

设置全部存为 JSON：`IHandler.LoadSettings<T>()` / `SaveSettings<T>()` 由各 Handler 用自己加载器的路径实现，core 的 `Settings` 类定义一次即可。

## 修改 Mod 元数据

**Info.json 只有 UMM 会读。** BepInEx、MelonLoader、Doorstop 都不认识它。所以「改名、改版本、改作者」要按加载器分别处理：

| 元数据 | UMM | BepInEx | MelonLoader |
| --- | --- | --- | --- |
| 名字 / 版本 / 作者 | `Info.json` | `[BepInPlugin]` 参数 | `[assembly: MelonInfo]` 参数 |
| 适用进程 / 游戏 | 无 | `[BepInProcess]` | `[assembly: MelonGame]` |
| 项目版本号 | csproj `<Version>` | csproj `<Version>` | csproj `<Version>` |

::: tip 模板的「一处修改」魔法
`dotnet new adofaiml -n MyMod -a "YourName" -v 2.0.0` 创建项目时，模板会自动把 `Info.json`、`[BepInPlugin]`、`[assembly: MelonInfo]`、`csproj <Version>` 里的**占位符**（`Your Name`、`1.0.0`）一起替换掉——所以**创建时就把名字版本定好**是最省事的。
:::

改完元数据后，需要分别验证：

- **UMM**：看 Mod 列表里的名字 / 版本
- **BepInEx**：看 `BepInEx/LogOutput.log` 或 plugins 目录
- **MelonLoader**：看 `MelonLoader` 的加载日志（在游戏目录的 `MelonLoader/Latest.log`）

## 前置要求

- .NET SDK 6.0 或更高
- Steam 版 ADOFAI

::: tip
加载器依赖（MelonLoader、BepInEx、UnityModManager、Harmony）已打包在模板的 `lib/ModManager/` 中，**构建时无需安装任何加载器**。只需要游戏的 `GameExePath`，用于引用 Unity 引擎与游戏程序集。
:::

## 安装模板

```bash
# 从本地仓库副本安装（推荐）
dotnet new install path/to/ADOFAIMod.MultiLoader

# 或从打包的 NuGet 包安装
dotnet pack path/to/AdofaiMod.MultiLoader.Template.csproj -o path/to/dist
dotnet new install path/to/dist/AdofaiMod.MultiLoader.1.0.0.nupkg
```

模板安装后名为 `adofaiml`，卸载：

```bash
dotnet new uninstall ADOFAIMod.MultiLoader
```

### Visual Studio / JetBrains Rider

安装模板后，新建项目并搜索 **ADOFAI** 或 **adofaiml**，新建向导会为每个加载器提供复选框。

## 创建项目

### 命令行

```bash
# 包含全部四个加载器（默认）
dotnet new adofaiml -n MyMod

# 选择加载器（关掉不需要的）
dotnet new adofaiml -n MyMod --bepinex false --doorstop false

# 指定作者与描述
dotnet new adofaiml -n MyMod -a "YourName" -d "My first ADOFAI mod"
```

### 参数一览

| 短参数 | 长参数 | 说明 |
| --- | --- | --- |
| `-n` | `--name` | 项目名（即 Mod 名） |
| `-a` | `--author` | 作者名 |
| `-d` | `--description` | Mod 描述 |
| `-v` | `--version` | 初始版本（默认 1.0.0） |
| `-um` | `--umm` | 是否包含 UMM 加载器（默认 true） |
| `-ml` | `--melon` | 是否包含 MelonLoader（默认 true） |
| `-bx` | `--bepinex` | 是否包含 BepInEx（默认 true） |
| `-ds` | `--doorstop` | 是否包含 Doorstop（默认 true） |

## 指向你的游戏（`.env`）

游戏路径从项目根目录的 `.env` 读取（已被 git 忽略），本地安装路径不会进入版本控制：

```bash
# 复制示例并填入你的路径
cp .env.example .env

# .env
ADOFAI_GAME_PATH=C:\Games\ADOFAI\ADanceOfFireAndIce.exe   # 默认（所有加载器）
ADOFAI_GAME_PATH_UMM=...\ADanceOfFireAndIce.exe            # 仅 UMM
ADOFAI_GAME_PATH_ML=...\ADanceOfFireAndIce.exe             # 仅 MelonLoader
ADOFAI_GAME_PATH_BEPINEX=...\ADanceOfFireAndIce.exe        # 仅 BepInEx
ADOFAI_GAME_PATH_DOORSTOP=...\ADanceOfFireAndIce.exe       # 仅 Doorstop
```

每个加载器在自身键为空时回退到 `ADOFAI_GAME_PATH`，只用一份默认值即可。

### 路径解析顺序

各加载器依次尝试：自身 `.env` 键 → `ADOFAI_GAME_PATH` → `ADOFAI_GAME_PATH_<LOADER>` 环境变量 → `-p:GameExePath=...`。这样可以让不同加载器指向不同的游戏安装（例如不同的 ADOFAI 版本）。

## 构建与部署

```bash
# 构建并部署到指定加载器的游戏目录，随后启动游戏
dotnet build -p:Loader=UMM          # UMM      → GameDir/Mods/{ModName}/
dotnet build -p:Loader=ML           # Melon    → GameDir/Mods/
dotnet build -p:Loader=BepInEx      # BepInEx  → GameDir/BepInEx/plugins/{ModName}/
dotnet build -p:Loader=Doorstop     # Doorstop → GameDir/

# 构建并部署，但不要启动游戏
dotnet build -p:Loader=UMM -p:AutoLaunchGame=false

# Release：仅构建（不部署/启动），输出平铺到 out/
dotnet build -c Release
```

### 各加载器部署目录

| 加载器 | 目标目录 |
| --- | --- |
| `UMM` | `GameDir/Mods/{ModName}/` |
| `ML` | `GameDir/Mods/` |
| `BepInEx` | `GameDir/BepInEx/plugins/{ModName}/` |
| `Doorstop` | `GameDir/`（根目录，与 doorstop_config.ini 同级） |

### 输出目录

无论构建哪个加载器，`out/` 都会以扁平布局收集所有产物：

```
out/
├── {ModName}.Core.dll
├── {ModName}.Loader.UMM.dll        (如果构建了 UMM)
├── {ModName}.Loader.Melon.dll      (如果构建了 Melon)
├── {ModName}.Loader.BepInEx.dll    (如果构建了 BepInEx)
├── {ModName}.Loader.Doorstop.dll   (如果构建了 Doorstop)
├── Info.json                        (仅构建 UMM 时)
├── doorstop_config.ini              (仅构建 Doorstop 时)
└── Resources/
```

## 制作发行包

需要 `dotnet script`（安装：`dotnet tool install -g dotnet-script`）。

```bash
# 先构建 Release 产物，再打包
scripts/pack.cmd      # Windows
scripts/pack.sh       # Linux/macOS
scripts/pack.ps1      # PowerShell
```

在 `dist/` 中生成各加载器的 ZIP：

| 文件 | 结构（相对于游戏根目录） |
| --- | --- |
| `{ModName}_umm.zip` | `Mods/{ModName}/` 扁平 |
| `{ModName}_melon.zip` | `Mods/` 扁平 |
| `{ModName}_bepinex.zip` | `BepInEx/plugins/{ModName}/` 扁平 |
| `{ModName}_doorstop.zip` | 根目录扁平（含 doorstop_config.ini） |

## 与 HarmonyX 的兼容性

多加载器生态里存在两个 Harmony：**Harmony 2**（UMM 常用）与 **HarmonyX**（MelonLoader / BepInEx 自带的分支）。同一个 Mod 要同时跑在四种加载器上，必须保证补丁代码在两个 Harmony 上都能工作。

::: warning 原则：只用两者共有的 API
HarmonyX 在 Harmony 2 的基础上**新增**了一些 API，也**移除**了一些 API（例如 `HarmonyCategory`）。因此多加载器 Mod 的补丁代码应当**只使用 Harmony 2 与 HarmonyX 共有的 API 子集**。
:::

### 安全使用范围

```csharp
// ✅ 两者都支持：常规补丁
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
public static class MyPatch
{
    public static void Prefix() { /* ... */ }
    public static void Postfix() { /* ... */ }
}

// ✅ 两者都支持：PatchAll / UnpatchAll
harmony.PatchAll(Assembly.GetExecutingAssembly());
harmony.UnpatchAll(entry.Info.Id);

// ✅ 两者都支持：魔法参数（__instance / __result / __state / ___field）
public static void Postfix(ref float __result) { /* ... */ }
```

### 需要避免的写法

- **`HarmonyCategory` / 分类相关 API**：HarmonyX 已移除，用了会编译失败
- **HarmonyX 新增 API**（如 HarmonyX 专属的补丁选项）：在 Harmony 2（UMM）上不存在
- **依赖 JIT 细节的 Transpiler**：两个 Harmony 的 IL 生成有细微差异，Transpiler 匹配应尽量宽松（见 [Transpiler 实战](./harmony-transpiler-practice.md)）

### 如何验证

1. 在 **UMM**（Harmony 2）与 **MelonLoader / BepInEx**（HarmonyX）各跑一遍
2. 用 `GetPatchInfo` 确认补丁都正常应用（见 [补丁生命周期](./harmony-lifecycle.md)）
3. CI 里对每种加载器分别构建，见 [GitHub Actions 自动构建](./github-actions.md)

> 模板的 `lib/ModManager/` 中打包的 Harmony 版本即面向兼容的目标版本，构建时无需自己决定版本。

## 你学到了什么

- 多加载器模板的目录结构与架构（core + 各加载器适配器）
- `IHandler` 抽象让核心代码与加载器解耦
- 用 `dotnet new adofaiml` 创建项目、用 `.env` 配置游戏路径
- **四种加载器的加载机制**：UMM（Info.json + 静态方法）、BepInEx（`BaseUnityPlugin` + `[BepInPlugin]`）、MelonLoader（`MelonMod` + 程序集级 `[MelonInfo]`/`[MelonGame]`）、Doorstop（doorstop_config.ini + 手动挂组件）
- **MelonLoader 目录结构**：`Mods/`（MelonMod）、`Plugins/`（MelonPlugin）、`UserLibs/`（共享依赖库）、`UserData/`（配置）、`Libraries/`（官方库）
- 各加载器的构建部署方式与发行包打包流程
- **Mod 元数据的差异**：Info.json 只有 UMM 读，BepInEx/MelonLoader 用特性声明
- **HarmonyX 兼容性：只用 Harmony 2 与 HarmonyX 共有 API**

## 下一步

使用 Mod API 扩展能力 → [进阶：Mod API](./sarcary.md)