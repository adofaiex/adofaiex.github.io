---
title: C# Basics Crash Course
order: 0
---

# C# Basics Crash Course

> **This chapter is for readers who have never learned C# (or have zero programming experience).** If you're already comfortable with C#, feel free to skip ahead and start from [Getting Started](./index.md).

C# (pronounced "C Sharp") is an **object-oriented** programming language developed by Microsoft, used mainly on the .NET platform and in the Unity game engine. ADOFAI itself is a Unity game written in C#, so **all Mod code is C# too**.

Don't be intimidated by the words "programming language" — 80% of Mod development is modifying a template; only 20% requires writing your own code. The goal of this chapter is to help you **read template code, know what to change, and understand why it's written that way**.

We'll learn in the following order, with each section tied to a real ADOFAI Mod scenario:

1. Basic program structure
2. Variables and types
3. Operators and expressions
4. Control flow
5. Methods (functions)
6. Classes and objects
7. Collections
8. The `static` keyword
9. Generics
10. Inheritance and interfaces
11. Attributes
12. Reflection
13. `null` and nullable types
14. Exception handling with `try/catch`
15. Delegates and events
16. Naming conventions and coding style

---

## 1. Basic Program Structure

A C# program consists of three core concepts: **namespaces**, **classes**, and **methods**. You can think of them as: folder → file → file contents.

```csharp
using System;              // Import the system library so we can use Console, Math, etc.

namespace MyFirstMod       // Namespace: groups code together, like a folder
{
    public static class Main   // Class: a container for code
    {
        public static void SayHello()   // Method: an executable block of code
        {
            Console.WriteLine("Hello");  // Print a line of text to the console
        }
    }
}
```

Line-by-line explanation:

- **`using System;`** — tells the compiler "I want to use the System library". Without this line, `Console` can't be found. Think of it as installing a toolbox: `using` takes the tools out and keeps them within reach.
- **`namespace MyFirstMod`** — puts the code under the "folder" `MyFirstMod`. A namespace can contain multiple classes.
- **`class Main`** — a class is a container for code; all methods are written inside a class.
- **`void SayHello()`** — a method, a unit of work that can be executed. `void` means "returns no value".
- **`Console.WriteLine("Hello")`** — calls a system method that prints a line of text to the console.

### About "Projects"

In real development, code spans more than one file. A **project** contains multiple `.cs` files, managed by a `.csproj` file:

```xml
<!-- MyFirstMod.csproj — the project file -->
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net481</TargetFramework>   <!-- Target framework: .NET Framework 4.8.1 -->
  </PropertyGroup>
</Project>
```

`TargetFramework` decides which libraries your Mod can use — ADOFAI runs on .NET Framework 4.8.1, so Mods must target the same version. The template project already configures this for you.

### The Entry Method

When UMM starts a Mod, it calls a method at a specific path: **Namespace.ClassName.MethodName**.

```csharp
// UMM finds and calls this method
namespace MyFirstMod
{
    public static class Main
    {
        // Path: MyFirstMod.Main.Load — UMM finds the entry by this name
        public static void Load() { /* ... */ }
    }
}
```

> Remember this "Namespace.ClassName.MethodName" structure — every later chapter uses it.

### A More Concise Syntax (C# 10+)

If you're using a C# 10 or newer compiler, the namespace can be written on a single line without braces:

```csharp
using System;

namespace MyFirstMod;    // File-scoped namespace: the whole file belongs to it

public static class Main
{
    public static void SayHello()
    {
        Console.WriteLine("Hello");
    }
}
```

Both forms are **completely equivalent**; the second just saves one level of indentation. **Note: with file-scoped namespaces, a file can only declare one namespace**, and it must come after all `using` statements.

> The templates in this series enable the latest C# syntax (`<LangVersion>latest</LangVersion>`), so both forms work. You only need to be able to **read** both.

---

## 2. Variables and Types

A variable is like a **named box** that holds data. Each box has a **type** — which determines what it can hold and what you can do with it.

### Basic Types

```csharp
int count = 10;              // Integer (no decimal point)
float speed = 1.5f;         // Decimal (note the trailing f)
double precision = 3.14159;  // Higher-precision decimal (no suffix needed)
bool enabled = true;         // Boolean: only true or false
string name = "ADOFAI";     // String (text)
char letter = 'A';           // A single character (single quotes)
```

`float` and `double` are both decimals; the difference is precision: `float` has about 7 significant digits, `double` about 15. For speeds, coordinates and the like in Mods, `float` is enough.

### `var` — Let the Compiler Infer the Type

```csharp
var count = 10;          // the compiler knows this is int
var name = "ADOFAI";      // the compiler knows this is string
var speed = 1.5f;        // the compiler knows this is float
```

`var` doesn't mean "untyped" — the compiler **automatically infers** the type from the value on the right. More convenient to write, but the result is exactly the same.

> **When to use `var`?** For local variables (inside methods) `var` is recommended for brevity; for class fields, explicit types read better.

### `const` — Values That Never Change

```csharp
const string ModName = "MyFirstMod";    // Constant: cannot be changed once defined
const int MaxRetry = 3;

// ModName = "Other";  // Compile error! Constants cannot be reassigned
```

A `const` value is fixed at compile time and cannot change at runtime. Good for Mod names, version numbers, and other values that never change.

### Type Conversion

Sometimes you need to convert between types:

```csharp
// Implicit conversion: smaller type automatically becomes larger (no data loss)
int score = 100;
double exact = score;         // int → double, automatic

// Explicit conversion: larger to smaller (may lose data, must be manual)
double pi = 3.14;
int approx = (int)pi;          // result is 3, decimal part truncated (not rounded!)

// Safe conversion with the Convert class (recommended)
string input = "42";
int number = Convert.ToInt32(input);     // string → int
float value = Convert.ToSingle("1.5");  // string → float
```

> Harmony patches often need to cast `object`-typed parameters to concrete types (e.g. `(float)args[0]`) — that's an explicit conversion.

### String Operations

Strings are everywhere in Mods (reading configs, building logs, formatting output):

```csharp
string a = "A Dance of";
string b = "Fire and Ice";

// Concatenation
string full = a + " " + b;                     // "A Dance of Fire and Ice"
string full2 = $"{a} {b}";                     // same, using string interpolation

// Common methods
full.Length;               // string length
full.Contains("Fire");     // does it contain a substring → true
full.StartsWith("A");      // does it start with text → true
full.Substring(2, 4);      // take 4 characters starting at index 2 → "Danc"
full.Replace("Ice", "Snow"); // replace → "A Dance of Fire and Snow"
full.Split(' ');           // split by space into an array → ["A", "Dance", "of", "Fire", "and", "Ice"]
string.Join(", ", full.Split(' '));  // join array with commas → "A, Dance, of, Fire, and, Ice"
```

> **String interpolation** `$"{name} is playing"` is used constantly in Mod logging: `Logger.Log($"Current speed: {speed}")` embeds variable values into text.

---

## 3. Operators and Expressions

Operators are symbols that operate on variables. C# provides a rich set, introduced by category.

### Arithmetic Operators

```csharp
int a = 10, b = 3;

a + b;    // add → 13
a - b;    // subtract → 7
a * b;    // multiply → 30
a / b;    // divide → 3 (integer division, decimals truncated!)
a % b;    // modulo (remainder) → 1 (10 = 3×3 + 1)
```

> **The integer division trap:** `10 / 3` is `3`, not `3.33`. If you want a decimal result, at least one operand must be floating-point: `10.0 / 3` → `3.333...`. This pitfall is easy to hit when computing precision or speed values.

### Comparison Operators

Comparisons produce a `bool` (`true` or `false`):

```csharp
10 > 3;      // greater than → true
10 < 3;      // less than → false
10 >= 10;    // greater than or equal → true
10 <= 3;     // less than or equal → false
10 == 10;    // equal → true (note: == not =)
10 != 3;     // not equal → true
```

> **`=` vs `==`**: `=` assigns (`x = 5`), `==` compares (`x == 5`). Mixing them up is one of the most common beginner bugs.

### Logical Operators

Combine multiple conditions:

```csharp
bool isPlaying = true;
bool isPaused = false;

// && (AND): both must be true
isPlaying && !isPaused;     // true && true → true

// || (OR): at least one true
isPlaying || isPaused;       // true || false → true

// ! (NOT): invert
!isPaused;                   // invert false → true
```

Practical usage (checking conditions in a Mod):

```csharp
// Both conditions must hold
if (health > 0 && isAlive) { /* ... */ }

// Either condition is enough
if (speed > 10f || isBoosting) { /* ... */ }

// Execute when the condition does NOT hold
if (!isModEnabled) { /* ... */ }
```

### The Ternary Operator

A shorthand `if/else` for simple two-way choices:

```csharp
// Syntax: condition ? valueA : valueB
string status = isAlive ? "alive" : "dead";

// Equivalent to:
string status;
if (isAlive) status = "alive";
else status = "dead";
```

> Often used in Mods to provide defaults: `_handler ??= new MelonHandler();` (a similar idea — the null-coalescing operator is covered in [section 13](#13-null-and-nullable-types)).

---

## 4. Control Flow

Programs execute line by line from top to bottom by default. **Control flow** lets you decide "which path to take under which conditions" and "how many times to repeat".

### `if / else` — Conditional Branching

```csharp
int health = 75;

if (health > 100)
{
    // runs when health is greater than 100
    Logger.Log("Full health");
}
else if (health > 50)
{
    // runs when health is between 51 and 100
    Logger.Log("In good shape");
}
else
{
    // runs when health <= 50
    Logger.Log("Low health!");
}
```

Only the **first matching branch** executes. If `health` is 75, only the second branch runs.

> Almost every Prefix patch uses `if` — for example, checking whether the Mod is enabled or whether a parameter is in range:

```csharp
public static void Prefix(ref float speed)
{
    if (MyMod.Settings.SpeedMultiplier > 0)   // a speed multiplier is configured
    {
        speed *= MyMod.Settings.SpeedMultiplier;
    }
}
```

### `switch` — Multi-Way Branching

When checking against several fixed values, `switch` is clearer than `if/else`:

```csharp
string difficulty = "Hard";

switch (difficulty)
{
    case "Easy":
        Logger.Log("Easy mode");
        break;
    case "Normal":
        Logger.Log("Normal mode");
        break;
    case "Hard":
        Logger.Log("Hard mode");
        break;
    default:
        Logger.Log("Unknown difficulty");
        break;
}
```

Every `case` must end with `break` (or `return`), otherwise the compiler errors. `default` is the fallback when nothing matches.

### `for` — Loop a Fixed Number of Times

```csharp
// Count from 0 to 9 (10 iterations)
for (int i = 0; i < 10; i++)
{
    Logger.Log($"Iteration {i}");
}
```

The `for` parentheses contain three parts: `initialization` (`int i = 0`); `condition` (`i < 10`, keep looping while true); `update` (`i++`, executed after each iteration).

> **ADOFAI scenario:** iterating over all tiles in a level to modify them in bulk:

```csharp
// Suppose tiles is an array holding every tile's data
for (int i = 0; i < tiles.Count; i++)
{
    tiles[i].speed = 1.5f;   // set every tile's speed to 1.5
}
```

### `foreach` — Iterating a Collection

When you don't need the index, `foreach` is cleaner than `for`:

```csharp
var mods = new List<string> { "Iridium", "Iris", "Sarcary" };

foreach (var modName in mods)
{
    Logger.Log($"Loaded: {modName}");
}
```

> `foreach` appears very frequently in Mods — iterating all objects in a scene, walking config lists, and so on.

### `while` — Conditional Loop

Loops as long as the condition is `true`:

```csharp
int retry = 0;
while (retry < 3)
{
    // try to load the resource
    retry++;
}
```

> **Beware infinite loops:** if the condition never becomes `false`, the program hangs. `while` is used less often than `for`/`foreach` in Mods, but occasionally for waiting on some state.

### `break` and `continue`

- **`break`** — exit the entire loop immediately
- **`continue`** — skip this iteration, move to the next

```csharp
foreach (var tile in tiles)
{
    if (tile.isMidspin) continue;   // skip midspins
    if (tile.isEnd) break;          // stop at the end tile
    tile.speed = 1.5f;
}
```

---

## 5. Methods (Functions)

A method (also called a function) is a **named, reusable block of code**. It takes input (parameters), processes it, and returns a result.

### Basic Form

```csharp
// Returns int, takes two int parameters
public static int Add(int a, int b)
{
    return a + b;      // return sends the value back to the caller
}

// Call it
int result = Add(1, 2);   // result = 3
```

### Methods Without a Return Value

```csharp
public static void LogMessage(string text)
{
    Console.WriteLine(text);
    // no return (void means nothing to return)
}

// Call it
LogMessage("Mod loaded");
```

### The `ref` Parameter

`ref` lets a method **modify the variable that was passed in**, instead of working on a copy:

```csharp
public static void Double(ref int x)
{
    x = x * 2;   // modifies the outer variable itself
}

int v = 5;
Double(ref v);     // after the call, v is 10 (not a return value — v itself changed)
```

**Why is `ref` everywhere in Mods?** Harmony's Postfix patches need to modify a method's return value, and they use `ref` for exactly that:

```csharp
// ref __result: modify the original method's return value
public static void Postfix(ref float __result)
{
    __result *= 2f;   // directly change the game's computed result
}
```

> `ref` is one of Harmony's core mechanisms (see [Magic Parameters](./harmony-magic-params.md)).

### The `out` Parameter

`out` is similar to `ref`, but signals "this parameter is an **output** of the method":

```csharp
// out means number is produced by TryParse
bool success = int.TryParse("42", out int number);
// success = true, number = 42

bool fail = int.TryParse("abc", out int notNumber);
// fail = false, notNumber = 0 (default value on failure)
```

`TryParse` parses strings safely — on failure it returns `false` instead of throwing. Mods often use it to read configs:

```csharp
if (float.TryParse(configText, out float speed))
{
    // parse succeeded, use speed
}
else
{
    // parse failed, fall back to default
    speed = 1.0f;
}
```

### Method Overloading

Methods with the same name can have **different parameter lists**; the compiler picks based on what you pass:

```csharp
public static void Log(string message)
{
    Console.WriteLine(message);
}

public static void Log(string message, string tag)    // one extra parameter
{
    Console.WriteLine($"[{tag}] {message}");
}

// Calls
Log("hello");               // calls the first
Log("hello", "MyMod");      // calls the second
```

### Optional and Named Parameters

```csharp
public static void CreatePlayer(string name, float speed = 1f)
{
    // speed defaults to 1f and can be omitted at the call site
}

CreatePlayer("Alice");           // speed uses the default 1f
CreatePlayer("Bob", 2.5f);       // speed uses 2.5f
CreatePlayer(name: "Charlie", speed: 3f);  // named arguments: order doesn't matter
```

### `params` — Variable Number of Arguments

```csharp
public static void LogAll(params string[] messages)
{
    foreach (var msg in messages)
    {
        Console.WriteLine(msg);
    }
}

LogAll("message 1", "message 2", "message 3");   // pass as many as you like
```

---

## 6. Classes and Objects

A **class** is a blueprint for objects; an **object** is an instance created from that blueprint. Analogy: the class is "the car's design drawing", the object is "the specific car built from it".

### Fields and Methods

```csharp
public class Player
{
    // Fields (variables inside a class)
    public string name;
    public float speed = 1f;          // can have default values
    public int health = 100;

    // Methods (functions inside a class)
    public void Play()
    {
        Console.WriteLine($"{name} starts playing, speed {speed}");
    }

    public void TakeDamage(int amount)
    {
        health -= amount;
        Console.WriteLine($"{name} takes {amount} damage, {health} left");
    }
}
```

### Creating Objects

```csharp
// The new keyword creates an instance
var player = new Player();
player.name = "Alice";
player.speed = 2f;
player.Play();          // output: Alice starts playing, speed 2
player.TakeDamage(30);  // output: Alice takes 30 damage, 70 left
```

Each `new Player()` is an **independent** object; they don't affect each other:

```csharp
var p1 = new Player();
var p2 = new Player();
p1.name = "Alice";
p2.name = "Bob";
p1.TakeDamage(10);     // only Alice loses health
```

### Shorthand for Creating Instances (C# 9+)

With a C# 9 or newer compiler, the type after `new` can be **inferred from the declaration on the left**:

```csharp
var player = new Player();        // common: type on the right
Player player2 = new();           // C# 9 shorthand: type on the left, new() infers it
```

> The type inside `new()` equals the declared type of the variable. It also works for fields and arguments (`settings.Sensitivity = new()`). The templates support both forms — being able to read them is enough.

### Constructors

A constructor runs **automatically** when `new` creates an object, for initialization:

```csharp
public class Player
{
    public string name;
    public float speed;

    // Constructor: same name as the class, no return type
    public Player(string name, float speed = 1f)
    {
        this.name = name;     // this means "the current object"
        this.speed = speed;
    }
}

// Pass initial values directly when creating
var player = new Player("Alice", 2f);
```

The `this` keyword refers to "this current object". When a method parameter has the same name as a field, `this` disambiguates: `this.name` (field) vs `name` (parameter).

### Access Modifiers

Access modifiers control "who can access what":

```csharp
public class Player
{
    public string name;          // public: anyone can access
    private int health = 100;     // private: only inside this class
    protected float speed;       // protected: this class and subclasses
}
```

| Modifier | Who can access | Use for |
|--------|---------|------|
| `public` | Anyone | The exposed interface |
| `private` | This class only | Internal details you don't want changed externally |
| `protected` | This class + subclasses | For inheriting classes |

> In Mod templates, `public` is most common (Harmony needs to reach patch methods), while `private` is for internal state you don't want to expose.

### Properties

Properties look like fields but can add **access control** and **logic**:

```csharp
public class Settings
{
    public bool EnableFeature { get; set; } = true;   // read/write, default true
    public float SpeedMultiplier { get; set; } = 1f;

    // Read-only property (get only, no set)
    public string ModName { get; } = "MyMod";

    // Property with logic
    private float _volume = 50f;
    public float Volume
    {
        get => _volume;           // reading returns the internal value
        set => _volume = Math.Clamp(value, 0f, 100f);  // writing clamps to 0–100
    }
}
```

The `{ get; set; }` accessors — `get` controls reading, `set` controls assigning. UMM's settings classes are written exactly like this (see [Settings System](./settings.md)).

---

## 7. Collections

A single variable holds one value. A **collection** holds a group of values — one of the most used data structures in Mod development.

### Arrays

Arrays are the most basic collection; their length is **fixed** after creation:

```csharp
// Declare and initialize
int[] scores = { 95, 87, 72, 100, 88 };

// Or like this
int[] scores2 = new int[5];      // length-5 array, all elements default to 0

// Access by index (starts at 0)
scores[0];     // → 95 (first element)
scores[4];     // → 88 (last element)
scores.Length; // → 5 (array length)
```

### `List<T>` — Dynamic List

A `List` can **grow and shrink** at any time, far more flexible than an array:

```csharp
var names = new List<string>();   // create an empty string list

// Add elements
names.Add("Alice");
names.Add("Bob");
names.Add("Charlie");

// Remove elements
names.Remove("Bob");          // remove by value
names.RemoveAt(0);            // remove by index

// Common operations
names.Count;                  // number of elements → 2
names.Contains("Alice");      // contains? → true
names[0];                     // access by index → "Charlie"
names.Clear();                // remove all elements
```

> Mods often use `List` to collect game objects — e.g. iterate all tiles in the scene, add matching ones to a list, then modify them together.

### `Dictionary<TKey, TValue>` — Key-Value Pairs

A `Dictionary` looks up a **value** by a **key**, like looking up a definition by headword in a dictionary:

```csharp
var config = new Dictionary<string, float>
{
    ["SpeedMultiplier"] = 1.5f,
    ["Volume"] = 80f,
    ["Threshold"] = 0.1f
};

// Read
config["SpeedMultiplier"];       // → 1.5f

// Modify
config["SpeedMultiplier"] = 2.0f;

// Safe read (doesn't throw if the key is missing)
if (config.TryGetValue("SpeedMultiplier", out float speed))
{
    Logger.Log($"Speed multiplier: {speed}");
}

// Check existence
config.ContainsKey("Volume");    // → true

// Iterate
foreach (var pair in config)
{
    Logger.Log($"Key: {pair.Key}, Value: {pair.Value}");
}
```

> `Dictionary` is used a lot for reading Mod configs and storing tile event data. The template's settings system is key-value based underneath.

### `HashSet<T>` — A Set Without Duplicates

A `HashSet` guarantees **no duplicates** — great for deduplication and fast membership checks:

```csharp
var tags = new HashSet<string> { "mod", "visual", "effect" };
tags.Add("mod");         // already present, not added again
tags.Count;               // → 3
tags.Contains("visual");  // → true, faster than List
```

---

## 8. The `static` Keyword

`static` means "belongs to the class itself" — usable without creating an instance. Analogy: `static` is like "the company-wide bulletin board" — everyone sees the same one; nobody needs their own copy.

```csharp
public static class MathHelper
{
    // static method: call directly through the class name
    public static int Square(int x) => x * x;
    public static float Clamp(float value, float min, float max)
    {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
}

// Calling: no need for new MathHelper()
MathHelper.Square(3);      // → 9
MathHelper.Clamp(15f, 0f, 10f);  // → 10
```

`static` also works on fields — all instances share the same value:

```csharp
public class GameInfo
{
    public static int TotalMods = 0;   // shared across all objects

    public GameInfo()
    {
        TotalMods++;   // increment the counter for every new object
    }
}
```

> UMM's `Main` class and Harmony patch classes are all `static`. `Load` is a static method, so UMM can call it without `new Main()`. A Mod needs exactly one `Main`, hence `static`.

---

## 9. Generics

Generics use angle brackets `<>` to mean "a template that works with **any type**". You write the code once; it handles `int`, `string`, `float`... anything.

```csharp
// T in List<T> is a placeholder
var numbers = new List<int>();       // T = int
numbers.Add(1);

var names = new List<string>();      // T = string
names.Add("Alice");

// Dictionary<TKey, TValue> has two generic parameters
var map = new Dictionary<string, int>();  // TKey=string, TValue=int
map["score"] = 100;
```

You can define generic methods yourself:

```csharp
// T can be any type
public static T GetDefault<T>()
{
    return default(T);   // default returns the type's default value (0 for numbers, null for references)
}

GetDefault<int>();       // → 0
GetDefault<string>();    // → null
GetDefault<bool>();      // → false
```

> Harmony's Transpiler returns `IEnumerable<CodeInstruction>` — "a sequence of `CodeInstruction` items", where `CodeInstruction` is the IL instruction type and `IEnumerable` means "iterable one by one" (see [Transpiler Introduction](./harmony-transpiler.md)).

---

## 10. Inheritance and Interfaces

### Inheritance

A class can **inherit** another class, gaining all its fields and methods, and can extend or override them:

```csharp
// Base (parent) class
public class ModBase
{
    public string Name { get; set; }
    public bool IsEnabled { get; set; }

    public virtual void OnToggle(bool value)   // virtual: subclasses may override
    {
        IsEnabled = value;
    }
}

// Derived (child) class
public class SpeedMod : ModBase      // colon means inheritance
{
    public float SpeedMultiplier { get; set; } = 1f;

    // override: replace the parent's method
    public override void OnToggle(bool value)
    {
        base.OnToggle(value);            // call the parent's logic first
        if (value) SpeedMultiplier = 1f; // the subclass's own logic
    }
}
```

- Methods marked `virtual` can be `override`-en by subclasses
- `base.OnToggle()` calls the parent's original implementation
- The subclass automatically has the parent's `Name` and `IsEnabled` properties

> In the ADOFAI Mod templates, loader adapters inherit different base classes: `BaseUnityPlugin` (BepInEx), `MelonMod` (MelonLoader). The `IHandler` interface is next.

### Interfaces

An interface defines "**what capabilities must exist**" without caring "how they're implemented":

```csharp
// Interface: the contract
public interface IHandler
{
    void Log(string message);          // log a message
    string ModPath { get; }            // where the Mod lives
    bool IsEnabled { get; set; }       // enabled or not
}

// Implementing the interface: UmmHandler satisfies the contract its own way
public class UmmHandler : IHandler
{
    private UnityModManager.ModEntry _entry;

    public UmmHandler(UnityModManager.ModEntry entry)
    {
        _entry = entry;
    }

    public void Log(string message)
    {
        _entry.Logger.Log(message);    // use UMM's logging system
    }

    public string ModPath => _entry.Path;

    public bool IsEnabled { get; set; }
}

// Implementing the interface: MelonHandler satisfies the contract its own way
public class MelonHandler : IHandler
{
    public void Log(string message)
    {
        MelonLogger.Msg(message);      // use MelonLoader's logging system
    }

    public string ModPath => Environment.CurrentDirectory;
    public bool IsEnabled { get; set; }
}
```

A class can implement **multiple interfaces** but inherit from only **one base class**.

> The heart of the multi-loader template is the `IHandler` interface: core code only knows `IHandler` and is unaware of which loader it's running on. See [Advanced: Multi-Loader Template](./multiloader.md).

---

## 11. Attributes

Attributes use `[square brackets]` to **tag** code; frameworks read these tags to decide what to do. Think of them as sticky notes attached to your code.

```csharp
[HarmonyPatch(typeof(Player), nameof(Player.Play))]   // tells Harmony: this is a patch targeting Player.Play
public static class Play_Prefix
{
    public static void Prefix() { /* ... */ }
}
```

Common built-in attributes:

```csharp
[Obsolete("Use NewMethod instead")]     // marked deprecated; the compiler warns
public void OldMethod() { /* ... */ }

[Serializable]                        // marks the type as serializable (savable to file)
public class SaveData { /* ... */ }
```

Defining your own attribute is simple too (though Mods usually just consume framework-provided ones):

```csharp
// Define the attribute
[AttributeUsage(AttributeTargets.Class)]
public class ModInfoAttribute : Attribute
{
    public string Name { get; }
    public ModInfoAttribute(string name) { Name = name; }
}

// Use the attribute
[ModInfo("My First Mod")]
public class MyMod { /* ... */ }
```

You don't need to write attributes — you just need to **use** them: copy `[HarmonyPatch(...)]` from the template (see [HarmonyPatch In Depth](./harmony-attributes.md)).

---

## 12. Reflection

Reflection means "**using code to inspect code**" — at runtime, reading information about classes, methods and fields, and even invoking them dynamically.

```csharp
// typeof: get type information
Type playerType = typeof(Player);

// GetType: get the type from an instance
var obj = new Player();
Type type = obj.GetType();

// Get method information
var method = AccessTools.Method(typeof(Player), nameof(Player.Play));
// AccessTools is Harmony's reflection helper, more convenient than raw reflection

// Invoke a method dynamically
method.Invoke(obj, null);    // calls obj's Play method
```

> Don't worry about the details — just know: **the game's method and class names exist as strings**, and Harmony uses reflection to find them and inject patches. You won't hand-write reflection in Mod development; Harmony's `AccessTools` handles it (see [Locating Target Methods](./finding-methods.md)).

---

## 13. `null` and Nullable Types

`null` means "nothing" — the variable doesn't point to any object.

```csharp
string name = null;     // name points to no string

// Accessing members of null crashes!
// name.Length;         // → NullReferenceException (the classic error)
```

### `?` — Nullable Types

Value types (`int`, `float`, `bool`) can't be `null` by default. Adding `?` allows it:

```csharp
int? maybeNull = null;         // nullable int
float? speed = null;           // nullable float

// Check before use
if (speed.HasValue)
{
    float value = speed.Value;     // extract the actual value
}
```

> The most common nullable types in Mods are `Harmony?` and `UnityModManager.ModEntry?` — they may be `null` (before the Mod loads).

### Safe Operators

C# offers several idioms to avoid `NullReferenceException`:

```csharp
// ?. — null-conditional: if the left side is null, the whole expression is null (no crash)
string? upper = name?.ToUpper();        // if name is null, upper is null too

// ?? — null-coalescing: if the left side is null, use the right side
string result = name ?? "default name";     // uses "default name" when name is null

// is not null — pattern matching
if (name is not null)
{
    Logger.Log(name.Length);
}

// Chained ?. (common with Unity)
player?.GetComponent<Rigidbody>()?.AddForce(Vector3.up);
// if any link is null it safely yields null, no crash
```

> Hunting `NullReferenceException` is every Mod developer's daily routine. 90% of the time it's a missing null check. See [FAQ](./troubleshooting.md).

---

## 14. Exception Handling with `try/catch`

Runtime errors (division by zero, missing files, wrong types...) **throw exceptions**. Unhandled, they crash the program. `try/catch` lets you handle errors gracefully.

### Basic Form

```csharp
try
{
    int.Parse("not a number");   // this line throws a FormatException
}
catch (Exception ex)
{
    Logger.Log($"Error: {ex.Message}");
}
```

If code in `try` fails, execution jumps straight to the `catch` block — no crash; your error-handling logic runs instead.

### Catching Specific Exceptions

```csharp
try
{
    var content = File.ReadAllText("config.txt");
    int value = int.Parse(content);
}
catch (FileNotFoundException)
{
    Logger.Log("Config file missing; using defaults");
}
catch (FormatException)
{
    Logger.Log("Config file has invalid format");
}
catch (Exception ex)   // fallback: catches everything else
{
    Logger.Log($"Unknown error: {ex.Message}");
}
```

> **Put specific exceptions before the general `Exception`.** The compiler errors if the order is reversed.

### `finally` — Always Runs

```csharp
FileStream? file = null;
try
{
    file = File.OpenRead("data.json");
    // read the file...
}
catch (Exception ex)
{
    Logger.Log($"Read failed: {ex.Message}");
}
finally
{
    file?.Dispose();   // runs whether it succeeded or failed (releases the resource)
}
```

### `throw` — Throwing Your Own Exceptions

```csharp
public static void SetSpeed(float speed)
{
    if (speed < 0)
    {
        throw new ArgumentException("Speed cannot be negative");
    }
    // ...
}
```

> Harmony's [Finalizer patch](./harmony-finalizer.md) is essentially this idea — catch exceptions thrown by the target method so the game doesn't crash.

---

## 15. Delegates and Events

### Delegates

A delegate treats a "method" as a **variable** — you can assign methods to variables, pass them as arguments, store them in lists.

```csharp
// Define a delegate type (describes "what kind of method can be assigned")
public delegate bool ToggleHandler(bool value);

// Create a delegate variable and assign
ToggleHandler handler = OnToggle;
bool result = handler(true);    // equivalent to calling OnToggle(true)
```

### `Action` and `Func` — Built-in Delegates

C# provides two general-purpose delegate types so you don't define your own:

```csharp
// Action: methods with no return value
Action<string> logger = (msg) => Logger.Log(msg);
logger("Mod loaded");

// Func: methods with a return value (the last type parameter is the return type)
Func<int, int, int> add = (a, b) => a + b;
int result = add(1, 2);     // → 3
```

> `Action` and `Func` appear constantly in Mod templates — `modEntry.OnToggle` is an `Action<bool>`-style delegate.

### Lambda Expressions

`=>` (read "goes to") marks Lambda syntax — a shorthand for **anonymous methods**:

```csharp
// Fully written
Action<string> log = (string msg) => { Logger.Log(msg); };

// Types can be omitted (compiler infers)
Action<string> log2 = (msg) => { Logger.Log(msg); };

// Parentheses optional with a single parameter
Action<string> log3 = msg => Logger.Log(msg);

// Multi-line lambda
Func<int, bool> isPositive = n =>
{
    if (n > 0) return true;
    return false;
};
```

### Events

Events are the "safe version" of delegates — outsiders can only **subscribe/unsubscribe**, not trigger:

```csharp
public class EventBus
{
    // Define events
    public event Action<string> OnModLoaded;
    public event Action<string> OnModUnloaded;

    // Trigger (only inside the class)
    public void Load(string modName)
    {
        OnModLoaded?.Invoke(modName);   // ?.Invoke: skipped if no subscribers
    }
}

// Usage
var bus = new EventBus();
bus.OnModLoaded += (name) => Logger.Log($"{name} loaded");    // subscribe
bus.OnModUnloaded += (name) => Logger.Log($"{name} unloaded");
bus.Load("MyMod");    // triggers → logs "MyMod loaded"
```

- `+=` subscribes to an event
- `-=` unsubscribes
- Outside code **cannot** invoke `bus.OnModLoaded("test")` directly; only the class can trigger it

> UMM's `modEntry.OnToggle = OnToggle` hands our method **to UMM** to call at the right time — that's delegation in essence (see [Minimal Example](./first-mod.md)).

---

## 16. Naming Conventions and Coding Style

The C# community shares naming conventions. Following them makes your code easier to read and consistent with other Mods.

### Naming Rules

| Context | Convention | Examples |
|------|------|------|
| Class, method, property, namespace names | **PascalCase** (capitalize each word) | `PlayerSpeed`, `OnToggle`, `Main` |
| Local variables, parameters | **camelCase** (lowercase first word) | `speedMultiplier`, `modEntry` |
| Constants | **PascalCase** | `MaxRetry`, `DefaultSpeed` |
| Private fields | **camelCase** or `_camelCase` | `_handler`, `speed` |
| Interfaces | **I** + PascalCase | `IHandler`, `ISettingsProvider` |

```csharp
// Good naming
public class PlayerController
{
    private float _moveSpeed = 5f;
    public int MaxHealth { get; set; }

    public void ApplyDamage(int damageAmount) { /* ... */ }
}

// Bad naming
public class playercontroller
{
    private float ms;
    public int mh { get; set; }
    public void DoStuff(int d) { /* ... */ }
}
```

### Comments

```csharp
/// <summary>
/// Calculates the ADOFAI speed multiplier.
/// </summary>
/// <param name="baseSpeed">The original speed</param>
/// <param name="multiplier">The multiplier</param>
/// <returns>The computed speed</returns>
public static float CalculateSpeed(float baseSpeed, float multiplier)
{
    return baseSpeed * multiplier;
}
```

`///` is an XML doc comment; the IDE shows it in hover tips. Regular comments use `//` (single line) or `/* ... */` (multi-line).

> Mod code doesn't need a comment on every line, but **key logic** (why it's done this way, what side effects exist) should be commented. The template projects set a good example.

---

## 17. The Mindset You Need

If you could follow all 16 sections above — congratulations, you have enough foundation for this series. The rest is **repeated practice**:

- **Read code**: look up unfamiliar syntax instead of being scared; C# error messages are usually clear
- **Copy templates**: 80% of Mod development is modifying a template, not writing from scratch
- **Read errors**: paste exceptions from `Player.log` into a search engine — answers usually exist
- **Use your IDE**: Visual Studio / Rider completion, hover tips and quick-fixes save you from memorizing everything
- **Debug with breakpoints**: set a breakpoint on a key line; the program pauses there at runtime so you can inspect variables step by step

## What You Learned

- C# program structure: `namespace` / `class` / `method`, what `using` does, the `.csproj` project file
- Variables and types: `int`/`float`/`double`/`bool`/`string`/`char`, `var`, `const`, conversions, string operations
- Operators: arithmetic, comparison, logical, ternary
- Control flow: `if/else`, `switch`, `for`, `foreach`, `while`, `break`/`continue`
- Methods: `ref`, `out`, overloading, optional parameters, `params`
- Classes and objects: fields, methods, constructors, `this`, access modifiers, properties
- Collections: arrays, `List<T>`, `Dictionary<K,V>`, `HashSet<T>`
- `static`, generics, inheritance and interfaces (where `IHandler` comes from)
- Attributes and reflection
- `null`, `?.`, `??`, nullable types
- `try/catch/finally`, exception types
- Delegates, `Action`/`Func`, Lambdas, events
- Naming conventions and coding style
- **Every section maps to concrete usage in later chapters**

## Next Step

Ready? Jump into real Mod development → [Getting Started](./index.md)
