---
title: GitHub Actions 自动构建
order: 23
---

# GitHub Actions 自动构建

手动编译、打包、上传 Release 很繁琐。用 GitHub Actions 可以让 CI/CD 自动完成：推送代码 → 自动编译 → 自动打包 → 自动发布。

## 为什么需要私有 lib 仓库

ADOFAI Mod 编译时**必须引用游戏的原版 DLL**（`Assembly-CSharp.dll` 等）。但这些 DLL **受版权保护，不能放进公开仓库**。

解决方案：**创建一个私有仓库专门存放这些二进制**，CI 时用密钥读取它来构建。这就是「私有 lib 仓库」方案。

> 禁止把原版二进制放入公开仓库或 Release，详见[模组开发规范](./guidelines.md)。

## 第一步：准备私有 lib 仓库

1. 新建一个**私有**仓库，例如 `my-mods-libs`
2. 把游戏目录 `A Dance of Fire and Ice\ADofAI_Data\Managed\` 下的原版 DLL 放入其中（结构与原目录保持一致）：

   ```
   my-mods-libs/
   └── Managed/
       ├── Assembly-CSharp.dll
       ├── UnityEngine.dll
       ├── UnityEngine.CoreModule.dll
       └── ...
   ```

3. 推送到 GitHub（仓库是私有的，二进制不会公开）

> 这些 DLL 仅作为**构建依赖**，不要修改、不要外发，仅供 CI 内部使用。

## 第二步：创建 Personal Access Token（PAT）

CI 需要权限克隆私有仓库：

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
2. 创建新 token，权限只需：
   - **Repository access**：选择你的私有 lib 仓库
   - **Contents → Read**（读取权限）
3. 复制 token 值

## 第三步：把 PAT 存为 Secret

在**你的 Mod 仓库**里：

1. Settings → Secrets and variables → Actions
2. New repository secret
3. 名字：`LIBS_PAT`（或任意名），值：粘贴上一步的 token

> Secret 不会出现在日志里，CI 中通过 <code v-pre>${{ secrets.LIBS_PAT }}</code> 使用。

## 第四步：编写 Actions 工作流

在仓库创建 `.github/workflows/build.yml`：

```yaml
name: Build

on:
  push:
    tags:
      - "v*"        # 打 tag 时触发

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4

      # 1. 克隆私有 lib 仓库（用 PAT）
      - name: Clone private libs
        run: |
          git clone https://${{ secrets.LIBS_PAT }}@github.com/yourname/my-mods-libs.git libs

      # 2. 安装 .NET
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: "8.x"

      # 3. 构建（引用 libs/ 下的 DLL）
      - name: Build
        run: dotnet build MyFirstMod.csproj -c Release -p:ADOFAI_PATH=libs

      # 4. 打包 Mod 目录
      - name: Package
        shell: pwsh
        run: |
          $mod = "MyFirstMod"
          New-Item -ItemType Directory -Path dist/$mod -Force | Out-Null
          Copy-Item MyFirstMod/bin/Release/**/*.dll dist/$mod/
          Copy-Item Info.json dist/$mod/
          Copy-Item README.md dist/$mod/

      # 5. 发布到 Release
      - uses: softprops/action-gh-release@v2
        with:
          files: dist/MyFirstMod/*
```

## 让 csproj 支持 libs 路径

工作流用 `-p:ADOFAI_PATH=libs` 传入 lib 仓库路径，`.csproj` 中要使用这个属性：

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <!-- 本地路径：你的游戏目录 -->
    <ADOFAI_PATH Condition="'$(ADOFAI_PATH)' == ''">D:\Steam\steamapps\common\A Dance of Fire and Ice</ADOFAI_PATH>
  </PropertyGroup>

  <ItemGroup>
    <Reference Include="Assembly-CSharp">
      <HintPath>$(ADOFAI_PATH)\ADofAI_Data\Managed\Assembly-CSharp.dll</HintPath>
      <Private>false</Private>
    </Reference>
  </ItemGroup>
</Project>
```

- `Condition`：CI 传入 `ADOFAI_PATH` 时使用 CI 路径，本地开发用默认游戏路径
- `<Private>false</Private>`：不把游戏 DLL 复制进输出目录

## 工作流解析

| 步骤 | 作用 |
| --- | --- |
| `checkout@v4` | 拉取你的 Mod 源码 |
| 克隆私有 libs | 用 `secrets.LIBS_PAT` 拉取二进制依赖 |
| `setup-dotnet` | 准备构建环境 |
| `dotnet build` | 编译 Release |
| Package | 拼出 `Mods/MyFirstMod/` 目录结构 |
| `action-gh-release` | 上传到 Release 资产 |

## 触发方式

```yaml
on:
  push:
    tags:
      - "v*"
```

推送 `v1.0.0` 这样的 tag 时自动构建并发布：

```bash
git tag v1.0.0
git push origin v1.0.0
```

## 常见问题

### 构建找不到游戏 DLL？

确认私有 lib 仓库目录结构与 `.csproj` 里的 `HintPath` 一致（都是 `ADofAI_Data/Managed/`）。

### Secret 名写错？

Actions 运行日志里 <code v-pre>${{ secrets.XXX }}</code> 用错了名字会直接以空串代替。检查 Secret 名是否完全一致。

### PAT 没权限克隆？

确认 PAT 的 **Contents: Read** 权限且仓库 access 只勾选了 lib 仓库。

## 你学到了什么

- 为什么需要私有 lib 仓库
- 如何创建 PAT 并配置 Secret
- 完整的 CI 工作流与 csproj 适配

## 下一步

发布前务必阅读规范 → [模组开发规范](./guidelines.md)