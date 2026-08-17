---
title: AdoCpp
order: 1
---

# AdoCpp

> ADOFAI level parsing and generation library (C++).
>
> Project URL: <https://github.com/adofaiex/AdoCpp>

## Introduction

A C++ implementation of an ADOFAI level parsing and generation library.

## Dependencies

- **CMake**: Build tool
- **JsonCpp / Json5Cpp**: JSON parsing
- (Optional) **Doxygen**: Documentation generation

## Quick Start

```c++
#include <iostream>
#include <AdoCpp.h>

int main()
{
    // 1. Import ADOFAI file
    constexpr const char* PATH = "...";
    AdoCpp::Level level{PATH};
    // or "AdoCpp::Level level; level.fromFile(PATH);"

    // 2. Read level info
    std::cout << level.settings.artist << " - "
              << level.settings.song << std::endl;

    // 3. Parse the level
    level.parse();

    // 4. Read tile info
    for (const auto& tile : level.tiles)
        std::cout << tile.seconds << std::endl;

    // 5. Update to the state at 10 seconds
    level.update(10);

    // 6. Read original values (.o) and current values (.c)
    for (const auto& tile : level.tiles)
    {
        auto [originalX, originalY] = tile.pos.o;
        auto [currentX, currentY] = tile.pos.c;
        printf("(%.2f, %.2f) (%.2f, %.2f)\n",
               originalX, originalY,
               currentX,  currentY);
    }

    // 7. Modify the level
    level.tiles[2].angle = AdoCpp::degrees(114.514);
    const auto twirl = std::make_shared<AdoCpp::Event::GamePlay::Twirl>();
    twirl->floor = 2;
    level.tiles[2].events.push_back(twirl);

    // 8. Export to JSON
    Json::Value doc = level.intoJson();
}
```

::: warning
AdoCpp is still under development and may contain bugs.
:::

## Interoperability

- Refer to the [Library Documentation](../index.md) of the same scope for basic concepts
