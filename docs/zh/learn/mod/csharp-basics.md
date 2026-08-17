---
title: C# 基础速成
order: 0
---

# C# 基础速成

> **本章是为完全没学过 C#（甚至零编程基础）的读者准备的。** 如果你对 C# 已经比较熟悉，可以直接跳过，从[从这里开始](./index.md)进入正题。

C#（读作 "C Sharp"）是一门**面向对象**的编程语言，由微软开发，主要用于 .NET 平台和 Unity 游戏引擎。ADOFAI 本身就是用 C# 写的 Unity 游戏，所以**所有 Mod 代码也都是 C#**。

别被"编程语言"四个字吓到——Mod 开发 80% 是照着模板改，20% 才需要自己写。本章的目标是让你**看懂模板代码、知道改哪里、理解为什么那样改**。

我们会按以下顺序学习，每节都配 ADOFAI Mod 的实际场景：

1. 程序的基本结构
2. 变量与类型
3. 运算符与表达式
4. 控制流
5. 方法（函数）
6. 类与对象
7. 集合（Collection）
8. `static` 关键字
9. 泛型（Generic）
10. 继承与接口
11. 特性（Attribute）
12. 反射（Reflection）
13. 空值 `null` 与可空类型
14. 异常处理 `try/catch`
15. 委托与事件
16. 命名约定与编码风格

---

## 1. 程序的基本结构

一个 C# 程序由三个核心概念组成：**命名空间**（namespace）、**类**（class）和**方法**（method）。你可以把它们类比为：文件夹 → 文件 → 文件内容。

```csharp
using System;              // 引入系统库，这样能用 Console、Math 等

namespace MyFirstMod       // 命名空间：给代码分组，类似文件夹
{
    public static class Main   // 类：一段代码的容器
    {
        public static void SayHello()   // 方法：可执行的代码块
        {
            Console.WriteLine("Hello");  // 在控制台输出一行文字
        }
    }
}
```

逐行解释：

- **`using System;`** —— 告诉编译器"我要用 System 这个库"。没有这行，`Console` 就找不到。相当于你安装了一个工具包，`using` 就是把工具拿出来放在手边。
- **`namespace MyFirstMod`** —— 把代码归类到 `MyFirstMod` 这个"文件夹"下。一个命名空间里可以有多个类。
- **`class Main`** —— 类是代码的容器，所有方法都写在类里面。
- **`void SayHello()`** —— 方法，一段可以执行的操作。`void` 表示"不返回任何值"。
- **`Console.WriteLine("Hello")`** —— 调用系统方法，在控制台打印一行文字。

### 关于"项目"

实际开发中，代码不止一个文件。一个 **项目**（Project）包含多个 `.cs` 文件，由一个 `.csproj` 文件管理：

```xml
<!-- MyFirstMod.csproj —— 项目文件 -->
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net481</TargetFramework>   <!-- 目标框架：.NET Framework 4.8.1 -->
  </PropertyGroup>
</Project>
```

`TargetFramework` 决定了你的 Mod 能用哪些库——ADOFAI 用的是 .NET Framework 4.8.1，所以 Mod 也必须用这个版本。模板项目已经帮你配好了，不用操心。

### 入口方法

UMM 启动 Mod 时，会调用一个特定路径的方法：**命名空间.类名.方法名**。

```csharp
// UMM 找到这个方法并调用它
namespace MyFirstMod
{
    public static class Main
    {
        // 路径：MyFirstMod.Main.Load —— UMM 靠这个名字找到入口
        public static void Load() { /* ... */ }
    }
}
```

> 记住这个「命名空间.类名.方法名」的结构，后面每篇教程都会用到。

### 更简洁的写法（C# 10+）

如果你用的是 C# 10 及以上的编译器，命名空间可以直接写在一行，不用花括号包起来：

```csharp
using System;

namespace MyFirstMod;    // 文件级命名空间：整个文件都属于它

public static class Main
{
    public static void SayHello()
    {
        Console.WriteLine("Hello");
    }
}
```

两种写法**完全等价**，只是第二种少一层缩进。**注意：文件级命名空间写法下，一个文件只能声明一个命名空间**，且必须放在所有 `using` 之后。

> 本系列的模板项目默认开启了最新 C# 语法（`<LangVersion>latest</LangVersion>`），两种写法都能用。你只需要能**看懂**这两种写法。

---

## 2. 变量与类型

变量就像一个**有名字的盒子**，里面可以放数据。每个盒子都有**类型**——决定了能放什么、能做什么。

### 基本类型

```csharp
int count = 10;              // 整数（没有小数点）
float speed = 1.5f;         // 小数（注意后面的 f）
double precision = 3.14159;  // 更精确的小数（不需要后缀）
bool enabled = true;         // 布尔：只有 true 或 false
string name = "ADOFAI";     // 字符串（文本）
char letter = 'A';           // 单个字符（用单引号）
```

`float` 和 `double` 都是小数，区别是精度：`float` 约 7 位有效数字，`double` 约 15 位。Mod 里常用的速度、坐标等用 `float` 就够了。

### `var` —— 让编译器猜类型

```csharp
var count = 10;          // 编译器知道这是 int
var name = "ADOFAI";      // 编译器知道这是 string
var speed = 1.5f;        // 编译器知道这是 float
```

`var` 不是"无类型"，编译器会根据右边的值**自动推断**类型。写起来更方便，但结果完全一样。

> **什么时候用 `var`？** 局部变量（方法内的）推荐用 `var`，简洁；类的字段（类里定义的变量）建议写明类型，方便阅读。

### `const` —— 不会变的值

```csharp
const string ModName = "MyFirstMod";    // 常量：一旦定义就不能修改
const int MaxRetry = 3;

// ModName = "Other";  // 编译错误！常量不能重新赋值
```

`const` 的值在编译时就确定了，运行时不能改。适合放 Mod 名称、版本号等永不变化的值。

### 类型转换

不同类型之间有时需要转换：

```csharp
// 隐式转换：小类型自动变大类型（不会丢数据）
int score = 100;
double exact = score;         // int → double，自动

// 显式转换：大类型转小类型（可能丢数据，必须手动）
double pi = 3.14;
int approx = (int)pi;          // 结果是 3，小数部分被截断（不是四舍五入！）

// 用 Convert 类做安全转换（推荐）
string input = "42";
int number = Convert.ToInt32(input);     // 字符串 → int
float value = Convert.ToSingle("1.5");  // 字符串 → float
```

> Harmony 补丁中经常需要把 `object` 类型的参数转换成具体类型（比如 `(float)args[0]`），这就是显式转换。

### 字符串操作

字符串在 Mod 里无处不在（读取配置、拼接日志、格式化输出）：

```csharp
string a = "A Dance of";
string b = "Fire and Ice";

// 拼接
string full = a + " " + b;                     // "A Dance of Fire and Ice"
string full2 = $"{a} {b}";                     // 同上，用字符串插值

// 常用方法
full.Length;               // 字符串长度
full.Contains("Fire");     // 是否包含某个子串 → true
full.StartsWith("A");      // 是否以某个文本开头 → true
full.Substring(2, 4);      // 从第 2 个字符开始取 4 个字符 → "Danc"
full.Replace("Ice", "Snow"); // 替换 → "A Dance of Fire and Snow"
full.Split(' ');           // 按空格拆成数组 → ["A", "Dance", "of", "Fire", "and", "Ice"]
string.Join(", ", full.Split(' '));  // 用逗号拼接数组 → "A, Dance, of, Fire, and, Ice"
```

> **字符串插值** `$"{name} 在游玩"` 在 Mod 日志里用得最多：`Logger.Log($"当前速度: {speed}")` 可以把变量值嵌入到文本中。

---

## 3. 运算符与表达式

运算符是对变量做操作用的符号。C# 提供了丰富的运算符，按类别介绍。

### 算术运算符

```csharp
int a = 10, b = 3;

a + b;    // 加 → 13
a - b;    // 减 → 7
a * b;    // 乘 → 30
a / b;    // 除 → 3（整数除法，小数被截断！）
a % b;    // 取余（模） → 1（10 = 3×3 + 1）
```

> **整数除法的陷阱：** `10 / 3` 的结果是 `3`，不是 `3.33`。如果想要小数结果，至少有一个操作数要是浮点数：`10.0 / 3` → `3.333...`。这个坑在计算精度、速度等场景特别容易踩。

### 比较运算符

比较的结果是 `bool`（`true` 或 `false`）：

```csharp
10 > 3;      // 大于 → true
10 < 3;      // 小于 → false
10 >= 10;    // 大于等于 → true
10 <= 3;     // 小于等于 → false
10 == 10;    // 等于 → true（注意是 == 不是 =）
10 != 3;     // 不等于 → true
```

> **`=` vs `==`**：`=` 是赋值（`x = 5`），`==` 是比较（`x == 5`）。写混了是新手最常见的 bug 之一。

### 逻辑运算符

把多个条件组合起来：

```csharp
bool isPlaying = true;
bool isPaused = false;

// && (与)：两个都 true 才 true
isPlaying && !isPaused;     // true && true → true

// || (或)：至少一个 true 就 true
isPlaying || isPaused;       // true || false → true

// ! (非)：取反
!isPaused;                   // false 取反 → true
```

实际用法示例（在 Mod 里判断条件）：

```csharp
// 同时满足两个条件
if (health > 0 && isAlive) { /* ... */ }

// 满足任意一个条件
if (speed > 10f || isBoosting) { /* ... */ }

// 条件不满足时执行
if (!isModEnabled) { /* ... */ }
```

### 三元运算符

简化版的 `if/else`，适合只有两个分支的简单场景：

```csharp
// 语法：条件 ? 值A : 值B
string status = isAlive ? "存活" : "已死亡";

// 等价于：
string status;
if (isAlive) status = "存活";
else status = "已死亡";
```

> Mod 里经常用来设置默认值：`_handler ??= new MelonHandler();`（类似思路，null 合并运算符在[第 13 节](#13-空值-null-与可空类型)讲）。

---

## 4. 控制流

程序默认从上到下一行行执行。**控制流**让你决定"在什么条件下走哪条路"和"重复执行多少次"。

### `if / else` —— 条件判断

```csharp
int health = 75;

if (health > 100)
{
    // health 大于 100 时执行
    Logger.Log("满血");
}
else if (health > 50)
{
    // health 在 51~100 之间时执行
    Logger.Log("状态良好");
}
else
{
    // health <= 50 时执行
    Logger.Log("血量低！");
}
```

条件只执行**第一个匹配的分支**。如果 `health` 是 75，只有第二个分支会运行。

> Mod 里几乎每个 Prefix 补丁都用到 `if` —— 比如判断 Mod 是否开启、参数是否在范围内：

```csharp
public static void Prefix(ref float speed)
{
    if (MyMod.Settings.SpeedMultiplier > 0)   // 设置了加速倍率
    {
        speed *= MyMod.Settings.SpeedMultiplier;
    }
}
```

### `switch` —— 多分支选择

当有多个固定值需要判断时，`switch` 比 `if/else` 更清晰：

```csharp
string difficulty = "Hard";

switch (difficulty)
{
    case "Easy":
        Logger.Log("简单模式");
        break;
    case "Normal":
        Logger.Log("普通模式");
        break;
    case "Hard":
        Logger.Log("困难模式");
        break;
    default:
        Logger.Log("未知难度");
        break;
}
```

每个 `case` 末尾必须有 `break`（或 `return`），否则编译器会报错。`default` 是"以上都不匹配时"的兜底。

### `for` —— 循环固定次数

```csharp
// 从 0 数到 9（共 10 次）
for (int i = 0; i < 10; i++)
{
    Logger.Log($"第 {i} 次");
}
```

`for` 括号里有三部分：`初始化`（`int i = 0`）；`条件`（`i < 10`，满足就继续）；`更新`（`i++`，每次循环后执行）。

> **ADOFAI 场景：** 遍历一关的所有 tile 做批量修改：

```csharp
// 假设 tiles 是一个数组，存储所有 tile 的数据
for (int i = 0; i < tiles.Count; i++)
{
    tiles[i].speed = 1.5f;   // 把所有 tile 的速度改为 1.5
}
```

### `foreach` —— 遍历集合

不需要索引时，`foreach` 比 `for` 更简洁：

```csharp
var mods = new List<string> { "Iridium", "Iris", "Sarcary" };

foreach (var modName in mods)
{
    Logger.Log($"已加载: {modName}");
}
```

> Mod 里用 `foreach` 的频率非常高——遍历场景中的所有对象、遍历配置列表等。

### `while` —— 条件循环

只要条件为 `true` 就一直循环：

```csharp
int retry = 0;
while (retry < 3)
{
    // 尝试加载资源
    retry++;
}
```

> **小心死循环：** 如果条件永远不变成 `false`，程序会卡住。`while` 在 Mod 里用得比 `for`/`foreach` 少，但偶尔用于等待某个状态。

### `break` 和 `continue`

- **`break`** —— 立刻跳出整个循环
- **`continue`** —— 跳过本次循环，进入下一次

```csharp
foreach (var tile in tiles)
{
    if (tile.isMidspin) continue;   // 跳过 midspin，不处理
    if (tile.isEnd) break;          // 遇到结尾就停止
    tile.speed = 1.5f;
}
```

---

## 5. 方法（函数）

方法（也叫函数）是一段**有名字、可重复调用的代码块**。它接收输入（参数），处理后返回结果。

### 基本形式

```csharp
// 返回 int，接收两个 int 参数
public static int Add(int a, int b)
{
    return a + b;      // return 把值返回给调用者
}

// 调用
int result = Add(1, 2);   // result = 3
```

### 不返回值的方法

```csharp
public static void LogMessage(string text)
{
    Console.WriteLine(text);
    // 没有 return（void 表示不需要返回值）
}

// 调用
LogMessage("Mod 已加载");
```

### 引用参数 `ref`

`ref` 允许方法**直接修改传入的变量**，而不是操作一份拷贝：

```csharp
public static void Double(ref int x)
{
    x = x * 2;   // 修改的是外面那个变量本身
}

int v = 5;
Double(ref v);     // 调用后 v 变成 10（不是返回值，而是直接改了 v）
```

**为什么 `ref` 在 Mod 里无处不在？** Harmony 的 Postfix 补丁需要修改方法的返回值，就是用 `ref`：

```csharp
// ref __result：修改原方法的返回值
public static void Postfix(ref float __result)
{
    __result *= 2f;   // 直接改掉游戏的计算结果
}
```

> `ref` 是 Harmony 补丁的核心机制之一（见 [魔法参数详解](./harmony-magic-params.md)）。

### `out` 参数

`out` 和 `ref` 类似，但表示"这个参数是方法的**输出**"：

```csharp
// out 表示 number 是由 TryParse 输出的
bool success = int.TryParse("42", out int number);
// success = true, number = 42

bool fail = int.TryParse("abc", out int notNumber);
// fail = true, notNumber = 0（解析失败时为默认值）
```

`TryParse` 是安全解析字符串的方法——解析失败不会抛异常，而是返回 `false`。Mod 里经常用它来读取配置：

```csharp
if (float.TryParse(configText, out float speed))
{
    // 解析成功，使用 speed
}
else
{
    // 解析失败，用默认值
    speed = 1.0f;
}
```

### 方法重载（Overload）

同名方法可以有**不同的参数列表**，编译器根据你传的参数自动选择：

```csharp
public static void Log(string message)
{
    Console.WriteLine(message);
}

public static void Log(string message, string tag)    // 多一个参数
{
    Console.WriteLine($"[{tag}] {message}");
}

// 调用
Log("hello");               // 调用第一个
Log("hello", "MyMod");      // 调用第二个
```

### 可选参数与命名参数

```csharp
public static void CreatePlayer(string name, float speed = 1f)
{
    // speed 有默认值 1f，调用时可以不传
}

CreatePlayer("Alice");           // speed 使用默认值 1f
CreatePlayer("Bob", 2.5f);       // speed 使用传入的 2.5f
CreatePlayer(name: "Charlie", speed: 3f);  // 命名参数：不按顺序也行
```

### `params` —— 可变数量参数

```csharp
public static void LogAll(params string[] messages)
{
    foreach (var msg in messages)
    {
        Console.WriteLine(msg);
    }
}

LogAll("消息1", "消息2", "消息3");   // 传多少个都行
```

---

## 6. 类与对象

**类**（Class）是对象的蓝图，**对象**（Object）是根据蓝图创建出来的实例。打个比方：类是"汽车的设计图"，对象是"根据图纸造出来的那辆具体的汽车"。

### 字段与方法

```csharp
public class Player
{
    // 字段（类里的变量）
    public string name;
    public float speed = 1f;          // 可以有默认值
    public int health = 100;

    // 方法（类里的函数）
    public void Play()
    {
        Console.WriteLine($"{name} 开始游玩，速度 {speed}");
    }

    public void TakeDamage(int amount)
    {
        health -= amount;
        Console.WriteLine($"{name} 受到 {amount} 伤害，剩余 {health}");
    }
}
```

### 创建对象

```csharp
// new 关键字创建实例
var player = new Player();
player.name = "Alice";
player.speed = 2f;
player.Play();          // 输出：Alice 开始游玩，速度 2
player.TakeDamage(30);  // 输出：Alice 受到 30伤害，剩余 70
```

每个 `new Player()` 都是一个**独立的**对象，互不影响：

```csharp
var p1 = new Player();
var p2 = new Player();
p1.name = "Alice";
p2.name = "Bob";
p1.TakeDamage(10);     // 只有 Alice 掉血
```

### 创建实例的简写（C# 9+）

如果你用的是 C# 9 及以上的编译器，`new` 的类型可以从**左侧的声明**推断出来：

```csharp
var player = new Player();        // 常见写法：类型写在右边
Player player2 = new();           // C# 9 简写：类型在左边，new() 自动推断
```

> 简写 `new()` 里的类型 = 声明变量时写的类型。赋值给字段、传参时也适用（`settings.Sensitivity = new()`）。模板项目两种写法都能用，看懂即可。

### 构造函数

构造函数在 `new` 创建对象时**自动调用**，用来做初始化：

```csharp
public class Player
{
    public string name;
    public float speed;

    // 构造函数：名字和类名相同，没有返回类型
    public Player(string name, float speed = 1f)
    {
        this.name = name;     // this 表示"当前对象"
        this.speed = speed;
    }
}

// 创建对象时直接传初始值
var player = new Player("Alice", 2f);
```

`this` 关键字表示"当前这个对象自身"。当方法的参数和字段同名时，用 `this` 区分：`this.name`（字段）vs `name`（参数）。

### 访问修饰符

访问修饰符控制"谁能访问"：

```csharp
public class Player
{
    public string name;          // public：谁都能访问
    private int health = 100;     // private：只有本类内部能访问
    protected float speed;       // protected：本类和子类能访问
}
```

| 修饰符 | 谁能访问 | 用途 |
|--------|---------|------|
| `public` | 任何人 | 对外开放的接口 |
| `private` | 仅本类 | 内部实现细节，不想被外部改 |
| `protected` | 本类 + 子类 | 给继承的子类用 |

> Mod 里的模板类中，`public` 最常见（因为 Harmony 需要访问补丁方法），`private` 用于不想暴露的内部状态。

### 属性（Property）

属性像字段，但可以加**访问控制**和**逻辑**：

```csharp
public class Settings
{
    public bool EnableFeature { get; set; } = true;   // 读写都开放，默认值 true
    public float SpeedMultiplier { get; set; } = 1f;

    // 只读属性（只有 get，没有 set）
    public string ModName { get; } = "MyMod";

    // 带逻辑的属性
    private float _volume = 50f;
    public float Volume
    {
        get => _volume;           // 读取时返回内部值
        set => _volume = Math.Clamp(value, 0f, 100f);  // 设置时限制在 0~100
    }
}
```

`{ get; set; }` 是属性的"访问器"——`get` 控制读取，`set` 控制赋值。UMM 的设置类就是这么写的（见[设置系统](./settings.md)）。

---

## 7. 集合（Collection）

单个变量只能存一个值。**集合**可以存一组数据——这是 Mod 开发中最常用的数据结构之一。

### 数组（Array）

数组是最基础的集合，创建后**长度固定**：

```csharp
// 声明并初始化
int[] scores = { 95, 87, 72, 100, 88 };

// 也可以这样写
int[] scores2 = new int[5];      // 创建长度为 5 的数组，默认值都是 0

// 通过索引访问（从 0 开始）
scores[0];     // → 95（第一个元素）
scores[4];     // → 88（最后一个元素）
scores.Length; // → 5（数组长度）
```

### `List<T>` —— 动态列表

`List` 的长度**可以随时增减**，比数组灵活得多：

```csharp
var names = new List<string>();   // 创建一个空的字符串列表

// 添加元素
names.Add("Alice");
names.Add("Bob");
names.Add("Charlie");

// 删除元素
names.Remove("Bob");          // 按值删除
names.RemoveAt(0);            // 按索引删除

// 常用操作
names.Count;                  // 元素数量 → 2
names.Contains("Alice");      // 是否包含 → true
names[0];                     // 按索引访问 → "Charlie"（Bob 被删了，Alice 变成第一个）
names.Clear();                // 清空所有元素
```

> Mod 里经常用 `List` 来收集游戏对象。比如：遍历场景里所有的 tile，把符合条件的放进列表，再统一修改。

### `Dictionary<TKey, TValue>` —— 键值对

`Dictionary` 用一个**键**（Key）查找对应的**值**（Value），就像字典用"词条"找"释义"：

```csharp
var config = new Dictionary<string, float>
{
    ["SpeedMultiplier"] = 1.5f,
    ["Volume"] = 80f,
    ["Threshold"] = 0.1f
};

// 读取
config["SpeedMultiplier"];       // → 1.5f

// 修改
config["SpeedMultiplier"] = 2.0f;

// 安全读取（键不存在时不会报错）
if (config.TryGetValue("SpeedMultiplier", out float speed))
{
    Logger.Log($"速度倍率: {speed}");
}

// 检查是否存在
config.ContainsKey("Volume");    // → true

// 遍历
foreach (var pair in config)
{
    Logger.Log($"键: {pair.Key}, 值: {pair.Value}");
}
```

> `Dictionary` 在读取 Mod 配置、存储 tile 事件数据等场景用得很多。模板的设置系统底层就是键值对。

### `HashSet<T>` —— 不重复的集合

`HashSet` 保证元素**不重复**，适合用来做"去重"或"快速判断是否包含"：

```csharp
var tags = new HashSet<string> { "mod", "visual", "effect" };
tags.Add("mod");         // 已经有了，不会重复添加
tags.Count;               // → 3
tags.Contains("visual");  // → true，速度比 List 快
```

---

## 8. `static` 关键字

`static` 表示"属于类本身"，不需要创建实例就能用。打个比方：`static` 就像"全公司的公告栏"，所有人都能看到，不需要自己有一份。

```csharp
public static class MathHelper
{
    // static 方法：直接通过类名调用
    public static int Square(int x) => x * x;
    public static float Clamp(float value, float min, float max)
    {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
}

// 调用：不需要 new MathHelper()
MathHelper.Square(3);      // → 9
MathHelper.Clamp(15f, 0f, 10f);  // → 10
```

`static` 也可以用于字段——所有实例共享同一个值：

```csharp
public class GameInfo
{
    public static int TotalMods = 0;   // 所有对象共享这一个变量

    public GameInfo()
    {
        TotalMods++;   // 每创建一个对象，计数器 +1
    }
}
```

> UMM 的 `Main` 类、Harmony 的补丁类都是 `static` 的。`Load` 是静态方法，UMM 不需要 `new Main()` 就能调用它。整个 Mod 只需要一份 `Main`，所以用 `static`。

---

## 9. 泛型（Generic）

泛型用尖括号 `<>` 表示"**任何类型都能用**的模板"。你写一份代码，它可以处理 `int`、`string`、`float`……任何类型。

```csharp
// List<T> 里的 T 是占位符
var numbers = new List<int>();       // T = int
numbers.Add(1);

var names = new List<string>();      // T = string
names.Add("Alice");

// Dictionary<TKey, TValue> 有两个泛型参数
var map = new Dictionary<string, int>();  // TKey=string, TValue=int
map["score"] = 100;
```

你也可以自己定义泛型方法：

```csharp
// T 可以是任何类型
public static T GetDefault<T>()
{
    return default(T);   // default 返回该类型的默认值（数字是 0，引用类型是 null）
}

GetDefault<int>();       // → 0
GetDefault<string>();    // → null
GetDefault<bool>();      // → false
```

> Harmony 的 Transpiler 返回 `IEnumerable<CodeInstruction>` 就是"一堆 `CodeInstruction` 的序列"——`CodeInstruction` 是 IL 指令的类型，`IEnumerable` 表示"可以逐个遍历"（见 [Transpiler 入门](./harmony-transpiler.md)）。

---

## 10. 继承与接口

### 继承（Inheritance）

一个类可以**继承**另一个类，获得它的所有字段和方法，还能扩展或覆盖：

```csharp
// 基类（父类）
public class ModBase
{
    public string Name { get; set; }
    public bool IsEnabled { get; set; }

    public virtual void OnToggle(bool value)   // virtual：允许子类覆盖
    {
        IsEnabled = value;
    }
}

// 派生类（子类）
public class SpeedMod : ModBase      // 冒号表示继承
{
    public float SpeedMultiplier { get; set; } = 1f;

    // override：覆盖父类的方法
    public override void OnToggle(bool value)
    {
        base.OnToggle(value);            // 先调用父类的逻辑
        if (value) SpeedMultiplier = 1f; // 子类自己的逻辑
    }
}
```

- `virtual` 标记的方法可以被子类 `override`（覆盖）
- `base.OnToggle()` 调用父类的原始实现
- 子类自动拥有父类的 `Name`、`IsEnabled` 属性

> ADOFAI Mod 模板中，加载器适配器继承不同的基类：`BaseUnityPlugin`（BepInEx）、`MelonMod`（MelonLoader）。`IHandler` 接口则是下一节的内容。

### 接口（Interface）

接口定义了"**必须有什么功能**"，但不关心"怎么实现"：

```csharp
// 接口：定义规范
public interface IHandler
{
    void Log(string message);          // 记录日志
    string ModPath { get; }            // Mod 所在路径
    bool IsEnabled { get; set; }       // 是否启用
}

// 实现接口：UmmHandler 按自己的方式满足规范
public class UmmHandler : IHandler
{
    private UnityModManager.ModEntry _entry;

    public UmmHandler(UnityModManager.ModEntry entry)
    {
        _entry = entry;
    }

    public void Log(string message)
    {
        _entry.Logger.Log(message);    // 用 UMM 的日志系统
    }

    public string ModPath => _entry.Path;

    public bool IsEnabled { get; set; }
}

// 实现接口：MelonHandler 按自己的方式满足规范
public class MelonHandler : IHandler
{
    public void Log(string message)
    {
        MelonLogger.Msg(message);      // 用 MelonLoader 的日志系统
    }

    public string ModPath => Environment.CurrentDirectory;
    public bool IsEnabled { get; set; }
}
```

一个类可以实现**多个接口**，但只能继承**一个基类**。

> 多加载器模板的核心就是 `IHandler` 接口：core 代码只认识 `IHandler`，不知道自己跑在哪个加载器上。详见[进阶：多加载器模板](./multiloader.md)。

---

## 11. 特性（Attribute）

特性用 `[方括号]` 给代码**打标记**，框架读取这些标记来决定做什么。你可以把它想象成给代码贴"标签"。

```csharp
[HarmonyPatch(typeof(Player), nameof(Player.Play))]   // 告诉 Harmony：这是补丁，目标是 Player.Play
public static class Play_Prefix
{
    public static void Prefix() { /* ... */ }
}
```

常见的内置特性：

```csharp
[Obsolete("请用 NewMethod 代替")]     // 标记为已弃用，编译器会警告
public void OldMethod() { /* ... */ }

[Serializable]                        // 标记为可序列化（能保存到文件）
public class SaveData { /* ... */ }
```

自定义特性也很简单（但 Mod 开发中一般不需要自己写，用框架提供的就够）：

```csharp
// 定义特性
[AttributeUsage(AttributeTargets.Class)]
public class ModInfoAttribute : Attribute
{
    public string Name { get; }
    public ModInfoAttribute(string name) { Name = name; }
}

// 使用特性
[ModInfo("我的第一个 Mod")]
public class MyMod { /* ... */ }
```

你不需要会写特性，只需**会用**——照着模板抄 `[HarmonyPatch(...)]` 即可（见 [HarmonyPatch 详解](./harmony-attributes.md)）。

---

## 12. 反射（Reflection）

反射是"**用代码查看代码**"——在程序运行时，读取类、方法、字段的信息，甚至动态调用它们。

```csharp
// typeof：获取类型信息
Type playerType = typeof(Player);

// GetType：从实例获取类型
var obj = new Player();
Type type = obj.GetType();

// 获取方法信息
var method = AccessTools.Method(typeof(Player), nameof(Player.Play));
// AccessTools 是 Harmony 提供的反射工具，比原生反射更方便

// 动态调用方法
method.Invoke(obj, null);    // 调用 obj 的 Play 方法
```

> 不理解细节没关系，只要知道：**游戏里的方法名、类名以字符串形式存在**，Harmony 靠反射找到它们并注入补丁。Mod 开发中你不需要手写反射代码，Harmony 的 `AccessTools` 帮你处理了（见[定位目标方法](./finding-methods.md)）。

---

## 13. 空值 `null` 与可空类型

`null` 表示"什么都没有"——变量没有指向任何对象。

```csharp
string name = null;     // name 不指向任何字符串

// 访问 null 的成员会崩溃！
// name.Length;         // → NullReferenceException（最经典的报错）
```

### `?` —— 可空类型

值类型（`int`、`float`、`bool`）默认不能为 `null`。加 `?` 后就允许为 `null`：

```csharp
int? maybeNull = null;         // 可空整数
float? speed = null;           // 可空浮点数

// 使用前要检查
if (speed.HasValue)
{
    float value = speed.Value;     // 取出实际值
}
```

> Mod 里最常见的可空类型是 `Harmony?` 和 `UnityModManager.ModEntry?`——它们可能为 `null`（Mod 未加载时）。

### 安全操作符

C# 提供了几种安全的写法来避免 `NullReferenceException`：

```csharp
// ?. —— null 条件运算符：如果左边是 null，整个表达式返回 null（不崩溃）
string? upper = name?.ToUpper();        // name 为 null 时，upper 也是 null

// ?? —— null 合并运算符：如果左边是 null，用右边的值代替
string result = name ?? "默认名字";     // name 为 null 时用 "默认名字"

// is not null —— 模式匹配判断
if (name is not null)
{
    Logger.Log(name.Length);
}

// ?. 链式调用（常见于 Unity）
player?.GetComponent<Rigidbody>()?.AddForce(Vector3.up);
// 任何一个环节为 null 都安全返回 null，不会崩溃
```

> 排查 `NullReferenceException` 是每个 Mod 开发者的日常。90% 的情况是忘了判空。见[常见问题](./troubleshooting.md)。

---

## 14. 异常处理 `try/catch`

程序运行中出错（除以零、文件不存在、类型不对……）会**抛出异常**（Exception）。如果不处理，程序会崩溃。`try/catch` 让你能优雅地处理错误。

### 基本形式

```csharp
try
{
    int.Parse("not a number");   // 这行会抛出 FormatException
}
catch (Exception ex)
{
    Logger.Log($"出错了: {ex.Message}");
}
```

`try` 里的代码如果出错，立刻跳到 `catch` 块——程序不会崩溃，而是执行你写的错误处理逻辑。

### 捕获特定异常

```csharp
try
{
    var content = File.ReadAllText("config.txt");
    int value = int.Parse(content);
}
catch (FileNotFoundException)
{
    Logger.Log("配置文件不存在，将使用默认设置");
}
catch (FormatException)
{
    Logger.Log("配置文件格式错误");
}
catch (Exception ex)   // 兜底：捕获所有其他异常
{
    Logger.Log($"未知错误: {ex.Message}");
}
```

> **先写具体的异常，再写通用的 `Exception`。** 顺序反了编译器会报错。

### `finally` —— 无论如何都执行

```csharp
FileStream? file = null;
try
{
    file = File.OpenRead("data.json");
    // 读取文件...
}
catch (Exception ex)
{
    Logger.Log($"读取失败: {ex.Message}");
}
finally
{
    file?.Dispose();   // 无论成功还是失败，都会执行（释放资源）
}
```

### `throw` —— 主动抛出异常

```csharp
public static void SetSpeed(float speed)
{
    if (speed < 0)
    {
        throw new ArgumentException("速度不能为负数");
    }
    // ...
}
```

> Harmony 的 [Finalizer 补丁](./harmony-finalizer.md) 本质上就是异常处理的思想——在目标方法抛异常时捕获它，防止游戏崩溃。

---

## 15. 委托与事件

### 委托（Delegate）

委托把"方法"当成**变量**传来传去——你可以把方法赋给一个变量、当作参数传递、存到列表里。

```csharp
// 定义委托类型（描述"什么样的方法可以赋给这个委托"）
public delegate bool ToggleHandler(bool value);

// 创建委托变量并赋值
ToggleHandler handler = OnToggle;
bool result = handler(true);    // 等价于调用 OnToggle(true)
```

### `Action` 和 `Func` —— 内置委托

C# 提供了两个通用委托类型，不需要自己定义：

```csharp
// Action：无返回值的方法
Action<string> logger = (msg) => Logger.Log(msg);
logger("Mod 已加载");

// Func：有返回值的方法（最后一个类型参数是返回值类型）
Func<int, int, int> add = (a, b) => a + b;
int result = add(1, 2);     // → 3
```

> `Action` 和 `Func` 在 Mod 模板中出现频率很高——`modEntry.OnToggle` 的类型就是 `Action<bool>`。

### Lambda 表达式

`=>`（读作 "goes to"）是 Lambda 语法的标志。它是一种**匿名方法**的简写：

```csharp
// 完整写法
Action<string> log = (string msg) => { Logger.Log(msg); };

// 类型可省略（编译器自动推断）
Action<string> log2 = (msg) => { Logger.Log(msg); };

// 只有一个参数时可以省略括号
Action<string> log3 = msg => Logger.Log(msg);

// 多行 Lambda
Func<int, bool> isPositive = n =>
{
    if (n > 0) return true;
    return false;
};
```

### 事件（Event）

事件是委托的"安全版"——它限制外部只能**订阅/取消订阅**，不能直接触发：

```csharp
public class EventBus
{
    // 定义事件
    public event Action<string> OnModLoaded;
    public event Action<string> OnModUnloaded;

    // 触发事件（只能在类内部触发）
    public void Load(string modName)
    {
        OnModLoaded?.Invoke(modName);   // ?.Invoke：如果没有订阅者就不调用
    }
}

// 使用
var bus = new EventBus();
bus.OnModLoaded += (name) => Logger.Log($"{name} 已加载");    // 订阅
bus.OnModUnloaded += (name) => Logger.Log($"{name} 已卸载");
bus.Load("MyMod");    // 触发 → 输出 "MyMod 已加载"
```

- `+=` 订阅事件
- `-=` 取消订阅
- 外部**不能**直接 `bus.OnModLoaded("test")`，只能类内部触发

> UMM 里 `modEntry.OnToggle = OnToggle` 就是把我们的方法**交给 UMM**，让 UMM 在合适时机调用它——本质上就是委托（见[最小实例](./first-mod.md)）。

---

## 16. 命名约定与编码风格

C# 社区有一套通用的命名规范。遵守它能让代码更易读，也更符合其他 Mod 的风格。

### 命名规则

| 场景 | 规范 | 示例 |
|------|------|------|
| 类名、方法名、属性、命名空间 | **PascalCase**（每个单词首字母大写） | `PlayerSpeed`、`OnToggle`、`Main` |
| 局部变量、方法参数 | **camelCase**（首字母小写，后续大写） | `speedMultiplier`、`modEntry` |
| 常量 | **PascalCase** | `MaxRetry`、`DefaultSpeed` |
| 私有字段 | **camelCase** 或 `_camelCase` | `_handler`、`speed` |
| 接口 | **I** + PascalCase | `IHandler`、`ISettingsProvider` |

```csharp
// 好的命名
public class PlayerController
{
    private float _moveSpeed = 5f;
    public int MaxHealth { get; set; }

    public void ApplyDamage(int damageAmount) { /* ... */ }
}

// 不好的命名
public class playercontroller
{
    private float ms;
    public int mh { get; set; }
    public void DoStuff(int d) { /* ... */ }
}
```

### 注释

```csharp
/// <summary>
/// 计算 ADOFAI 的速度倍率。
/// </summary>
/// <param name="baseSpeed">原始速度</param>
/// <param name="multiplier">倍率</param>
/// <returns>计算后的速度</returns>
public static float CalculateSpeed(float baseSpeed, float multiplier)
{
    return baseSpeed * multiplier;
}
```

`///` 是 XML 文档注释，IDE 会把它显示在悬浮提示中。普通注释用 `//`（单行）或 `/* ... */`（多行）。

> Mod 代码不需要每行都注释，但**关键逻辑**（为什么这样做、有什么副作用）应该加注释。模板项目的代码就有良好的注释习惯。

---

## 17. 你需要掌握的思维

如果你能看懂上面 16 节，恭喜——你已经有足够基础跟上本系列教程了。剩下的是**反复练习**：

- **读代码**：遇到不懂的语法先查，别被吓到。C# 的报错信息通常很明确
- **抄模板**：Mod 开发 80% 是照着模板改，不需要从头写
- **看报错**：把 `Player.log` 里的异常信息贴到搜索引擎，通常就有答案
- **善用 IDE**：Visual Studio / Rider 的代码补全、悬浮提示、快速操作能帮你省掉大量记忆
- **加断点调试**：在关键行设置断点，运行时程序会暂停，你可以逐行查看变量的值

## 你学到了什么

- C# 程序结构：`namespace` / `class` / `method`、`using` 的作用、`.csproj` 项目文件
- 变量与类型：`int`/`float`/`double`/`bool`/`string`/`char`、`var`、`const`、类型转换、字符串操作
- 运算符：算术、比较、逻辑、三元
- 控制流：`if/else`、`switch`、`for`、`foreach`、`while`、`break`/`continue`
- 方法：`ref`、`out`、重载、可选参数、`params`
- 类与对象：字段、方法、构造函数、`this`、访问修饰符、属性
- 集合：数组、`List<T>`、`Dictionary<K,V>`、`HashSet<T>`
- `static`、泛型、继承与接口（`IHandler` 的由来）
- 特性（Attribute）、反射（Reflection）
- `null`、`?.`、`??`、可空类型
- `try/catch/finally`、异常类型
- 委托、`Action`/`Func`、Lambda、事件
- 命名约定与编码风格
- **每一节都对应到后续教程的具体用法**

## 下一步

准备好了吗？进入正式的 Mod 开发 → [从这里开始](./index.md)
