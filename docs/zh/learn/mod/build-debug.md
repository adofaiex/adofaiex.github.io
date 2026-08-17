---
title: 编译、部署与调试
order: 5
---

# 编译、部署与调试

写完代码，怎么把它跑进游戏里？

## 编译

用 Visual Studio / Rider 或命令行：

```bash
dotnet build -c Debug
```

模板项目引用的是**游戏目录里的 DLL**，所以编译前请确保：

- 游戏已经通过 UMM 安装（注入）
- `.csproj` 中引用的程序集路径存在（通常是 `$(ADOFAI_PATH)` 或相对路径）

## 部署：把产物放进 Mods

模板通常配置了「编译后自动复制」：

```
MyFirstMod.dll  →  ADOFAI/Mods/MyFirstMod/
Info.json       →  ADOFAI/Mods/MyFirstMod/
```

如果模板没有自动部署，手动复制即可。**发布时也同样要把这两个文件放到一起。**

## 在游戏中验证

1. 启动游戏，打开 UMM 界面（默认 `Ctrl+F10`）
2. 在 Mod 列表中找到 MyFirstMod，勾选启用
3. 观察日志是否输出 `Mod loaded`
4. 若列表里没有你的 Mod，检查：
   - `Info.json` 的 `AssemblyName` 是否等于实际 DLL 文件名
   - `EntryMethod` 是否为 `命名空间.类.Load`
   - 编译产物是否真的复制到了 `Mods/` 下

## 调试技巧

### 1. 用日志定位问题

```csharp
modEntry.Logger.Log($"当前值: {value}");   // 输出到 UMM 界面
```

### 2. 修改后热重载

UMM 支持在游戏内**禁用再启用** Mod：在 UMM 界面取消勾选再重新勾选。这样不用重启游戏就能应用新代码（前提是你重新编译并覆盖了 DLL）。

### 3. 崩溃时看 Player.log

Mod 抛出的异常会写在游戏日志里（见[认识 UMM](./umm.md)的日志位置）。看到 `NullReferenceException` 时，先确认：

- 是否在 `OnToggle` 之前就访问了 `Settings`
- Harmony 补丁的签名是否与目标方法一致

### 4. 附加调试器（可选）

在 IDE 中「附加到进程」选择 `A Dance of Fire and Ice.exe`，可以直接在 C# 代码里打断点。注意需要以**调试配置**编译，且游戏要先启动。

## 你学到了什么

- 编译与部署 Mod 到游戏目录
- 在游戏中启用、验证、热重载 Mod
- 用日志与 `Player.log` 排查问题

## 下一步

学会用 Harmony 修改游戏行为 → [Harmony 入门](./harmony.md)