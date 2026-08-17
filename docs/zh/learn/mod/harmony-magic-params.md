---
title: 魔法参数详解
order: 10
---

# 魔法参数详解

Harmony 补丁方法可以声明一些**特殊参数**（以双下划线开头），在调用时由 Harmony 自动注入。掌握它们是写补丁的基础。

## 参数一览

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `__instance` | 任何补丁 | 目标方法的当前对象实例（实例方法） |
| `__result` | Prefix / Postfix / Finalizer | 返回值 |
| `__state` | Prefix / Postfix / Finalizer | 跨补丁传值（Prefix→Postfix） |
| `__args` | 任何补丁 | 目标方法的全部参数（`object[]`） |
| `__originalMethod` | 任何补丁 | 原始 `MethodBase`（被补丁前的方法） |
| `___fieldName` | 任何补丁 | 读取目标类的字段（三个下划线） |

## `__instance`：当前实例

目标方法是**实例方法**时可用，类型可以是目标类或其基类：

```csharp
public static void Prefix(Player __instance)
{
    var speed = __instance.speed;
}
```

- 类型写成 `object` 也合法（需要时再转型）
- 静态方法 / 构造函数中为 `null`

## `__result`：返回值

- **Prefix**：初始为该类型的默认值（`0`、`null`、`false`）
- **Postfix / Finalizer**：目标方法执行后的实际返回值
- 想修改返回值必须写 `ref`：

```csharp
public static void Postfix(ref int __result)
{
    __result = Math.Abs(__result);
}
```

## `__state`：跨补丁传值

在 Prefix 中存值（必须 `ref`），在 Postfix / Finalizer 中读取：

```csharp
public static void Prefix(ref float __state)
{
    __state = Time.deltaTime;   // 记住方法执行前的时间
}

public static void Postfix(float __state)
{
    // __state 是执行前的值
}
```

- 类型在 Prefix / Postfix 中必须一致
- 只有 Postfix 时，`__state` 为类型默认值

## `__args`：所有参数

以 `object[]` 拿到目标方法的全部入参（只读视角）：

```csharp
public static void Prefix(object[] __args)
{
    foreach (var a in __args) MyMod.Logger.Log(a?.ToString() ?? "null");
}
```

> 想修改参数还是用「参数名 + `ref`」的方式更清晰（见 [Prefix 补丁](./harmony-prefix.md)）。

## `__originalMethod`：原始方法

在手动补丁或需要调用原方法时，可以拿到原始的 `MethodBase`：

```csharp
public static void Prefix(MethodBase __originalMethod)
{
    MyMod.Logger.Log($"正在调用 {__originalMethod.Name}");
}
```

## `___fieldName`：读取私有字段

三个下划线 + 字段名，可以读取目标类的**私有字段**：

```csharp
// 读取 Scoring 类的私有字段 _score
public static void Postfix(Scoring __instance)
{
    var score = __instance._score;    // 公有/内部字段
    var raw = __instance.___rawScore; // 私有字段：三个下划线
}
```

::: warning
字段名必须与反编译结果**完全一致**（区分大小写）。用 `___` 读字段本质是反射，频繁访问有性能开销，热路径慎用。
:::

## 组合使用

魔法参数可以任意组合：

```csharp
public static void Prefix(Player __instance, ref float __state, object[] __args)
{
    // ...
}
```

## 你学到了什么

- 六个魔法参数的用途
- `__result` 的修改方式（`ref`）
- `__state` 的跨补丁传值
- `___` 读取私有字段

## 下一步

深入 `[HarmonyPatch]` 特性的各种写法 → [HarmonyPatch 详解](./harmony-attributes.md)