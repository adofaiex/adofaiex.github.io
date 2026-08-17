import { getLang } from './i18n.js';

export let files = [];
export let isProcessing = false;
export let currentPreset = null;
export let lang = getLang();

export function setFiles(v) { files = v; }
export function setIsProcessing(v) { isProcessing = v; }
export function setCurrentPreset(v) { currentPreset = v; }
export function setLang(v) { lang = v; }
