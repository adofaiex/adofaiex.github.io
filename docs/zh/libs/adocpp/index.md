---
title: AdoCpp
order: 1
---

# AdoCpp

> ADOFAI 关卡解析与生成库（C++）。
>
> 项目地址：<https://github.com/adofaiex/AdoCpp>

## 简介

C++ 实现的 ADOFAI 关卡解析与生成库。

## 依赖

- **CMake**：构建工具
- **JsonCpp / Json5Cpp**：解析 JSON
- （可选）**Doxygen**：生成文档

## 快速上手

```c++
#include <iostream>
#include <AdoCpp.h>

int main()
{
    // 1. 导入 ADOFAI 文件
    constexpr const char* PATH = "...";
    AdoCpp::Level level{PATH};
    // 或 "AdoCpp::Level level; level.fromFile(PATH);"

    // 2. 读取关卡信息
    std::cout << level.settings.artist << " - "
              << level.settings.song << std::endl;

    // 3. 解析关卡
    level.parse();

    // 4. 读取地块信息
    for (const auto& tile : level.tiles)
        std::cout << tile.seconds << std::endl;

    // 5. 更新到第 10 秒的状态
    level.update(10);

    // 6. 读取原始值（.o）与当前值（.c）
    for (const auto& tile : level.tiles)
    {
        auto [originalX, originalY] = tile.pos.o;
        auto [currentX, currentY] = tile.pos.c;
        printf("(%.2f, %.2f) (%.2f, %.2f)\n",
               originalX, originalY,
               currentX,  currentY);
    }

    // 7. 修改关卡
    level.tiles[2].angle = AdoCpp::degrees(114.514);
    const auto twirl = std::make_shared<AdoCpp::Event::GamePlay::Twirl>();
    twirl->floor = 2;
    level.tiles[2].events.push_back(twirl);

    // 8. 导出为 JSON
    Json::Value doc = level.intoJson();
}
```

::: warning
AdoCpp 仍在开发中，可能存在 bug。
:::

## 联动

- 参考相同定位的[库文档](../index.md)了解基础概念