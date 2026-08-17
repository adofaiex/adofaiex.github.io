export const REGULAR_EVENTS = [
  'SetSpeed', 'Twirl', 'Checkpoint', 'SetHitsound', 'PlaySound',
  'SetPlanetRotation', 'Pause', 'AutoPlayTiles', 'ScalePlanets',
  'ColorTrack', 'AnimateTrack', 'RecolorTrack', 'MoveTrack', 'PositionTrack',
  'CustomBackground', 'Flash', 'MoveCamera', 'SetFilter', 'SetFilterAdvanced',
  'HallofMirrors', 'ShakeScreen', 'Bloom', 'ScreenTile', 'ScreenScroll',
  'SetFrameRate', 'RepeatEvents', 'SetConditionalEvents', 'EditorComment',
  'Bookmark', 'Hold', 'SetHoldSound', 'MultiPlanet', 'FreeRoam',
  'FreeRoamTwirl', 'FreeRoamRemove', 'Hide', 'ScaleMargin', 'ScaleRadius'
];

export const ALL_DECORATION_TYPES = [
  'AddDecoration', 'AddText', 'AddObject', 'AddParticle',
  'MoveDecorations', 'SetText', 'SetObject', 'SetDefaultText'
];

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

import { t } from './i18n.js';
export function statusText(s) {
  return t(`status.${s}`) || s;
}

let errorTimer;
export function showError(msg) {
  const el = document.getElementById('errorMessage');
  const alert = document.getElementById('errorAlert');
  if (!el || !alert) return;
  el.textContent = msg;
  alert.hidden = false;
  clearTimeout(errorTimer);
  errorTimer = setTimeout(() => alert.hidden = true, 5000);
}
