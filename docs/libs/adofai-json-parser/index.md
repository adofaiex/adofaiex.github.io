---
title: adofai-json-parser
order: 1
---

# adofai-json-parser

> A lightweight, pure Kotlin ADOFAI level JSON parsing library with an API similar to JavaScript's `JSON.parse()` and `JSON.stringify()`.
>
> Project URL: <https://github.com/adofaiex/adofai-json-parser>

## Features

- ✅ Pure Kotlin implementation, no external dependencies
- ✅ Multi-platform: JVM and Kotlin/Native (Windows, macOS, Linux)
- ✅ Simple API, similar to JS's JSON API
- ✅ Reviver / Replacer support (transform values during parsing / serialization)
- ✅ Pretty printing (formatted with indentation)
- ✅ Full JSON support (objects, arrays, strings, numbers, booleans, null)
- ✅ Lenient parsing: supports JSON with trailing commas and newline-containing strings

## Installation

### Gradle (Kotlin DSL)

```kotlin
repositories {
    mavenCentral()
    // Add your repository
}

dependencies {
    implementation("com.fizzd:jsonparser:1.0-SNAPSHOT")
}
```

### Build from Source

```bash
git clone <repository-url>
cd adofai-json-parser

./gradlew build
```

JAR output is in `build/libs/`:
- `ADOFAIJSONParser-jvm-1.0-SNAPSHOT.jar` (JVM)
- `ADOFAIJSONParser-metadata-1.0-SNAPSHOT.jar` (Metadata)

## Usage

### Basic Parsing

```kotlin
import com.fizzd.jsonparser.StringParser

val parser = StringParser()

val jsonString = """{"name": "John", "age": 30, "city": "New York"}"""
val result = parser.parse(jsonString) as? Map<String, Any?>

println(result?.get("name")) // John
```

## Interoperability

- Refer to [Understanding Level Files](../level-format.md) to learn about the file structure
- Other versions with the same scope: [ADOFAI-JS](../adofai-js/), [SharpFAI](../sharpfai/), [AdoCpp](../adocpp/)
