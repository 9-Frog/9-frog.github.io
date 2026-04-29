import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Clapperboard, Download, House, Image as ImageIcon, Lightbulb, Moon, Ruler, ScanLine, Settings2, Sun, X } from 'lucide-react';
const visoraLogo = new URL('./assets/visora-logo.png', import.meta.url).href;
const exportWatermark = new URL('./assets/visora-export-watermark.png', import.meta.url).href;
import { siteConfig } from './config/siteConfig.js';
import VerandaScene from './components/VerandaScene.js';
import { exportConfigToGlb } from './lib/arModel.js';
const colorOptions = [
    { key: 'oyster-white', name: 'Kırık Beyaz', ral: 'RAL1013', swatch: '#E9E5D0', frame: '#d9d5bf' },
    { key: 'anthracite-grey', name: 'Antrasit Gri', ral: 'RAL7016', swatch: '#2C3033', frame: '#394044' },
    { key: 'jet-black', name: 'Siyah', ral: 'RAL9005', swatch: '#101214', frame: '#171b1d' },
    { key: 'pure-white', name: 'Saf Beyaz', ral: 'RAL9010', swatch: '#F5F5F2', frame: '#efefea' },
    { key: 'traffic-white', name: 'Trafik Beyazı', ral: 'RAL9016', swatch: '#FFFFFF', frame: '#f7f8f6' },
];
const landingOptions = siteConfig.menu.projectCards;
const brandLogo = siteConfig.branding.logo;
const homepageUrl = siteConfig.branding.homepageUrl;
const socialLinks = siteConfig.branding.socialLinks;
const configuredWhatsappNumber = siteConfig.branding.whatsappNumber.replace(/\D/g, '');
const enabledRoofOptions = siteConfig.configurator.roofOptions.filter((option) => option.enabled);
const defaultRoofMaterial = enabledRoofOptions[0]?.key ?? 'glass';
const roofLabelMap = {
    glass: 'Cam',
    polycarbonate: 'Polikarbon',
    aluminium: 'Alüminyum Panel',
    fabric: 'Kumaş Pergola',
    bioclimatic: 'Biyoklimatik Pergola',
    'lux-bioclimatic': 'Lüks Biyoklimatik Pergola',
};
const enabledEnclosureOptions = siteConfig.configurator.sideOptions.filter((option) => option.enabled);
const defaultEnclosureType = enabledEnclosureOptions.find((option) => option.key === 'none')?.key ?? enabledEnclosureOptions[0]?.key ?? 'none';
const enclosureLabelMap = {
    sliding: 'Sürgülü cam kapı',
    bifold: 'Katlanır kapı',
    guillotine: 'Giyotin cam',
    fixed: 'Sabit cam',
    aluminium: 'Alüminyum Panel',
    none: 'Yok',
};
const addonsConfig = siteConfig.configurator.addons;
const hasAnyAddonOption = addonsConfig.lights || addonsConfig.roofAwning || addonsConfig.sideAwnings;
const enclosureOptionIconMap = {
    sliding: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("rect", { x: "2", y: "3", width: "12", height: "10", rx: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }), _jsx("path", { d: "M5 13V3M11 13V3", stroke: "currentColor", strokeWidth: "1.3" }), _jsx("path", { d: "M2 5H14", stroke: "currentColor", strokeWidth: "1.3" })] }),
    bifold: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("path", { d: "M2 3.2H6V12.8H2zM6 4l3 1.2v5.6L6 12zM9 5l5 1.4v3.2L9 11z", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }), _jsx("path", { d: "M6 4V12M9 5V11", stroke: "currentColor", strokeWidth: "1.2" })] }),
    guillotine: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("rect", { x: "2", y: "2.5", width: "12", height: "11", rx: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }), _jsx("path", { d: "M2.8 6.2H13.2M2.8 9.3H13.2", stroke: "currentColor", strokeWidth: "1.2" }), _jsx("path", { d: "M8 5V10.5", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })] }),
    fixed: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("rect", { x: "2", y: "2.5", width: "12", height: "11", rx: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }), _jsx("path", { d: "M8 2.8V13.2", stroke: "currentColor", strokeWidth: "1.15" }), _jsx("path", { d: "M3 6.3H7M9 6.3H13M3 9.8H7M9 9.8H13", stroke: "currentColor", strokeWidth: "1.15", strokeLinecap: "round" })] }),
    aluminium: _jsx(Settings2, { className: "h-4 w-4" }),
    none: _jsx(ArrowRight, { className: "h-4 w-4" }),
};
const ModelViewerTag = 'model-viewer';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
function normalizeHexColor(input) {
    if (!input)
        return null;
    const value = input.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(value))
        return value;
    if (/^#[0-9a-fA-F]{3}$/.test(value)) {
        return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
    }
    return null;
}
function hexToRgb(hex) {
    const normalized = normalizeHexColor(hex);
    if (!normalized)
        return { r: 0, g: 57, b: 52 };
    const numeric = Number.parseInt(normalized.slice(1), 16);
    return {
        r: (numeric >> 16) & 255,
        g: (numeric >> 8) & 255,
        b: numeric & 255,
    };
}
function rgbToHex({ r, g, b }) {
    return `#${[r, g, b].map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, '0')).join('')}`;
}
function mixHex(colorA, colorB, ratio) {
    const a = hexToRgb(colorA);
    const b = hexToRgb(colorB);
    const safeRatio = clamp(ratio, 0, 1);
    return rgbToHex({
        r: a.r + (b.r - a.r) * safeRatio,
        g: a.g + (b.g - a.g) * safeRatio,
        b: a.b + (b.b - a.b) * safeRatio,
    });
}
function withAlpha(color, alpha) {
    const { r, g, b } = hexToRgb(color);
    return `rgba(${r},${g},${b},${clamp(alpha, 0, 1)})`;
}
function getReadableTextColor(background) {
    const { r, g, b } = hexToRgb(background);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.62 ? '#0f1f1d' : '#ffffff';
}
function resolveMenuTheme(config) {
    const primary = normalizeHexColor(config?.primary) ?? '#003934';
    const palette = config?.palette ?? {};
    const text = palette.text ?? mixHex(primary, '#091311', 0.15);
    const accent = palette.accent ?? mixHex(primary, '#ffffff', 0.14);
    const accentSoft = palette.accentSoft ?? mixHex(primary, '#ffffff', 0.34);
    const shadowColor = palette.shadowColor ?? withAlpha(primary, 0.14);
    return {
        backgroundStart: palette.backgroundStart ?? mixHex(primary, '#ffffff', 0.93),
        backgroundMid: palette.backgroundMid ?? mixHex(primary, '#ffffff', 0.87),
        backgroundEnd: palette.backgroundEnd ?? mixHex(primary, '#ffffff', 0.95),
        panelBackground: palette.panelBackground ?? withAlpha('#ffffff', 0.72),
        panelBorder: palette.panelBorder ?? withAlpha('#ffffff', 0.70),
        logoBackground: palette.logoBackground ?? primary,
        text,
        accent,
        accentSoft,
        badgeBackground: palette.badgeBackground ?? withAlpha('#ffffff', 0.72),
        badgeBorder: palette.badgeBorder ?? withAlpha(accentSoft, 0.55),
        badgeText: palette.badgeText ?? accent,
        buttonBackground: palette.buttonBackground ?? '#ffffff',
        buttonBorder: palette.buttonBorder ?? withAlpha(accentSoft, 0.72),
        buttonText: palette.buttonText ?? text,
        buttonHoverBackground: palette.buttonHoverBackground ?? mixHex(primary, '#ffffff', 0.95),
        buttonHoverBorder: palette.buttonHoverBorder ?? withAlpha(accent, 0.58),
        cardBackground: palette.cardBackground ?? withAlpha('#ffffff', 0.70),
        cardBorder: palette.cardBorder ?? withAlpha('#ffffff', 0.70),
        modalBackgroundTop: palette.modalBackgroundTop ?? withAlpha('#ffffff', 0.96),
        modalBackgroundBottom: palette.modalBackgroundBottom ?? withAlpha(mixHex(primary, '#ffffff', 0.84), 0.98),
        modalOverlay: palette.modalOverlay ?? 'rgba(3,12,17,0.72)',
        liveBackground: palette.liveBackground ?? withAlpha(primary, 0.52),
        liveText: palette.liveText ?? getReadableTextColor(primary),
        shadowColor,
    };
}
const defaultDimensions = {
    width: 5,
    projection: 3,
    height: 2,
};
function formatMetres(value) {
    return `${value.toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1')} m`;
}
const sideKeyOrder = ['front', 'frontLeft', 'frontRight', 'left', 'right'];
const arAwningKeyOrder = ['roof', ...sideKeyOrder];
function isAnimatedDoorType(type) {
    return type === 'sliding' || type === 'bifold' || type === 'guillotine';
}
function animationSideLabel(side) {
    switch (side) {
        case 'frontLeft':
            return 'Ön sol';
        case 'frontRight':
            return 'Ön sağ';
        case 'left':
            return 'Sol';
        case 'right':
            return 'Sağ';
        default:
            return 'On';
    }
}
const EXPORT_PHOTO_VIEWS = [
    { view: 'hero', slug: 'hero' },
    { view: 'front', slug: 'front' },
    { view: 'right', slug: 'right' },
    { view: 'left', slug: 'left' },
    { view: 'top', slug: 'top' },
];
const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
function makeExportTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
}
function triggerBlobDownload(blob, filename) {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
let watermarkImagePromise = null;
function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Visora filigrani yuklenemedi.'));
        image.src = src;
    });
}
function getWatermarkImage() {
    if (!watermarkImagePromise) {
        watermarkImagePromise = loadImageElement(exportWatermark).catch(() => loadImageElement(visoraLogo));
    }
    return watermarkImagePromise;
}
function drawWatermark(context, canvas, watermark) {
    const logoWidth = Math.max(260, Math.min(canvas.width * 0.68, canvas.height * 0.82));
    const aspectRatio = watermark.naturalWidth > 0 && watermark.naturalHeight > 0 ? watermark.naturalWidth / watermark.naturalHeight : 2.8;
    const logoHeight = logoWidth / aspectRatio;
    const x = (canvas.width - logoWidth) / 2;
    const y = (canvas.height - logoHeight) / 2;
    context.save();
    context.globalAlpha = 0.3;
    context.drawImage(watermark, x, y, logoWidth, logoHeight);
    context.restore();
}
async function captureWatermarkedSceneBlob(scene) {
    const sourceCanvas = scene.getCanvas();
    if (!sourceCanvas) {
        throw new Error('Sahne henüz hazır değil.');
    }
    const watermark = await getWatermarkImage();
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = sourceCanvas.width;
    exportCanvas.height = sourceCanvas.height;
    const context = exportCanvas.getContext('2d');
    if (!context) {
        throw new Error('Dışa aktarım tuvali hazırlanamadı.');
    }
    context.drawImage(sourceCanvas, 0, 0);
    drawWatermark(context, exportCanvas, watermark);
    const blob = await new Promise((resolve) => {
        exportCanvas.toBlob(resolve, 'image/png', 1);
    });
    if (!blob) {
        throw new Error('Fotoğraf dışa aktarımı oluşturulamadı.');
    }
    return blob;
}
async function createWatermarkedRecordingSurface(sourceCanvas) {
    const watermark = await getWatermarkImage();
    const recordingCanvas = document.createElement('canvas');
    recordingCanvas.width = sourceCanvas.width;
    recordingCanvas.height = sourceCanvas.height;
    const context = recordingCanvas.getContext('2d');
    if (!context) {
        throw new Error('Video kayit tuvali hazirlanamadi.');
    }
    let frameId = 0;
    let running = true;
    const render = () => {
        if (!running)
            return;
        if (recordingCanvas.width !== sourceCanvas.width || recordingCanvas.height !== sourceCanvas.height) {
            recordingCanvas.width = sourceCanvas.width;
            recordingCanvas.height = sourceCanvas.height;
        }
        context.clearRect(0, 0, recordingCanvas.width, recordingCanvas.height);
        context.drawImage(sourceCanvas, 0, 0);
        drawWatermark(context, recordingCanvas, watermark);
        frameId = requestAnimationFrame(render);
    };
    render();
    return {
        canvas: recordingCanvas,
        stop: () => {
            running = false;
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        },
    };
}
function getSupportedVideoFormat() {
    if (typeof MediaRecorder === 'undefined')
        return null;
    const candidates = [
        { mimeType: 'video/mp4;codecs=avc1.64001F', extension: 'mp4' },
        { mimeType: 'video/mp4;codecs=avc1.42E01E', extension: 'mp4' },
        { mimeType: 'video/mp4;codecs=avc1', extension: 'mp4' },
        { mimeType: 'video/mp4', extension: 'mp4' },
    ];
    for (const candidate of candidates) {
        if (typeof MediaRecorder.isTypeSupported !== 'function' || MediaRecorder.isTypeSupported(candidate.mimeType)) {
            return candidate;
        }
    }
    return null;
}
const roofCodeMap = {
    glass: 'g',
    polycarbonate: 'p',
    aluminium: 'a',
    fabric: 'f',
    bioclimatic: 'b',
    'lux-bioclimatic': 'l',
};
const roofCodeReverse = Object.fromEntries(Object.entries(roofCodeMap).map(([key, value]) => [value, key]));
const enclosureCodeMap = {
    none: 'n',
    sliding: 's',
    bifold: 'b',
    guillotine: 'g',
    fixed: 'f',
    aluminium: 'a',
};
const enclosureCodeReverse = Object.fromEntries(Object.entries(enclosureCodeMap).map(([key, value]) => [value, key]));
const colorCodeMap = {
    'oyster-white': 'ow',
    'anthracite-grey': 'ag',
    'jet-black': 'jb',
    'pure-white': 'pw',
    'traffic-white': 'tw',
};
const colorCodeReverse = Object.fromEntries(Object.entries(colorCodeMap).map(([key, value]) => [value, key]));
const defaultConfiguratorSnapshot = {
    dimensions: defaultDimensions,
    roofMaterial: defaultRoofMaterial,
    pergolaColorOverride: null,
    selectedColor: 'anthracite-grey',
    enclosures: {
        front: defaultEnclosureType,
        frontLeft: defaultEnclosureType,
        frontRight: defaultEnclosureType,
        left: defaultEnclosureType,
        right: defaultEnclosureType,
    },
    lightsEnabled: addonsConfig.lights,
    lightTemperature: 'warm',
    doorsOpen: false,
    awningsOpen: false,
    roofOpen: false,
    doorOpenStates: {
        front: false,
        frontLeft: false,
        frontRight: false,
        left: false,
        right: false,
    },
    awningOpenStates: {
        roof: false,
        front: false,
        frontLeft: false,
        frontRight: false,
        left: false,
        right: false,
    },
    roofAwningEnabled: false,
    sideAwnings: {
        front: false,
        frontLeft: false,
        frontRight: false,
        left: false,
        right: false,
    },
    awningColor: 'anthracite-grey',
};
const CONFIGURATOR_SNAPSHOT_STORAGE_KEY = 'visora-configurator-snapshot-v1';
function readModeParam() {
    if (typeof window === 'undefined')
        return null;
    const mode = new URLSearchParams(window.location.search).get('mode');
    return mode === 'ar' ? mode : null;
}
function readStoredConfiguratorSnapshot() {
    if (typeof window === 'undefined')
        return defaultConfiguratorSnapshot;
    try {
        const raw = window.sessionStorage.getItem(CONFIGURATOR_SNAPSHOT_STORAGE_KEY);
        if (!raw)
            return defaultConfiguratorSnapshot;
        return { ...defaultConfiguratorSnapshot, ...JSON.parse(raw) };
    }
    catch {
        return defaultConfiguratorSnapshot;
    }
}
function writeStoredConfiguratorSnapshot(snapshot) {
    if (typeof window === 'undefined')
        return;
    try {
        window.sessionStorage.setItem(CONFIGURATOR_SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
    }
    catch { }
}
function encodeConfiguratorState(state) {
    const params = new URLSearchParams();
    params.set('mode', 'ar');
    params.set('auto', '1');
    params.set('w', state.dimensions.width.toFixed(1));
    params.set('p', state.dimensions.projection.toFixed(1));
    params.set('h', state.dimensions.height.toFixed(1));
    params.set('r', roofCodeMap[state.roofMaterial]);
    params.set('c', colorCodeMap[state.selectedColor]);
    if (state.pergolaColorOverride)
        params.set('pc', colorCodeMap[state.pergolaColorOverride]);
    params.set('e', sideKeyOrder.map((side) => enclosureCodeMap[state.enclosures[side]]).join(''));
    params.set('l', state.lightsEnabled ? '1' : '0');
    params.set('lt', state.lightTemperature === 'neutral' ? 'n' : 'w');
    params.set('d', state.doorsOpen ? '1' : '0');
    params.set('ao', state.awningsOpen ? '1' : '0');
    params.set('ro', state.roofOpen ? '1' : '0');
    params.set('dos', sideKeyOrder.map((side) => (state.doorOpenStates[side] ? '1' : '0')).join(''));
    params.set('aos', arAwningKeyOrder.map((key) => (state.awningOpenStates[key] ? '1' : '0')).join(''));
    params.set('ra', state.roofAwningEnabled ? '1' : '0');
    params.set('sa', sideKeyOrder.map((side) => (state.sideAwnings[side] ? '1' : '0')).join(''));
    params.set('ac', colorCodeMap[state.awningColor]);
    return params.toString();
}
function decodeConfiguratorState(search) {
    const params = new URLSearchParams(search);
    const enclosureString = params.get('e') || '';
    const sideAwningString = params.get('sa') || '';
    const doorOpenString = params.get('dos') || '';
    const awningOpenString = params.get('aos') || '';
    const legacyDoorsOpen = params.get('d') === '1';
    const legacyAwningsOpen = params.get('ao') === '1';
    return {
        dimensions: {
            width: clamp(Number(params.get('w') || defaultConfiguratorSnapshot.dimensions.width), 2, 7),
            projection: clamp(Number(params.get('p') || defaultConfiguratorSnapshot.dimensions.projection), 2, 4),
            height: clamp(Number(params.get('h') || defaultConfiguratorSnapshot.dimensions.height), 2, 3.5),
        },
        roofMaterial: roofCodeReverse[params.get('r') || ''] || defaultConfiguratorSnapshot.roofMaterial,
        pergolaColorOverride: colorCodeReverse[params.get('pc') || ''] || null,
        selectedColor: colorCodeReverse[params.get('c') || ''] || defaultConfiguratorSnapshot.selectedColor,
        enclosures: Object.fromEntries(sideKeyOrder.map((side, index) => [side, enclosureCodeReverse[enclosureString[index] || ''] || defaultConfiguratorSnapshot.enclosures[side]])),
        lightsEnabled: params.get('l') !== '0',
        lightTemperature: params.get('lt') === 'n' ? 'neutral' : 'warm',
        doorsOpen: legacyDoorsOpen,
        awningsOpen: legacyAwningsOpen,
        roofOpen: params.has('ro') ? params.get('ro') === '1' : legacyDoorsOpen,
        doorOpenStates: Object.fromEntries(sideKeyOrder.map((side, index) => [side, doorOpenString ? doorOpenString[index] === '1' : legacyDoorsOpen])),
        awningOpenStates: Object.fromEntries(arAwningKeyOrder.map((key, index) => [key, awningOpenString ? awningOpenString[index] === '1' : legacyAwningsOpen])),
        roofAwningEnabled: params.get('ra') === '1',
        sideAwnings: Object.fromEntries(sideKeyOrder.map((side, index) => [side, sideAwningString[index] === '1'])),
        awningColor: colorCodeReverse[params.get('ac') || ''] || defaultConfiguratorSnapshot.awningColor,
    };
}
function buildArUrl(currentHref, state) {
    const url = new URL(currentHref);
    url.search = encodeConfiguratorState(state);
    url.hash = '';
    return url.toString();
}
function isLikelyPhone() {
    if (typeof navigator === 'undefined')
        return false;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.innerWidth < 1180);
}
function canUseLiveCamera() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined')
        return false;
    const supportsMediaDevices = !!navigator.mediaDevices?.getUserMedia;
    const secureContext = window.isSecureContext || /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    return supportsMediaDevices && secureContext;
}
function loadModelViewer() {
    if (typeof window === 'undefined')
        return Promise.resolve();
    if (window.customElements?.get('model-viewer'))
        return Promise.resolve();
    return new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-model-viewer="true"]');
        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error('AR görünümü yüklenemedi.')), { once: true });
            return;
        }
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
        script.dataset.modelViewer = 'true';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('AR görünümü yüklenemedi.'));
        document.head.appendChild(script);
    });
}
function ArQrModal({ open, onClose, shareUrl }) {
    if (!open)
        return null;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(shareUrl)}`;
    return (_jsx("div", { className: "fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(10,14,24,0.62)] px-4 py-6 backdrop-blur-[10px]", onClick: onClose, children: _jsxs("div", { className: "w-full max-w-[420px] rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,rgba(19,25,39,0.98)_0%,rgba(12,16,26,0.96)_100%)] p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]", onClick: (event) => event.stopPropagation(), children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[11px] uppercase tracking-[0.18em] text-white/45", children: "Telefonda G\u00F6r\u00FCnt\u00FCle" }), _jsx("h2", { className: "mt-2 text-[24px] font-semibold tracking-[-0.03em]", children: "Telefonunuzla Taray\u0131n" }), _jsx("p", { className: "mt-2 text-[13px] leading-6 text-white/68", children: "Ayn\u0131 projeyi telefonunuzda a\u00E7\u0131n ve kamera g\u00F6r\u00FCn\u00FCm\u00FCn\u00FC oradan ba\u015Flat\u0131n." })] }), _jsx("button", { type: "button", onClick: onClose, className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/72 transition-all hover:bg-white/10 hover:text-white", "aria-label": "QR penceresini kapat", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "mt-5 rounded-[24px] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]", children: _jsx("img", { src: qrUrl, alt: "Telefon g\u00F6r\u00FCn\u00FCm\u00FC i\u00E7in QR kodu", className: "mx-auto block h-[280px] w-[280px] rounded-[18px]" }) }), _jsx("div", { className: "mt-4 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-[12px] leading-5 text-white/60", children: "En iyi sonu\u00E7 i\u00E7in siteyi telefonunuzda a\u00E7\u0131n. QR kodu, site \u00E7evrim i\u00E7i yay\u0131nland\u0131\u011F\u0131nda \u00E7al\u0131\u015F\u0131r." })] }) }));
}
function InquiryModal({ open, onClose, form, onChange, onSubmit, }) {
    if (!open)
        return null;
    const inputClassName = 'w-full rounded-[16px] border border-[#c7d9d6] bg-white px-4 py-3 text-[14px] text-[#13181c] outline-none transition-all placeholder:text-[#7c9894] focus:border-[#0b6a60] focus:ring-2 focus:ring-[rgba(11,106,96,0.18)]';
    return (_jsx("div", { className: "fixed inset-0 z-[85] flex items-center justify-center bg-[rgba(19,24,28,0.58)] px-4 py-6 backdrop-blur-[10px]", onClick: onClose, children: _jsxs("div", { className: "w-full max-w-[520px] rounded-[28px] border border-[#0a5b53]/20 bg-[linear-gradient(180deg,#ffffff_0%,#f4f8f7_100%)] p-5 text-[#13181c] shadow-[0_32px_80px_rgba(19,24,28,0.28)] sm:p-6", onClick: (event) => event.stopPropagation(), children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[11px] uppercase tracking-[0.18em] text-[#7c9894]", children: "Talep G\u00F6nder" }), _jsx("h2", { className: "mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#13181c]", children: "\u0130leti\u015Fim Bilgileri" }), _jsx("p", { className: "mt-2 text-[13px] leading-6 text-[#0a5b53]", children: "Bilgilerinizi a\u015Fa\u011F\u0131ya ekleyin; veranda mesaj\u0131na dahil edelim." })] }), _jsx("button", { type: "button", onClick: onClose, className: "flex h-10 w-10 items-center justify-center rounded-full border border-[#c7d9d6] bg-white text-[#004840] transition-all hover:border-[#7c9894] hover:bg-[#f4f8f7]", "aria-label": "Formu kapat", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "mt-5 space-y-4", children: [_jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("label", { className: "block space-y-2", children: [_jsx("span", { className: "text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0a5b53]", children: "Ad Soyad" }), _jsx("input", { type: "text", value: form.name, onChange: (event) => onChange('name', event.target.value), className: inputClassName, placeholder: "Ad\u0131n\u0131z ve soyad\u0131n\u0131z" })] }), _jsxs("label", { className: "block space-y-2", children: [_jsx("span", { className: "text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0a5b53]", children: "Posta Kodu" }), _jsx("input", { type: "text", value: form.postcode, onChange: (event) => onChange('postcode', event.target.value), className: inputClassName, placeholder: "Posta kodunuz" })] })] }), _jsxs("label", { className: "block space-y-2", children: [_jsx("span", { className: "text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0a5b53]", children: "E-posta Adresi" }), _jsx("input", { type: "email", value: form.email, onChange: (event) => onChange('email', event.target.value), className: inputClassName, placeholder: "ornek@eposta.com" })] }), _jsxs("label", { className: "block space-y-2", children: [_jsxs("span", { className: "text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0a5b53]", children: ["Ek Not ", _jsx("span", { className: "normal-case font-normal text-[#7c9894]", children: "(iste\u011Fe ba\u011Fl\u0131)" })] }), _jsx("textarea", { value: form.note, onChange: (event) => onChange('note', event.target.value), className: `${inputClassName} min-h-[120px] resize-y`, placeholder: "\u0130sterseniz buraya ek bir not yazabilirsiniz." })] })] }), _jsxs("div", { className: "mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", children: [_jsx("button", { type: "button", onClick: onClose, className: "inline-flex items-center justify-center rounded-[16px] border border-[#c7d9d6] bg-white px-4 py-3 text-[13px] font-semibold text-[#004840] transition-all hover:border-[#7c9894] hover:bg-[#f4f8f7]", children: "\u0130ptal" }), _jsxs("button", { type: "button", onClick: onSubmit, className: "inline-flex items-center justify-center gap-2 rounded-[16px] border border-[#0a5b53] bg-[linear-gradient(180deg,#004840_0%,#003934_100%)] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_16px_34px_rgba(37,44,49,0.24)] transition-all hover:bg-[linear-gradient(180deg,#00544b_0%,#003934_100%)]", children: ["WhatsApp ile Devam Et", _jsx(ArrowRight, { className: "h-4 w-4" })] })] })] }) }));
}
function ArExperiencePage() {
    const decoded = useMemo(() => decodeConfiguratorState(typeof window === 'undefined' ? '' : window.location.search), []);
    const shouldAutoLaunchNativeAr = useMemo(() => {
        if (typeof window === 'undefined')
            return false;
        const params = new URLSearchParams(window.location.search);
        return params.get('auto') !== '0' && isLikelyPhone();
    }, []);
    const activeColor = useMemo(() => colorOptions.find((option) => option.key === decoded.selectedColor) ?? colorOptions[1], [decoded.selectedColor]);
    const pergolaColor = useMemo(() => decoded.pergolaColorOverride
        ? colorOptions.find((option) => option.key === decoded.pergolaColorOverride) ?? activeColor
        : activeColor, [activeColor, decoded.pergolaColorOverride]);
    const awningActiveColor = useMemo(() => colorOptions.find((option) => option.key === decoded.awningColor) ?? activeColor, [activeColor, decoded.awningColor]);
    const [viewerReady, setViewerReady] = useState(false);
    const [glbUrl, setGlbUrl] = useState('');
    const [viewerError, setViewerError] = useState('');
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [modelScale, setModelScale] = useState(() => clamp(1.02 - (decoded.dimensions.width - 5) * 0.045, 0.84, 1.12));
    const [modelRotationY, setModelRotationY] = useState(() => -0.34);
    const [modelOffset, setModelOffset] = useState({ x: 0, y: -0.24, z: 0 });
    const videoRef = useRef(null);
    const modelViewerRef = useRef(null);
    const autoLaunchAttemptedRef = useRef(false);
    const dragStateRef = useRef(null);
    const arConfig = useMemo(() => ({
        target: decoded.dimensions,
        roofMaterial: decoded.roofMaterial,
        frameColor: activeColor.frame,
        pergolaColor: pergolaColor.frame,
        enclosures: decoded.enclosures,
        lightsEnabled: decoded.lightsEnabled,
        lightTemperature: decoded.lightTemperature,
        doorsOpen: decoded.doorsOpen,
        awningsOpen: decoded.awningsOpen,
        roofOpen: decoded.roofOpen,
        doorOpenStates: decoded.doorOpenStates,
        awningOpenStates: decoded.awningOpenStates,
        roofAwningEnabled: decoded.roofAwningEnabled,
        sideAwnings: decoded.sideAwnings,
        awningColor: awningActiveColor.frame,
    }), [
        activeColor.frame,
        awningActiveColor.frame,
        decoded.awningOpenStates,
        decoded.awningsOpen,
        decoded.dimensions,
        decoded.doorOpenStates,
        decoded.doorsOpen,
        decoded.enclosures,
        decoded.lightTemperature,
        decoded.lightsEnabled,
        decoded.roofAwningEnabled,
        decoded.roofMaterial,
        decoded.roofOpen,
        decoded.sideAwnings,
        pergolaColor.frame,
    ]);
    useEffect(() => {
        let cancelled = false;
        loadModelViewer()
            .then(() => {
            if (!cancelled)
                setViewerReady(true);
        })
            .catch((loadError) => {
            if (!cancelled)
                setViewerError(loadError instanceof Error ? loadError.message : 'AR görünümü yüklenemedi.');
        });
        return () => {
            cancelled = true;
        };
    }, []);
    useEffect(() => {
        let cancelled = false;
        let nextUrl = '';
        exportConfigToGlb(arConfig)
            .then((url) => {
            if (cancelled) {
                URL.revokeObjectURL(url);
                return;
            }
            nextUrl = url;
            setGlbUrl(url);
        })
            .catch((exportError) => {
            if (!cancelled)
                setViewerError(exportError instanceof Error ? exportError.message : 'AR modeli hazırlanamadı.');
        });
        return () => {
            cancelled = true;
            if (nextUrl)
                URL.revokeObjectURL(nextUrl);
        };
    }, [arConfig]);
    useEffect(() => {
        let active = true;
        let currentStream = null;
        const startCamera = async () => {
            if (!canUseLiveCamera()) {
                setCameraError('Bu tarayıcı burada canlı önizleme gösteremiyor. Telefon görünümü hâlâ kullanılabilir.');
                return;
            }
            const constraintOptions = [
                { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false },
                { video: { facingMode: { ideal: 'environment' } }, audio: false },
                { video: true, audio: false },
            ];
            let stream = null;
            let lastError = null;
            for (const constraints of constraintOptions) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                    break;
                }
                catch (error) {
                    lastError = error;
                }
            }
            if (!stream) {
                setCameraError(lastError instanceof Error ? lastError.message : 'Canlı önizleme için kamera erişimine izin verin.');
                return;
            }
            if (!active) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }
            currentStream = stream;
            const video = videoRef.current;
            if (!video)
                return;
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                if (!active)
                    return;
                setCameraReady(true);
                setCameraError('');
                video.play().catch(() => undefined);
            };
        };
        startCamera();
        return () => {
            active = false;
            if (currentStream)
                currentStream.getTracks().forEach((track) => track.stop());
        };
    }, []);
    const roofLabel = roofLabelMap[decoded.roofMaterial];
    const summary = `${formatMetres(decoded.dimensions.width)} × ${formatMetres(decoded.dimensions.projection)} × ${formatMetres(decoded.dimensions.height)}`;
    const backHref = typeof window === 'undefined' ? '/' : `${window.location.pathname}`;
    const showOverlayPreview = cameraReady;
    const showFallbackViewer = !showOverlayPreview && viewerReady && !!glbUrl;
    const nudgeModel = (x, y) => {
        setModelOffset((prev) => ({
            ...prev,
            x: clamp(prev.x + x, -2.8, 2.8),
            y: clamp(prev.y + y, -1.8, 1.8),
        }));
    };
    const resetOverlayView = () => {
        setModelScale(clamp(1.02 - (decoded.dimensions.width - 5) * 0.045, 0.84, 1.12));
        setModelRotationY(-0.34);
        setModelOffset({ x: 0, y: -0.24, z: 0 });
    };
    const handlePreviewPointerDown = (event) => {
        if (event.target.closest('[data-ar-ui="true"]'))
            return;
        dragStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            originX: modelOffset.x,
            originY: modelOffset.y,
        };
        event.currentTarget.setPointerCapture?.(event.pointerId);
    };
    const handlePreviewPointerMove = (event) => {
        const drag = dragStateRef.current;
        if (!drag || drag.pointerId !== event.pointerId)
            return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        setModelOffset((prev) => ({
            ...prev,
            x: clamp(drag.originX + dx * 0.011, -2.8, 2.8),
            y: clamp(drag.originY - dy * 0.011, -1.8, 1.8),
        }));
    };
    const handlePreviewPointerUp = (event) => {
        if (dragStateRef.current?.pointerId !== event.pointerId)
            return;
        dragStateRef.current = null;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
    };
    const triggerNativeAr = () => {
        const viewer = modelViewerRef.current;
        if (typeof viewer?.activateAR !== 'function')
            return false;
        viewer.activateAR();
        return true;
    };
    useEffect(() => {
        if (!shouldAutoLaunchNativeAr || autoLaunchAttemptedRef.current || !viewerReady || !glbUrl)
            return;
        const launchTimer = window.setTimeout(() => {
            if (triggerNativeAr()) {
                autoLaunchAttemptedRef.current = true;
            }
        }, 160);
        return () => window.clearTimeout(launchTimer);
    }, [glbUrl, shouldAutoLaunchNativeAr, viewerReady]);
    const handleLaunchNativeAr = () => {
        triggerNativeAr();
    };
    return (_jsxs("div", { className: "relative min-h-dvh overflow-hidden bg-[#081018] text-white", children: [_jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(80,121,181,0.18),transparent_42%),linear-gradient(180deg,#0A1019_0%,#060A10_100%)]" }), showOverlayPreview ? (_jsxs(_Fragment, { children: [_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "absolute inset-0 h-full w-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,16,0.16)_0%,rgba(6,10,16,0.02)_36%,rgba(6,10,16,0.2)_100%)]" }), _jsx("div", { className: "absolute inset-0 z-10 touch-none", onPointerDown: handlePreviewPointerDown, onPointerMove: handlePreviewPointerMove, onPointerUp: handlePreviewPointerUp, onPointerCancel: handlePreviewPointerUp, children: _jsx("div", { className: "absolute inset-0", children: _jsx(VerandaScene, { target: decoded.dimensions, roofMaterial: decoded.roofMaterial, wedgeMaterial: decoded.roofMaterial, frameColor: activeColor.frame, pergolaColor: pergolaColor.frame, enclosures: decoded.enclosures, lightsEnabled: decoded.lightsEnabled, lightTemperature: decoded.lightTemperature, nightMode: false, doorsOpen: decoded.doorsOpen, awningsOpen: decoded.awningsOpen, roofAwningEnabled: decoded.roofAwningEnabled, sideAwnings: decoded.sideAwnings, awningColor: awningActiveColor.frame, sceneMode: "ar-preview", modelTransform: {
                                    position: [modelOffset.x, modelOffset.y, modelOffset.z],
                                    rotationY: modelRotationY,
                                    scale: modelScale,
                                } }) }) })] })) : showFallbackViewer ? (_jsxs("div", { className: "absolute inset-0 z-[1]", children: [_jsx(ModelViewerTag, { ref: modelViewerRef, src: glbUrl, ar: true, "ar-modes": "webxr scene-viewer quick-look", "ar-placement": "floor", "camera-controls": true, "touch-action": "pan-y", "shadow-intensity": "1", "shadow-softness": "0.85", exposure: "1", "environment-image": "neutral", style: { width: '100%', height: '100%', background: 'linear-gradient(180deg,#0B1119 0%,#070B12 100%)' } }), _jsx("div", { className: "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,16,0.12)_0%,rgba(6,10,16,0.02)_45%,rgba(6,10,16,0.16)_100%)]" })] })) : (_jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,#162030_0%,#0A1019_100%)] text-center text-white/72", children: [_jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/80" }), _jsx("p", { className: "text-[14px]", children: "Telefon g\u00F6r\u00FCn\u00FCm\u00FC haz\u0131rlan\u0131yor..." }), viewerError ? _jsx("p", { className: "max-w-[320px] px-6 text-[13px] leading-6 text-[#FFD6A5]", children: viewerError }) : null] })), showOverlayPreview || showFallbackViewer ? (_jsx("div", { className: "pointer-events-none absolute inset-0 z-[15] flex items-center justify-center", children: _jsx("img", { src: exportWatermark, alt: "", "aria-hidden": "true", className: "w-[112px] max-w-[34vw] opacity-30 sm:w-[136px]" }) })) : null, !showFallbackViewer && viewerReady && glbUrl ? (_jsx(ModelViewerTag, { ref: modelViewerRef, src: glbUrl, ar: true, "ar-modes": "webxr scene-viewer quick-look", "ar-placement": "floor", "camera-controls": true, style: { position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', left: -10, bottom: -10 } })) : null, _jsxs("div", { className: "pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-3 pt-3 sm:px-4 sm:pt-4", children: [_jsxs("div", { "data-ar-ui": "true", className: "pointer-events-auto max-w-[calc(100vw-122px)] rounded-[20px] border border-white/16 bg-[linear-gradient(180deg,rgba(10,15,23,0.58)_0%,rgba(10,15,23,0.22)_100%)] px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-[14px]", children: [_jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] text-white/46", children: "Telefonda G\u00F6r\u00FCnt\u00FCle" }), _jsx("div", { className: "mt-1 text-[14px] font-medium text-white", children: summary }), _jsx("div", { className: "mt-1 text-[11px] text-white/62", children: roofLabel }), cameraError ? _jsx("div", { className: "mt-2 text-[11px] leading-5 text-[#FFD6A5]", children: cameraError }) : null, !cameraReady && !cameraError ? _jsx("div", { className: "mt-2 text-[11px] leading-5 text-white/56", children: "Kamera ba\u015Flat\u0131l\u0131yor..." }) : null] }), _jsx("a", { "data-ar-ui": "true", href: backHref, className: "pointer-events-auto inline-flex h-12 min-w-[92px] items-center justify-center rounded-[16px] border border-white/16 bg-[linear-gradient(180deg,rgba(10,15,23,0.58)_0%,rgba(10,15,23,0.24)_100%)] px-4 text-[13px] font-medium text-white/88 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-[14px] transition-all hover:bg-white/12 hover:text-white", children: "Geri" })] }), _jsx("div", { className: "pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-3 sm:px-4 sm:pb-4", children: _jsx("div", { "data-ar-ui": "true", className: "pointer-events-auto rounded-[22px] border border-white/16 bg-[linear-gradient(180deg,rgba(10,15,23,0.56)_0%,rgba(10,15,23,0.24)_100%)] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-[16px]", children: _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("button", { type: "button", onClick: handleLaunchNativeAr, className: "inline-flex min-h-[46px] items-center justify-center rounded-[15px] bg-[linear-gradient(135deg,#6BC75C_0%,#4DA23F_100%)] px-4 text-[13px] font-semibold text-white shadow-[0_16px_34px_rgba(72,123,54,0.34)] transition-all hover:brightness-105", children: "Telefon AR G\u00F6r\u00FCn\u00FCm\u00FCn\u00FC A\u00E7" }), showOverlayPreview ? (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: () => setModelScale((prev) => clamp(prev - 0.05, 0.72, 1.42)), className: "rounded-[14px] border border-white/12 bg-white/8 px-3 py-3 text-[12px] font-medium text-white/82 transition-all hover:bg-white/12 hover:text-white", children: "K\u00FC\u00E7\u00FClt" }), _jsx("button", { type: "button", onClick: () => setModelScale((prev) => clamp(prev + 0.05, 0.72, 1.42)), className: "rounded-[14px] border border-white/12 bg-white/8 px-3 py-3 text-[12px] font-medium text-white/82 transition-all hover:bg-white/12 hover:text-white", children: "B\u00FCy\u00FCt" }), _jsx("button", { type: "button", onClick: () => setModelRotationY((prev) => prev + Math.PI / 18), className: "rounded-[14px] border border-white/12 bg-white/8 px-3 py-3 text-[12px] font-medium text-white/82 transition-all hover:bg-white/12 hover:text-white", children: "Sola d\u00F6nd\u00FCr" }), _jsx("button", { type: "button", onClick: () => setModelRotationY((prev) => prev - Math.PI / 18), className: "rounded-[14px] border border-white/12 bg-white/8 px-3 py-3 text-[12px] font-medium text-white/82 transition-all hover:bg-white/12 hover:text-white", children: "Sa\u011Fa d\u00F6nd\u00FCr" }), _jsx("button", { type: "button", onClick: () => nudgeModel(-0.12, 0), className: "rounded-[14px] border border-white/12 bg-white/6 px-3 py-3 text-[12px] font-medium text-white/76 transition-all hover:bg-white/10 hover:text-white", children: "Sol" }), _jsx("button", { type: "button", onClick: () => nudgeModel(0.12, 0), className: "rounded-[14px] border border-white/12 bg-white/6 px-3 py-3 text-[12px] font-medium text-white/76 transition-all hover:bg-white/10 hover:text-white", children: "Sag" }), _jsx("button", { type: "button", onClick: () => nudgeModel(0, 0.1), className: "rounded-[14px] border border-white/12 bg-white/6 px-3 py-3 text-[12px] font-medium text-white/76 transition-all hover:bg-white/10 hover:text-white", children: "Yukar\u0131" }), _jsx("button", { type: "button", onClick: resetOverlayView, className: "rounded-[14px] border border-white/12 bg-white/6 px-3 py-3 text-[12px] font-medium text-white/76 transition-all hover:bg-white/10 hover:text-white", children: "S\u0131f\u0131rla" })] })) : (_jsxs("div", { className: "rounded-[14px] border border-white/10 bg-white/6 px-3 py-3 text-[12px] leading-5 text-white/66", children: ["Modeli g\u00F6rmek i\u00E7in tek parma\u011F\u0131n\u0131zla s\u00FCr\u00FCkleyin. Ard\u0131ndan ", _jsx("span", { className: "font-medium text-white", children: "Telefon Kameras\u0131nda A\u00E7" }), " d\u00FC\u011Fmesine bas\u0131n."] }))] }) }) })] }));
}
function Card({ children, className = '' }) {
    return (_jsx("section", { className: `rounded-[20px] border border-[#c7d9d6] bg-white/92 p-4 shadow-[0_18px_40px_rgba(37,44,49,0.08)] backdrop-blur-[6px] ${className}`, children: children }));
}
function SectionTitle({ children, helper }) {
    return (_jsx("div", { className: "mb-4 flex items-start justify-between gap-4", children: _jsxs("div", { children: [_jsx("h3", { className: "text-[15px] font-semibold text-ink", children: children }), helper ? _jsx("p", { className: "mt-1 text-[12px] text-muted", children: helper }) : null] }) }));
}
function AccordionSection({ title, helper, open, onOpen, children, }) {
    return (_jsxs("section", { className: "overflow-hidden rounded-[20px] border border-[#c7d9d6] bg-white/92 shadow-[0_18px_40px_rgba(37,44,49,0.08)] backdrop-blur-[6px]", children: [_jsxs("button", { type: "button", onClick: onOpen, className: `flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-all duration-200 ${open ? 'bg-[linear-gradient(135deg,rgba(0,57,52,0.08),rgba(11,106,96,0.10))]' : 'hover:bg-[#ffffff]'}`, children: [_jsxs("div", { children: [_jsx("h3", { className: "text-[15px] font-semibold text-ink", children: title }), helper ? _jsx("p", { className: "mt-1 text-[12px] text-muted", children: helper }) : null] }), _jsx("span", { className: `flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${open ? 'border-[#0b6a60] bg-[#003934] text-white' : 'border-[#c7d9d6] bg-white text-[#003934]'}`, children: _jsx(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}` }) })] }), _jsx("div", { className: `grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-100'}`, children: _jsx("div", { className: "overflow-hidden", children: _jsx("div", { className: "border-t border-[#c7d9d6] px-4 pb-4 pt-4", children: children }) }) })] }));
}
function SummaryMetric({ value, label }) {
    return (_jsxs("div", { className: "rounded-[14px] border border-[#c7d9d6] bg-[linear-gradient(180deg,#FFFFFF_0%,#ffffff_100%)] px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]", children: [_jsx("div", { className: "text-[16px] font-semibold text-ink", children: value }), _jsx("div", { className: "mt-1 text-[11px] text-muted", children: label })] }));
}
function SliderRow({ label, range, value, min, max, step, onChange, }) {
    const percent = ((value - min) / (max - min)) * 100;
    return (_jsxs("div", { className: "space-y-2.5", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[13px] font-medium text-ink", children: label }), _jsx("div", { className: "mt-0.5 text-[11px] text-muted", children: range })] }), _jsx("div", { className: "w-[82px] shrink-0 rounded-[12px] border border-[#c7d9d6] bg-white px-2.5 py-2 text-right text-[13px] font-medium text-ink shadow-[0_4px_14px_rgba(37,44,49,0.05)]", children: _jsx("input", { type: "number", min: min, max: max, step: step, value: value, onChange: (event) => onChange(clamp(Number(event.target.value || min), min, max)), className: "w-full bg-transparent text-right outline-none" }) })] }), _jsx("div", { className: "rounded-full", style: {
                    background: `linear-gradient(to right, #003934 0%, #003934 ${percent}%, #7c9894 ${percent}%, #7c9894 100%)`,
                }, children: _jsx("input", { type: "range", min: min, max: max, step: step, value: value, onChange: (event) => onChange(Number(event.target.value)), className: "w-full" }) })] }));
}
function PillButton({ active, label, onClick }) {
    return (_jsx("button", { type: "button", onClick: onClick, className: `rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200 ${active
            ? 'border-[#0b6a60] bg-[#003934]/8 text-[#003934] shadow-[0_8px_20px_rgba(37,44,49,0.10)]'
            : 'border-[#c7d9d6] bg-white text-muted hover:border-[#7c9894] hover:text-ink'}`, children: label }));
}
function SideIcon({ side, active }) {
    const stroke = active ? '#003934' : '#6f908b';
    const fill = active ? 'rgba(0,57,52,0.10)' : 'transparent';
    return (_jsxs("svg", { width: "32", height: "24", viewBox: "0 0 32 24", "aria-hidden": "true", children: [_jsx("rect", { x: "5", y: "5", width: "22", height: "14", rx: "2.4", fill: fill, stroke: "#c7d9d6" }), _jsx("path", { d: "M8 18V6", stroke: "#c7d9d6", strokeWidth: "1.5" }), _jsx("path", { d: "M24 18V6", stroke: "#c7d9d6", strokeWidth: "1.5" }), side === 'front' ? _jsx("path", { d: "M8 18H24", stroke: stroke, strokeWidth: "2.1", strokeLinecap: "round" }) : null, side === 'left' ? _jsx("path", { d: "M8 6V18", stroke: stroke, strokeWidth: "2.1", strokeLinecap: "round" }) : null, side === 'right' ? _jsx("path", { d: "M24 6V18", stroke: stroke, strokeWidth: "2.1", strokeLinecap: "round" }) : null] }));
}
function EnclosureOptionCard({ active, title, subtitle, icon, onClick, }) {
    return (_jsxs("button", { type: "button", onClick: onClick, className: `flex w-full items-center gap-3 rounded-[14px] border px-3.5 py-3 text-left transition-all duration-200 ${active ? 'border-[#0b6a60] bg-[#003934]/6 shadow-[0_10px_22px_rgba(37,44,49,0.08)]' : 'border-[#c7d9d6] bg-white hover:border-[#7c9894]'}`, children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#c7d9d6] bg-[#ffffff] text-[#0a5b53]", children: icon }), _jsxs("div", { children: [_jsx("div", { className: "text-[13px] font-medium text-ink", children: title }), subtitle ? _jsx("div", { className: "mt-0.5 text-[11px] text-muted", children: subtitle }) : null] })] }));
}
function Swatch({ option, active, onClick }) {
    return (_jsxs("button", { type: "button", onClick: onClick, className: "flex flex-col items-center gap-2 text-center", children: [_jsx("span", { className: `inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all ${active ? 'border-[#0b6a60] ring-2 ring-[#57b7ac]' : 'border-[#c7d9d6]'}`, children: _jsx("span", { className: "h-[34px] w-[34px] rounded-full border border-black/5", style: { backgroundColor: option.swatch } }) }), _jsx("span", { className: "text-[11px] leading-4 text-muted", children: option.name })] }));
}
function OptionRing({ active, tone, title, subtitle, onClick, }) {
    return (_jsxs("button", { type: "button", onClick: onClick, className: "flex flex-col items-center gap-2 text-center", children: [_jsx("span", { className: `inline-flex h-16 w-16 items-center justify-center rounded-full border transition-all ${active ? 'border-[#0b6a60] ring-2 ring-[#57b7ac]' : 'border-[#c7d9d6]'}`, style: { backgroundColor: tone } }), _jsx("div", { className: "text-[12px] font-medium text-ink", children: title }), _jsx("div", { className: "-mt-1 text-[11px] text-muted", children: subtitle })] }));
}
function DoorClosedIcon() {
    return (_jsxs("svg", { width: "17", height: "17", viewBox: "0 0 24 24", "aria-hidden": "true", fill: "none", children: [_jsx("path", { d: "M5 4.5C5 3.67 5.67 3 6.5 3H17.5C18.33 3 19 3.67 19 4.5V20.5C19 21.33 18.33 22 17.5 22H6.5C5.67 22 5 21.33 5 20.5V4.5Z", stroke: "currentColor", strokeWidth: "1.9" }), _jsx("path", { d: "M9 3V22", stroke: "currentColor", strokeWidth: "1.9" }), _jsx("circle", { cx: "14.6", cy: "12", r: "1", fill: "currentColor" })] }));
}
function DoorOpenIcon() {
    return (_jsxs("svg", { width: "17", height: "17", viewBox: "0 0 24 24", "aria-hidden": "true", fill: "none", children: [_jsx("path", { d: "M6 4.5C6 3.67 6.67 3 7.5 3H15.5C16.33 3 17 3.67 17 4.5V20.5C17 21.33 16.33 22 15.5 22H7.5C6.67 22 6 21.33 6 20.5V4.5Z", stroke: "currentColor", strokeWidth: "1.9" }), _jsx("path", { d: "M17 5L21 8.2V18.8L17 21", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("circle", { cx: "11.8", cy: "12", r: "1", fill: "currentColor" })] }));
}
function AwningClosedIcon() {
    return (_jsxs("svg", { width: "17", height: "17", viewBox: "0 0 24 24", "aria-hidden": "true", fill: "none", children: [_jsx("path", { d: "M4 6.5H20", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round" }), _jsx("path", { d: "M6 6.5V9.6", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round" }), _jsx("path", { d: "M18 6.5V9.6", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round" }), _jsx("path", { d: "M6 10.2H18", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round" }), _jsx("path", { d: "M7 10.2V18", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("path", { d: "M12 10.2V18", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("path", { d: "M17 10.2V18", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" })] }));
}
function AwningOpenIcon() {
    return (_jsxs("svg", { width: "17", height: "17", viewBox: "0 0 24 24", "aria-hidden": "true", fill: "none", children: [_jsx("path", { d: "M4 6.5H20", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round" }), _jsx("path", { d: "M6 6.5V9.6", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round" }), _jsx("path", { d: "M18 6.5V9.6", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round" }), _jsx("path", { d: "M6 10.2H18", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round" }), _jsx("path", { d: "M7.4 11.2C8.7 12.9 10 14.6 11.3 16.3", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("path", { d: "M11.3 16.3C12.5 14.6 13.7 12.9 14.9 11.2", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("path", { d: "M14.9 11.2C16 12.7 17.1 14.2 18.2 15.7", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" })] }));
}
function InquiryButton({ label, onClick, className = '', icon }) {
    return (_jsxs("button", { type: "button", onClick: onClick, className: `inline-flex items-center gap-2 rounded-[14px] px-4 py-3 text-[13px] font-medium text-white transition-all duration-200 bg-[linear-gradient(180deg,#0b6a60_0%,#002b27_100%)] shadow-[0_14px_28px_rgba(46,37,32,0.28)] hover:bg-[linear-gradient(180deg,#57b7ac_0%,#002b27_100%)] ${className}`, children: [icon ?? _jsx(ArrowRight, { className: "h-4 w-4" }), label] }));
}
function MeasurementsTabIcon() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [_jsx("path", { d: "M4 16.5L16.5 4", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("path", { d: "M6.4 14.1L9.9 17.6", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("path", { d: "M10.9 9.6L14.4 13.1", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "4", stroke: "currentColor", strokeWidth: "1.5", opacity: "0.7" })] }));
}
function RoofTabIcon() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [_jsx("path", { d: "M4 12.4L12 5L20 12.4", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M6.2 12.2H17.8", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("path", { d: "M8.4 12.2V18", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", opacity: "0.8" }), _jsx("path", { d: "M12 12.2V18", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", opacity: "0.8" }), _jsx("path", { d: "M15.6 12.2V18", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", opacity: "0.8" })] }));
}
function SidesTabIcon() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [_jsx("rect", { x: "4", y: "5", width: "16", height: "14", rx: "2.6", stroke: "currentColor", strokeWidth: "1.7" }), _jsx("path", { d: "M9 5.7V18.3", stroke: "currentColor", strokeWidth: "1.5", opacity: "0.75" }), _jsx("path", { d: "M15 5.7V18.3", stroke: "currentColor", strokeWidth: "1.5", opacity: "0.75" }), _jsx("path", { d: "M4.7 12H19.3", stroke: "currentColor", strokeWidth: "1.5", opacity: "0.75" })] }));
}
function ColourTabIcon() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [_jsx("path", { d: "M12 4.4C8.35 4.4 5.4 7.35 5.4 11C5.4 14.65 8.35 17.6 12 17.6C13.62 17.6 14.98 16.96 14.98 15.62C14.98 14.68 14.34 14.12 14.34 13.34C14.34 12.48 15.04 11.88 16.06 11.88H17.1C18.94 11.88 20.4 10.42 20.4 8.58C20.4 6.02 16.74 4.4 12 4.4Z", stroke: "currentColor", strokeWidth: "1.7", strokeLinejoin: "round" }), _jsx("circle", { cx: "8.8", cy: "10", r: "1", fill: "currentColor" }), _jsx("circle", { cx: "11.7", cy: "8.4", r: "1", fill: "currentColor" }), _jsx("circle", { cx: "14.7", cy: "9.7", r: "1", fill: "currentColor" })] }));
}
function AddOnsTabIcon() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [_jsx("path", { d: "M12 4.2L13.6 7.6L17.4 8.1L14.6 10.8L15.3 14.6L12 12.8L8.7 14.6L9.4 10.8L6.6 8.1L10.4 7.6L12 4.2Z", stroke: "currentColor", strokeWidth: "1.6", strokeLinejoin: "round" }), _jsx("path", { d: "M18.3 16.2L18.9 17.4L20.2 17.6L19.2 18.5L19.5 19.8L18.3 19.1L17.1 19.8L17.4 18.5L16.4 17.6L17.7 17.4L18.3 16.2Z", fill: "currentColor", opacity: "0.8" }), _jsx("path", { d: "M5.4 15.6L5.9 16.6L7 16.8L6.2 17.6L6.4 18.7L5.4 18.1L4.4 18.7L4.6 17.6L3.8 16.8L4.9 16.6L5.4 15.6Z", fill: "currentColor", opacity: "0.75" })] }));
}
function SceneControlButton({ active, ariaLabel, onClick, children, label, }) {
    return (_jsxs("button", { type: "button", "aria-label": ariaLabel, onClick: onClick, className: `flex h-10 items-center justify-center gap-2 border backdrop-blur-[8px] transition-colors ${label ? 'rounded-full px-4' : 'w-10 rounded-full sm:w-10'} ${active
            ? 'border-black bg-black text-white hover:bg-[#002f2b]'
            : 'border-white/60 bg-[rgba(255,255,255,0.84)] text-[#003934] hover:bg-[rgba(255,255,255,0.95)]'}`, children: [children, label ? _jsx("span", { className: "text-[12px] font-semibold tracking-[0.02em]", children: label }) : null] }));
}
function AnimatePlayIcon() {
    return (_jsxs("svg", { width: "17", height: "17", viewBox: "0 0 24 24", "aria-hidden": "true", fill: "none", children: [_jsx("circle", { cx: "12", cy: "12", r: "8", stroke: "currentColor", strokeWidth: "1.8" }), _jsx("path", { d: "M10 8.9L15.4 12L10 15.1V8.9Z", fill: "currentColor" })] }));
}
function AnimateMenuItemButton({ item }) {
    return (_jsxs("button", { type: "button", onClick: item.onToggle, className: `flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left transition-all duration-200 ${item.active
            ? 'border-[#0b6a60] bg-[#003934]/7 text-ink shadow-[0_10px_20px_rgba(37,44,49,0.08)]'
            : 'border-[#d6e1df] bg-white text-ink hover:border-[#7c9894] hover:bg-[#f8fbfa]'}`, children: [_jsx("span", { className: `flex h-8 w-8 items-center justify-center rounded-[10px] border ${item.active ? 'border-[#0b6a60] bg-[#003934] text-white' : 'border-[#d3dcda] bg-[#f8faf9] text-[#003934]'}`, children: item.icon }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block text-[12px] font-semibold", children: item.label }), item.detail ? _jsx("span", { className: "block text-[11px] text-muted", children: item.detail }) : null] }), _jsx("span", { className: `rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${item.active ? 'border-[#0b6a60]/40 bg-[#003934]/8 text-[#003934]' : 'border-[#d6e1df] bg-white text-muted'}`, children: item.active ? 'Açık' : 'Kapalı' })] }));
}
function AnimateMenuPanel({ sections, emptyMessage = 'Henüz hareketli parça yok.', }) {
    const visibleSections = sections.filter((section) => section.items.length > 0);
    if (!visibleSections.length) {
        return (_jsx("div", { className: "rounded-[14px] border border-dashed border-[#c7d9d6] bg-[#f8fbfa] px-4 py-4 text-[12px] text-muted", children: emptyMessage }));
    }
    return (_jsx("div", { className: "space-y-3", children: visibleSections.map((section) => (_jsxs("div", { children: [_jsx("div", { className: "mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5e7974]", children: section.title }), _jsx("div", { className: "space-y-2", children: section.items.map((item) => (_jsx(AnimateMenuItemButton, { item: item }, item.key))) })] }, section.title))) }));
}
function AnimateControlButton({ active, isMobile, mobileMenuOpen, menuSections, onToggleAll, onToggleMobileMenu, }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef(null);
    useEffect(() => {
        if (isMobile) {
            setMenuOpen(false);
            return;
        }
        if (!menuOpen)
            return;
        const handlePointerDown = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === 'Escape')
                setMenuOpen(false);
        };
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isMobile, menuOpen]);
    if (isMobile) {
        return (_jsx("button", { type: "button", "aria-label": mobileMenuOpen ? 'Animasyon menüsünü kapat' : 'Animasyon menüsünü aç', onClick: onToggleMobileMenu, className: `flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-[8px] transition-colors ${mobileMenuOpen || active
                ? 'border-black bg-black text-white hover:bg-[#002f2b]'
                : 'border-white/60 bg-[rgba(255,255,255,0.84)] text-[#003934] hover:bg-[rgba(255,255,255,0.95)]'}`, children: _jsx(AnimatePlayIcon, {}) }));
    }
    const desktopActive = active || menuOpen;
    return (_jsxs("div", { ref: containerRef, className: "relative", children: [_jsxs("div", { className: `flex overflow-hidden rounded-full border backdrop-blur-[8px] transition-colors ${desktopActive
                    ? 'border-black bg-black text-white hover:bg-[#002f2b]'
                    : 'border-white/60 bg-[rgba(255,255,255,0.84)] text-[#003934] hover:bg-[rgba(255,255,255,0.95)]'}`, children: [_jsxs("button", { type: "button", "aria-label": active ? 'Animasyonları kapat' : 'Animasyonları aç', onClick: onToggleAll, className: "flex h-10 items-center gap-2 px-4 text-[12px] font-semibold tracking-[0.02em] transition-colors", children: [_jsx(AnimatePlayIcon, {}), _jsx("span", { children: "Animasyon" })] }), _jsx("button", { type: "button", "aria-label": menuOpen ? 'Animasyon seçeneklerini kapat' : 'Animasyon seçeneklerini aç', onClick: () => setMenuOpen((prev) => !prev), className: `flex h-10 w-10 items-center justify-center border-l transition-colors ${desktopActive ? 'border-white/16' : 'border-[#003934]/12'}`, children: _jsx(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}` }) })] }), menuOpen ? (_jsx("div", { className: "absolute left-0 top-full z-30 mt-2 w-[280px] rounded-[14px] border border-[#d8dddb] bg-white/96 p-3 shadow-[0_18px_36px_rgba(37,44,49,0.18)] backdrop-blur-[18px]", children: _jsx(AnimateMenuPanel, { sections: menuSections }) })) : null] }));
}
function DownloadMenuItemButton({ item }) {
    return (_jsxs("button", { type: "button", onClick: item.onSelect, disabled: item.disabled, className: `flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left transition-all duration-200 ${item.disabled
            ? 'cursor-wait border-[#d6e1df] bg-[#f6f8f7] text-[#8ba09c]'
            : 'border-[#d6e1df] bg-white text-ink hover:border-[#7c9894] hover:bg-[#f8fbfa]'}`, children: [_jsx("span", { className: `flex h-8 w-8 items-center justify-center rounded-[10px] border ${item.disabled ? 'border-[#d3dcda] bg-[#eef3f2] text-[#90a39f]' : 'border-[#d3dcda] bg-[#f8faf9] text-[#003934]'}`, children: item.icon }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block text-[12px] font-semibold", children: item.label }), _jsx("span", { className: "block text-[11px] text-muted", children: item.detail })] })] }));
}
function DownloadMenuPanel({ items }) {
    return (_jsx("div", { className: "space-y-2", children: items.map((item) => (_jsx(DownloadMenuItemButton, { item: item }, item.key))) }));
}
function DownloadControlButton({ active, busy, isMobile, mobileMenuOpen, items, onToggleMobileMenu, }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef(null);
    useEffect(() => {
        if (isMobile || busy) {
            setMenuOpen(false);
            return;
        }
        if (!menuOpen)
            return;
        const handlePointerDown = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === 'Escape')
                setMenuOpen(false);
        };
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [busy, isMobile, menuOpen]);
    if (isMobile) {
        return (_jsx("button", { type: "button", "aria-label": mobileMenuOpen ? 'İndirme menüsünü kapat' : 'İndirme menüsünü aç', onClick: onToggleMobileMenu, disabled: busy, className: `flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-[8px] transition-colors ${mobileMenuOpen || active
                ? 'border-black bg-black text-white hover:bg-[#002f2b]'
                : 'border-white/60 bg-[rgba(255,255,255,0.84)] text-[#003934] hover:bg-[rgba(255,255,255,0.95)]'} ${busy ? 'cursor-wait opacity-80' : ''}`, children: _jsx(Download, { size: 17, strokeWidth: 1.9 }) }));
    }
    const desktopActive = active || menuOpen;
    return (_jsxs("div", { ref: containerRef, className: "relative", children: [_jsxs("button", { type: "button", "aria-label": menuOpen ? 'İndirme seçeneklerini kapat' : 'İndirme seçeneklerini aç', onClick: () => setMenuOpen((prev) => !prev), disabled: busy, className: `flex h-10 items-center gap-2 rounded-full border px-4 backdrop-blur-[8px] transition-colors ${desktopActive
                    ? 'border-black bg-black text-white hover:bg-[#002f2b]'
                    : 'border-white/60 bg-[rgba(255,255,255,0.84)] text-[#003934] hover:bg-[rgba(255,255,255,0.95)]'} ${busy ? 'cursor-wait opacity-80' : ''}`, children: [_jsx(Download, { size: 16, strokeWidth: 1.9 }), _jsx("span", { className: "text-[12px] font-semibold tracking-[0.02em]", children: "\u0130ndir" }), _jsx(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}` })] }), menuOpen ? (_jsx("div", { className: "absolute left-0 top-full z-30 mt-2 w-[272px] rounded-[14px] border border-[#d8dddb] bg-white/96 p-3 shadow-[0_18px_36px_rgba(37,44,49,0.18)] backdrop-blur-[18px]", children: _jsx(DownloadMenuPanel, { items: items.map((item) => ({
                        ...item,
                        onSelect: () => {
                            setMenuOpen(false);
                            item.onSelect();
                        },
                    })) }) })) : null] }));
}
function MobileTabButton({ label, icon, active, onClick, }) {
    return (_jsxs("button", { type: "button", onClick: onClick, className: `flex shrink-0 items-center gap-3 rounded-[18px] border px-4 py-3 text-left transition-all duration-200 ${active
            ? 'border-[#0a5b53] bg-[linear-gradient(180deg,#004840_0%,#003934_100%)] text-white shadow-[0_16px_30px_rgba(37,44,49,0.20)]'
            : 'border-[#c7d9d6] bg-white text-[#004840] hover:border-[#7c9894]'}`, children: [_jsx("span", { className: `flex h-9 w-9 items-center justify-center rounded-full ${active ? 'bg-white/16 text-white' : 'bg-[#ffffff] text-[#0a5b53]'}`, children: icon }), _jsx("span", { className: "text-[13px] font-medium whitespace-nowrap", children: label })] }));
}
function ComingSoonModal({ open, title, onClose, theme }) {
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[120] flex items-center justify-center px-4 py-6 backdrop-blur-[12px]", style: { background: theme.modalOverlay }, onClick: onClose, children: _jsxs("div", { className: "relative w-full max-w-[460px] rounded-[30px] border p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]", style: {
                borderColor: withAlpha(theme.accentSoft, 0.35),
                background: `linear-gradient(180deg, ${theme.modalBackgroundTop} 0%, ${theme.modalBackgroundBottom} 100%)`,
                color: theme.text,
            }, onClick: (event) => event.stopPropagation(), children: [_jsx("button", { type: "button", onClick: onClose, className: "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 transition-all hover:bg-white", style: { borderColor: withAlpha(theme.accentSoft, 0.45), color: theme.text }, "aria-label": "Pencereyi kapat", children: _jsx(X, { className: "h-4 w-4" }) }), _jsx("div", { className: "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", style: {
                        borderColor: withAlpha(theme.accentSoft, 0.52),
                        background: withAlpha('#ffffff', 0.8),
                        color: theme.accent,
                    }, children: "Yak\u0131nda" }), _jsx("h2", { className: "mt-4 text-[28px] font-semibold tracking-[-0.04em]", children: "Yak\u0131nda A\u00E7\u0131l\u0131yor" }), _jsxs("p", { className: "mt-3 text-[14px] leading-7", style: { color: mixHex(theme.text, '#ffffff', 0.18) }, children: [_jsx("span", { className: "font-semibold", style: { color: theme.text }, children: title }), " yap\u0131land\u0131r\u0131c\u0131s\u0131 modern bir demo ekran\u0131na haz\u0131rlan\u0131yor. Bu b\u00F6l\u00FCm yak\u0131nda kullan\u0131ma a\u00E7\u0131lacak."] })] }) }));
}
function LandingMenu({ onOpenConfigurator }) {
    const [comingSoonTitle, setComingSoonTitle] = useState(null);
    const menuTheme = useMemo(() => resolveMenuTheme(siteConfig.menu.theme), []);
    return (_jsxs("div", { className: "min-h-screen", style: { background: `linear-gradient(180deg, ${menuTheme.backgroundStart} 0%, ${menuTheme.backgroundMid} 45%, ${menuTheme.backgroundEnd} 100%)`, color: menuTheme.text }, children: [_jsx(ComingSoonModal, { open: !!comingSoonTitle, title: comingSoonTitle || '', onClose: () => setComingSoonTitle(null), theme: menuTheme }), _jsxs("div", { className: "mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6", children: [_jsxs("div", { className: "flex items-center justify-between gap-4 rounded-[24px] border px-4 py-3 backdrop-blur-[12px] sm:px-5", style: {
                            borderColor: menuTheme.panelBorder,
                            background: menuTheme.panelBackground,
                            boxShadow: `0 20px 45px ${withAlpha(menuTheme.text, 0.08)}`,
                        }, children: [_jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "relative inline-flex rounded-[18px] border px-4 py-3", style: {
                                        borderColor: withAlpha(menuTheme.accent, 0.55),
                                        background: menuTheme.logoBackground,
                                        boxShadow: `0 0 18px rgba(255,255,255,0.14), 0 0 26px ${withAlpha(menuTheme.logoBackground, 0.26)}`,
                                    }, children: [_jsx("span", { className: "pointer-events-none absolute inset-0 rounded-[18px]", style: { boxShadow: `0 0 18px rgba(255,255,255,0.12), 0 0 28px ${withAlpha(menuTheme.logoBackground, 0.28)}` } }), _jsx("img", { src: brandLogo, alt: "Visora logo", className: "relative h-7 w-auto [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.45))]" })] }) }), _jsxs("a", { href: homepageUrl, className: "inline-flex items-center gap-2 rounded-[16px] border px-4 py-3 text-[13px] font-semibold transition-all duration-200", style: {
                                    borderColor: menuTheme.buttonBorder,
                                    background: menuTheme.buttonBackground,
                                    color: menuTheme.buttonText,
                                    boxShadow: `0 14px 30px ${withAlpha(menuTheme.text, 0.08)}`,
                                }, onMouseEnter: (event) => {
                                    event.currentTarget.style.borderColor = menuTheme.buttonHoverBorder;
                                    event.currentTarget.style.background = menuTheme.buttonHoverBackground;
                                }, onMouseLeave: (event) => {
                                    event.currentTarget.style.borderColor = menuTheme.buttonBorder;
                                    event.currentTarget.style.background = menuTheme.buttonBackground;
                                }, children: [_jsx(House, { className: "h-4 w-4" }), _jsx("span", { children: "Ana Sayfa" })] })] }), _jsxs("div", { className: "px-1 pb-5 pt-7 text-center sm:px-2 lg:pt-9", children: [_jsx("div", { className: "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]", style: { borderColor: menuTheme.badgeBorder, background: menuTheme.badgeBackground, color: menuTheme.badgeText }, children: siteConfig.menu.badge }), _jsx("h1", { className: "mt-4 text-[34px] font-semibold tracking-[-0.05em] sm:text-[42px] lg:text-[54px]", style: { color: menuTheme.text }, children: siteConfig.menu.heading })] }), _jsx("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3", children: landingOptions.map((option, index) => (_jsx("button", { type: "button", onClick: () => {
                                if (option.opensConfigurator) {
                                    onOpenConfigurator();
                                    return;
                                }
                                setComingSoonTitle(option.title);
                            }, className: "group relative isolate overflow-hidden rounded-[28px] border text-left transition-all duration-300 hover:-translate-y-1.5 [backface-visibility:hidden] [transform:translateZ(0)]", style: {
                                animationDelay: `${index * 70}ms`,
                                borderColor: menuTheme.cardBorder,
                                background: menuTheme.cardBackground,
                                boxShadow: `0 26px 60px ${menuTheme.shadowColor}`,
                            }, onMouseEnter: (event) => {
                                event.currentTarget.style.boxShadow = `0 34px 70px ${withAlpha(menuTheme.text, 0.16)}`;
                            }, onMouseLeave: (event) => {
                                event.currentTarget.style.boxShadow = `0 26px 60px ${menuTheme.shadowColor}`;
                            }, children: _jsxs("div", { className: "relative aspect-[1.65/1] overflow-hidden rounded-[28px] [backface-visibility:hidden] [transform:translateZ(0)]", children: [_jsx("img", { src: option.image, alt: option.title, className: "h-full w-full rounded-[28px] object-cover transition-transform duration-500 group-hover:scale-[1.04] [backface-visibility:hidden] [transform:translateZ(0)]" }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,rgba(0,0,0,0.18)_54%,rgba(0,0,0,0.72)_100%)]" }), option.status === 'comingSoon' ? (_jsx("div", { className: "absolute right-4 top-4 rounded-full border border-white/28 bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-[12px]", children: "Yak\u0131nda" })) : (_jsx("div", { className: "absolute right-4 top-4 rounded-full border border-white/28 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur-[12px]", style: { background: menuTheme.liveBackground, color: menuTheme.liveText }, children: "Yay\u0131nda" })), _jsx("div", { className: "absolute inset-x-0 bottom-0 p-5 sm:p-6", children: _jsxs("div", { className: "flex items-end justify-between gap-4", children: [_jsx("div", { children: _jsx("h2", { className: "text-[28px] font-semibold tracking-[-0.04em] text-white sm:text-[32px]", children: option.title }) }), _jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/24 bg-white/12 text-white backdrop-blur-[14px] transition-all duration-300 group-hover:bg-white/18 group-hover:translate-x-1", children: _jsx(ArrowRight, { className: "h-5 w-5" }) })] }) })] }) }, option.key))) })] })] }));
}
function InstagramSocialIcon({ className = 'h-4 w-4' }) {
    return (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", className: className, children: [_jsx("rect", { x: "3.5", y: "3.5", width: "17", height: "17", rx: "5", stroke: "currentColor", strokeWidth: "1.8" }), _jsx("circle", { cx: "12", cy: "12", r: "4", stroke: "currentColor", strokeWidth: "1.8" }), _jsx("circle", { cx: "17.2", cy: "6.8", r: "1", fill: "currentColor" })] }));
}
function FacebookSocialIcon({ className = 'h-4 w-4' }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", className: className, children: _jsx("path", { d: "M13.2 20V12.9H15.8L16.2 10H13.2V8.15C13.2 7.3 13.5 6.72 14.72 6.72H16.3V4.13C16.03 4.1 15.08 4 13.98 4C11.69 4 10.12 5.35 10.12 7.84V10H7.7V12.9H10.12V20H13.2Z", fill: "currentColor" }) }));
}
function TikTokSocialIcon({ className = 'h-4 w-4' }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", className: className, children: _jsx("path", { d: "M14.6 4.2C15.15 5.75 16.32 6.93 17.88 7.51V10.05C16.77 10.03 15.72 9.71 14.8 9.13V14.2C14.8 17.1 12.48 19.4 9.62 19.4C6.77 19.4 4.45 17.1 4.45 14.2C4.45 11.36 6.71 9.08 9.52 9V11.58C8.14 11.66 7.05 12.81 7.05 14.2C7.05 15.65 8.2 16.8 9.62 16.8C11.04 16.8 12.2 15.66 12.2 14.2V4.2H14.6Z", fill: "currentColor" }) }));
}
function SocialPanel({ mobile = false }) {
    const items = [
        { key: 'instagram', label: 'Instagram', href: socialLinks.instagram, icon: _jsx(InstagramSocialIcon, { className: mobile ? 'h-[11px] w-[11px]' : 'h-[17px] w-[17px]' }) },
        { key: 'facebook', label: 'Facebook', href: socialLinks.facebook, icon: _jsx(FacebookSocialIcon, { className: mobile ? 'h-[11px] w-[11px]' : 'h-[17px] w-[17px]' }) },
        { key: 'tiktok', label: 'TikTok', href: socialLinks.tiktok, icon: _jsx(TikTokSocialIcon, { className: mobile ? 'h-[11px] w-[11px]' : 'h-[17px] w-[17px]' }) },
    ].filter((item) => !!item.href);
    if (!items.length)
        return null;
    return (_jsx("div", { className: `absolute z-20 ${mobile ? 'right-2.5 top-2.5' : 'left-4 bottom-5'}`, children: _jsx("div", { className: `border border-white/18 bg-[linear-gradient(180deg,rgba(0,57,52,0.30)_0%,rgba(0,72,64,0.18)_100%)] shadow-[0_18px_34px_rgba(0,26,24,0.24),inset_0_1px_0_rgba(255,255,255,0.20)] backdrop-blur-[18px] ${mobile
                ? 'flex flex-row items-center gap-1 rounded-[12px] px-1 py-1'
                : 'flex flex-col items-center gap-2 rounded-[22px] p-2.5 min-w-[58px]'}`, children: items.map((item) => (_jsx("a", { href: item.href, target: "_blank", rel: "noreferrer", "aria-label": item.label, className: `group flex items-center justify-center rounded-full border border-white/18 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.08)_48%,rgba(0,57,52,0.12)_100%)] text-white shadow-[0_10px_22px_rgba(0,0,0,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/28 hover:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0.12)_48%,rgba(0,57,52,0.18)_100%)] ${mobile ? 'h-6 w-6' : 'h-10 w-10'}`, children: _jsx("span", { className: "text-white/95 transition-transform duration-200 group-hover:scale-105", children: item.icon }) }, item.key))) }) }));
}
function ConfiguratorApp({ initialSnapshot = defaultConfiguratorSnapshot, onSnapshotChange, }) {
    const [dimensions, setDimensions] = useState(initialSnapshot.dimensions);
    const [roofMaterial, setRoofMaterial] = useState(initialSnapshot.roofMaterial);
    const [pergolaColorOverride, setPergolaColorOverride] = useState(initialSnapshot.pergolaColorOverride);
    const [selectedColor, setSelectedColor] = useState(initialSnapshot.selectedColor);
    const [selectedSide, setSelectedSide] = useState('front');
    const [enclosures, setEnclosures] = useState(initialSnapshot.enclosures);
    const wedgeMaterial = 'glass';
    const [lightsEnabled, setLightsEnabled] = useState(initialSnapshot.lightsEnabled);
    const [roofAwningEnabled, setRoofAwningEnabled] = useState(initialSnapshot.roofAwningEnabled);
    const [sideAwnings, setSideAwnings] = useState(initialSnapshot.sideAwnings);
    const [awningColor, setAwningColor] = useState(initialSnapshot.awningColor);
    const [lightTemperature, setLightTemperature] = useState(initialSnapshot.lightTemperature);
    const [nightMode, setNightMode] = useState(false);
    const [roofAnimationOpen, setRoofAnimationOpen] = useState(initialSnapshot.roofOpen);
    const [doorAnimationOpen, setDoorAnimationOpen] = useState(initialSnapshot.doorOpenStates);
    const [awningAnimationOpen, setAwningAnimationOpen] = useState(initialSnapshot.awningOpenStates);
    const [measurementsVisible, setMeasurementsVisible] = useState(true);
    const [frontSplitLinked, setFrontSplitLinked] = useState(false);
    const [openSection, setOpenSection] = useState('roof');
    const [mobileTab, setMobileTab] = useState('dimensions');
    const [mobileAnimationMenuOpen, setMobileAnimationMenuOpen] = useState(false);
    const [mobileDownloadMenuOpen, setMobileDownloadMenuOpen] = useState(false);
    const [isMobileLayout, setIsMobileLayout] = useState(false);
    const [arModalOpen, setArModalOpen] = useState(false);
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [exportStatus, setExportStatus] = useState(null);
    const [inquiryForm, setInquiryForm] = useState({
        name: '',
        postcode: '',
        email: '',
        note: '',
    });
    const sceneRef = useRef(null);
    const [directArViewerReady, setDirectArViewerReady] = useState(false);
    const [directArGlbUrl, setDirectArGlbUrl] = useState('');
    const [directArLaunchPending, setDirectArLaunchPending] = useState(false);
    const directArViewerRef = useRef(null);
    const directArObjectUrlRef = useRef('');
    const frontIsSplit = dimensions.width >= 5;
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const media = window.matchMedia('(max-width: 1023px)');
        const update = () => setIsMobileLayout(media.matches);
        update();
        media.addEventListener?.('change', update);
        return () => media.removeEventListener?.('change', update);
    }, []);
    const roofMaterialLabel = (type) => roofLabelMap[type];
    const enclosureSummary = (type) => enclosureLabelMap[type];
    useEffect(() => {
        if (frontIsSplit) {
            setFrontSplitLinked(true);
            setSelectedSide((prev) => (prev === 'front' ? 'frontLeft' : prev));
            setEnclosures((prev) => {
                const fallbackType = prev.front !== 'none' ? prev.front : prev.frontLeft !== 'none' ? prev.frontLeft : prev.frontRight;
                const nextLeft = fallbackType === 'none' ? prev.frontLeft : fallbackType;
                const nextRight = fallbackType === 'none' ? prev.frontRight : fallbackType;
                if (nextLeft === prev.frontLeft && nextRight === prev.frontRight)
                    return prev;
                return { ...prev, frontLeft: nextLeft, frontRight: nextRight };
            });
        }
        else {
            setFrontSplitLinked(false);
            setSelectedSide((prev) => (prev === 'frontLeft' || prev === 'frontRight' ? 'front' : prev));
            setEnclosures((prev) => {
                const nextFront = prev.frontLeft !== 'none' ? prev.frontLeft : prev.frontRight !== 'none' ? prev.frontRight : prev.front;
                if (nextFront === prev.front)
                    return prev;
                return { ...prev, front: nextFront };
            });
        }
    }, [frontIsSplit]);
    const applyEnclosureSelection = (type) => {
        setEnclosures((prev) => {
            if (frontIsSplit && (selectedSide === 'frontLeft' || selectedSide === 'frontRight')) {
                if (frontSplitLinked) {
                    return { ...prev, frontLeft: type, frontRight: type };
                }
                return { ...prev, [selectedSide]: type };
            }
            return { ...prev, [selectedSide]: type };
        });
    };
    const activeColor = useMemo(() => colorOptions.find((option) => option.key === selectedColor) ?? colorOptions[1], [selectedColor]);
    const pergolaColor = useMemo(() => (pergolaColorOverride ? colorOptions.find((option) => option.key === pergolaColorOverride) ?? activeColor : activeColor), [activeColor, pergolaColorOverride]);
    const awningActiveColor = useMemo(() => colorOptions.find((option) => option.key === awningColor) ?? activeColor, [activeColor, awningColor]);
    const isPergolaRoof = roofMaterial === 'fabric' || roofMaterial === 'bioclimatic' || roofMaterial === 'lux-bioclimatic';
    const animationSideKeys = frontIsSplit ? ['frontLeft', 'frontRight', 'left', 'right'] : ['front', 'left', 'right'];
    const availableDoorSides = animationSideKeys.filter((side) => isAnimatedDoorType(enclosures[side]));
    const availableCurtainSides = animationSideKeys.filter((side) => sideAwnings[side]);
    const hasRoofCurtain = !isPergolaRoof && roofAwningEnabled;
    const doorsOpen = roofAnimationOpen || availableDoorSides.some((side) => doorAnimationOpen[side]);
    const awningsOpen = (hasRoofCurtain && awningAnimationOpen.roof) || availableCurtainSides.some((side) => awningAnimationOpen[side]);
    const animationItemCount = (isPergolaRoof ? 1 : 0) +
        availableDoorSides.length +
        (hasRoofCurtain ? 1 : 0) +
        availableCurtainSides.length;
    const allAnimationsOpen = animationItemCount > 0 &&
        (!isPergolaRoof || roofAnimationOpen) &&
        availableDoorSides.every((side) => doorAnimationOpen[side]) &&
        (!hasRoofCurtain || awningAnimationOpen.roof) &&
        availableCurtainSides.every((side) => awningAnimationOpen[side]);
    const hasAnyAnimationOpen = doorsOpen || awningsOpen;
    const closeAllSideAnimations = () => {
        setRoofAnimationOpen(false);
        setDoorAnimationOpen({
            front: false,
            frontLeft: false,
            frontRight: false,
            left: false,
            right: false,
        });
        setAwningAnimationOpen({
            roof: false,
            front: false,
            frontLeft: false,
            frontRight: false,
            left: false,
            right: false,
        });
    };
    const toggleAllAnimations = () => {
        const nextOpen = !allAnimationsOpen;
        if (isPergolaRoof) {
            setRoofAnimationOpen(nextOpen);
        }
        setDoorAnimationOpen((prev) => {
            const next = { ...prev };
            availableDoorSides.forEach((side) => {
                next[side] = nextOpen;
            });
            return next;
        });
        setAwningAnimationOpen((prev) => {
            const next = { ...prev };
            if (hasRoofCurtain)
                next.roof = nextOpen;
            availableCurtainSides.forEach((side) => {
                next[side] = nextOpen;
            });
            return next;
        });
    };
    const openMobileAnimationMenu = () => {
        setMobileDownloadMenuOpen(false);
        setMobileAnimationMenuOpen((prev) => !prev);
    };
    const openMobileDownloadMenu = () => {
        setMobileAnimationMenuOpen(false);
        setMobileDownloadMenuOpen((prev) => !prev);
    };
    const createClosedDoorAnimationState = () => ({
        front: false,
        frontLeft: false,
        frontRight: false,
        left: false,
        right: false,
    });
    const createClosedAwningAnimationState = () => ({
        roof: false,
        front: false,
        frontLeft: false,
        frontRight: false,
        left: false,
        right: false,
    });
    const captureAnimationSnapshot = () => ({
        roofOpen: roofAnimationOpen,
        doorOpenStates: { ...doorAnimationOpen },
        awningOpenStates: { ...awningAnimationOpen },
    });
    const restoreAnimationSnapshot = (snapshot) => {
        setRoofAnimationOpen(snapshot.roofOpen);
        setDoorAnimationOpen(snapshot.doorOpenStates);
        setAwningAnimationOpen(snapshot.awningOpenStates);
    };
    const closeExportAnimations = () => {
        setRoofAnimationOpen(false);
        setDoorAnimationOpen(createClosedDoorAnimationState());
        setAwningAnimationOpen(createClosedAwningAnimationState());
    };
    const setExportDoorKeysOpen = (keys, open) => {
        const next = createClosedDoorAnimationState();
        keys.forEach((key) => {
            if (availableDoorSides.includes(key)) {
                next[key] = open;
            }
        });
        setDoorAnimationOpen(next);
    };
    const setExportAwningKeysOpen = (keys, open) => {
        const next = createClosedAwningAnimationState();
        keys.forEach((key) => {
            if (key === 'roof') {
                if (hasRoofCurtain) {
                    next.roof = open;
                }
                return;
            }
            if (availableCurtainSides.includes(key)) {
                next[key] = open;
            }
        });
        setAwningAnimationOpen(next);
    };
    const frontVideoSides = frontIsSplit ? ['frontLeft', 'frontRight'] : ['front'];
    const playExportAwningSequence = async (keys, detail) => {
        const availableKeys = keys.filter((key) => (key === 'roof' ? hasRoofCurtain : availableCurtainSides.includes(key)));
        if (!availableKeys.length)
            return false;
        setExportStatus({ title: 'Video kaydediliyor', detail });
        setExportAwningKeysOpen(availableKeys, true);
        await sleep(960);
        return true;
    };
    const playExportDoorSequence = async (keys, detail) => {
        const availableKeys = keys.filter((key) => availableDoorSides.includes(key));
        if (!availableKeys.length)
            return false;
        setExportStatus({ title: 'Video kaydediliyor', detail });
        setExportDoorKeysOpen(availableKeys, true);
        await sleep(980);
        setExportDoorKeysOpen([], false);
        await sleep(920);
        return true;
    };
    const closeExportAwningSequence = async (detail) => {
        setExportStatus({ title: 'Video kaydediliyor', detail });
        setExportAwningKeysOpen([], false);
        await sleep(900);
    };
    const playExportSideSequence = async ({ view, awningKeys, doorKeys, openingCurtainDetail, openingSideDetail, }) => {
        await sceneRef.current?.moveToView(view, { durationMs: view === 'front' ? 1700 : 1500 });
        await sleep(220);
        const curtainOpened = await playExportAwningSequence(awningKeys, openingCurtainDetail);
        if (curtainOpened) {
            await sleep(260);
        }
        const sideAnimated = await playExportDoorSequence(doorKeys, openingSideDetail);
        if (curtainOpened) {
            const closingCurtainDetail = view === 'front'
                ? 'Ön perde kapanıyor...'
                : view === 'right'
                    ? 'Sağ perde kapanıyor...'
                    : view === 'left'
                        ? 'Sol perde kapanıyor...'
                        : 'Perde kapanıyor...';
            await closeExportAwningSequence(closingCurtainDetail);
        }
        else if (!sideAnimated) {
            await sleep(700);
        }
    };
    const playExportRoofSequence = async (detail) => {
        if (!isPergolaRoof)
            return;
        setExportStatus({ title: 'Video kaydediliyor', detail });
        setRoofAnimationOpen(true);
        await sleep(roofMaterial === 'lux-bioclimatic' ? 1550 : 980);
        setRoofAnimationOpen(false);
        await sleep(roofMaterial === 'lux-bioclimatic' ? 1450 : 920);
    };
    const handlePhotoExport = async () => {
        const scene = sceneRef.current;
        if (!scene || exportStatus)
            return;
        setMobileDownloadMenuOpen(false);
        setExportStatus({ title: 'Fotoğraf hazırlanıyor', detail: '5 ayrı açı yakalanıyor...' });
        const initialCameraState = scene.getCameraState();
        const timestamp = makeExportTimestamp();
        try {
            for (let index = 0; index < EXPORT_PHOTO_VIEWS.length; index += 1) {
                const { view, slug } = EXPORT_PHOTO_VIEWS[index];
                setExportStatus({
                    title: 'Fotoğraf hazırlanıyor',
                    detail: `Açı yakalanıyor: ${index + 1} / ${EXPORT_PHOTO_VIEWS.length}...`,
                });
                await scene.moveToView(view, { durationMs: index === 0 ? 280 : 560 });
                await sleep(140);
                const photoBlob = await captureWatermarkedSceneBlob(scene);
                triggerBlobDownload(photoBlob, `visora-photo-${slug}-${timestamp}.png`);
                await sleep(120);
            }
        }
        catch (error) {
            console.error(error);
            window.alert(error instanceof Error ? error.message : 'Fotoğraf dışa aktarımı oluşturulamadı.');
        }
        finally {
            if (initialCameraState && sceneRef.current) {
                await sceneRef.current.restoreCameraState(initialCameraState, { durationMs: 420 });
            }
            setExportStatus(null);
        }
    };
    const handleVideoExport = async () => {
        const scene = sceneRef.current;
        if (!scene || exportStatus)
            return;
        if (typeof MediaRecorder === 'undefined') {
            window.alert('Bu tarayıcı video dışa aktarımını desteklemiyor.');
            return;
        }
        const videoFormat = getSupportedVideoFormat();
        const sourceCanvas = scene.getCanvas();
        if (!videoFormat) {
            window.alert('Bu tarayıcı dışa aktarım için gerçek bir MP4 video dosyası oluşturamıyor.');
            return;
        }
        if (!sourceCanvas) {
            window.alert('Sahne video akışı henüz hazır değil.');
            return;
        }
        const recordingSurface = await createWatermarkedRecordingSurface(sourceCanvas);
        const stream = recordingSurface.canvas.captureStream(30);
        let recorder;
        try {
            recorder = new MediaRecorder(stream, { mimeType: videoFormat.mimeType });
        }
        catch {
            recordingSurface.stop();
            stream.getTracks().forEach((track) => track.stop());
            window.alert('Bu tarayıcı dışa aktarım için gerçek bir MP4 video dosyası oluşturamıyor.');
            return;
        }
        const chunks = [];
        const initialCameraState = scene.getCameraState();
        const animationSnapshot = captureAnimationSnapshot();
        const animationResetDuration = isPergolaRoof ? 1500 : 980;
        const timestamp = makeExportTimestamp();
        const stopPromise = new Promise((resolve, reject) => {
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
            recorder.onerror = () => reject(new Error('Video dışa aktarımı kaydedilemedi.'));
            recorder.onstop = () => resolve(new Blob(chunks, { type: videoFormat.mimeType }));
        });
        setMobileDownloadMenuOpen(false);
        setExportStatus({ title: 'Video hazırlanıyor', detail: 'Hareketli parçalar sıfırlanıyor...' });
        try {
            closeExportAnimations();
            await scene.moveToView('hero', { immediate: true });
            await sleep(animationResetDuration);
            recorder.start(250);
            await sleep(180);
            if (animationItemCount <= 0) {
                setExportStatus({ title: 'Video kaydediliyor', detail: 'Sahne turu kaydediliyor...' });
                await scene.moveToView('right', { durationMs: 1500 });
                await sleep(700);
                await scene.moveToView('front', { durationMs: 1700 });
                await sleep(700);
                await scene.moveToView('left', { durationMs: 1700 });
                await sleep(700);
                await scene.moveToView('top', { durationMs: 1600 });
                await sleep(700);
                await scene.moveToView('hero', { durationMs: 1200 });
            }
            else {
                const roofHasAction = hasRoofCurtain || isPergolaRoof;
                await playExportSideSequence({
                    view: 'right',
                    awningKeys: ['right'],
                    doorKeys: ['right'],
                    openingCurtainDetail: 'Sağ perde açılıyor...',
                    openingSideDetail: 'Sağ cephe açılıyor...',
                });
                await playExportSideSequence({
                    view: 'front',
                    awningKeys: frontVideoSides,
                    doorKeys: frontVideoSides,
                    openingCurtainDetail: 'Ön perde açılıyor...',
                    openingSideDetail: 'Ön cephe açılıyor...',
                });
                await playExportSideSequence({
                    view: 'left',
                    awningKeys: ['left'],
                    doorKeys: ['left'],
                    openingCurtainDetail: 'Sol perde açılıyor...',
                    openingSideDetail: 'Sol cephe açılıyor...',
                });
                await scene.moveToView('top', { durationMs: 1500 });
                await sleep(220);
                const roofCurtainOpened = await playExportAwningSequence(['roof'], 'Çatı perdesi açılıyor...');
                if (roofCurtainOpened) {
                    await sleep(260);
                }
                await playExportRoofSequence('Çatı sistemi açılıyor...');
                if (roofCurtainOpened) {
                    await closeExportAwningSequence('Çatı perdesi kapanıyor...');
                }
                if (!roofHasAction)
                    await sleep(700);
                await scene.moveToView('hero', { durationMs: 1150 });
                await sleep(360);
            }
            await sleep(420);
            recorder.stop();
            const videoBlob = await stopPromise;
            triggerBlobDownload(videoBlob, `visora-video-${timestamp}.${videoFormat.extension}`);
        }
        catch (error) {
            console.error(error);
            if (recorder.state !== 'inactive') {
                recorder.stop();
            }
            window.alert(error instanceof Error ? error.message : 'Video dışa aktarımı oluşturulamadı.');
        }
        finally {
            recordingSurface.stop();
            stream.getTracks().forEach((track) => track.stop());
            restoreAnimationSnapshot(animationSnapshot);
            if (initialCameraState && sceneRef.current) {
                await sceneRef.current.restoreCameraState(initialCameraState, { durationMs: 420 });
            }
            setExportStatus(null);
        }
    };
    useEffect(() => {
        if (!isMobileLayout && mobileAnimationMenuOpen) {
            setMobileAnimationMenuOpen(false);
        }
    }, [isMobileLayout, mobileAnimationMenuOpen]);
    useEffect(() => {
        if (!isMobileLayout && mobileDownloadMenuOpen) {
            setMobileDownloadMenuOpen(false);
        }
    }, [isMobileLayout, mobileDownloadMenuOpen]);
    useEffect(() => {
        if (!isPergolaRoof && roofAnimationOpen) {
            setRoofAnimationOpen(false);
        }
    }, [isPergolaRoof, roofAnimationOpen]);
    useEffect(() => {
        setDoorAnimationOpen((prev) => {
            const next = { ...prev };
            if (frontIsSplit) {
                next.front = false;
            }
            else {
                next.frontLeft = false;
                next.frontRight = false;
            }
            sideKeyOrder.forEach((side) => {
                if (!availableDoorSides.includes(side)) {
                    next[side] = false;
                }
            });
            return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
        });
    }, [availableDoorSides, frontIsSplit]);
    useEffect(() => {
        setAwningAnimationOpen((prev) => {
            const next = { ...prev };
            if (frontIsSplit) {
                next.front = false;
            }
            else {
                next.frontLeft = false;
                next.frontRight = false;
            }
            if (!hasRoofCurtain) {
                next.roof = false;
            }
            sideKeyOrder.forEach((side) => {
                if (!availableCurtainSides.includes(side)) {
                    next[side] = false;
                }
            });
            return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
        });
    }, [availableCurtainSides, frontIsSplit, hasRoofCurtain]);
    useEffect(() => {
        if (!enabledRoofOptions.some((option) => option.key === roofMaterial)) {
            setRoofMaterial(defaultRoofMaterial);
        }
    }, [roofMaterial]);
    useEffect(() => {
        setEnclosures((prev) => {
            const next = { ...prev };
            let changed = false;
            Object.keys(next).forEach((side) => {
                if (!enabledEnclosureOptions.some((option) => option.key === next[side])) {
                    next[side] = defaultEnclosureType;
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
        if (!addonsConfig.lights && lightsEnabled)
            setLightsEnabled(false);
        if (!addonsConfig.roofAwning && roofAwningEnabled)
            setRoofAwningEnabled(false);
        if (!addonsConfig.sideAwnings && Object.values(sideAwnings).some(Boolean)) {
            setSideAwnings({ front: false, frontLeft: false, frontRight: false, left: false, right: false });
        }
        if (!hasAnyAddonOption) {
            setOpenSection((prev) => (prev === 'addons' ? 'roof' : prev));
            setMobileTab((prev) => (prev === 'addons' ? 'dimensions' : prev));
        }
    }, [lightsEnabled, roofAwningEnabled, roofMaterial, sideAwnings]);
    useEffect(() => {
        if (isPergolaRoof && roofAwningEnabled) {
            setRoofAwningEnabled(false);
        }
        setSideAwnings((prev) => {
            const next = { ...prev };
            if (frontIsSplit) {
                next.front = false;
                if (enclosures.frontLeft === 'aluminium')
                    next.frontLeft = false;
                if (enclosures.frontRight === 'aluminium')
                    next.frontRight = false;
            }
            else {
                next.frontLeft = false;
                next.frontRight = false;
                if (enclosures.front === 'aluminium')
                    next.front = false;
            }
            if (enclosures.left === 'aluminium')
                next.left = false;
            if (enclosures.right === 'aluminium')
                next.right = false;
            return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
        });
    }, [enclosures, frontIsSplit, isPergolaRoof, roofAwningEnabled]);
    const inquiryText = useMemo(() => {
        const lines = [
            `Merhaba ${siteConfig.branding.whatsappBrandName},`,
            '',
            'İletişim bilgileri',
            `• Ad Soyad: ${inquiryForm.name.trim() || 'Belirtilmedi'}`,
            `• Posta kodu: ${inquiryForm.postcode.trim() || 'Belirtilmedi'}`,
            `• E-posta: ${inquiryForm.email.trim() || 'Belirtilmedi'}`,
            ...(inquiryForm.note.trim() ? ['', 'Ek not', inquiryForm.note.trim()] : []),
            '',
            `Aşağıdaki ${siteConfig.branding.whatsappBrandName} yapılandırması için fiyat bilgisi almak istiyorum:`,
            '',
            'Ölçüler',
            `• Genişlik: ${formatMetres(dimensions.width)}`,
            `• Derinlik: ${formatMetres(dimensions.projection)}`,
            `• Yükseklik: ${formatMetres(dimensions.height)}`,
            '',
            'Özellikler',
            `• Çatı: ${roofMaterialLabel(roofMaterial)}`,
            `• Profil rengi: ${activeColor.name} (${activeColor.ral})`,
            ...(isPergolaRoof ? [`• Pergola rengi: ${pergolaColor.name} (${pergolaColor.ral})`] : []),
            ...(frontIsSplit
                ? [
                    `• Ön sol cephe: ${enclosureSummary(enclosures.frontLeft)}`,
                    `• Ön sağ cephe: ${enclosureSummary(enclosures.frontRight)}`,
                ]
                : [`• Ön cephe: ${enclosureSummary(enclosures.front)}`]),
            `• Sol cephe: ${enclosureSummary(enclosures.left)}`,
            `• Sağ cephe: ${enclosureSummary(enclosures.right)}`,
            '• Üst cam: Cam',
            '',
            'Ekstralar',
            `• Çatı tentesi: ${roofAwningEnabled ? `Evet / ${awningActiveColor.name}` : 'Hayır'}`,
            `• Ön tente: ${frontIsSplit ? `Sol ${sideAwnings.frontLeft ? 'Evet' : 'Hayır'} / Sağ ${sideAwnings.frontRight ? 'Evet' : 'Hayır'}` : sideAwnings.front ? 'Evet' : 'Hayır'}`,
            `• Sol tente: ${sideAwnings.left ? 'Evet' : 'Hayır'}`,
            `• Sağ tente: ${sideAwnings.right ? 'Evet' : 'Hayır'}`,
            `• Işıklar: ${lightsEnabled ? `Yuvarlak LED ışıklar / ${lightTemperature === 'warm' ? 'Sıcak Beyaz 3000K' : 'Nötr Beyaz 4000K'}` : 'Seçilmedi'}`,
            '',
            'Tahmini fiyatı, teslim süresini ve önerilerinizi paylaşabilir misiniz?',
            '',
            'Teşekkürler.',
        ];
        return lines.join('\n');
    }, [
        activeColor.name,
        activeColor.ral,
        awningActiveColor.name,
        dimensions.height,
        dimensions.projection,
        dimensions.width,
        enclosures.front,
        enclosures.frontLeft,
        enclosures.frontRight,
        enclosures.left,
        enclosures.right,
        frontIsSplit,
        inquiryForm.email,
        inquiryForm.name,
        inquiryForm.note,
        inquiryForm.postcode,
        isPergolaRoof,
        lightTemperature,
        lightsEnabled,
        pergolaColor.name,
        pergolaColor.ral,
        roofAwningEnabled,
        roofMaterial,
        sideAwnings.front,
        sideAwnings.frontLeft,
        sideAwnings.frontRight,
        sideAwnings.left,
        sideAwnings.right,
    ]);
    const handleInquiry = () => {
        setInquiryModalOpen(true);
    };
    const handleInquiryFormChange = (field, value) => {
        setInquiryForm((prev) => ({ ...prev, [field]: value }));
    };
    const handleInquirySubmit = () => {
        if (typeof window === 'undefined')
            return;
        const whatsappUrl = `https://wa.me/${configuredWhatsappNumber}?text=${encodeURIComponent(inquiryText)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        setInquiryModalOpen(false);
    };
    const configuratorSnapshot = useMemo(() => ({
        dimensions,
        roofMaterial,
        pergolaColorOverride,
        selectedColor,
        enclosures,
        lightsEnabled,
        lightTemperature,
        doorsOpen,
        awningsOpen,
        roofOpen: roofAnimationOpen,
        doorOpenStates: doorAnimationOpen,
        awningOpenStates: awningAnimationOpen,
        roofAwningEnabled,
        sideAwnings,
        awningColor,
    }), [
        awningAnimationOpen,
        awningColor,
        awningsOpen,
        dimensions,
        doorAnimationOpen,
        doorsOpen,
        enclosures,
        lightTemperature,
        lightsEnabled,
        pergolaColorOverride,
        roofAnimationOpen,
        roofAwningEnabled,
        roofMaterial,
        selectedColor,
        sideAwnings,
    ]);
    useEffect(() => {
        onSnapshotChange?.(configuratorSnapshot);
    }, [configuratorSnapshot, onSnapshotChange]);
    const directArConfig = useMemo(() => ({
        target: dimensions,
        roofMaterial,
        frameColor: activeColor.frame,
        pergolaColor: pergolaColor.frame,
        enclosures,
        lightsEnabled,
        lightTemperature,
        doorsOpen,
        awningsOpen,
        roofOpen: roofAnimationOpen,
        doorOpenStates: doorAnimationOpen,
        awningOpenStates: awningAnimationOpen,
        roofAwningEnabled,
        sideAwnings,
        awningColor: awningActiveColor.frame,
    }), [
        activeColor.frame,
        awningActiveColor.frame,
        awningAnimationOpen,
        awningsOpen,
        dimensions,
        doorAnimationOpen,
        doorsOpen,
        enclosures,
        lightTemperature,
        lightsEnabled,
        pergolaColor.frame,
        roofAnimationOpen,
        roofAwningEnabled,
        roofMaterial,
        sideAwnings,
    ]);
    useEffect(() => {
        if (!isMobileLayout)
            return;
        let cancelled = false;
        loadModelViewer()
            .then(() => {
            if (!cancelled)
                setDirectArViewerReady(true);
        })
            .catch(() => {
            if (!cancelled)
                setDirectArViewerReady(false);
        });
        return () => {
            cancelled = true;
        };
    }, [isMobileLayout]);
    useEffect(() => {
        if (!isMobileLayout)
            return;
        let cancelled = false;
        exportConfigToGlb(directArConfig)
            .then((url) => {
            if (cancelled) {
                URL.revokeObjectURL(url);
                return;
            }
            if (directArObjectUrlRef.current && directArObjectUrlRef.current !== url) {
                URL.revokeObjectURL(directArObjectUrlRef.current);
            }
            directArObjectUrlRef.current = url;
            setDirectArGlbUrl(url);
        })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [directArConfig, isMobileLayout]);
    useEffect(() => {
        return () => {
            if (directArObjectUrlRef.current) {
                URL.revokeObjectURL(directArObjectUrlRef.current);
                directArObjectUrlRef.current = '';
            }
        };
    }, []);
    const arShareUrl = useMemo(() => {
        if (typeof window === 'undefined')
            return '';
        return buildArUrl(window.location.href, configuratorSnapshot);
    }, [configuratorSnapshot]);
    const triggerDirectPhoneAr = () => {
        const viewer = directArViewerRef.current;
        if (typeof viewer?.activateAR !== 'function')
            return false;
        viewer.activateAR();
        return true;
    };
    useEffect(() => {
        if (typeof window === 'undefined' || !directArLaunchPending || !isLikelyPhone() || !directArViewerReady || !directArGlbUrl)
            return;
        const launchTimer = window.setTimeout(() => {
            triggerDirectPhoneAr();
            setDirectArLaunchPending(false);
        }, 40);
        return () => window.clearTimeout(launchTimer);
    }, [directArGlbUrl, directArLaunchPending, directArViewerReady]);
    const handleViewInAr = () => {
        if (typeof window === 'undefined')
            return;
        if (isLikelyPhone()) {
            if (directArViewerReady && directArGlbUrl && triggerDirectPhoneAr())
                return;
            setDirectArLaunchPending(true);
            return;
        }
        setArModalOpen(true);
    };
    const dimensionsContent = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-3 gap-2.5", children: [_jsx(SummaryMetric, { value: formatMetres(dimensions.width), label: "Geni\u015Flik" }), _jsx(SummaryMetric, { value: formatMetres(dimensions.projection), label: "Derinlik" }), _jsx(SummaryMetric, { value: formatMetres(dimensions.height), label: "Y\u00FCkseklik" })] }), _jsxs("div", { className: "mt-4 space-y-4", children: [_jsx(SliderRow, { label: "Geni\u015Flik", range: "2 m ile 7 m aras\u0131nda", value: dimensions.width, min: 2, max: 7, step: 0.1, onChange: (value) => setDimensions((prev) => ({ ...prev, width: Number(value.toFixed(1)) })) }), _jsx(SliderRow, { label: "Derinlik", range: "2 m ile 4 m aras\u0131nda", value: dimensions.projection, min: 2, max: 4, step: 0.1, onChange: (value) => setDimensions((prev) => ({ ...prev, projection: Number(value.toFixed(1)) })) }), _jsx(SliderRow, { label: "Y\u00FCkseklik", range: "2 m ile 2,2 m aras\u0131nda", value: dimensions.height, min: 2, max: 2.2, step: 0.01, onChange: (value) => setDimensions((prev) => ({ ...prev, height: Number(value.toFixed(2)) })) })] })] }));
    const roofContent = (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-2 gap-2.5", children: enabledRoofOptions.map((option) => (_jsx(PillButton, { active: roofMaterial === option.key, label: option.label, onClick: () => setRoofMaterial(option.key) }, option.key))) }), isPergolaRoof ? (_jsxs("div", { className: "mt-4 border-t border-[#c7d9d6] pt-4", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between gap-3", children: [_jsxs("p", { className: "text-[12px] text-muted", children: ["Pergola rengi: ", _jsx("span", { className: "font-medium text-ink", children: pergolaColor.ral })] }), _jsx("button", { type: "button", onClick: () => setPergolaColorOverride(null), className: `rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${pergolaColorOverride === null
                                    ? 'border-[#0b6a60] bg-[#003934]/8 text-ink'
                                    : 'border-[#c7d9d6] bg-white text-muted hover:border-[#7c9894] hover:text-ink'}`, children: "Ta\u015F\u0131y\u0131c\u0131 ile ayn\u0131" })] }), _jsx("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-5", children: colorOptions.map((option) => (_jsx(Swatch, { option: option, active: option.key === (pergolaColorOverride ?? selectedColor), onClick: () => setPergolaColorOverride(option.key) }, `pergola-${option.key}`))) })] })) : null] }));
    const colorsContent = (_jsxs(_Fragment, { children: [_jsxs("p", { className: "mb-3 text-[12px] text-muted", children: ["Profil rengi: ", _jsx("span", { className: "font-medium text-ink", children: activeColor.ral })] }), _jsx("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-5", children: colorOptions.map((option) => (_jsx(Swatch, { option: option, active: option.key === selectedColor, onClick: () => setSelectedColor(option.key) }, option.key))) })] }));
    const enclosureContent = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-1 rounded-[13px] border border-[#c7d9d6] bg-[linear-gradient(180deg,#FFFFFF_0%,#ffffff_100%)] px-3 py-3 text-[12px] text-muted", children: [frontIsSplit ? (_jsxs(_Fragment, { children: [_jsxs("div", { children: ["\u00D6n sol: ", _jsx("span", { className: "font-medium text-ink", children: enclosureSummary(enclosures.frontLeft) })] }), _jsxs("div", { children: ["\u00D6n sa\u011F: ", _jsx("span", { className: "font-medium text-ink", children: enclosureSummary(enclosures.frontRight) })] })] })) : (_jsxs("div", { children: ["\u00D6n: ", _jsx("span", { className: "font-medium text-ink", children: enclosureSummary(enclosures.front) })] })), _jsxs("div", { children: ["Sol: ", _jsx("span", { className: "font-medium text-ink", children: enclosureSummary(enclosures.left) })] }), _jsxs("div", { children: ["Sa\u011F: ", _jsx("span", { className: "font-medium text-ink", children: enclosureSummary(enclosures.right) })] })] }), _jsx("div", { className: `mt-4 grid gap-2.5 ${frontIsSplit ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`, children: (frontIsSplit ? ['frontLeft', 'frontRight', 'left', 'right'] : ['front', 'left', 'right']).map((side) => (_jsxs("button", { type: "button", onClick: () => {
                        if (frontIsSplit &&
                            (side === 'frontLeft' || side === 'frontRight') &&
                            frontSplitLinked &&
                            (selectedSide === 'frontLeft' || selectedSide === 'frontRight') &&
                            side !== selectedSide) {
                            setFrontSplitLinked(false);
                        }
                        setSelectedSide(side);
                    }, className: `flex flex-col items-center gap-2 rounded-[13px] border px-3 py-3 transition-all duration-200 ${selectedSide === side ? 'border-[#0b6a60] bg-[#003934]/6 shadow-[0_10px_22px_rgba(37,44,49,0.08)]' : 'border-[#c7d9d6] bg-white hover:border-[#7c9894]'}`, children: [_jsx(SideIcon, { side: side === 'frontLeft' || side === 'frontRight' ? 'front' : side, active: selectedSide === side }), _jsx("span", { className: "text-[12px] font-medium text-ink", children: side === 'frontLeft' ? 'Ön Sol' : side === 'frontRight' ? 'Ön Sağ' : side === 'left' ? 'Sol' : 'Sağ' })] }, side))) }), _jsx("p", { className: "mt-4 text-[12px] text-muted", children: "Cephe kapatma tipini se\u00E7in" }), _jsx("div", { className: "mt-3 space-y-2.5", children: enabledEnclosureOptions.map((option) => (_jsx(EnclosureOptionCard, { active: enclosures[selectedSide] === option.key, title: option.title, subtitle: option.subtitle, icon: enclosureOptionIconMap[option.key], onClick: () => {
                        if (isAnimatedDoorType(option.key)) {
                            closeAllSideAnimations();
                        }
                        applyEnclosureSelection(option.key);
                    } }, option.key))) })] }));
    const addonsContent = (_jsxs(_Fragment, { children: [addonsConfig.lights ? (_jsxs("div", { children: [_jsx("div", { className: "mb-2 text-[12px] font-medium text-ink", children: "I\u015F\u0131klar" }), _jsx(EnclosureOptionCard, { active: lightsEnabled, title: "Yuvarlak LED \u0131\u015F\u0131klar", subtitle: "Somfy uzaktan kumanda dahil", icon: _jsx(Lightbulb, { className: "h-4 w-4" }), onClick: () => setLightsEnabled((prev) => !prev) }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", children: [_jsx(OptionRing, { active: lightTemperature === 'warm', tone: "#F5E9D2", title: "S\u0131cak Beyaz", subtitle: "3000K", onClick: () => setLightTemperature('warm') }), _jsx(OptionRing, { active: lightTemperature === 'neutral', tone: "#F1F2EE", title: "N\u00F6tr Beyaz", subtitle: "4000K", onClick: () => setLightTemperature('neutral') })] })] })) : null, addonsConfig.roofAwning || addonsConfig.sideAwnings ? (_jsxs("div", { className: `${addonsConfig.lights ? 'mt-5 border-t border-[#c7d9d6] pt-4' : ''}`, children: [_jsx("div", { className: "mb-2 text-[12px] font-medium text-ink", children: "Tenteler" }), !isPergolaRoof && addonsConfig.roofAwning ? (_jsx(EnclosureOptionCard, { active: roofAwningEnabled, title: "\u00C7at\u0131 tentesi", subtitle: "Geri \u00E7ekilebilir yar\u0131 \u015Feffaf kuma\u015F", icon: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", "aria-hidden": "true", children: [_jsx("path", { d: "M2 4.2H14M2 4.2V6.1M14 4.2V6.1M2 6.1H14L11.8 12.8H4.2L2 6.1Z", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }), _jsx("path", { d: "M5 6.6V12.3M8 6.6V12.3M11 6.6V12.3", stroke: "currentColor", strokeWidth: "1.1", strokeLinecap: "round" })] }), onClick: () => setRoofAwningEnabled((prev) => !prev) })) : null, addonsConfig.sideAwnings ? (_jsx("div", { className: "mt-3 grid grid-cols-2 gap-2.5", children: (frontIsSplit ? ['frontLeft', 'frontRight', 'left', 'right'] : ['front', 'left', 'right'])
                            .filter((side) => enclosures[side] !== 'aluminium')
                            .map((side) => (_jsx("button", { type: "button", onClick: () => setSideAwnings((prev) => ({ ...prev, [side]: !prev[side] })), className: `rounded-[13px] border px-3 py-2 text-[12px] font-medium transition-all duration-200 ${sideAwnings[side] ? 'border-[#0b6a60] bg-[#003934]/6 text-ink shadow-[0_10px_22px_rgba(37,44,49,0.08)]' : 'border-[#c7d9d6] bg-white text-muted hover:border-[#7c9894] hover:text-ink'}`, children: side === 'frontLeft' ? 'Ön sol tente' : side === 'frontRight' ? 'Ön sağ tente' : side === 'left' ? 'Sol tente' : 'Sağ tente' }, `awning-${side}`))) })) : null, (roofAwningEnabled || Object.values(sideAwnings).some(Boolean)) ? (_jsxs("div", { className: "mt-4", children: [_jsx("p", { className: "mb-3 text-[12px] text-muted", children: "Tente rengi" }), _jsx("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-5", children: colorOptions.map((option) => (_jsx(Swatch, { option: option, active: option.key === awningColor, onClick: () => setAwningColor(option.key) }, `awning-color-${option.key}`))) })] })) : null] })) : null] }));
    const animationSections = [
        ...(isPergolaRoof
            ? [
                {
                    title: 'Çatı',
                    items: [
                        {
                            key: 'roof-panels',
                            label: 'Çatı',
                            detail: roofMaterialLabel(roofMaterial),
                            active: roofAnimationOpen,
                            icon: _jsx(RoofTabIcon, {}),
                            onToggle: () => setRoofAnimationOpen((prev) => !prev),
                        },
                    ],
                },
            ]
            : []),
        ...(availableDoorSides.length
            ? [
                {
                    title: 'Cepheler',
                    items: availableDoorSides.map((side) => ({
                        key: `door-${side}`,
                        label: animationSideLabel(side),
                        detail: enclosureSummary(enclosures[side]),
                        active: doorAnimationOpen[side],
                        icon: doorAnimationOpen[side] ? _jsx(DoorOpenIcon, {}) : _jsx(DoorClosedIcon, {}),
                        onToggle: () => setDoorAnimationOpen((prev) => ({ ...prev, [side]: !prev[side] })),
                    })),
                },
            ]
            : []),
        ...(hasRoofCurtain || availableCurtainSides.length
            ? [
                {
                    title: 'Perdeler',
                    items: [
                        ...(hasRoofCurtain
                            ? [
                                {
                                    key: 'curtain-roof',
                                    label: 'Çatı',
                                    detail: 'Çatı perdesi',
                                    active: awningAnimationOpen.roof,
                                    icon: awningAnimationOpen.roof ? _jsx(AwningOpenIcon, {}) : _jsx(AwningClosedIcon, {}),
                                    onToggle: () => setAwningAnimationOpen((prev) => ({ ...prev, roof: !prev.roof })),
                                },
                            ]
                            : []),
                        ...availableCurtainSides.map((side) => ({
                            key: `curtain-${side}`,
                            label: animationSideLabel(side),
                            detail: 'Cephe perdesi',
                            active: awningAnimationOpen[side],
                            icon: awningAnimationOpen[side] ? _jsx(AwningOpenIcon, {}) : _jsx(AwningClosedIcon, {}),
                            onToggle: () => setAwningAnimationOpen((prev) => ({ ...prev, [side]: !prev[side] })),
                        })),
                    ],
                },
            ]
            : []),
    ];
    const exportInProgress = exportStatus !== null;
    const downloadMenuItems = [
        {
            key: 'photo',
            label: 'Fotoğraf olarak',
            detail: 'Farklı 3D açılardan 5 ayrı görsel kaydedin.',
            icon: _jsx(ImageIcon, { className: "h-4 w-4" }),
            onSelect: () => {
                void handlePhotoExport();
            },
            disabled: exportInProgress,
        },
        {
            key: 'video',
            label: 'Video olarak',
            detail: 'Hareketli parçaların açıldığı kısa bir tur kaydedin.',
            icon: _jsx(Clapperboard, { className: "h-4 w-4" }),
            onSelect: () => {
                void handleVideoExport();
            },
            disabled: exportInProgress,
        },
    ];
    const mobileAnimationContent = (_jsxs(Card, { className: "border-[#c7d9d6] bg-white/95 shadow-[0_20px_44px_rgba(37,44,49,0.08)]", children: [_jsx(SectionTitle, { helper: "\u00C7at\u0131y\u0131, cepheleri ve perdeleri tek tek a\u00E7\u0131p kapat\u0131n.", children: "Animasyon" }), _jsx(AnimateMenuPanel, { sections: animationSections })] }));
    const mobileDownloadContent = (_jsxs(Card, { className: "border-[#c7d9d6] bg-white/95 shadow-[0_20px_44px_rgba(37,44,49,0.08)]", children: [_jsx(SectionTitle, { helper: "5 ayr\u0131 foto\u011Fraf veya k\u0131sa hareketli tur kaydedin.", children: "\u0130ndir" }), _jsx(DownloadMenuPanel, { items: downloadMenuItems })] }));
    const mobileSections = {
        dimensions: {
            title: 'Ölçüler',
            helper: 'Sürgüleri kullanın veya değerleri elle girin.',
            content: dimensionsContent,
        },
        roof: {
            title: 'Çatı',
            helper: 'Tasarımınız için çatı tipini seçin.',
            content: roofContent,
        },
        enclosures: {
            title: 'Cepheler',
            helper: 'Bir cephe seçin ve kapatma tipini belirleyin.',
            content: enclosureContent,
        },
        colors: {
            title: 'Renk',
            helper: 'Profil rengini seçin.',
            content: colorsContent,
        },
        ...(hasAnyAddonOption
            ? {
                addons: {
                    title: 'Ekstralar',
                    helper: 'Işık ve tente seçenekleri.',
                    content: addonsContent,
                },
            }
            : {}),
    };
    const mobileTabButtons = [
        { key: 'dimensions', label: 'Ölçüler', icon: _jsx(MeasurementsTabIcon, {}) },
        { key: 'roof', label: 'Çatı', icon: _jsx(RoofTabIcon, {}) },
        { key: 'enclosures', label: 'Cepheler', icon: _jsx(SidesTabIcon, {}) },
        { key: 'colors', label: 'Renk', icon: _jsx(ColourTabIcon, {}) },
        ...(hasAnyAddonOption ? ([{ key: 'addons', label: 'Ekstralar', icon: _jsx(AddOnsTabIcon, {}) }]) : []),
    ];
    const activeMobileSection = mobileSections[mobileTab] ?? mobileSections.dimensions;
    return (_jsxs("div", { className: "min-h-dvh bg-[#ffffff] text-ink lg:h-dvh lg:overflow-hidden", children: [_jsxs("div", { className: "relative flex min-h-dvh flex-col lg:h-full lg:flex-row", children: [_jsxs("div", { className: `relative border-b border-[#c7d9d6] bg-canvas lg:min-h-0 lg:flex-1 lg:basis-[72%] lg:border-b-0 lg:border-r ${isMobileLayout ? 'h-[43svh] min-h-[330px] max-h-[560px]' : 'min-h-0 flex-1'}`, children: [_jsxs("div", { className: "absolute left-3 top-3 z-20 flex items-center gap-2 sm:left-4 sm:top-4 sm:gap-2.5", children: [_jsx(SceneControlButton, { active: measurementsVisible, ariaLabel: measurementsVisible ? 'Ölçüleri gizle' : 'Ölçüleri goster', onClick: () => setMeasurementsVisible((prev) => !prev), label: isMobileLayout ? undefined : 'Ölçüler', children: _jsx(Ruler, { size: 17, strokeWidth: 1.9 }) }), _jsx(AnimateControlButton, { active: hasAnyAnimationOpen, isMobile: isMobileLayout, mobileMenuOpen: mobileAnimationMenuOpen, menuSections: animationSections, onToggleAll: toggleAllAnimations, onToggleMobileMenu: openMobileAnimationMenu }), _jsx(DownloadControlButton, { active: mobileDownloadMenuOpen || exportInProgress, busy: exportInProgress, isMobile: isMobileLayout, mobileMenuOpen: mobileDownloadMenuOpen, items: downloadMenuItems, onToggleMobileMenu: openMobileDownloadMenu }), _jsx(SceneControlButton, { active: nightMode, ariaLabel: nightMode ? 'Gündüz moduna geç' : 'Gece moduna geç', onClick: () => setNightMode((prev) => !prev), children: nightMode ? _jsx(Moon, { size: 17, strokeWidth: 1.9 }) : _jsx(Sun, { size: 17, strokeWidth: 1.9 }) })] }), isMobileLayout ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "pointer-events-none absolute left-3 top-[3.45rem] z-20 rounded-[10px] border border-white/30 bg-[rgba(255,255,255,0.16)] px-2 py-1 backdrop-blur-[10px] shadow-[0_0_18px_rgba(255,255,255,0.22),0_0_28px_rgba(0,57,52,0.35)]", children: _jsx("img", { src: brandLogo, alt: "Visora logo", className: "h-[11px] w-auto opacity-95 [filter:drop-shadow(0_0_8px_rgba(255,255,255,0.38))_drop-shadow(0_0_16px_rgba(0,57,52,0.45))]" }) }), _jsx(SocialPanel, { mobile: true }), _jsx("div", { className: "absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2", children: _jsxs("button", { type: "button", onClick: handleViewInAr, className: "inline-flex items-center gap-2 rounded-[13px] border border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.10)_100%)] px-3 py-2 text-[11px] font-medium text-white shadow-[0_14px_30px_rgba(0,28,26,0.18)] backdrop-blur-[20px] transition-all duration-200 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.13)_100%)]", children: [_jsx("span", { className: "inline-flex h-6 items-center justify-center rounded-[7px] border border-white/20 bg-white/10 px-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]", children: _jsx("img", { src: visoraLogo, alt: "", className: "h-[9px] w-auto object-contain", "aria-hidden": "true" }) }), _jsx("span", { children: "Telefonda G\u00F6r\u00FCnt\u00FCle" })] }) })] })) : null, !isMobileLayout ? _jsx(SocialPanel, {}) : null, _jsxs("div", { className: "absolute inset-0", children: [_jsx(VerandaScene, { ref: sceneRef, target: dimensions, roofMaterial: roofMaterial, wedgeMaterial: wedgeMaterial, frameColor: activeColor.frame, pergolaColor: pergolaColor.frame, enclosures: enclosures, lightsEnabled: lightsEnabled, lightTemperature: lightTemperature, nightMode: nightMode, doorsOpen: doorsOpen, awningsOpen: awningsOpen, roofOpen: roofAnimationOpen, doorOpenStates: doorAnimationOpen, awningOpenStates: awningAnimationOpen, roofAwningEnabled: roofAwningEnabled, sideAwnings: sideAwnings, awningColor: awningActiveColor.frame, measurementsVisible: measurementsVisible }), exportStatus ? (_jsx("div", { className: "absolute inset-0 z-30 flex items-center justify-center bg-[rgba(7,13,12,0.26)] px-4 backdrop-blur-[10px]", children: _jsxs("div", { className: "w-full max-w-[320px] rounded-[22px] border border-white/16 bg-[rgba(10,19,17,0.86)] px-5 py-5 text-center text-white shadow-[0_20px_44px_rgba(0,0,0,0.28)]", children: [_jsx("div", { className: "mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/16 border-t-white/90" }), _jsx("div", { className: "mt-4 text-[14px] font-semibold", children: exportStatus.title }), _jsx("div", { className: "mt-1 text-[12px] leading-5 text-white/72", children: exportStatus.detail })] }) })) : null] })] }), _jsx("aside", { className: "relative bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_100%)] lg:basis-[28%] lg:shadow-none", children: isMobileLayout ? (_jsxs("div", { className: "relative", children: [mobileAnimationMenuOpen ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "border-b border-[#c7d9d6] bg-[linear-gradient(180deg,#ffffff_0%,#c7d9d6_100%)] px-3 py-3", children: _jsxs("div", { className: "rounded-[18px] border border-[#c7d9d6] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(37,44,49,0.08)]", children: [_jsx("div", { className: "text-[13px] font-semibold text-ink", children: "Animasyon" }), _jsx("div", { className: "mt-1 text-[11px] text-muted", children: "\u00C7at\u0131y\u0131, cepheleri ve perdeleri tek tek a\u00E7\u0131p kapat\u0131n." })] }) }), _jsx("div", { className: "px-3 pb-28 pt-3", children: mobileAnimationContent })] })) : mobileDownloadMenuOpen ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "border-b border-[#c7d9d6] bg-[linear-gradient(180deg,#ffffff_0%,#c7d9d6_100%)] px-3 py-3", children: _jsxs("div", { className: "rounded-[18px] border border-[#c7d9d6] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(37,44,49,0.08)]", children: [_jsx("div", { className: "text-[13px] font-semibold text-ink", children: "\u0130ndir" }), _jsx("div", { className: "mt-1 text-[11px] text-muted", children: "5 ayr\u0131 foto\u011Fraf veya k\u0131sa hareketli video se\u00E7in." })] }) }), _jsx("div", { className: "px-3 pb-28 pt-3", children: mobileDownloadContent })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "border-b border-[#c7d9d6] bg-[linear-gradient(180deg,#ffffff_0%,#c7d9d6_100%)] px-3 py-3", children: _jsx("div", { className: "scrollbar-thin flex gap-2 overflow-x-auto pb-1", children: mobileTabButtons.map((tab) => (_jsx(MobileTabButton, { label: tab.label, icon: tab.icon, active: mobileTab === tab.key, onClick: () => setMobileTab(tab.key) }, tab.key))) }) }), _jsx("div", { className: "px-3 pb-28 pt-3", children: _jsxs(Card, { className: "border-[#c7d9d6] bg-white/95 shadow-[0_20px_44px_rgba(37,44,49,0.08)]", children: [_jsx(SectionTitle, { helper: activeMobileSection.helper, children: activeMobileSection.title }), activeMobileSection.content] }) })] })), _jsx("div", { className: "sticky bottom-0 z-20 border-t border-[#c7d9d6] bg-[linear-gradient(180deg,rgba(255,255,255,0.90)_0%,rgba(226,239,236,0.96)_46%,rgba(226,239,236,0.99)_100%)] px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur-[18px]", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsxs("a", { href: homepageUrl, className: "inline-flex items-center gap-2 rounded-[14px] border border-[#7c9894] bg-white/88 px-3.5 py-3 text-[12px] font-semibold text-[#003934] shadow-[0_12px_28px_rgba(37,44,49,0.10)] transition-all duration-200 hover:border-[#7c9894] hover:bg-white", children: [_jsx(House, { className: "h-4 w-4" }), _jsx("span", { children: "Ana Sayfa" })] }), _jsxs("button", { type: "button", onClick: () => window.location.reload(), className: "inline-flex items-center gap-2 rounded-[14px] border border-[#7c9894] bg-white/88 px-3.5 py-3 text-[12px] font-semibold text-[#003934] shadow-[0_12px_28px_rgba(37,44,49,0.10)] transition-all duration-200 hover:border-[#7c9894] hover:bg-white", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), _jsx("span", { children: "Geri" })] }), _jsx(InquiryButton, { label: "Talep G\u00F6nder", onClick: handleInquiry, className: "rounded-[14px] border border-[#0a5b53] bg-[linear-gradient(180deg,#004840_0%,#003934_100%)] px-3.5 py-3 text-[12px] font-semibold shadow-[0_16px_34px_rgba(37,44,49,0.24)] hover:bg-[linear-gradient(180deg,#00544b_0%,#003934_100%)]" })] }) })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "scrollbar-thin h-full overflow-y-auto px-4 pb-32 pt-4 sm:px-5 sm:pb-32 sm:pt-5", children: [_jsxs("div", { className: "mb-5 rounded-[22px] border border-[#0a5b53] bg-[linear-gradient(135deg,#003934_0%,#004840_55%,#0a5b53_100%)] px-5 py-5 text-white shadow-[0_24px_50px_rgba(37,44,49,0.28)]", children: [_jsx("div", { className: "text-[12px] uppercase tracking-[0.18em] text-white/72", children: "Tasar\u0131m Paneli" }), _jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-3", children: [_jsxs("div", { className: "relative inline-flex rounded-[18px] border border-white/14 bg-white/6 px-4 py-3", children: [_jsx("span", { className: "pointer-events-none absolute inset-0 rounded-[18px] shadow-[0_0_24px_rgba(255,255,255,0.22),0_0_38px_rgba(0,57,52,0.42)]" }), _jsx("img", { src: brandLogo, alt: "Visora logo", className: "relative h-7 w-auto [filter:drop-shadow(0_0_12px_rgba(255,255,255,0.42))_drop-shadow(0_0_22px_rgba(0,57,52,0.55))]" })] }), _jsxs("a", { href: homepageUrl, className: "inline-flex items-center gap-2 rounded-[16px] border border-white/18 bg-white/10 px-4 py-3 text-[13px] font-semibold text-white shadow-[0_14px_28px_rgba(0,0,0,0.16),0_0_18px_rgba(255,255,255,0.08)] transition-all duration-200 hover:border-white/28 hover:bg-white/16", children: [_jsx(House, { className: "h-4 w-4" }), _jsx("span", { children: "Ana Sayfa" })] }), _jsxs("button", { type: "button", onClick: () => window.location.reload(), className: "inline-flex items-center gap-2 rounded-[16px] border border-white/18 bg-white/10 px-4 py-3 text-[13px] font-semibold text-white shadow-[0_14px_28px_rgba(0,0,0,0.16),0_0_18px_rgba(255,255,255,0.08)] transition-all duration-200 hover:border-white/28 hover:bg-white/16", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), _jsx("span", { children: "Geri" })] })] }), _jsx("p", { className: "mt-3 text-[12px] text-white/78", children: "Sahne \u00F6l\u00E7\u00FClerini g\u00F6stermek veya gizlemek i\u00E7in yukar\u0131daki \u00D6l\u00E7\u00FCler kontrol\u00FCn\u00FC kullan\u0131n. Di\u011Fer b\u00F6l\u00FCmler tek tek a\u00E7\u0131l\u0131r." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { children: [_jsx(SectionTitle, { helper: "S\u00FCrg\u00FCleri kullan\u0131n veya de\u011Ferleri elle girin.", children: "\u00D6l\u00E7\u00FCler" }), dimensionsContent] }), _jsx(AccordionSection, { title: "\u00C7at\u0131 Tipi", open: openSection === 'roof', onOpen: () => setOpenSection('roof'), children: roofContent }), _jsx(AccordionSection, { title: "Renkler", open: openSection === 'colors', onOpen: () => setOpenSection('colors'), children: colorsContent }), _jsx(AccordionSection, { title: "Cephe Se\u00E7enekleri", open: openSection === 'enclosures', onOpen: () => setOpenSection('enclosures'), children: enclosureContent }), hasAnyAddonOption ? (_jsx(AccordionSection, { title: "Ekstralar", open: openSection === 'addons', onOpen: () => setOpenSection('addons'), children: addonsContent })) : null] })] }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 border-t border-[#c7d9d6] bg-[rgba(255,255,255,0.94)] px-4 py-4 backdrop-blur-[8px] sm:px-5", children: _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(InquiryButton, { label: "Telefonda G\u00F6r\u00FCnt\u00FCle", icon: _jsx(ScanLine, { className: "h-4 w-4" }), onClick: handleViewInAr, className: "bg-[linear-gradient(180deg,#004840_0%,#003934_100%)] shadow-[0_14px_28px_rgba(37,44,49,0.18)] hover:bg-[linear-gradient(180deg,#004840_0%,#13181c_100%)]" }), _jsx(InquiryButton, { label: "Talep G\u00F6nder", onClick: handleInquiry })] }) })] })) })] }), isMobileLayout && directArViewerReady && directArGlbUrl ? (_jsx(ModelViewerTag, { ref: directArViewerRef, src: directArGlbUrl, ar: true, "ar-modes": "webxr scene-viewer quick-look", "ar-placement": "floor", "camera-controls": true, style: { position: 'fixed', width: 1, height: 1, opacity: 0, pointerEvents: 'none', left: -10, bottom: -10 } })) : null, _jsx(InquiryModal, { open: inquiryModalOpen, onClose: () => setInquiryModalOpen(false), form: inquiryForm, onChange: handleInquiryFormChange, onSubmit: handleInquirySubmit }), _jsx(ArQrModal, { open: arModalOpen, onClose: () => setArModalOpen(false), shareUrl: arShareUrl })] }));
}
function App() {
    const initialMode = readModeParam();
    const [modeParam, setModeParam] = useState(initialMode);
    const [showConfigurator, setShowConfigurator] = useState(false);
    const [configuratorSnapshot, setConfiguratorSnapshot] = useState(() => readStoredConfiguratorSnapshot());
    useEffect(() => {
        if (typeof document === 'undefined')
            return;
        document.title = siteConfig.branding.siteTitle;
        let faviconLink = document.querySelector("link[rel='icon']");
        if (!faviconLink) {
            faviconLink = document.createElement('link');
            faviconLink.rel = 'icon';
            document.head.appendChild(faviconLink);
        }
        faviconLink.href = siteConfig.branding.favicon;
    }, []);
    useEffect(() => {
        writeStoredConfiguratorSnapshot(configuratorSnapshot);
    }, [configuratorSnapshot]);
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const handlePopState = () => {
            const mode = readModeParam();
            setModeParam(mode);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
    if (modeParam === 'ar')
        return _jsx(ArExperiencePage, {});
    if (!showConfigurator)
        return _jsx(LandingMenu, { onOpenConfigurator: () => setShowConfigurator(true) });
    return (_jsx(ConfiguratorApp, { initialSnapshot: configuratorSnapshot, onSnapshotChange: setConfiguratorSnapshot }));
}
export default App;
