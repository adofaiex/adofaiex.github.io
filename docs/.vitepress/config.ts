import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const docsDir = fileURLToPath(new URL('..', import.meta.url))
const LOCALE_FILE = '.vitepress.locale.json'

interface LocaleMeta {
  label: string
  lang: string
  title: string
  description?: string
  /** 翻译 map：key 为目录/文件名，value 为导航与侧边栏显示名 */
  nav?: Record<string, string>
  /** 顶栏额外的快捷跳转（外部链接） */
  navExternal?: { text: string; link: string }[]
  ui?: {
    outline?: string
    prev?: string
    next?: string
    lastUpdated?: string
    darkModeSwitchLabel?: string
    lightModeSwitchLabel?: string
    sidebarMenuLabel?: string
    returnToTopLabel?: string
    langMenuLabel?: string
  }
}

function readLocaleMeta(dir: string): LocaleMeta | null {
  const file = join(dir, LOCALE_FILE)
  if (!existsSync(file)) return null
  return JSON.parse(readFileSync(file, 'utf-8')) as LocaleMeta
}

function humanize(name: string): string {
  return name
    .replace(/\.md$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function slug(name: string): string {
  return name.replace(/\.md$/, '')
}

interface PageInfo {
  name: string
  title: string
  order: number
}

function listPages(dir: string): PageInfo[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const file = join(dir, f)
      const content = readFileSync(file, 'utf-8')
      const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      let title = humanize(f)
      let order = Number.POSITIVE_INFINITY
      if (m) {
        const t = m[1].match(/^\s*title\s*:\s*(.+?)\s*$/m)
        if (t) title = t[1].replace(/^['"]|['"]$/g, '').trim()
        const o = m[1].match(/^\s*order\s*:\s*(\d+)\s*$/m)
        if (o) order = Number(o[1])
      }
      return { name: f, title, order }
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
}

function listSections(dir: string, excluded: Set<string>, only?: Set<string>): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        !d.name.startsWith('.') &&
        !excluded.has(d.name) &&
        d.name !== 'public' &&
        (!only || only.has(d.name))
    )
    .map((d) => d.name)
}

function sectionOrder(dir: string): number {
  const idx = join(dir, 'index.md')
  if (!existsSync(idx)) return Number.POSITIVE_INFINITY
  const m = readFileSync(idx, 'utf-8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return Number.POSITIVE_INFINITY
  const o = m[1].match(/^\s*order\s*:\s*(\d+)\s*$/m)
  return o ? Number(o[1]) : Number.POSITIVE_INFINITY
}

function buildSidebar(
  dir: string,
  prefix: string,
  labels: Record<string, string> | undefined,
  excluded: Set<string>,
  only?: Set<string>
): DefaultTheme.SidebarItem[] {
  const entries: { item: DefaultTheme.SidebarItem; order: number; name: string }[] = []
  for (const p of listPages(dir)) {
    if (p.name === 'index.md') continue
    entries.push({
      item: { text: p.title, link: `${prefix}/${slug(p.name)}` },
      order: p.order,
      name: p.name
    })
  }
  for (const s of listSections(dir, excluded, only)) {
    const sub = join(dir, s)
    const subItems = buildSidebar(sub, `${prefix}/${s}`, labels, excluded)
    if (subItems.length === 0) continue
    const label = labels?.[s] ?? humanize(s)
    const group: DefaultTheme.SidebarItem = {
      text: label,
      collapsed: false,
      items: subItems
    }
    if (existsSync(join(sub, 'index.md'))) {
      group.link = `${prefix}/${s}/`
    }
    entries.push({ item: group, order: sectionOrder(sub), name: s })
  }
  entries.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
  return entries.map((e) => e.item)
}

/** 侧边栏树：学习路线（含库文档）与使用指南 */
interface TreeDef {
  /** 该树包含的顶层 section 目录（按 frontmatter order 排序） */
  sections: string[]
  /** 侧边栏挂载的路径前缀 */
  mount: string[]
  /** 导航入口 section（优先，缺失则回退到 sections 中第一个有 index.md 的） */
  primary: string
}

const TREES: TreeDef[] = [
  { sections: ['guide', 'learn', 'libs'], mount: ['/guide/', '/learn/', '/libs/'], primary: 'learn' },
  { sections: ['mods'], mount: ['/mods/'], primary: 'mods' }
]

function treeEntry(dir: string, tree: TreeDef): string | null {
  for (const s of [tree.primary, ...tree.sections]) {
    if (existsSync(join(dir, s, 'index.md'))) return s
  }
  return null
}

function buildNav(
  dir: string,
  prefix: string,
  labels: Record<string, string> | undefined,
  excluded: Set<string>,
  navExternal: { text: string; link: string }[] | undefined
): DefaultTheme.NavItem[] {
  const entries: DefaultTheme.NavItem[] = []
  for (const tree of TREES) {
    const entry = treeEntry(dir, tree)
    if (!entry) continue
    const label = labels?.[tree.primary] ?? labels?.[entry] ?? humanize(tree.primary)
    entries.push({ text: label, link: `${prefix}/${entry}/` })
  }
  for (const ext of navExternal ?? []) {
    entries.push({ text: ext.text, link: ext.link })
  }
  return entries
}

function buildSidebarForLocale(
  dir: string,
  prefix: string,
  labels: Record<string, string> | undefined,
  excluded: Set<string>
): DefaultTheme.Sidebar {
  const sidebar: Record<string, DefaultTheme.SidebarItem[]> = {}
  for (const tree of TREES) {
    const items = buildSidebar(dir, prefix, labels, excluded, new Set(tree.sections))
    if (items.length === 0) continue
    for (const m of tree.mount) {
      sidebar[`${prefix}${m}`] = items
    }
  }
  return sidebar
}

interface SearchTranslations {
  button: { buttonText: string; buttonAriaLabel: string }
  modal: {
    displayDetails: string
    resetButtonTitle: string
    backButtonTitle: string
    noResultsText: string
    footer: {
      selectText: string
      selectKeyAriaLabel: string
      navigateText: string
      navigateUpKeyAriaLabel: string
      navigateDownKeyAriaLabel: string
      closeText: string
      closeKeyAriaLabel: string
    }
  }
}

function searchTranslations(lang: string): SearchTranslations {
  const zh = lang.startsWith('zh')
  return {
    button: {
      buttonText: zh ? '搜索' : 'Search',
      buttonAriaLabel: zh ? '打开搜索' : 'Open search'
    },
    modal: {
      displayDetails: zh ? '显示详情' : 'Display detailed list',
      resetButtonTitle: zh ? '清除搜索条件' : 'Clear search query',
      backButtonTitle: zh ? '返回' : 'Back',
      noResultsText: zh ? '未找到相关结果' : 'No results found',
      footer: {
        selectText: zh ? '选择' : 'Select',
        selectKeyAriaLabel: zh ? '选择' : 'Select',
        navigateText: zh ? '切换' : 'Navigate',
        navigateUpKeyAriaLabel: zh ? '上一条' : 'Previous',
        navigateDownKeyAriaLabel: zh ? '下一条' : 'Next',
        closeText: zh ? '关闭' : 'Close',
        closeKeyAriaLabel: zh ? '关闭' : 'Close'
      }
    }
  }
}

const rootMeta = readLocaleMeta(docsDir)
if (!rootMeta) throw new Error(`missing ${LOCALE_FILE} at docs root`)

const locales: Record<string, { path: string; dir: string; meta: LocaleMeta }> = {
  root: { path: '', dir: docsDir, meta: rootMeta }
}
const excluded = new Set<string>()
for (const d of readdirSync(docsDir, { withFileTypes: true })) {
  if (!d.isDirectory() || d.name.startsWith('.')) continue
  const meta = readLocaleMeta(join(docsDir, d.name))
  if (meta) {
    locales[d.name] = { path: d.name, dir: join(docsDir, d.name), meta }
    excluded.add(d.name)
  }
}

function buildLocaleTheme(locale: { path: string; dir: string; meta: LocaleMeta }): DefaultTheme.Config['themeConfig'] {
  const { path, dir, meta } = locale
  const prefix = path === '' ? '' : `/${path}`
  const labels = meta.nav
  const nav = buildNav(dir, prefix, labels, excluded, meta.navExternal)
  const sidebar = buildSidebarForLocale(dir, prefix, labels, excluded)
  const ui = meta.ui ?? {}
  return {
    nav,
    sidebar,
    outline: { label: ui.outline ?? meta.label },
    docFooter: { prev: ui.prev ?? meta.label, next: ui.next ?? meta.label },
    lastUpdated: { text: ui.lastUpdated ?? meta.label },
    editLink: {
      pattern: 'https://github.com/adofaiex/adofaiex.github.io/edit/learn/docs/:path',
      text: ui.editLinkText ?? 'Edit this page'
    },
    darkModeSwitchLabel: ui.darkModeSwitchLabel ?? meta.label,
    lightModeSwitchLabel: ui.lightModeSwitchLabel ?? meta.label,
    sidebarMenuLabel: ui.sidebarMenuLabel ?? meta.label,
    returnToTopLabel: ui.returnToTopLabel ?? meta.label,
    langMenuLabel: ui.langMenuLabel ?? meta.label
  }
}

const siteLocales = Object.fromEntries(
  Object.entries(locales).map(([path, l]) => [
    path,
    {
      label: l.meta.label,
      lang: l.meta.lang,
      title: l.meta.title,
      description: l.meta.description,
      themeConfig: buildLocaleTheme(l)
    }
  ])
)

const searchLocales = Object.fromEntries(
  Object.entries(locales).map(([path, l]) => [path, { translations: searchTranslations(l.meta.lang) }])
)

export default defineConfig({
  lang: rootMeta.lang,
  title: rootMeta.title,
  description: rootMeta.description,
  locales: siteLocales,
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  outDir: '../dist',
  // TEMPORARY: translation in progress — root EN locale links to not-yet-translated chapters.
  // TODO: restore `ignoreDeadLinks: [(link) => link.startsWith('/tools/')]` once all locales are complete.
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#5f7cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: rootMeta.title }]
  ],
  markdown: {
    lineNumbers: true
  },
  vite: {},
  themeConfig: {
    i18nRouting: true,
    logo: { light: '/logo.svg', dark: '/logo-dark.svg' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/adofaiex' },
      { icon: 'discord', link: 'https://discord.gg/ddndY4xXeK' }
    ],
    search: {
      provider: 'local',
      options: { locales: searchLocales }
    },
    footer: {
      message: 'An organization that researches and expands the functions of ADOFAI',
      copyright: '© 2026 ADOFAI Expansion'
    }
  }
})