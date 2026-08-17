---
title: 绘制设置界面
order: 18
---

# 绘制设置界面

UMM 的设置面板用 Unity 的 **IMGUI**（即时模式 GUI）绘制。在 Settings 类中添加 `OnGUI` 方法即可。

## 基本结构

```csharp
public void OnGUI(UnityModManager.ModEntry entry)
{
    GUILayout.BeginVertical();

    GUILayout.Label("功能开关");
    EnableFeature = GUILayout.Toggle(EnableFeature, "启用功能");

    GUILayout.Label("灵敏度");
    Sensitivity = GUILayout.HorizontalSlider(Sensitivity, 0f, 2f);

    if (GUILayout.Button("保存"))
    {
        Save(entry);
    }

    GUILayout.EndVertical();
}
```

> 关键点：IMGUI 每帧都会重新绘制，所以**每次调用都重新读取控件值并写回属性**。

## 常用控件速查

| 需求 | 代码 |
| --- | --- |
| 开关 | `GUILayout.Toggle(bool, string)` |
| 按钮 | `GUILayout.Button(string)` |
| 文本 | `GUILayout.Label(string)` |
| 滑动条 | `GUILayout.HorizontalSlider(float, min, max)` |
| 文本输入 | `GUILayout.TextField(string)` |
| 多选开关 | `GUILayout.Toolbar(int, string[])` |

## 分组与布局

用 `BeginHorizontal` / `EndHorizontal` 把控件排成一行：

```csharp
GUILayout.BeginHorizontal();
GUILayout.Label("难度");
Difficulty = GUILayout.Toolbar(Difficulty, new[] { "简单", "普通", "困难" });
GUILayout.EndHorizontal();
```

用 `GUILayout.FlexibleSpace()` 让布局自动撑开。更复杂的布局还可以用 `GUILayout.BeginScrollView` 做滚动区域。

## 设置界面规范

1. **不要忘记保存按钮**，或至少把改动即时写回属性
2. 控件文本用**中英双语**（可参考[模组开发规范](./guidelines.md)的本地化建议）
3. 敏感选项（如影响性能的）加提示文案
4. 不要绘制超出 UMM 面板宽度的内容

## 保存时机

```csharp
if (GUILayout.Button("保存"))
{
    Save(entry);   // 立即写盘
}
```

也可以不画保存按钮，依赖 UMM 的 `OnSaveGUI` 在退出设置时自动保存。

## 完整示例

```csharp
public void OnGUI(UnityModManager.ModEntry entry)
{
    GUILayout.BeginVertical();
    GUILayout.Space(10);

    EnableFeature = GUILayout.Toggle(EnableFeature, "Enable Feature / 启用功能");

    GUILayout.Label($"Sensitivity / 灵敏度: {Sensitivity:F2}");
    Sensitivity = GUILayout.HorizontalSlider(Sensitivity, 0f, 2f);

    GUILayout.Space(10);
    if (GUILayout.Button("Save / 保存"))
    {
        Save(entry);
    }

    GUILayout.EndVertical();
}
```

## 你学到了什么

- IMGUI 的绘制机制（每帧重绘）
- 常用控件与布局
- 设置界面的保存时机与规范

## 下一步

了解如何找到要修改的游戏方法 → [定位目标方法](./finding-methods.md)