---
title: Parsers
order: 2
---

# Parsers

The library provides four parsers to choose from based on input type. All parsers are zero-dependency and browser-compatible.

## StringParser — Parse from String

Handles non-standard formatting (trailing commas, raw newlines in strings):

```ts
import { StringParser } from 'adofai'

const parser = new StringParser()
const data = parser.parse(`{ "angleData": [...], "settings": {...}, "actions": [...] }`)
```

## BufferParser — Parse from Byte Stream

Directly parses `Uint8Array` binary streams, automatically handles BOM:

```ts
import { BufferParser } from 'adofai'

const parser = new BufferParser()
const u8 = new Uint8Array(await file.arrayBuffer())
const data = parser.parse(u8)
```

## ArrayBufferParser

Accepts `ArrayBuffer` or string, handles BOM stripping, trailing comma normalization, and UTF-8 decoding:

```ts
import { ArrayBufferParser } from 'adofai'

const parser = new ArrayBufferParser()
const buffer = await response.arrayBuffer()
const data = parser.parse(buffer)
```

## LargeFileParser — Extra Large Levels

Memory-optimized incremental parser, suitable for levels with massive `angleData` / `actions`:

```ts
import { LargeFileParser } from 'adofai'

const parser = new LargeFileParser((stage, percent) => {
  console.log(`[${stage}] ${percent}%`)
}, {
  skipLargeActions: false, // Skip actions when exceeding 100MB
  maxActions: 0            // Limit the number of parsed actions
})

const result = parser.parse(arrayBuffer)
// result: { settings?, angleData?, pathData?, actions?, decorations? }
```

Key behaviors:

- **< 50MB** — Normal full parse
- **> 50MB** — `actions` are parsed incrementally, one by one
- **> 100MB** — Can completely skip actions via `skipLargeActions: true`
- **Any size** — `angleData` is always parsed incrementally, number by number
