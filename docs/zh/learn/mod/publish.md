---
title: 打包与发布
order: 22
---

# 打包与发布

写完代码后，把你的 Mod 打包发布，让更多玩家用上它。发布前请先阅读[模组开发规范](./guidelines.md)。

## 1. 确认 Info.json

`Info.json` 是 UMM 读取的 Mod 信息文件，在[最小实例](./first-mod.md)中已经写好。发布前再次核对 `EntryMethod`、`AssemblyName`、`Version`。

## 2. 编译与部署

模板支持自动部署：编译后会把产物放到游戏目录的 Mods 文件夹，可以直接在游戏内测试。

手动部署时，把编译产物放到：

```
ADOFAI/Mods/MyFirstMod/
```

发布包应包含：

- `MyFirstMod.dll`（编译产物）
- `Info.json`
- 使用说明（README）
- 依赖的其它 DLL（如果有）

## 3. 发布到 GitHub Release

1. 把代码推送到你的 GitHub 仓库
2. 在仓库页面创建 **Release**
3. 上传编译好的 DLL 与使用说明

> 常见坑：玩家误下载「源码压缩包」导致无法加载。发布时务必把编译产物也上传到 Release。

## 4. 分享到 Mod 平台

也可以在组织的 Mod 平台 [modrift.org](https://modrift.org) 发布，让更多玩家发现你的作品。

## 5. 用 GitHub Actions 自动构建

手动编译、打包、上传 Release 很繁琐。可以用 GitHub Actions 在推送时自动完成，详见 [GitHub Actions 自动构建](./github-actions.md)。

## 你学到了什么

- 发布包应包含哪些文件
- 通过 GitHub Release 发布 Mod
- 自动构建的入口

## 系列完成 🎉

你已经走完了 ADOFAI Mod 开发的完整流程。接下来可以：

- 探索[库文档](../../libs/)，用代码处理关卡文件
- 体验[在线工具](../../mods/online-tools/)，或为[使用指南](../../mods/)补充你的 Mod 教程