---
title: 常见问题与排查
order: 25
---

# 常见问题与排查

## 加载失败

**症状**：UMM 列表里看不到你的 Mod，或显示加载失败。

**排查**：

1. `Info.json` 的 `AssemblyName` 是否等于实际 DLL 文件名
2. `EntryMethod` 是否为 `命名空间.类.Load`
3. DLL 是否真的复制到了 `Mods/MyFirstMod/` 目录
4. `Load` 是否返回 `true`
5. 查看 UMM 日志中的错误信息

## 补丁不生效

**症状**：写好了 Harmony 补丁，但游戏行为没变化。

**排查**（详见 [补丁生命周期](./harmony-lifecycle.md)）：

1. 类必须是 `public static class` 且带 `[HarmonyPatch]`
2. `PatchAll` 是否在 `OnToggle(true)` 中被调用
3. 目标方法名 / 类名 / 参数类型是否完全匹配（注意重载）
4. 用 `GetPatchInfo` 检查补丁是否真的应用了
5. 是否在 Mod 启用前目标方法已经被调用过

## NullReferenceException

**症状**：日志中出现 `NullReferenceException`。

**排查**：

1. 是否在 `OnToggle` 之前就访问了 `Settings`
2. `__instance` 是否可能为 null（静态方法或空引用）
3. 反编译确认目标方法实际的字段 / 属性名

## Transpiler 崩溃或行为异常

**症状**：应用 Transpiler 后游戏崩溃，或行为变得诡异。

**排查**（详见 [Transpiler 实战](./harmony-transpiler-practice.md)）：

1. 用 dnSpy 查看目标方法的真实 IL，确认匹配的指令序列存在
2. 匹配失败时降级处理（`IsValid` 检查），不要直接抛异常
3. 先加日志输出指令序列，逐个核对

## 设置没保存

**症状**：重启游戏后设置恢复默认。

**排查**：

1. `OnSaveGUI` 是否绑定到 `Settings.OnSaveGUI`
2. `Settings.Save` 是否被调用
3. 属性类型是否为 UMM 支持的类型

## CI 构建失败

**症状**：GitHub Actions 报错找不到 DLL。

**排查**（详见 [GitHub Actions 自动构建](./github-actions.md)）：

1. 私有 lib 仓库目录结构是否与 `HintPath` 一致
2. `LIBS_PAT` Secret 是否创建、拼写是否一致
3. PAT 是否有 `Contents: Read` 权限
4. 本地路径的 `Condition` 是否会在 CI 中被覆盖

## 游戏闪退

**症状**：启用 Mod 后游戏直接崩溃。

**排查**：

1. 查看 `Player.log` 最后的异常堆栈
2. 禁用所有 Mod 逐个启用，二分定位
3. 如果指向你的补丁，用 `Finalizer` 捕获异常避免直接崩溃
4. 确认没有把游戏二进制带进构建产物（这会造成加载冲突）

## 你学到了什么

- 常见问题的一线排查思路
- 每个问题对应的详细章节位置

## 系列完结 🎉

你已经走完了 ADOFAI Mod 开发的完整流程。接下来可以：

- 探索[库文档](../../libs/)，用代码处理关卡文件
- 体验[在线工具](../../mods/online-tools/)，或为[使用指南](../../mods/)补充你的 Mod 教程