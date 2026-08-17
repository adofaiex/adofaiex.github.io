---
title: 进阶：Mod API
order: 21
---

# 进阶：Mod API

[Sarcary](https://github.com/adofaiex/Sarcary) 是组织的 **ADOFAI Mod API**，一个 Unity Mod Manager 加载器。它向其他 Mod 提供**注册、更新检查与游戏内通知**的公共接口，让 Mod 之间共享一套统一的更新生态。

## 它能做什么

- **注册 Mod**：把你的 Mod 注册进 Sarcary 系统，统一管理
- **自动检查更新**：远程拉取版本信息，发现新版本时在游戏内弹出通知
- **事件通知**：通过 C# 事件订阅「Mod 已注册」「发现更新」等回调
- **API 版本校验**：检查调用方声明的 API 版本与当前版本是否兼容

## 作为用户

安装 [Sarcary](https://github.com/adofaiex/Sarcary/releases) 后，其设置（UMM 面板，默认 `Ctrl+F10`）：

| 设置项 | 说明 | 默认 |
| --- | --- | --- |
| 自动检查更新 | 自动为注册的 Mod 检查更新 | ✓ |
| 显示更新通知 | 在 GUI 上绘制更新通知 | ✓ |
| 游戏内通知 | 游戏内弹窗通知 | ✓ |
| 启用 API | 允许其他 Mod 调用 API | ✓ |
| 允许远程更新检查 | 允许发起网络请求 | ✓ |
| 导出本地 | 把日志导出到本地文件 | — |
| 日志级别 | Info / Debug / Error 等 | Info |

## 作为开发者

### 注册 Mod

在启动时调用 `API.RegisterMod`，返回是否成功：

```csharp
using Sarcary;

bool ok = API.RegisterMod("MyMod", "1.0.0", "1.0.0");
```

调用前会校验：Sarcary 是否激活（`Main.IsModActive()`）、API 是否启用（设置中的「启用 API」）、API 版本是否兼容（`requiredAPIVersion` 与 `API_VERSION`，当前 `1.0.0`）。不满足会返回 `false` 并记录警告。

### 注册 Mod 并开启更新检查

```csharp
bool ok = API.RegisterModWithUpdate(
    modId: "MyMod",
    modVersion: "1.0.0",
    updateCheckUrl: "https://example.com/api/version",
    updateDownloadUrl: "https://example.com/releases/latest",
    changelog: "修复了若干问题",
    requiredAPIVersion: "1.0.0"
);
```

注册成功后立即发起一次更新检查。

### 订阅事件

```csharp
API.OnModRegistered += (modId, modVersion) => {
    Debug.Log($"Mod registered: {modId} v{modVersion}");
};

API.OnUpdateAvailable += (modId, info) => {
    Debug.Log($"{modId} 有新版本: {info.LatestVersion}");
    API.OpenUpdateDownload(modId); // 打开下载页
};
```

### 常用方法

| 方法 | 说明 |
| --- | --- |
| `RegisterMod(id, ver, requiredApi)` | 注册 Mod |
| `RegisterModWithUpdate(id, ver, checkUrl, dlUrl, changelog, requiredApi)` | 注册并开启更新检查 |
| `RegisterUpdate(...)` | 仅注册更新信息（不注册 Mod） |
| `CheckForUpdate(id, ver)` | 手动检查某个 Mod 的更新 |
| `CheckAllUpdates()` | 检查所有已注册 Mod 的更新 |
| `SetUpdateInfo(id, latestVer, dlUrl, changelog)` | 手动设置更新信息（不支持自动检查时用） |
| `GetUpdateInfo(id)` | 获取更新信息（`ModUpdateInfo`） |
| `GetAvailableUpdates()` | 获取所有有更新的 Mod 列表 |
| `OpenUpdateDownload(id)` | 在浏览器中打开下载地址 |
| `DrawUpdateNotifications()` | 在 GUI 上绘制更新通知 |

`ModUpdateInfo` 字段：`ModId`、`CurrentVersion`、`LatestVersion`、`UpdateCheckUrl`、`UpdateDownloadUrl`、`Changelog`、`IsUpdateAvailable`、`LastCheckTime`。

## 你学到了什么

- Sarcary 是组织提供的 ADOFAI Mod API，提供注册与更新检查能力
- 用 `API.RegisterMod` / `RegisterModWithUpdate` 注册你的 Mod
- 用 `OnUpdateAvailable` 事件响应更新并打开下载页

## 下一步

把作品分享出去 → [打包与发布](./publish.md)