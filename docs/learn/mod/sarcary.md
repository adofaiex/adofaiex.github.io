---
title: "Advanced: Mod API"
order: 21
---

# Advanced: Mod API

[Sarcary](https://github.com/adofaiex/Sarcary) is the organization's **ADOFAI Mod API**, a Unity Mod Manager loader. It provides a public interface for other Mods to **register, check for updates, and show in-game notifications**, letting Mods share a unified update ecosystem.

## What It Does

- **Register Mods**: register your Mod into the Sarcary system for unified management
- **Auto-check for updates**: pull version info from remote; pop up an in-game notification when a new version is found
- **Event notifications**: subscribe to callbacks like "Mod registered" and "update available" via C# events
- **API version validation**: check whether the caller's declared API version is compatible with the current version

## As a User

After installing [Sarcary](https://github.com/adofaiex/Sarcary/releases), its settings (UMM panel, default `Ctrl+F10`):

| Setting | Description | Default |
| --- | --- | --- |
| Auto-check for updates | Automatically check updates for registered Mods | ✓ |
| Show update notifications | Draw update notifications on the GUI | ✓ |
| In-game notifications | In-game popup notifications | ✓ |
| Enable API | Allow other Mods to call the API | ✓ |
| Allow remote update checks | Allow network requests | ✓ |
| Export to local | Export logs to a local file | — |
| Log level | Info / Debug / Error etc. | Info |

## As a Developer

### Registering a Mod

Call `API.RegisterMod` at startup — returns whether it succeeded:

```csharp
using Sarcary;

bool ok = API.RegisterMod("MyMod", "1.0.0", "1.0.0");
```

Before calling, it validates: whether Sarcary is active (`Main.IsModActive()`), whether the API is enabled (the "Enable API" setting), and whether the API version is compatible (`requiredAPIVersion` vs `API_VERSION`, currently `1.0.0`). If any check fails, it returns `false` and logs a warning.

### Register with Update Checking

```csharp
bool ok = API.RegisterModWithUpdate(
    modId: "MyMod",
    modVersion: "1.0.0",
    updateCheckUrl: "https://example.com/api/version",
    updateDownloadUrl: "https://example.com/releases/latest",
    changelog: "Fixed several issues",
    requiredAPIVersion: "1.0.0"
);
```

After successful registration, it immediately triggers an update check.

### Subscribing to Events

```csharp
API.OnModRegistered += (modId, modVersion) => {
    Debug.Log($"Mod registered: {modId} v{modVersion}");
};

API.OnUpdateAvailable += (modId, info) => {
    Debug.Log($"{modId} has a new version: {info.LatestVersion}");
    API.OpenUpdateDownload(modId); // Open the download page
};
```

### Common Methods

| Method | Description |
| --- | --- |
| `RegisterMod(id, ver, requiredApi)` | Register a Mod |
| `RegisterModWithUpdate(id, ver, checkUrl, dlUrl, changelog, requiredApi)` | Register and enable update checking |
| `RegisterUpdate(...)` | Register update info only (without registering the Mod) |
| `CheckForUpdate(id, ver)` | Manually check for a Mod's update |
| `CheckAllUpdates()` | Check updates for all registered Mods |
| `SetUpdateInfo(id, latestVer, dlUrl, changelog)` | Manually set update info (when auto-check isn't supported) |
| `GetUpdateInfo(id)` | Get update info (`ModUpdateInfo`) |
| `GetAvailableUpdates()` | Get a list of all Mods with updates available |
| `OpenUpdateDownload(id)` | Open the download URL in the browser |
| `DrawUpdateNotifications()` | Draw update notifications on the GUI |

`ModUpdateInfo` fields: `ModId`, `CurrentVersion`, `LatestVersion`, `UpdateCheckUrl`, `UpdateDownloadUrl`, `Changelog`, `IsUpdateAvailable`, `LastCheckTime`.

## What You Learned

- Sarcary is the organization's ADOFAI Mod API, providing registration and update checking
- Use `API.RegisterMod` / `RegisterModWithUpdate` to register your Mod
- Use the `OnUpdateAvailable` event to respond to updates and open the download page

## Next Step

Share your work → [Packaging & Publishing](./publish.md)
