---
title: 事件类型
order: 5
---

# 事件类型

`Events` 模块导出 **56 种** ADOFAI 事件类型的 TypeScript 定义，覆盖游戏玩法、轨道、相机、装饰等全部事件。按功能分类如下。

## 玩法与判定

| 事件 | 说明 |
| --- | --- |
| SetSpeed | 改变音符速度（BPM 缩放） |
| Twirl | 路径转向（反方向） |
| Checkpoint | 检查点 |
| Hold | 长按 |
| SetHoldSound | 设置长按音效 |
| SetHitsound | 设置打击音效 |
| KillPlayer | 杀死玩家 |
| Pause | 暂停 |
| Multitap | 多连打 |
| SetInputEvent | 订阅/取消订阅输入事件 |
| AutoPlayTiles | 自动演示地板 |
| MultiPlanet | 多星球 |
| FreeRoam / FreeRoamTwirl / FreeRoamRemove | 自由移动 / 转向 / 移除 |
| RepeatEvents | 重复事件 |
| SetConditionalEvents | 条件事件（通过/失败） |
| SetFrameRate | 设置帧率 |
| TileDimensions | 地板尺寸 |
| ScalePlanets | 缩放星球 |
| ScaleRadius | 缩放半径 |
| ScaleMargin | 缩放边距 |

## 轨道

| 事件 | 说明 |
| --- | --- |
| MoveTrack | 移动轨道 |
| PositionTrack | 定位轨道 |
| ColorTrack | 轨道着色 |
| RecolorTrack | 轨道重新着色 |
| AnimateTrack | 轨道动画 |
| ChangeTrack | 切换轨道 |
| SetPlanetRotation | 设置星球旋转 |
| Hide | 隐藏（轨道/玩家等） |
| MoveDecorations | 移动装饰 |

## 相机与屏幕

| 事件 | 说明 |
| --- | --- |
| MoveCamera | 移动相机 |
| ScreenScroll | 屏幕滚动 |
| ScreenTile | 屏幕地块 |
| ShakeScreen | 屏幕震动 |
| Flash | 闪屏 |

## 滤镜与后处理

| 事件 | 说明 |
| --- | --- |
| SetFilter | 设置滤镜 |
| SetFilterAdvanced | 高级滤镜 |
| HallOfMirrors | 镜面走廊 |
| Bloom | 辉光 |

## 装饰、对象与文本

| 事件 | 说明 |
| --- | --- |
| AddDecoration | 添加装饰 |
| AddText | 添加文本 |
| AddObject | 添加对象 |
| SetObject | 设置对象 |
| SetText | 设置文本 |
| SetDefaultText | 设置默认文本 |
| AddComponent | 添加组件 |
| SetFloorIcon | 设置地板图标 |
| CustomBackground | 自定义背景 |

## 粒子

| 事件 | 说明 |
| --- | --- |
| AddParticle | 添加粒子 |
| SetParticle | 设置粒子 |
| EmitParticle | 发射粒子 |

## 其他

| 事件 | 说明 |
| --- | --- |
| PlaySound | 播放音效 |
| EditorComment | 编辑器注释 |
| Bookmark | 书签 |
| CallMethod | 调用方法 |

## 用法

```ts
import { Events } from 'adofai'
import type { SetSpeed } from 'adofai'

const ev: Events.SetSpeed = {
  floor: 0,
  eventType: 'SetSpeed',
  speedType: 'Bpm',
  beatsPerMinute: 180
}
```

> 每个事件的具体字段以仓库 `src/events/` 下的类型定义为准。