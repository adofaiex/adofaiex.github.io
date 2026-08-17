---
title: Level 类
order: 3
---

# Level 类

`Level` 是库的核心数据结构，接收 ADOFAI 文件内容（字符串、对象、ArrayBuffer、Uint8Array 等），提供地块管理与导出。

## 创建与加载

```ts
import { Level } from 'adofai'

// 从字符串加载
const level = new Level(adofaiJsonString)
await level.load()

// 使用自定义解析器
const level = new Level(rawData, bufferParser)
await level.load()

// 从已解析的对象加载
const level = new Level({
  angleData: [...],
  settings: { ... },
  actions: [...],
  decorations: [...]
})
await level.load()

// 事件式加载（监听进度）
level.on('parse:progress', (event) => {
  // { stage: 'relativeAngle', current: 500, total: 1000, percent: 50 }
  console.log(`${event.stage}: ${event.percent}%`)
})
level.load()
```

进度阶段：`start` → `pathData` | `angleData` → `relativeAngle` → `tilePosition` → `complete`

## 数据模型

加载后数据分两层：

```
┌──────────────────────────────────────────┐
│  源数据（只读的初始值）                    │
│  level.angleData       — 原始角度数组      │
│  level.actions         — 扁平事件列表      │
│  level.__decorations   — 扁平装饰列表      │
│  level.settings        — 关卡设置          │
├──────────────────────────────────────────┤
│  工作数据（主要操作对象）                  │
│  level.tiles           — Tile[]          │
└──────────────────────────────────────────┘
```

**所有数据操作都在 `level.tiles` 上进行**。源数组（`angleData` / `actions` / `decorations`）是初始输入，修改 tiles 时**不会**同步；导出时再从 `level.tiles` 重建。

### Tile 结构

```ts
interface Tile {
  direction?: number;          // 原始角度值（含 999）
  angle?: number;              // 计算出的相对角度
  _lastdir?: number;           // 上一个地块的方向
  twirl?: number;              // 累计 twirl 次数
  actions: ActionData[];       // 该地块的事件
  addDecorations?: ActionData[]; // 该地块的装饰
  position?: number[];         // 计算出的 [x, y]
  extraProps?: Record<string, any>; // 额外计算数据
}
```

## 读取与修改地块

```ts
// 读取
const tile = level.tiles[42]
tile.direction;       // 原始角度值
tile.angle;           // 相对角度
tile.actions;         // 该地块事件
tile.addDecorations;  // 该地块装饰
tile.twirl;           // twirl 次数
tile.position;        // [x, y]（需先计算）

// 追加
level.floorOperation({ type: 'append', direction: 180 })

// 插入到指定索引
level.floorOperation({ type: 'insert', direction: 90, id: 10 })

// 删除
level.floorOperation({ type: 'delete', id: 10 })
```

## 查询事件

```ts
// 查找所有含指定事件类型的地块
const results = level.filterActionsByEventType('Flash')
// 返回 { index: number, action: ActionData }[]

// 获取指定地块索引处的事件
const { count, actions } = level.getActionsByIndex('MoveTrack', 5)
```

## 计算地块位置

```ts
const positions = level.calculateTilePosition()
// 返回 number[][] — 每个地块（含终点）的 [x, y]

level.tiles[5].position   // [x, y]
level.tiles[5].extraProps // { angle1, angle2, cangle }
```

## 特效过滤

所有特效操作就地修改 `level.tiles`：

```ts
import { Presets } from 'adofai'

// 使用预设（如去除所有特效）
level.clearEffect('preset_noeffect')

// 自定义过滤 — 仅保留指定事件
level.clearEvent({ type: 'include', events: ['SetSpeed', 'Twirl'] })

// 自定义过滤 — 排除指定事件
level.clearEvent({ type: 'exclude', events: ['Flash', 'Bloom'] })

// 清除所有装饰
level.clearDeco()
```

## 导出（从 tiles 重建）

```ts
// 导出为格式化 ADOFAI JSON 字符串
const str = level.export('string', 0, true)
// fs.writeFileSync('output.adofai', str)

// 导出为对象
const obj = level.export('object', 0, true)
// { angleData, settings, actions, decorations }
// 三个数组均由 level.tiles 重建
```

## 事件系统

```ts
// 监听生命周期事件
const guid = level.on('load', (level) => { /* ... */ })

// 按 GUID 移除监听
level.off(guid)

// 触发自定义事件
level.trigger('custom:event', data)
```

## 事件与类型

```ts
import { Events } from 'adofai'
import * as Types from 'adofai/types'
```