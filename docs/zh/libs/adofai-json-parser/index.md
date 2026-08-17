---
title: adofai-json-parser
order: 1
---

# adofai-json-parser

> 轻量、纯 Kotlin 的 ADOFAI 关卡 JSON 解析库，API 类似 JavaScript 的 `JSON.parse()` 与 `JSON.stringify()`。
>
> 项目地址：<https://github.com/adofaiex/adofai-json-parser>

## 特性

- ✅ 纯 Kotlin 实现，无外部依赖
- ✅ 多平台：JVM 与 Kotlin/Native（Windows、macOS、Linux）
- ✅ 简单 API，类似 JS 的 JSON API
- ✅ Reviver / Replacer 支持（解析 / 序列化时转换值）
- ✅ 美化打印（带缩进格式化）
- ✅ 完整 JSON 支持（对象、数组、字符串、数字、布尔、null）
- ✅ 宽松解析：支持带逗号、换行字符串的 JSON

## 安装

### Gradle（Kotlin DSL）

```kotlin
repositories {
    mavenCentral()
    // 添加你的仓库
}

dependencies {
    implementation("com.fizzd:jsonparser:1.0-SNAPSHOT")
}
```

### 从源码构建

```bash
git clone <repository-url>
cd adofai-json-parser

./gradlew build
```

JAR 输出在 `build/libs/`：
- `ADOFAIJSONParser-jvm-1.0-SNAPSHOT.jar`（JVM）
- `ADOFAIJSONParser-metadata-1.0-SNAPSHOT.jar`（Metadata）

## 使用

### 基础解析

```kotlin
import com.fizzd.jsonparser.StringParser

val parser = StringParser()

val jsonString = """{"name": "John", "age": 30, "city": "New York"}"""
val result = parser.parse(jsonString) as? Map<String, Any?>

println(result?.get("name")) // John
```

## 联动

- 参考[认识关卡文件](../level-format.md)了解文件结构
- 相同定位的其他版本：[ADOFAI-JS](../adofai-js/)、[SharpFAI](../sharpfai/)、[AdoCpp](../adocpp/)