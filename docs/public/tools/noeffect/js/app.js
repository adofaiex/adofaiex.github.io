import { files, setFiles, isProcessing, setIsProcessing, currentPreset, lang, setLang as setStateLang } from './state.js';
import { REGULAR_EVENTS, ALL_DECORATION_TYPES, generateId, formatBytes, statusText, showError } from './utils.js';
import { initPresetEditor, editorEvents, editorDecorations, editorFilterType } from './preset.js';
import { t, applyLang, setLang } from './i18n.js';

const ParserX = new window.ADOFAI.Parsers.StringParser();

document.addEventListener('DOMContentLoaded', () => {
  initLangSwitcher();
  applyLang();
  initPresetEditor();
  setupEventListeners();
});

function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.onclick = () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setLang(btn.dataset.lang);
      setStateLang(btn.dataset.lang);
      applyLang();
      render();
    };
  });
}

function setupEventListeners() {
  document.getElementById('uploadBtn').onclick = () => document.getElementById('fileInput').click();
  document.getElementById('fileInput').onchange = handleFileSelect;

  const dropZone = document.getElementById('dropZone');
  dropZone.ondragover = (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--primary)'; };
  dropZone.ondragleave = () => { dropZone.style.borderColor = ''; };
  dropZone.ondrop = (e) => { e.preventDefault(); dropZone.style.borderColor = ''; addFiles(e.dataTransfer.files); };

  document.getElementById('processAllBtn').onclick = processAll;
  document.getElementById('downloadAllBtn').onclick = downloadAll;
  document.getElementById('clearAllBtn').onclick = clearAll;

  document.getElementById('fileList').onclick = (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'process') processSingle(id);
    else if (action === 'download') downloadFile(id);
    else if (action === 'remove') removeFile(id);
  };
}

function addFiles(fileList) {
  const valid = Array.from(fileList).filter(f =>
    /\.(adofai|json|jsonc|hjson)$/i.test(f.name)
  );
  const items = valid.map(f => ({
    id: generateId(), file: f, status: 'pending', processedContent: null, error: null
  }));
  setFiles([...files, ...items]);
  render();
}

function removeFile(id) {
  setFiles(files.filter(f => f.id !== id));
  render();
}

function clearAll() {
  setFiles([]);
  render();
}

function handleFileSelect(e) {
  if (e.target.files.length) { addFiles(e.target.files); e.target.value = ''; }
}

function processFileContent(item) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target.result;
        const effType = document.querySelector('input[name="effectType"]:checked').value;
        const preset = currentPreset;
        const level = new window.ADOFAI.Level(content, ParserX);
        level.on('load', () => {
          try {
            if (effType === 'custom') {
              if (!preset) throw new Error(t('error.presetMissing'));
              level.clearEvent({ type: preset.type, events: preset.events || [] });
              if (preset.decorations?.length) {
                level.tiles.forEach(tile => {
                  if (tile.addDecorations) {
                    tile.addDecorations = preset.type === 'exclude'
                      ? tile.addDecorations.filter(d => !preset.decorations.includes(d.eventType))
                      : tile.addDecorations.filter(d => preset.decorations.includes(d.eventType));
                  }
                  if (Array.isArray(tile.actions)) {
                    tile.actions = tile.actions.filter(a => !preset.decorations.includes(a.eventType));
                  }
                });
              }
            } else {
              if (effType.includes('preset_noeffect')) level.clearDeco();
              level.clearEffect(effType);
            }
            level.calculateTileCoordinates();
            resolve(level.export());
          } catch (err) { reject(new Error(t('error.processFile', { name: item.file.name, msg: err.message }))); }
        });
        level.load();
      } catch (err) { reject(new Error(t('error.parseFile', { msg: err.message }))); }
    };
    reader.onerror = () => reject(new Error(t('error.readFile')));
    reader.readAsText(item.file, 'utf-8');
  });
}

async function processSingle(id) {
  const item = files.find(f => f.id === id);
  if (!item) return;
  setFiles(files.map(f => f.id === id ? { ...f, status: 'processing' } : f));
  render();
  try {
    const content = await processFileContent(item);
    setFiles(files.map(f => f.id === id ? { ...f, status: 'completed', processedContent: content } : f));
  } catch (err) {
    showError(err.message);
    setFiles(files.map(f => f.id === id ? { ...f, status: 'error', error: err.message } : f));
  }
  render();
}

async function processAll() {
  const pending = files.filter(f => f.status === 'pending');
  if (!pending.length || isProcessing) return;
  setIsProcessing(true);
  document.getElementById('progressArea').hidden = false;
  render();
  for (let i = 0; i < pending.length; i++) {
    await processSingle(pending[i].id);
    updateProgress(((i + 1) / pending.length) * 100);
  }
  setIsProcessing(false);
  document.getElementById('progressArea').hidden = true;
  render();
}

function updateProgress(pct) {
  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('progressText').textContent = `${Math.round(pct)}%`;
}

function downloadFile(id) {
  const item = files.find(f => f.id === id);
  if (!item?.processedContent) return;
  const blob = new Blob([item.processedContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const parts = item.file.name.split('.');
  const ext = parts.pop();
  a.href = url;
  a.download = `${parts.join('.')}_processed.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadAll() {
  files.filter(f => f.status === 'completed' && f.processedContent).forEach(f => downloadFile(f.id));
}

function render() {
  const pending = files.filter(f => f.status === 'pending').length;
  const completed = files.filter(f => f.status === 'completed').length;
  const errors = files.filter(f => f.status === 'error').length;

  document.getElementById('fileListTitle').innerHTML = t('fileList.title', { count: `<span id="fileCount">${files.length}</span>` });
  document.getElementById('pendingBadge').innerHTML = t('fileList.pending', { count: pending });
  document.getElementById('completedBadge').innerHTML = t('fileList.completed', { count: completed });
  const errBadge = document.getElementById('errorBadge');
  if (errors > 0) {
    errBadge.hidden = false;
    errBadge.innerHTML = t('fileList.failed', { count: errors });
  } else {
    errBadge.hidden = true;
  }

  const list = document.getElementById('fileList');
  list.innerHTML = '';
  files.forEach(item => list.appendChild(createFileItem(item)));

  document.getElementById('batchCard').hidden = files.length === 0;
  document.getElementById('dropZone').hidden = files.length > 0;

  const pBtn = document.getElementById('processAllBtn');
  pBtn.disabled = pending === 0 || isProcessing;
  pBtn.innerHTML = `<span class="ms-icon">play_arrow</span> ${t('batch.processAll', { count: pending })}`;
  const dBtn = document.getElementById('downloadAllBtn');
  dBtn.disabled = completed === 0;
  dBtn.innerHTML = `<span class="ms-icon">download</span> ${t('batch.downloadAll', { count: completed })}`;
}

function createFileItem(item) {
  const div = document.createElement('div');
  div.className = 'file-item';
  const statusColors = {
    pending: { bg: '#E5E1E6', color: '#44474E' },
    processing: { bg: '#DBE2F9', color: '#141B2C' },
    completed: { bg: '#D7F5DD', color: '#003A1F' },
    error: { bg: '#FFDAD6', color: '#410002' }
  };
  const sc = statusColors[item.status] || statusColors.pending;
  const actions = [];
  if (item.status === 'pending') actions.push(`<button class="btn outlined-btn btn-sm icon-btn" data-action="process" data-id="${item.id}"><span class="ms-icon">play_arrow</span> ${t('file.process')}</button>`);
  if (item.status === 'completed') actions.push(`<button class="btn outlined-btn btn-sm icon-btn" data-action="download" data-id="${item.id}"><span class="ms-icon">download</span> ${t('file.download')}</button>`);
  actions.push(`<button class="btn outlined-btn btn-sm icon-btn" color="error" data-action="remove" data-id="${item.id}"><span class="ms-icon">close</span> ${t('file.delete')}</button>`);
  div.innerHTML = `
    <span class="ms-icon file-icon">description</span>
    <div class="file-info">
      <div class="file-name">${item.file.name}</div>
      <div class="file-size">${formatBytes(item.file.size)}</div>
    </div>
    <span class="file-status" style="background:${sc.bg};color:${sc.color}">${statusText(item.status)}</span>
    <div class="file-actions">${actions.join('')}</div>`;
  return div;
}
