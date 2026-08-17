---
title: ADOFAI-JS
order: 1
---

# ADOFAI-JS

[ADOFAI-JS](https://github.com/adofaiex/ADOFAI-JS) is a zero-dependency JavaScript / TypeScript level library for parsing, editing, and exporting ADOFAI level files, fully browser-compatible.

## Features

- **Multiple parsers** — `StringParser`, `BufferParser`, `ArrayBufferParser`, `LargeFileParser` (incremental parsing for large files)
- **Level management** — Load, edit, and export `.adofai` files with full tile and event access
- **Typed events** — TypeScript definitions for 56 ADOFAI event types
- **Shared types** — Constant enums and utility types (angles, judgment, filters, etc.)
- **PathData conversion** — Convert between `pathData` strings and `angleData` arrays
- **Effect filtering** — Preset and custom event filtering (remove effects, include/exclude events)
- **Precompute mode** — Batch process and cache progress events for rendering pipeline polling
- **Lightweight data** — Memory-optimized data extraction for large levels

> Before getting started, we recommend reading [Understanding Level Files](../level-format.md) to learn about the structure of `.adofai` files and Path Data encoding.

## Installation

```bash
npm install adofai
# or
yarn add adofai
# or
pnpm add adofai
```

## Import

**ESM:**

```ts
import * as adofai from 'adofai'
import { Level, Parsers, Types, Events, Structure } from 'adofai'
```

**CommonJS:**

```ts
const adofai = require('adofai')
```

**Subpath imports:**

```ts
import { StringParser } from 'adofai/parser/string'
import { BufferParser } from 'adofai/parser/buffer'
import { ArrayBufferParser } from 'adofai/parser/array-buffer'
import * as Types from 'adofai/types'
import * as Events from 'adofai/event'
```

### Package Exports Overview

| Import Path | Contents |
| --- | --- |
| `adofai` | Main entry: Level, Parsers, Types, Events, Structure, Presets, pathData |
| `adofai/parser` | Parser classes |
| `adofai/parser/string` | StringParser |
| `adofai/parser/buffer` | BufferParser |
| `adofai/parser/array-buffer` | ArrayBufferParser |
| `adofai/types` | Types (constant enums, utility types and functions) |
| `adofai/event` | All event type interfaces |
| `adofai/structure` | Core interfaces (LevelOptions, Tile, etc.) |
| `adofai/filter` | Filter presets |
| `adofai/filter/effect-processor` | Low-level effect processor |
| `adofai/pathdata` | PathData conversion tables |

## Quick Start

```ts
import { Level } from 'adofai'
import fs from 'node:fs'

const raw = fs.readFileSync('level.adofai', 'utf-8')
const level = new Level(raw)
await level.load()

// Number of tiles
console.log(level.tiles.length)

// Read settings
console.log(level.settings.bpm, level.settings.artist)

// Remove all effects
level.clearEffect('preset_noeffect')

// Export back to ADOFAI JSON
fs.writeFileSync('output.adofai', level.export('string', 0, true))
```

## Sections

- [Parsers](./parsers.md) — Choosing and using the four parsers
- [Level Class](./level.md) — Loading, editing, and exporting level data
- [Shared Types](./types.md) — Types and constant enums
- [Event Types](./events.md) — 56 event definitions
- [Effect Filtering](./filters.md) — Preset and custom event filtering
- [Advanced Usage](./advanced.md) — Precompute mode and lightweight data

## Interoperability

- [Re_ADOJAS](https://github.com/adofaiex/Re_ADOJAS) (chart player) is built on this library, see the [User Guide](../../mods/online-tools/re_adojas.md)
- The corresponding C# version: [SharpFAI](../sharpfai/)
