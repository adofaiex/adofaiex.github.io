const translations = {
  zh: {
    langName: '中文',
    header: { title: 'ADOFAI NoEffect', subtitle: '支持批量处理多个ADOFAI谱面文件，包含自定义预设功能' },
    effectType: {
      title: '选择去特效类型',
      preset_noeffect: '去常规特效', preset_noeffect_completely: '完全去特效',
      preset_noholds: '去长按', preset_nomovecamera: '去运镜', custom: '自定义预设'
    },
    preset: {
      import: '导入预设', export: '导出预设',
      info: '使用下方编辑器创建预设或导入JSON文件',
      infoImported: '已导入预设: {type} 模式，{events} 个常规事件{deco}',
      infoCurrent: '当前预设: {type} 模式，{events} 个常规事件{deco}',
      decoSuffix: '，{n} 个装饰事件',
      editor: '预设编辑器',
      filterType: '过滤类型',
      exclude: '黑名单（排除选中的事件）',
      include: '白名单（只保留选中的事件）',
      regularEvents: '常规事件（tile.actions）',
      decoEvents: '装饰事件（decorations → tile.addDecorations）',
      customEvent: '输入自定义常规事件',
      customDeco: '输入自定义装饰事件',
      add: '添加',
      apply: '应用预设', clear: '清空选择',
      selectAllRegular: '全选常规', selectAllDeco: '全选装饰',
      customTag: '自定义事件', customDecoTag: '自定义装饰'
    },
    fileList: {
      title: '文件列表（{count}）',
      upload: '选择文件',
      pending: '{count} 待处理', completed: '{count} 已完成', failed: '{count} 失败',
      clear: '清空',
      dropzone: '拖拽文件到此处或点击上方「选择文件」按钮'
    },
    batch: {
      progress: '批量处理进度',
      processAll: '处理全部（{count}）', downloadAll: '下载全部（{count}）'
    },
    file: {
      process: '处理', download: '下载', delete: '删除'
    },
    status: { pending: '待处理', processing: '处理中', completed: '已完成', error: '处理失败' },
    error: {
      presetMissing: '请先设置自定义预设',
      presetFormat: '预设格式不正确',
      presetFile: '预设文件格式错误: {msg}',
      selectEvents: '请先选择要处理的事件',
      selectExport: '请先选择要导出的事件',
      processFile: '处理文件 {name} 时出错: {msg}',
      parseFile: '文件解析错误: {msg}',
      readFile: '文件读取失败'
    }
  },

  en: {
    langName: 'English',
    header: { title: 'ADOFAI NoEffect', subtitle: 'Batch process ADOFAI level files with custom presets' },
    effectType: {
      title: 'Effect Type',
      preset_noeffect: 'Remove Effects', preset_noeffect_completely: 'Remove All',
      preset_noholds: 'Remove Holds', preset_nomovecamera: 'Remove Camera', custom: 'Custom Preset'
    },
    preset: {
      import: 'Import Preset', export: 'Export Preset',
      info: 'Create a preset below or import a JSON file',
      infoImported: 'Imported: {type} mode, {events} regular events{deco}',
      infoCurrent: 'Current: {type} mode, {events} regular events{deco}',
      decoSuffix: ', {n} decorations',
      editor: 'Preset Editor',
      filterType: 'Filter Type',
      exclude: 'Exclude (remove selected events)',
      include: 'Include (keep selected events only)',
      regularEvents: 'Regular Events (tile.actions)',
      decoEvents: 'Decoration Events (decorations → tile.addDecorations)',
      customEvent: 'Enter custom event name',
      customDeco: 'Enter custom decoration name',
      add: 'Add',
      apply: 'Apply Preset', clear: 'Clear Selection',
      selectAllRegular: 'Select All Regular', selectAllDeco: 'Select All Decorations',
      customTag: 'Custom Event', customDecoTag: 'Custom Decoration'
    },
    fileList: {
      title: 'File List ({count})',
      upload: 'Choose Files',
      pending: '{count} pending', completed: '{count} done', failed: '{count} failed',
      clear: 'Clear All',
      dropzone: 'Drop files here or click "Choose Files" above'
    },
    batch: {
      progress: 'Batch Progress',
      processAll: 'Process All ({count})', downloadAll: 'Download All ({count})'
    },
    file: {
      process: 'Process', download: 'Download', delete: 'Delete'
    },
    status: { pending: 'Pending', processing: 'Processing', completed: 'Completed', error: 'Failed' },
    error: {
      presetMissing: 'Please set a custom preset first',
      presetFormat: 'Invalid preset format',
      presetFile: 'Preset file error: {msg}',
      selectEvents: 'Please select events first',
      selectExport: 'Please select events to export',
      processFile: 'Error processing {name}: {msg}',
      parseFile: 'Parse error: {msg}',
      readFile: 'Failed to read file'
    }
  },

  ja: {
    langName: '日本語',
    header: { title: 'ADOFAI NoEffect', subtitle: 'ADOFAI譜面ファイルを一括処理、カスタムプリセット対応' },
    effectType: {
      title: 'エフェクト種類',
      preset_noeffect: 'エフェクト除去', preset_noeffect_completely: '完全除去',
      preset_noholds: 'ホールド除去', preset_nomovecamera: 'カメラ除去', custom: 'カスタムプリセット'
    },
    preset: {
      import: 'プリセットを読込', export: 'プリセットを出力',
      info: 'エディタで作成するかJSONファイルを読込',
      infoImported: '読込完了: {type} モード、{events} 個の通常イベント{deco}',
      infoCurrent: '現在: {type} モード、{events} 個の通常イベント{deco}',
      decoSuffix: '、{n} 個の装飾イベント',
      editor: 'プリセットエディタ',
      filterType: 'フィルター種類',
      exclude: 'ブラックリスト（選択イベントを除外）',
      include: 'ホワイトリスト（選択イベントのみ保持）',
      regularEvents: '通常イベント（tile.actions）',
      decoEvents: '装飾イベント（decorations → tile.addDecorations）',
      customEvent: 'カスタムイベント名を入力',
      customDeco: 'カスタム装飾名を入力',
      add: '追加',
      apply: '適用', clear: '選択解除',
      selectAllRegular: '全選択(通常)', selectAllDeco: '全選択(装飾)',
      customTag: 'カスタムイベント', customDecoTag: 'カスタム装飾'
    },
    fileList: {
      title: 'ファイル一覧（{count}）',
      upload: 'ファイルを選択',
      pending: '{count} 待処理', completed: '{count} 完了', failed: '{count} 失敗',
      clear: 'クリア',
      dropzone: 'ファイルをドラッグするか「ファイルを選択」をクリック'
    },
    batch: {
      progress: '一括処理の進行状況',
      processAll: '一括処理（{count}）', downloadAll: '一括ダウンロード（{count}）'
    },
    file: {
      process: '処理', download: 'DL', delete: '削除'
    },
    status: { pending: '待処理', processing: '処理中', completed: '完了', error: 'エラー' },
    error: {
      presetMissing: 'カスタムプリセットを設定してください',
      presetFormat: 'プリセットの形式が正しくありません',
      presetFile: 'プリセットファイルエラー: {msg}',
      selectEvents: 'イベントを選択してください',
      selectExport: '出力するイベントを選択してください',
      processFile: '{name} の処理中にエラー: {msg}',
      parseFile: '解析エラー: {msg}',
      readFile: 'ファイル読込失敗'
    }
  },

  ko: {
    langName: '한국어',
    header: { title: 'ADOFAI NoEffect', subtitle: 'ADOFAI 채보 파일 일괄 처리, 사용자 정의 프리셋 지원' },
    effectType: {
      title: '이펙트 종류',
      preset_noeffect: '이펙트 제거', preset_noeffect_completely: '완전 제거',
      preset_noholds: '홀드 제거', preset_nomovecamera: '카메라 제거', custom: '사용자 프리셋'
    },
    preset: {
      import: '프리셋 불러오기', export: '프리셋 내보내기',
      info: '아래 편집기에서 만들거나 JSON 파일 불러오기',
      infoImported: '불러옴: {type} 모드, 일반 이벤트 {events}개{deco}',
      infoCurrent: '현재: {type} 모드, 일반 이벤트 {events}개{deco}',
      decoSuffix: ', 장식 이벤트 {n}개',
      editor: '프리셋 편집기',
      filterType: '필터 종류',
      exclude: '블랙리스트 (선택한 이벤트 제외)',
      include: '화이트리스트 (선택한 이벤트만 유지)',
      regularEvents: '일반 이벤트 (tile.actions)',
      decoEvents: '장식 이벤트 (decorations → tile.addDecorations)',
      customEvent: '사용자 이벤트 이름 입력',
      customDeco: '사용자 장식 이름 입력',
      add: '추가',
      apply: '프리셋 적용', clear: '선택 해제',
      selectAllRegular: '전체 선택(일반)', selectAllDeco: '전체 선택(장식)',
      customTag: '사용자 이벤트', customDecoTag: '사용자 장식'
    },
    fileList: {
      title: '파일 목록 ({count}개)',
      upload: '파일 선택',
      pending: '{count} 대기 중', completed: '{count} 완료', failed: '{count} 실패',
      clear: '전체 삭제',
      dropzone: '파일을 드래그하거나 위의 「파일 선택」 클릭'
    },
    batch: {
      progress: '일괄 처리 진행도',
      processAll: '일괄 처리 ({count})', downloadAll: '일괄 다운로드 ({count})'
    },
    file: {
      process: '처리', download: '다운로드', delete: '삭제'
    },
    status: { pending: '대기 중', processing: '처리 중', completed: '완료', error: '실패' },
    error: {
      presetMissing: '사용자 프리셋을 먼저 설정하세요',
      presetFormat: '프리셋 형식이 올바르지 않습니다',
      presetFile: '프리셋 파일 오류: {msg}',
      selectEvents: '이벤트를 먼저 선택하세요',
      selectExport: '내보낼 이벤트를 선택하세요',
      processFile: '{name} 처리 중 오류: {msg}',
      parseFile: '파싱 오류: {msg}',
      readFile: '파일 읽기 실패'
    }
  }
};

let currentLang = localStorage.getItem('adofai_lang') || 'zh';

export function getLang() { return currentLang; }

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('adofai_lang', lang);
}

function resolve(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] !== undefined ? vars[k] : `{${k}}`);
}

export function t(path, vars) {
  const val = resolve(translations[currentLang], path);
  if (val === undefined) {
    const fallback = resolve(translations['en'], path);
    return fallback !== undefined ? interpolate(fallback, vars) : path;
  }
  return interpolate(val, vars);
}

export function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}
