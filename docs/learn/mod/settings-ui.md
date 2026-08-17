---
title: Drawing the Settings UI
order: 18
---

# Drawing the Settings UI

UMM's settings panel is drawn using Unity's **IMGUI** (Immediate Mode GUI). Add an `OnGUI` method to the Settings class.

## Basic Structure

```csharp
public void OnGUI(UnityModManager.ModEntry entry)
{
    GUILayout.BeginVertical();

    GUILayout.Label("Feature Toggle");
    EnableFeature = GUILayout.Toggle(EnableFeature, "Enable Feature");

    GUILayout.Label("Sensitivity");
    Sensitivity = GUILayout.HorizontalSlider(Sensitivity, 0f, 2f);

    if (GUILayout.Button("Save"))
    {
        Save(entry);
    }

    GUILayout.EndVertical();
}
```

> Key point: IMGUI redraws every frame, so **each call re-reads control values and writes them back to properties**.

## Common Controls Quick Reference

| Need | Code |
| --- | --- |
| Toggle | `GUILayout.Toggle(bool, string)` |
| Button | `GUILayout.Button(string)` |
| Text | `GUILayout.Label(string)` |
| Slider | `GUILayout.HorizontalSlider(float, min, max)` |
| Text input | `GUILayout.TextField(string)` |
| Multi-select | `GUILayout.Toolbar(int, string[])` |

## Grouping and Layout

Use `BeginHorizontal` / `EndHorizontal` to arrange controls in a row:

```csharp
GUILayout.BeginHorizontal();
GUILayout.Label("Difficulty");
Difficulty = GUILayout.Toolbar(Difficulty, new[] { "Easy", "Normal", "Hard" });
GUILayout.EndHorizontal();
```

Use `GUILayout.FlexibleSpace()` to auto-expand the layout. For more complex layouts, you can use `GUILayout.BeginScrollView` for scrollable areas.

## Settings UI Guidelines

1. **Don't forget a save button**, or at least write changes back to properties immediately
2. Use **bilingual text** for control labels (see [Development Guidelines](./guidelines.md) for localization advice)
3. Add hint text for sensitive options (e.g. those affecting performance)
4. Don't draw content wider than the UMM panel

## Save Timing

```csharp
if (GUILayout.Button("Save"))
{
    Save(entry);   // Write to disk immediately
}
```

You can also skip the save button and rely on UMM's `OnSaveGUI` to auto-save when exiting settings.

## Complete Example

```csharp
public void OnGUI(UnityModManager.ModEntry entry)
{
    GUILayout.BeginVertical();
    GUILayout.Space(10);

    EnableFeature = GUILayout.Toggle(EnableFeature, "Enable Feature");

    GUILayout.Label($"Sensitivity: {Sensitivity:F2}");
    Sensitivity = GUILayout.HorizontalSlider(Sensitivity, 0f, 2f);

    GUILayout.Space(10);
    if (GUILayout.Button("Save"))
    {
        Save(entry);
    }

    GUILayout.EndVertical();
}
```

## What You Learned

- IMGUI's drawing mechanism (redraws every frame)
- Common controls and layout
- Save timing and UI guidelines for the settings panel

## Next Step

Learn how to find the game methods to patch → [Finding Target Methods](./finding-methods.md)
