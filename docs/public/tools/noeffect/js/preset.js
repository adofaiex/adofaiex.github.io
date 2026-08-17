import { REGULAR_EVENTS, ALL_DECORATION_TYPES, showError } from './utils.js';
import { currentPreset, setCurrentPreset } from './state.js';
import { t } from './i18n.js';

export let editorEvents = [];
export let editorDecorations = [];
export let editorFilterType = 'exclude';

export function initPresetEditor() {
  renderGrid('regularEventsGrid', REGULAR_EVENTS, editorEvents, toggleEvent);
  renderGrid('decoEventsGrid', ALL_DECORATION_TYPES, editorDecorations, toggleDecoration);

  document.getElementById('addCustomEventBtn').onclick = addCustomEvent;
  document.getElementById('addCustomDecoBtn').onclick = addCustomDecoration;
  document.getElementById('customEventInput').onkeydown = (e) => { if (e.key === 'Enter') addCustomEvent(); };
  document.getElementById('customDecoInput').onkeydown = (e) => { if (e.key === 'Enter') addCustomDecoration(); };

  document.querySelectorAll('#filterTypeGroup .chip').forEach(el => {
    el.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) editorFilterType = e.target.value;
    });
  });

  document.getElementById('applyPresetBtn').onclick = applyPreset;
  document.getElementById('clearPresetBtn').onclick = clearAll;
  document.getElementById('selectAllEventsBtn').onclick = () => selectAll('events');
  document.getElementById('selectAllDecosBtn').onclick = () => selectAll('decos');

  document.getElementById('presetFileInput').onchange = importPreset;
  document.getElementById('importPresetBtn').onclick = () => document.getElementById('presetFileInput').click();
  document.getElementById('exportPresetBtn').onclick = exportPreset;

  document.querySelectorAll('#effectTypeGroup .chip').forEach(el => {
    el.querySelector('input').addEventListener('change', (e) => {
      const isCustom = e.target.value === 'custom';
      document.getElementById('customPresetBar').hidden = !isCustom;
      document.getElementById('presetEditorCard').hidden = !isCustom;
    });
  });
}

function renderGrid(id, allEvents, selected, onChange) {
  const grid = document.getElementById(id);
  grid.innerHTML = '';
  allEvents.forEach(ev => {
    const div = document.createElement('div');
    div.className = 'event-item';
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = selected.includes(ev);
    cb.onchange = () => onChange(ev);
    label.appendChild(cb);
    label.append(ev);
    div.appendChild(label);
    grid.appendChild(div);
  });
}

function toggleEvent(ev) {
  editorEvents = editorEvents.includes(ev)
    ? editorEvents.filter(e => e !== ev)
    : [...editorEvents, ev];
  renderGrid('regularEventsGrid', REGULAR_EVENTS, editorEvents, toggleEvent);
  renderCustomTags('regular');
}

function toggleDecoration(ev) {
  editorDecorations = editorDecorations.includes(ev)
    ? editorDecorations.filter(e => e !== ev)
    : [...editorDecorations, ev];
  renderGrid('decoEventsGrid', ALL_DECORATION_TYPES, editorDecorations, toggleDecoration);
  renderCustomTags('deco');
}

function addCustomEvent() {
  const input = document.getElementById('customEventInput');
  const name = input.value.trim();
  if (!name) return;
  if (!editorEvents.includes(name)) {
    editorEvents = [...editorEvents, name];
    renderGrid('regularEventsGrid', REGULAR_EVENTS, editorEvents, toggleEvent);
    renderCustomTags('regular');
  }
  input.value = '';
}

function addCustomDecoration() {
  const input = document.getElementById('customDecoInput');
  const name = input.value.trim();
  if (!name) return;
  if (!editorDecorations.includes(name)) {
    editorDecorations = [...editorDecorations, name];
    renderGrid('decoEventsGrid', ALL_DECORATION_TYPES, editorDecorations, toggleDecoration);
    renderCustomTags('deco');
  }
  input.value = '';
}

function renderCustomTags(type) {
  const list = type === 'regular' ? editorEvents : editorDecorations;
  const base = type === 'regular' ? REGULAR_EVENTS : ALL_DECORATION_TYPES;
  const container = document.getElementById(type === 'regular' ? 'customEventsList' : 'customDecorationsList');
  const custom = list.filter(e => !base.includes(e));
  if (custom.length === 0) { container.innerHTML = ''; return; }
  const tagLabel = type === 'regular' ? t('preset.customTag') : t('preset.customDecoTag');
  container.innerHTML = `<div class="event-chips">${custom.map(e =>
    `<span class="chip-tag">${e}<button class="remove" data-type="${type}" data-event="${e}">✕</button></span>`
  ).join('')}</div>`;
  container.querySelectorAll('.remove').forEach(btn => {
    btn.onclick = () => {
      if (type === 'regular') toggleEvent(btn.dataset.event);
      else toggleDecoration(btn.dataset.event);
    };
  });
}

function selectAll(type) {
  if (type === 'events') {
    editorEvents = [...REGULAR_EVENTS];
    renderGrid('regularEventsGrid', REGULAR_EVENTS, editorEvents, toggleEvent);
    renderCustomTags('regular');
  } else {
    editorDecorations = [...ALL_DECORATION_TYPES];
    renderGrid('decoEventsGrid', ALL_DECORATION_TYPES, editorDecorations, toggleDecoration);
    renderCustomTags('deco');
  }
}

function clearAll() {
  editorEvents = [];
  editorDecorations = [];
  setCurrentPreset(null);
  document.getElementById('presetInfo').textContent = t('preset.info');
  renderGrid('regularEventsGrid', REGULAR_EVENTS, editorEvents, toggleEvent);
  renderGrid('decoEventsGrid', ALL_DECORATION_TYPES, editorDecorations, toggleDecoration);
  renderCustomTags('regular');
  renderCustomTags('deco');
}

export function applyPreset() {
  if (editorEvents.length === 0 && editorDecorations.length === 0) {
    showError(t('error.selectEvents'));
    return;
  }
  const preset = { type: editorFilterType, events: editorEvents, decorations: editorDecorations };
  setCurrentPreset(preset);
  const deco = editorDecorations.length;
  const info = editorDecorations.length
    ? t('preset.infoCurrent', { type: editorFilterType, events: editorEvents.length, deco: t('preset.decoSuffix', { n: deco }) })
    : t('preset.infoCurrent', { type: editorFilterType, events: editorEvents.length, deco: '' });
  document.getElementById('presetInfo').textContent = info;
  document.querySelector('#effectTypeGroup .chip[data-value="custom"] input').checked = true;
  document.getElementById('customPresetBar').hidden = false;
  document.getElementById('presetEditorCard').hidden = false;
}

function importPreset(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const p = JSON.parse(ev.target.result);
      if (!p.type || !Array.isArray(p.events)) throw new Error(t('error.presetFormat'));
      editorFilterType = p.type;
      editorEvents = p.events || [];
      editorDecorations = p.decorations || [];
      document.querySelector(`#filterTypeGroup .chip[data-value="${p.type}"] input`).checked = true;
      setCurrentPreset(p);
      renderGrid('regularEventsGrid', REGULAR_EVENTS, editorEvents, toggleEvent);
      renderGrid('decoEventsGrid', ALL_DECORATION_TYPES, editorDecorations, toggleDecoration);
      renderCustomTags('regular');
      renderCustomTags('deco');
      const deco = editorDecorations.length;
      const info = deco
        ? t('preset.infoImported', { type: p.type, events: p.events.length, deco: t('preset.decoSuffix', { n: deco }) })
        : t('preset.infoImported', { type: p.type, events: p.events.length, deco: '' });
      document.getElementById('presetInfo').textContent = info;
    } catch (err) {
      showError(t('error.presetFile', { msg: err.message }));
    }
  };
  reader.readAsText(file);
}

function exportPreset() {
  if (editorEvents.length === 0 && editorDecorations.length === 0) {
    showError(t('error.selectExport'));
    return;
  }
  const preset = { type: editorFilterType, events: editorEvents, decorations: editorDecorations };
  const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `adofai_preset_${preset.type}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
