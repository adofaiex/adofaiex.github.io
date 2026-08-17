---
title: GitHub Actions Auto Build
order: 23
---

# GitHub Actions Auto Build

Manually compiling, packaging, and uploading Releases is tedious. With GitHub Actions, CI/CD can automate it all: push code → auto-compile → auto-package → auto-publish.

## Why You Need a Private Lib Repository

ADOFAI Mods **must reference the game's original DLLs** (`Assembly-CSharp.dll`, etc.) at compile time. But these DLLs are **copyright-protected and cannot be placed in public repositories**.

The solution: **create a private repository specifically to store these binaries**, and use a token to access it during CI builds. This is the "private lib repository" approach.

> Never put original binaries in public repositories or Releases — see [Development Guidelines](./guidelines.md).

## Step 1: Prepare the Private Lib Repository

1. Create a **private** repository, e.g. `my-mods-libs`
2. Place the original DLLs from the game directory `A Dance of Fire and Ice\ADofAI_Data\Managed\` into it (keep the same directory structure):

   ```
   my-mods-libs/
   └── Managed/
       ├── Assembly-CSharp.dll
       ├── UnityEngine.dll
       ├── UnityEngine.CoreModule.dll
       └── ...
   ```

3. Push to GitHub (the repository is private, so binaries won't be exposed)

> These DLLs are **build dependencies only** — don't modify, don't distribute, for CI internal use only.

## Step 2: Create a Personal Access Token (PAT)

CI needs permission to clone the private repository:

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
2. Create a new token with only:
   - **Repository access**: select your private lib repository
   - **Contents → Read** (read permission)
3. Copy the token value

## Step 3: Store the PAT as a Secret

In **your Mod repository**:

1. Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `LIBS_PAT` (or any name), value: paste the token from the previous step

> Secrets don't appear in logs. In CI, use <code v-pre>${{ secrets.LIBS_PAT }}</code>.

## Step 4: Write the Actions Workflow

Create `.github/workflows/build.yml` in your repository:

```yaml
name: Build

on:
  push:
    tags:
      - "v*"        # Trigger on tag push

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4

      # 1. Clone the private lib repository (using PAT)
      - name: Clone private libs
        run: |
          git clone https://${{ secrets.LIBS_PAT }}@github.com/yourname/my-mods-libs.git libs

      # 2. Install .NET
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: "8.x"

      # 3. Build (referencing DLLs under libs/)
      - name: Build
        run: dotnet build MyFirstMod.csproj -c Release -p:ADOFAI_PATH=libs

      # 4. Package the Mod directory
      - name: Package
        shell: pwsh
        run: |
          $mod = "MyFirstMod"
          New-Item -ItemType Directory -Path dist/$mod -Force | Out-Null
          Copy-Item MyFirstMod/bin/Release/**/*.dll dist/$mod/
          Copy-Item Info.json dist/$mod/
          Copy-Item README.md dist/$mod/

      # 5. Publish to Release
      - uses: softprops/action-gh-release@v2
        with:
          files: dist/MyFirstMod/*
```

## Making csproj Support the libs Path

The workflow passes the lib repository path via `-p:ADOFAI_PATH=libs`. Your `.csproj` should use this property:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <!-- Local path: your game directory -->
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

- `Condition`: when CI passes `ADOFAI_PATH`, it uses the CI path; for local development, it uses the default game path
- `<Private>false</Private>`: don't copy game DLLs into the output directory

## Workflow Breakdown

| Step | Purpose |
| --- | --- |
| `checkout@v4` | Pull your Mod source code |
| Clone private libs | Pull binary dependencies using `secrets.LIBS_PAT` |
| `setup-dotnet` | Prepare the build environment |
| `dotnet build` | Compile Release |
| Package | Assemble the `Mods/MyFirstMod/` directory structure |
| `action-gh-release` | Upload to Release assets |

## Trigger

```yaml
on:
  push:
    tags:
      - "v*"
```

Push a tag like `v1.0.0` to auto-build and publish:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Common Issues

### Build can't find game DLLs?

Confirm the private lib repository directory structure matches the `HintPath` in `.csproj` (both should use `ADofAI_Data/Managed/`).

### Secret name wrong?

In the Actions run log, using the wrong name for <code v-pre>${{ secrets.XXX }}</code> will silently substitute an empty string. Check that the Secret name matches exactly.

### PAT lacks clone permission?

Confirm the PAT has **Contents: Read** permission and that repository access only checks the lib repository.

## What You Learned

- Why you need a private lib repository
- How to create a PAT and configure a Secret
- The complete CI workflow and csproj adaptation

## Next Step

Read the guidelines before publishing → [Development Guidelines](./guidelines.md)
