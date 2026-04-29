import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Html, Line, OrbitControls, Preload, useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
const houseModelUrl = new URL('../assets/modern_house.glb', import.meta.url).href;
const lerpValue = (current, target, factor) => current + (target - current) * factor;
const isDoorEnclosure = (type) => type === 'sliding' || type === 'bifold' || type === 'guillotine';
const isPergolaRoofMaterial = (type) => type === 'fabric' || type === 'bioclimatic' || type === 'lux-bioclimatic';
const isFlatPergolaRoofMaterial = (type) => type === 'bioclimatic' || type === 'lux-bioclimatic';
const sideFixedGlassCount = (length) => (length > 3 ? 4 : length > 2 ? 3 : 2);
const frontFixedGlassCount = (length) => (length > 4 ? 5 : length > 3 ? 4 : length > 2 ? 3 : 2);
const HOUSE_POSITION = [-3.23, 0, -1.42];
const HOUSE_SCALE = 0.72;
const VERANDA_LEFT_ANCHOR_X = -4.72;
const HIDE_ZONE = {
    minX: VERANDA_LEFT_ANCHOR_X - 0.08,
    maxX: VERANDA_LEFT_ANCHOR_X + 7.08,
    minZ: -0.05,
    maxZ: 4.08,
};
const DIMENSION_COLORS = {
    primary: '#eef8ff',
    accent: '#d7ecff',
    soft: '#a7c6db',
};
const AXIS_VECTORS = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, 1],
};
const addVec = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const subVec = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scaleVec = (vector, scale) => [vector[0] * scale, vector[1] * scale, vector[2] * scale];
const midpointVec = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
const normalizeVec = (vector) => {
    const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
    return [vector[0] / length, vector[1] / length, vector[2] / length];
};
const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
const waitForFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const clampProgress = (value) => Math.min(1, Math.max(0, value));
const easeInOutCubic = (value) => (value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2);
const formatDimensionMetres = (value) => `${Math.round(value * 100)} cm`;
const formatDimensionLabel = (name, value) => `${name}\n${formatDimensionMetres(value)}`;
function getOrbitTarget(dims, isMobileView) {
    return [VERANDA_LEFT_ANCHOR_X + dims.width / 2, isMobileView ? 1.15 : 1.25, 1.15];
}
function getCaptureViewState(view, dims, isMobileView) {
    const target = getOrbitTarget(dims, isMobileView);
    const width = Math.max(4.2, dims.width);
    const projection = Math.max(2.4, dims.projection);
    const height = Math.max(2, dims.height);
    switch (view) {
        case 'front':
            return {
                position: [target[0], target[1] + height * 0.62 + 0.86, target[2] + projection * 2.8 + 2.05],
                target,
            };
        case 'frontLeft':
            return {
                position: [target[0] - width * 1.28 - 1.2, target[1] + height * 0.6 + 0.82, target[2] + projection * 1.5 + 0.95],
                target,
            };
        case 'left':
            return {
                position: [target[0] - width * 1.8 - 1.35, target[1] + height * 0.52 + 0.7, target[2] + projection * 0.4 + 0.18],
                target,
            };
        case 'right':
            return {
                position: [target[0] + width * 1.8 + 1.35, target[1] + height * 0.52 + 0.7, target[2] + projection * 0.4 + 0.18],
                target,
            };
        case 'top':
            return {
                position: [target[0] + width * 0.08, target[1] + height * 1.82 + 2.35, target[2] + projection * 1.08 + 0.45],
                target,
            };
        case 'hero':
        default:
            return {
                position: [target[0] + width * 1.38 + 1.25, target[1] + height * 0.64 + 0.86, target[2] + projection * 1.62 + 1.12],
                target,
            };
    }
}
function getRuntimeCameraState(runtime, fallbackTarget) {
    const camera = runtime.camera;
    if (!camera)
        return null;
    const target = runtime.controls
        ? [runtime.controls.target.x, runtime.controls.target.y, runtime.controls.target.z]
        : fallbackTarget;
    return {
        position: [camera.position.x, camera.position.y, camera.position.z],
        target,
    };
}
function renderRuntimeScene(runtime) {
    if (!runtime.gl || !runtime.scene || !runtime.camera)
        return;
    runtime.gl.render(runtime.scene, runtime.camera);
}
function applyRuntimeCameraState(runtime, state) {
    if (!runtime.camera)
        return;
    runtime.camera.position.set(...state.position);
    if (runtime.controls) {
        runtime.controls.target.set(...state.target);
        runtime.controls.update();
    }
    else {
        runtime.camera.lookAt(...state.target);
    }
    runtime.camera.updateProjectionMatrix();
    renderRuntimeScene(runtime);
}
function useAnimatedDimensions(target) {
    const [animated, setAnimated] = useState(target);
    useEffect(() => {
        let frame = 0;
        const animate = () => {
            setAnimated((prev) => {
                const next = {
                    width: lerpValue(prev.width, target.width, 0.14),
                    projection: lerpValue(prev.projection, target.projection, 0.14),
                    height: lerpValue(prev.height, target.height, 0.1),
                };
                const done = Math.abs(next.width - target.width) < 0.0015 &&
                    Math.abs(next.projection - target.projection) < 0.0015 &&
                    Math.abs(next.height - target.height) < 0.0015;
                if (done)
                    return target;
                frame = requestAnimationFrame(animate);
                return next;
            });
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [target.height, target.projection, target.width]);
    return animated;
}
function enhanceMaterialTextures(material, maxAnisotropy) {
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((entry) => {
        const candidate = entry;
        [
            candidate.map,
            candidate.normalMap,
            candidate.roughnessMap,
            candidate.metalnessMap,
            candidate.aoMap,
            candidate.alphaMap,
            candidate.emissiveMap,
        ].forEach((texture) => {
            if (!texture)
                return;
            texture.anisotropy = Math.max(texture.anisotropy || 1, maxAnisotropy);
            texture.generateMipmaps = true;
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.needsUpdate = true;
        });
    });
}
function RendererQuality({ isArPreview }) {
    const { gl, scene } = useThree();
    useEffect(() => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = isArPreview ? 1 : 1.02;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        const maxAnisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());
        scene.traverse((child) => {
            const mesh = child;
            if ('isMesh' in mesh && mesh.isMesh && mesh.material) {
                enhanceMaterialTextures(mesh.material, maxAnisotropy);
            }
        });
    }, [gl, isArPreview, scene]);
    return null;
}
function SceneCaptureBridge({ runtimeRef }) {
    const { camera, gl, scene } = useThree();
    useEffect(() => {
        runtimeRef.current.camera = camera;
        runtimeRef.current.gl = gl;
        runtimeRef.current.scene = scene;
        return () => {
            if (runtimeRef.current.camera === camera)
                runtimeRef.current.camera = null;
            if (runtimeRef.current.gl === gl)
                runtimeRef.current.gl = null;
            if (runtimeRef.current.scene === scene)
                runtimeRef.current.scene = null;
        };
    }, [camera, gl, runtimeRef, scene]);
    return null;
}
const glassMaterial = new THREE.MeshStandardMaterial({
    color: '#dbe7ea',
    transparent: true,
    opacity: 0.38,
    roughness: 0.2,
    metalness: 0.02,
});
const polyMaterial = new THREE.MeshStandardMaterial({
    color: '#8f9aa1',
    transparent: true,
    opacity: 0.82,
    roughness: 0.8,
    metalness: 0.08,
});
const warmDeckMaterial = new THREE.MeshStandardMaterial({
    color: '#c8b399',
    roughness: 0.95,
    metalness: 0.02,
});
function makePanelMaterials(frameColor) {
    const base = new THREE.Color(frameColor);
    const groove = base.clone().lerp(new THREE.Color('#101417'), 0.18);
    const edge = base.clone().lerp(new THREE.Color('#ffffff'), 0.06);
    return {
        base: new THREE.MeshStandardMaterial({
            color: base,
            roughness: 0.78,
            metalness: 0.18,
        }),
        groove: new THREE.MeshStandardMaterial({
            color: groove,
            roughness: 0.82,
            metalness: 0.16,
        }),
        edge: new THREE.MeshStandardMaterial({
            color: edge,
            roughness: 0.72,
            metalness: 0.2,
        }),
    };
}
function DimensionLabel({ position, text, rotationDeg = 0, flatOnGround = false, fontSizePx = 15, }) {
    return (_jsx("group", { position: position, rotation: flatOnGround ? [-Math.PI / 2, 0, 0] : [0, 0, 0], children: _jsx(Html, { center: true, transform: true, distanceFactor: 2, children: _jsx("div", { className: "pointer-events-none select-none whitespace-nowrap text-center text-[2px] font-medium leading-none tracking-[0em] text-[#c1121f]", style: {
                    color: '#c1121f',
                    fontSize: `${fontSizePx}px`,
                    lineHeight: 1.05,
                    whiteSpace: 'pre-line',
                    transform: rotationDeg === 0 ? undefined : `rotate(${rotationDeg}deg)`,
                }, children: text }) }) }));
}
function DimensionLine({ start, end, guideStart, guideEnd, markerAxis, label, labelOffset = [0, 0, 0], labelRotationDeg, labelFlatOnGround = false, labelFontSizePx, }) {
    const markerVector = AXIS_VECTORS[markerAxis];
    const capLength = 0.13;
    const labelPosition = addVec(midpointVec(start, end), labelOffset);
    const startCapA = addVec(start, scaleVec(markerVector, capLength));
    const startCapB = addVec(start, scaleVec(markerVector, -capLength));
    const endCapA = addVec(end, scaleVec(markerVector, capLength));
    const endCapB = addVec(end, scaleVec(markerVector, -capLength));
    const renderStroke = (points, color, lineWidth, opacity) => (_jsxs(_Fragment, { children: [_jsx(Line, { points: points, color: "#7b94a8", lineWidth: lineWidth + 1.1, transparent: true, opacity: opacity * 0.24 }), _jsx(Line, { points: points, color: color, lineWidth: lineWidth, transparent: true, opacity: opacity })] }));
    return (_jsxs("group", { children: [guideStart ? renderStroke([guideStart, start], DIMENSION_COLORS.soft, 1.35, 0.72) : null, guideEnd ? renderStroke([guideEnd, end], DIMENSION_COLORS.soft, 1.35, 0.72) : null, renderStroke([start, end], DIMENSION_COLORS.primary, 1.95, 0.99), renderStroke([startCapA, startCapB], DIMENSION_COLORS.accent, 1.6, 0.95), renderStroke([endCapA, endCapB], DIMENSION_COLORS.accent, 1.6, 0.95), _jsx(DimensionLabel, { position: labelPosition, text: label, rotationDeg: labelRotationDeg ?? (markerAxis === 'x' ? -90 : 0), flatOnGround: labelFlatOnGround, fontSizePx: labelFontSizePx })] }));
}
function TreeSilhouette({ dark }) {
    const trunkMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: dark ? '#6f665b' : '#7c7368', roughness: 1 }), [dark]);
    const leafMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: dark ? '#607952' : '#769568',
        roughness: 0.96,
    }), [dark]);
    return (_jsxs("group", { position: [-5.4, 0, -1.65], children: [_jsx("mesh", { material: trunkMaterial, position: [0, 1.5, 0], castShadow: true, children: _jsx("cylinderGeometry", { args: [0.12, 0.18, 3.0, 14] }) }), [
                { pos: [-0.18, 2.2, 0.02], rot: [0.45, 0.1, -0.8], len: 1.4 },
                { pos: [0.22, 2.15, -0.03], rot: [0.35, -0.1, 0.9], len: 1.25 },
                { pos: [-0.08, 2.7, 0.05], rot: [0.2, 0.3, -0.2], len: 1.0 },
            ].map((branch, index) => (_jsx("mesh", { material: trunkMaterial, position: branch.pos, rotation: branch.rot, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.03, 0.06, branch.len, 8] }) }, index))), [
                [-0.65, 3.0, -0.1, 0.7],
                [0.1, 3.35, -0.1, 0.82],
                [0.82, 2.95, 0.15, 0.66],
                [-0.15, 3.9, 0.08, 0.62],
                [0.22, 2.6, 0.35, 0.56],
            ].map((pos, index) => (_jsx("mesh", { material: leafMaterial, position: [pos[0], pos[1], pos[2]], castShadow: true, children: _jsx("sphereGeometry", { args: [pos[3], 18, 18] }) }, index)))] }));
}
function HedgeRow({ dark }) {
    const hedgeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: dark ? '#668255' : '#7a9868', roughness: 1 }), [dark]);
    return (_jsx("group", { position: [0.2, 0.64, -4.9], children: Array.from({ length: 18 }, (_, index) => {
            const x = -6.2 + index * 0.72;
            const y = 0.03 * Math.sin(index * 0.9);
            const z = 0.06 * Math.cos(index * 0.65);
            return (_jsx("mesh", { material: hedgeMaterial, position: [x, y, z], castShadow: true, receiveShadow: true, children: _jsx("boxGeometry", { args: [0.78, 1.2 + (index % 4) * 0.07, 0.78] }) }, index));
        }) }));
}
function PatioGrid({ width, depth, color }) {
    const cols = Math.max(3, Math.round(width / 1.1));
    const rows = Math.max(2, Math.round(depth / 1.1));
    return (_jsxs("group", { children: [Array.from({ length: cols - 1 }, (_, index) => {
                const x = -width / 2 + ((index + 1) * width) / cols;
                return (_jsxs("mesh", { position: [x, 0.004, 0], children: [_jsx("boxGeometry", { args: [0.01, 0.001, depth] }), _jsx("meshStandardMaterial", { color: color, roughness: 1 })] }, `v-${index}`));
            }), Array.from({ length: rows - 1 }, (_, index) => {
                const z = -depth / 2 + ((index + 1) * depth) / rows;
                return (_jsxs("mesh", { position: [0, 0.004, z], children: [_jsx("boxGeometry", { args: [width, 0.001, 0.01] }), _jsx("meshStandardMaterial", { color: color, roughness: 1 })] }, `h-${index}`));
            })] }));
}
function PotPlant({ position, scale = 1, dark, }) {
    const potColor = dark ? '#2e3134' : '#232629';
    const stemColor = dark ? '#657e5a' : '#739267';
    const leafColor = dark ? '#7e996e' : '#90aa7c';
    return (_jsxs("group", { position: position, scale: scale, children: [_jsxs("mesh", { castShadow: true, receiveShadow: true, children: [_jsx("cylinderGeometry", { args: [0.16, 0.12, 0.34, 18] }), _jsx("meshStandardMaterial", { color: potColor, roughness: 0.85 })] }), _jsxs("mesh", { position: [0, 0.19, 0], children: [_jsx("cylinderGeometry", { args: [0.1, 0.1, 0.06, 12] }), _jsx("meshStandardMaterial", { color: "#5c4937", roughness: 1 })] }), _jsxs("mesh", { position: [0, 0.45, 0], castShadow: true, children: [_jsx("cylinderGeometry", { args: [0.022, 0.03, 0.42, 10] }), _jsx("meshStandardMaterial", { color: stemColor, roughness: 1 })] }), [
                [0.08, 0.56, 0.0, -0.6],
                [-0.08, 0.62, 0.03, 0.7],
                [0.05, 0.76, -0.04, -0.2],
                [-0.02, 0.85, 0.04, 0.2],
            ].map((leaf, idx) => (_jsxs("mesh", { position: [leaf[0], leaf[1], leaf[2]], rotation: [0, 0, leaf[3]], castShadow: true, children: [_jsx("coneGeometry", { args: [0.09, 0.28, 8] }), _jsx("meshStandardMaterial", { color: leafColor, roughness: 0.95 })] }, idx)))] }));
}
function NeighborHouse({ dark }) {
    return (_jsxs("group", { position: [4.9, 0, -5.3], scale: 0.92, children: [_jsxs("mesh", { position: [0, 1.15, 0], castShadow: true, receiveShadow: true, children: [_jsx("boxGeometry", { args: [2.8, 2.3, 1.9] }), _jsx("meshStandardMaterial", { color: dark ? '#8b7165' : '#9a8073', roughness: 1 })] }), _jsxs("mesh", { position: [0, 2.45, 0], castShadow: true, children: [_jsx("boxGeometry", { args: [2.96, 0.18, 2.02] }), _jsx("meshStandardMaterial", { color: "#3a3431", roughness: 1 })] }), _jsxs("mesh", { position: [0.55, 1.28, 0.97], children: [_jsx("boxGeometry", { args: [0.88, 0.72, 0.08] }), _jsx("meshStandardMaterial", { color: "#53595e", roughness: 0.4 })] }), _jsxs("mesh", { position: [-0.95, 1.95, 0.4], children: [_jsx("boxGeometry", { args: [1.08, 0.54, 0.08] }), _jsx("meshStandardMaterial", { color: "#53595e", roughness: 0.4 })] })] }));
}
function BrickField({ width, height, color }) {
    const cols = Math.max(10, Math.floor(width / 0.55));
    const rows = Math.max(6, Math.floor(height / 0.16));
    const brickW = width / cols;
    const brickH = height / rows;
    return (_jsx("group", { children: Array.from({ length: rows }, (_, row) => {
            const offset = row % 2 === 0 ? 0 : brickW / 2;
            const count = row % 2 === 0 ? cols : cols + 1;
            return Array.from({ length: count }, (_, col) => {
                const x = -width / 2 + brickW / 2 + col * brickW - offset;
                if (x < -width / 2 - brickW / 2 || x > width / 2 + brickW / 2)
                    return null;
                const y = height / 2 - brickH / 2 - row * brickH;
                return (_jsxs("mesh", { position: [x, y, 0], children: [_jsx("boxGeometry", { args: [brickW - 0.018, brickH - 0.018, 0.008] }), _jsx("meshStandardMaterial", { color: color, roughness: 1 })] }, `${row}-${col}`));
            });
        }) }));
}
function BuildingBackdrop({ dark, frameColor }) {
    const brick = dark ? '#c08d79' : '#c99684';
    const mortar = dark ? '#b98774' : '#c18e7b';
    const sideCladding = dark ? '#b6aea6' : '#c4beb6';
    const upperRender = dark ? '#d7d2ca' : '#e3dfd8';
    const trim = dark ? '#26292c' : '#2f3336';
    const glass = dark ? '#575e66' : '#5f666d';
    const patio = dark ? '#d3d6d4' : '#dfe1de';
    const slabLines = dark ? '#bcc1bf' : '#c8ccca';
    const lawn = dark ? '#8ea04a' : '#9aad53';
    return (_jsxs("group", { children: [_jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [0.5, 0.001, 1.85], receiveShadow: true, children: [_jsx("planeGeometry", { args: [13.5, 8.2] }), _jsx("meshStandardMaterial", { color: patio, roughness: 1 })] }), _jsx("group", { position: [0.55, 0.002, 2.1], children: _jsx(PatioGrid, { width: 12.9, depth: 6.4, color: slabLines }) }), _jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [-4.25, -0.002, 2.25], receiveShadow: true, children: [_jsx("planeGeometry", { args: [3.0, 8.2] }), _jsx("meshStandardMaterial", { color: lawn, roughness: 1 })] }), _jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [6.05, -0.002, 2.05], receiveShadow: true, children: [_jsx("planeGeometry", { args: [2.0, 8.2] }), _jsx("meshStandardMaterial", { color: lawn, roughness: 1 })] }), _jsxs("mesh", { position: [0.6, 1.62, -0.16], receiveShadow: true, children: [_jsx("boxGeometry", { args: [12.7, 3.24, 0.22] }), _jsx("meshStandardMaterial", { color: brick, roughness: 1 })] }), _jsx("group", { position: [0.6, 1.62, -0.045], children: _jsx(BrickField, { width: 12.45, height: 3.02, color: mortar }) }), _jsxs("mesh", { position: [3.85, 1.35, -0.03], receiveShadow: true, children: [_jsx("boxGeometry", { args: [2.6, 2.72, 0.05] }), _jsx("meshStandardMaterial", { color: sideCladding, roughness: 1 })] }), Array.from({ length: 14 }, (_, index) => (_jsxs("mesh", { position: [2.63 + index * 0.19, 1.35, -0.002], children: [_jsx("boxGeometry", { args: [0.04, 2.64, 0.026] }), _jsx("meshStandardMaterial", { color: dark ? '#aba39a' : '#b6aea7', roughness: 1 })] }, index))), _jsxs("mesh", { position: [-0.25, 4.08, -0.5], receiveShadow: true, children: [_jsx("boxGeometry", { args: [7.8, 2.1, 1.0] }), _jsx("meshStandardMaterial", { color: upperRender, roughness: 1 })] }), _jsxs("group", { position: [-1.18, 4.28, 0.07], children: [_jsxs("mesh", { children: [_jsx("boxGeometry", { args: [4.2, 0.86, 0.09] }), _jsx("meshStandardMaterial", { color: trim, roughness: 0.95 })] }), _jsxs("mesh", { position: [0, 0, 0.04], children: [_jsx("boxGeometry", { args: [3.92, 0.62, 0.04] }), _jsx("meshStandardMaterial", { color: glass, roughness: 0.38, metalness: 0.04 })] }), [-1.34, 0, 1.34].map((x, index) => (_jsxs("mesh", { position: [x, 0, 0.068], children: [_jsx("boxGeometry", { args: [0.06, 0.84, 0.02] }), _jsx("meshStandardMaterial", { color: trim, roughness: 1 })] }, index)))] }), _jsxs("group", { position: [0.1, 0, -0.01], children: [_jsxs("mesh", { position: [0.02, 1.13, 0], castShadow: true, children: [_jsx("boxGeometry", { args: [1.86, 2.24, 0.06] }), _jsx("meshStandardMaterial", { color: frameColor, roughness: 0.8, metalness: 0.18 })] }), _jsxs("mesh", { position: [0.02, 1.13, 0.036], children: [_jsx("boxGeometry", { args: [1.62, 1.98, 0.03] }), _jsx("meshStandardMaterial", { color: "#d8dde0", transparent: true, opacity: 0.32, roughness: 0.15, metalness: 0.04 })] }), _jsxs("mesh", { position: [0.02, 1.13, 0.05], children: [_jsx("boxGeometry", { args: [0.05, 2.04, 0.02] }), _jsx("meshStandardMaterial", { color: frameColor, roughness: 1 })] }), _jsxs("mesh", { position: [-0.43, 0.46, 0.056], children: [_jsx("boxGeometry", { args: [0.08, 0.08, 0.04] }), _jsx("meshStandardMaterial", { color: frameColor, roughness: 1 })] })] }), _jsxs("mesh", { position: [-2.9, 1.62, 0.06], castShadow: true, children: [_jsx("boxGeometry", { args: [0.1, 0.3, 0.08] }), _jsx("meshStandardMaterial", { color: "#202325", roughness: 0.85 })] }), _jsxs("mesh", { position: [4.85, 1.5, 0.06], castShadow: true, children: [_jsx("boxGeometry", { args: [0.12, 0.34, 0.08] }), _jsx("meshStandardMaterial", { color: "#202325", roughness: 0.85 })] }), _jsx(PotPlant, { position: [4.55, 0.18, 1.45], dark: dark }), _jsx(PotPlant, { position: [4.95, 0.18, 1.9], scale: 0.88, dark: dark }), _jsx(PotPlant, { position: [4.2, 0.18, 0.95], scale: 0.8, dark: dark }), _jsx(HedgeRow, { dark: dark }), _jsx(TreeSilhouette, { dark: dark }), _jsx(NeighborHouse, { dark: dark })] }));
}
function HouseEnvironment() {
    const gltf = useGLTF(houseModelUrl);
    const { gl } = useThree();
    const house = useMemo(() => {
        const clone = gltf.scene.clone(true);
        clone.updateMatrixWorld(true);
        clone.traverse((child) => {
            const mesh = child;
            if ('isMesh' in mesh && mesh.isMesh) {
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                const meshName = (mesh.name || '').toLowerCase();
                const glassLikeMesh = /window|glass|door middle/.test(meshName);
                const roofMesh = /roof main|roof 2|roof 3|^roof\b/.test(meshName);
                const doorMesh = /garage door|door front|door side/.test(meshName);
                const decorativeMesh = /rock|plant|pine/.test(meshName);
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                if (decorativeMesh) {
                    mesh.geometry.computeBoundingBox();
                    const worldBounds = mesh.geometry.boundingBox?.clone().applyMatrix4(mesh.matrixWorld);
                    if (worldBounds) {
                        const min = worldBounds.min.clone().multiplyScalar(HOUSE_SCALE).add(new THREE.Vector3(...HOUSE_POSITION));
                        const max = worldBounds.max.clone().multiplyScalar(HOUSE_SCALE).add(new THREE.Vector3(...HOUSE_POSITION));
                        const intersectsHideZone = max.x >= HIDE_ZONE.minX &&
                            min.x <= HIDE_ZONE.maxX &&
                            max.z >= HIDE_ZONE.minZ &&
                            min.z <= HIDE_ZONE.maxZ;
                        if (intersectsHideZone) {
                            mesh.visible = false;
                            return;
                        }
                    }
                }
                materials.forEach((material, index) => {
                    if (!material)
                        return;
                    enhanceMaterialTextures(material, Math.min(16, gl.capabilities.getMaxAnisotropy()));
                    const standard = material;
                    if (glassLikeMesh) {
                        const mirrorGlass = new THREE.MeshPhysicalMaterial({
                            color: '#4d5963',
                            transparent: true,
                            opacity: 0.82,
                            roughness: 0.12,
                            metalness: 0.9,
                            transmission: 0.0,
                            ior: 1.52,
                            reflectivity: 1,
                            clearcoat: 1,
                            clearcoatRoughness: 0.05,
                            side: THREE.DoubleSide,
                        });
                        mirrorGlass.depthWrite = false;
                        mirrorGlass.envMapIntensity = 2.0;
                        mesh.material = mirrorGlass;
                        return;
                    }
                    if (roofMesh || doorMesh) {
                        const anthracite = standard.clone();
                        anthracite.color = new THREE.Color('#3f464b');
                        anthracite.roughness = roofMesh ? 0.62 : 0.52;
                        anthracite.metalness = roofMesh ? 0.28 : 0.2;
                        anthracite.needsUpdate = true;
                        if (Array.isArray(mesh.material)) {
                            const nextMaterials = [...mesh.material];
                            nextMaterials[index] = anthracite;
                            mesh.material = nextMaterials;
                        }
                        else {
                            mesh.material = anthracite;
                        }
                        return;
                    }
                    standard.needsUpdate = true;
                });
            }
        });
        return clone;
    }, [gltf.scene]);
    return (_jsx("primitive", { object: house, position: HOUSE_POSITION, scale: HOUSE_SCALE, rotation: [0, 0, 0] }));
}
useGLTF.preload(houseModelUrl);
function RoofLights({ width, projection, backHeight, frontHeight, panelCount, warm, nightMode }) {
    const rafterPositions = Array.from({ length: Math.max(1, panelCount - 1) }, (_, index) => -width / 2 + ((index + 1) * width) / panelCount);
    const z = projection * 0.56;
    const y = THREE.MathUtils.lerp(backHeight, frontHeight, z / projection) - 0.06;
    const faceRotation = [Math.PI / 2 + Math.atan2(backHeight - frontHeight, projection), 0, 0];
    return (_jsx("group", { children: rafterPositions.map((x, index) => (_jsxs("group", { position: [x, y, z], children: [_jsxs("mesh", { rotation: faceRotation, children: [_jsx("cylinderGeometry", { args: [0.04, 0.04, 0.012, 28] }), _jsx("meshStandardMaterial", { color: "#1f2428", roughness: 0.42, metalness: 0.55 })] }), _jsxs("mesh", { position: [0, -0.004, 0], rotation: faceRotation, children: [_jsx("circleGeometry", { args: [0.026, 28] }), _jsx("meshStandardMaterial", { color: warm ? '#f8ebcf' : '#f1f5f6', emissive: warm ? '#f2dcaf' : '#e6eef2', emissiveIntensity: nightMode ? 2.15 : 0.72, transparent: true, opacity: nightMode ? 0.98 : 0.9 })] }), nightMode ? (_jsxs("mesh", { position: [0, -0.03, 0], children: [_jsx("sphereGeometry", { args: [0.07, 18, 18] }), _jsx("meshBasicMaterial", { color: warm ? '#ffd8a0' : '#eef8ff', transparent: true, opacity: 0.1, depthWrite: false })] })) : null, _jsx("pointLight", { position: [0, -0.035, 0], distance: nightMode ? 3.8 : 2.2, intensity: nightMode ? (warm ? 0.96 : 0.76) : warm ? 0.22 : 0.18, color: warm ? '#ffd7a0' : '#eef8ff', decay: 2 })] }, index))) }));
}
function AluminiumPanelSurface({ width, height, depth, frameColor, rotation, }) {
    const materials = useMemo(() => makePanelMaterials(frameColor), [frameColor]);
    const grooveCount = Math.max(5, Math.floor(height / 0.18));
    const grooveSpacing = height / grooveCount;
    const grooveDepth = Math.min(depth * 0.5, 0.008);
    return (_jsxs("group", { rotation: rotation, children: [_jsx("mesh", { material: materials.base, children: _jsx("boxGeometry", { args: [width, height, depth] }) }), _jsx("mesh", { material: materials.edge, position: [0, height / 2 - 0.03, depth / 2 + 0.001], children: _jsx("boxGeometry", { args: [width * 0.995, 0.018, 0.002] }) }), _jsx("mesh", { material: materials.edge, position: [0, -height / 2 + 0.03, depth / 2 + 0.001], children: _jsx("boxGeometry", { args: [width * 0.995, 0.018, 0.002] }) }), Array.from({ length: grooveCount - 1 }, (_, index) => {
                const y = -height / 2 + (index + 1) * grooveSpacing;
                return (_jsx("mesh", { material: materials.groove, position: [0, y, depth / 2 + 0.0008], children: _jsx("boxGeometry", { args: [width * 0.992, 0.008, grooveDepth] }) }, index));
            })] }));
}
function RoofAluminiumPanel({ width, length, thickness, frameColor, position, rotation, }) {
    const materials = useMemo(() => makePanelMaterials(frameColor), [frameColor]);
    const ribCount = Math.max(2, Math.floor(width / 0.22));
    const ribSpacing = width / (ribCount + 1);
    return (_jsxs("group", { position: position, rotation: rotation, children: [_jsx("mesh", { material: materials.base, children: _jsx("boxGeometry", { args: [width, thickness, length] }) }), _jsx("mesh", { material: materials.edge, position: [0, thickness / 2 + 0.0008, 0], children: _jsx("boxGeometry", { args: [width * 0.995, 0.003, length * 0.996] }) }), Array.from({ length: ribCount }, (_, index) => {
                const x = -width / 2 + ribSpacing * (index + 1);
                return (_jsxs("group", { children: [_jsx("mesh", { material: materials.groove, position: [x, thickness / 2 + 0.003, 0], children: _jsx("boxGeometry", { args: [0.016, 0.004, length * 0.985] }) }), _jsx("mesh", { material: materials.edge, position: [x, thickness / 2 + 0.0065, 0], children: _jsx("boxGeometry", { args: [0.009, 0.003, length * 0.982] }) })] }, index));
            }), _jsx("mesh", { material: materials.edge, position: [0, 0, length / 2 - 0.006], children: _jsx("boxGeometry", { args: [width * 0.996, thickness * 0.9, 0.01] }) }), _jsx("mesh", { material: materials.edge, position: [0, 0, -length / 2 + 0.006], children: _jsx("boxGeometry", { args: [width * 0.996, thickness * 0.9, 0.01] }) })] }));
}
function SlidingDoorLeaf({ panelWidth, panelHeight, depth, frameMaterial, glassTintMaterial, position, rotation, }) {
    const stile = Math.min(0.03, Math.max(0.02, panelWidth * 0.08));
    const rail = 0.028;
    const glassWidth = Math.max(0.12, panelWidth - stile * 2 - 0.012);
    const glassHeight = Math.max(0.18, panelHeight - rail * 2 - 0.012);
    const glassDepth = Math.max(0.01, depth * 0.55);
    return (_jsxs("group", { position: position, rotation: rotation, children: [_jsx("mesh", { material: glassTintMaterial, children: _jsx("boxGeometry", { args: [glassWidth, glassHeight, glassDepth] }) }), _jsx("mesh", { material: frameMaterial, position: [-panelWidth / 2 + stile / 2, 0, 0], children: _jsx("boxGeometry", { args: [stile, panelHeight, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [panelWidth / 2 - stile / 2, 0, 0], children: _jsx("boxGeometry", { args: [stile, panelHeight, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, panelHeight / 2 - rail / 2, 0], children: _jsx("boxGeometry", { args: [panelWidth, rail, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, -panelHeight / 2 + rail / 2, 0], children: _jsx("boxGeometry", { args: [panelWidth, rail, depth] }) })] }));
}
function FixedGlassSection({ sectionWidth, panelHeight, depth, frameMaterial, glassTintMaterial, position, }) {
    const stile = Math.min(0.032, Math.max(0.024, sectionWidth * 0.08));
    const outerRail = 0.03;
    const innerRail = 0.024;
    const glassWidth = Math.max(0.12, sectionWidth - stile * 2 - 0.012);
    const cellHeight = Math.max(0.18, (panelHeight - outerRail * 2 - innerRail * 2 - 0.016) / 3);
    const glassDepth = Math.max(0.01, depth * 0.52);
    const innerOffset = cellHeight + innerRail;
    return (_jsxs("group", { position: position, children: [[-innerOffset, 0, innerOffset].map((y, index) => (_jsx("mesh", { material: glassTintMaterial, position: [0, y, 0], children: _jsx("boxGeometry", { args: [glassWidth, cellHeight, glassDepth] }) }, `glass-${index}`))), _jsx("mesh", { material: frameMaterial, position: [-sectionWidth / 2 + stile / 2, 0, 0], children: _jsx("boxGeometry", { args: [stile, panelHeight, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [sectionWidth / 2 - stile / 2, 0, 0], children: _jsx("boxGeometry", { args: [stile, panelHeight, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, panelHeight / 2 - outerRail / 2, 0], children: _jsx("boxGeometry", { args: [sectionWidth, outerRail, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, -panelHeight / 2 + outerRail / 2, 0], children: _jsx("boxGeometry", { args: [sectionWidth, outerRail, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, innerOffset / 2, 0], children: _jsx("boxGeometry", { args: [sectionWidth - stile * 0.4, innerRail, depth * 0.9] }) }), _jsx("mesh", { material: frameMaterial, position: [0, -innerOffset / 2, 0], children: _jsx("boxGeometry", { args: [sectionWidth - stile * 0.4, innerRail, depth * 0.9] }) })] }));
}
function FixedGlassSystem({ openingWidth, panelHeight, frameMaterial, glassTintMaterial, pieceCount = 2, position, rotation, depth = 0.03, }) {
    const frameInset = 0.032;
    const clearWidth = Math.max(0.48, openingWidth - frameInset * 2);
    const safePieceCount = Math.max(2, pieceCount);
    const mullionWidth = Math.min(0.038, Math.max(0.026, clearWidth * 0.015));
    const sectionWidth = (clearWidth - mullionWidth * (safePieceCount - 1)) / safePieceCount;
    return (_jsxs("group", { position: position, rotation: rotation, children: [_jsx("mesh", { material: frameMaterial, position: [0, panelHeight / 2 + 0.036, 0], children: _jsx("boxGeometry", { args: [openingWidth, 0.02, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, -panelHeight / 2 - 0.036, 0], children: _jsx("boxGeometry", { args: [openingWidth, 0.02, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [-openingWidth / 2 + frameInset / 2, 0, 0], children: _jsx("boxGeometry", { args: [frameInset, panelHeight + 0.072, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [openingWidth / 2 - frameInset / 2, 0, 0], children: _jsx("boxGeometry", { args: [frameInset, panelHeight + 0.072, depth] }) }), Array.from({ length: safePieceCount }, (_, index) => {
                const x = -clearWidth / 2 + sectionWidth / 2 + index * (sectionWidth + mullionWidth);
                return (_jsxs("group", { children: [_jsx(FixedGlassSection, { sectionWidth: sectionWidth, panelHeight: panelHeight, depth: depth, frameMaterial: frameMaterial, glassTintMaterial: glassTintMaterial, position: [x, 0, 0] }), index < safePieceCount - 1 ? (_jsx("mesh", { material: frameMaterial, position: [x + sectionWidth / 2 + mullionWidth / 2, 0, 0], children: _jsx("boxGeometry", { args: [mullionWidth, panelHeight, depth] }) })) : null] }, `fixed-piece-${index}`));
            })] }));
}
function SlidingDoorSystem({ openingWidth, panelHeight, frameMaterial, glassTintMaterial, progress, position, rotation, depth = 0.03, leafCount = 3, }) {
    const safeLeafCount = Math.max(2, leafCount);
    const basePanelWidth = openingWidth / safeLeafCount;
    const overlap = Math.max(0.025, Math.min(0.05, basePanelWidth * 0.08));
    const panelWidth = basePanelWidth + overlap;
    const frameInset = 0.03;
    const trackDepth = Math.max(0.012, depth * 0.4);
    const stackSpacing = Math.min(0.082, Math.max(0.038, panelWidth * 0.07));
    const stackBaseX = -openingWidth / 2 + panelWidth / 2 + 0.01;
    const closedSpan = Math.max(0.001, openingWidth - panelWidth);
    const closedCenters = Array.from({ length: safeLeafCount }, (_, index) => -openingWidth / 2 + panelWidth / 2 + (safeLeafCount === 1 ? 0 : (index * closedSpan) / Math.max(1, safeLeafCount - 1)));
    const openCenters = Array.from({ length: safeLeafCount }, (_, index) => stackBaseX + stackSpacing * index);
    const layerOffsets = Array.from({ length: safeLeafCount }, (_, index) => (index - (safeLeafCount - 1) / 2) * trackDepth);
    return (_jsxs("group", { position: position, rotation: rotation, children: [layerOffsets.map((offset, index) => (_jsxs("group", { children: [_jsx("mesh", { material: frameMaterial, position: [0, panelHeight / 2 + 0.036, offset], children: _jsx("boxGeometry", { args: [openingWidth, 0.018, 0.014] }) }), _jsx("mesh", { material: frameMaterial, position: [0, -panelHeight / 2 - 0.036, offset], children: _jsx("boxGeometry", { args: [openingWidth, 0.018, 0.014] }) })] }, `track-${index}`))), _jsx("mesh", { material: frameMaterial, position: [-openingWidth / 2 + frameInset / 2, 0, 0], children: _jsx("boxGeometry", { args: [frameInset, panelHeight + 0.072, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [openingWidth / 2 - frameInset / 2, 0, 0], children: _jsx("boxGeometry", { args: [frameInset, panelHeight + 0.072, depth] }) }), closedCenters.map((closedX, index) => {
                const openX = openCenters[index];
                const x = closedX + (openX - closedX) * progress;
                return (_jsx(SlidingDoorLeaf, { panelWidth: panelWidth, panelHeight: panelHeight, depth: depth, frameMaterial: frameMaterial, glassTintMaterial: glassTintMaterial, position: [x, 0, layerOffsets[index]] }, `leaf-${index}`));
            })] }));
}
function BifoldDoorLeaf({ panelWidth, panelHeight, depth, frameMaterial, glassTintMaterial, position, rotation, hingeSide = 'left', }) {
    const localX = hingeSide === 'left' ? panelWidth / 2 : -panelWidth / 2;
    return (_jsx("group", { position: position, rotation: rotation, children: _jsx(SlidingDoorLeaf, { panelWidth: panelWidth, panelHeight: panelHeight, depth: depth, frameMaterial: frameMaterial, glassTintMaterial: glassTintMaterial, position: [localX, 0, 0] }) }));
}
function BifoldDoorChain({ index, leafCount, leafWidth, panelHeight, depth, frameMaterial, glassTintMaterial, progress, isLeft, sideSign, foldSign, }) {
    const magnitude = index === 0 ? 84 : index % 2 === 1 ? 168 : 152;
    const direction = isLeft ? (index % 2 === 0 ? -1 : 1) : index % 2 === 0 ? 1 : -1;
    const angle = THREE.MathUtils.degToRad(magnitude) * direction * progress * foldSign;
    const stackDepth = Math.max(0.012, depth * 0.62) * progress * foldSign;
    const stackLift = 0.012 * progress * foldSign * Math.max(1, index);
    return (_jsxs("group", { rotation: [0, angle, 0], children: [_jsx(BifoldDoorLeaf, { panelWidth: leafWidth, panelHeight: panelHeight, depth: depth, frameMaterial: frameMaterial, glassTintMaterial: glassTintMaterial, hingeSide: isLeft ? 'left' : 'right', position: [0, 0, stackLift] }), index < leafCount - 1 ? (_jsx("group", { position: [sideSign * leafWidth, 0, stackDepth], children: _jsx(BifoldDoorChain, { index: index + 1, leafCount: leafCount, leafWidth: leafWidth, panelHeight: panelHeight, depth: depth, frameMaterial: frameMaterial, glassTintMaterial: glassTintMaterial, progress: progress, isLeft: isLeft, sideSign: sideSign, foldSign: foldSign }) })) : null] }));
}
function BifoldDoorSystem({ openingWidth, panelHeight, frameMaterial, glassTintMaterial, progress, position, rotation, depth = 0.03, stackSide = 'left', foldOutward = false, leafCount = 3, }) {
    const frameInset = 0.03;
    const clearWidth = Math.max(0.72, openingWidth - frameInset * 2);
    const safeLeafCount = Math.max(2, leafCount);
    const leafWidth = Math.max(0.18, clearWidth / safeLeafCount);
    const isLeft = stackSide === 'left';
    const sideSign = isLeft ? 1 : -1;
    const jambX = isLeft ? -openingWidth / 2 + frameInset : openingWidth / 2 - frameInset;
    const foldSign = foldOutward ? -1 : 1;
    return (_jsxs("group", { position: position, rotation: rotation, children: [_jsx("mesh", { material: frameMaterial, position: [0, panelHeight / 2 + 0.036, 0], children: _jsx("boxGeometry", { args: [openingWidth, 0.018, 0.018] }) }), _jsx("mesh", { material: frameMaterial, position: [0, -panelHeight / 2 - 0.036, 0], children: _jsx("boxGeometry", { args: [openingWidth, 0.018, 0.018] }) }), _jsx("mesh", { material: frameMaterial, position: [-openingWidth / 2 + frameInset / 2, 0, 0], children: _jsx("boxGeometry", { args: [frameInset, panelHeight + 0.072, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [openingWidth / 2 - frameInset / 2, 0, 0], children: _jsx("boxGeometry", { args: [frameInset, panelHeight + 0.072, depth] }) }), _jsx("group", { position: [jambX, 0, 0], children: _jsx(BifoldDoorChain, { index: 0, leafCount: safeLeafCount, leafWidth: leafWidth, panelHeight: panelHeight, depth: depth, frameMaterial: frameMaterial, glassTintMaterial: glassTintMaterial, progress: progress, isLeft: isLeft, sideSign: sideSign, foldSign: foldSign }) })] }));
}
function GuillotineSash({ panelWidth, panelHeight, depth, frameMaterial, glassTintMaterial, position, zOffset = 0, }) {
    const stile = Math.min(0.03, Math.max(0.022, panelWidth * 0.07));
    const rail = Math.min(0.032, Math.max(0.024, panelHeight * 0.09));
    const glassWidth = Math.max(0.12, panelWidth - stile * 2 - 0.012);
    const glassHeight = Math.max(0.14, panelHeight - rail * 2 - 0.012);
    const glassDepth = Math.max(0.01, depth * 0.55);
    return (_jsxs("group", { position: position, children: [_jsx("mesh", { material: glassTintMaterial, position: [0, 0, zOffset], children: _jsx("boxGeometry", { args: [glassWidth, glassHeight, glassDepth] }) }), _jsx("mesh", { material: frameMaterial, position: [-panelWidth / 2 + stile / 2, 0, zOffset], children: _jsx("boxGeometry", { args: [stile, panelHeight, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [panelWidth / 2 - stile / 2, 0, zOffset], children: _jsx("boxGeometry", { args: [stile, panelHeight, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, panelHeight / 2 - rail / 2, zOffset], children: _jsx("boxGeometry", { args: [panelWidth, rail, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, -panelHeight / 2 + rail / 2, zOffset], children: _jsx("boxGeometry", { args: [panelWidth, rail, depth] }) })] }));
}
function GuillotineGlassSystem({ openingWidth, panelHeight, frameMaterial, glassTintMaterial, progress, position, rotation, depth = 0.032, }) {
    const frameInset = 0.03;
    const clearWidth = Math.max(0.28, openingWidth - frameInset * 2);
    const clearHeight = Math.max(0.48, panelHeight);
    const sashHeight = Math.max(0.18, clearHeight / 3);
    const sideFrameWidth = frameInset;
    const trackDepth = Math.max(0.012, depth * 0.4);
    const bottomDrop = 0;
    const closedTopY = clearHeight / 2 - sashHeight / 2;
    const closedMidY = 0;
    const closedBotY = -clearHeight / 2 + sashHeight / 2 - bottomDrop;
    // In the open state, all moving sashes should stack down at the base.
    // The top sash rides fully down behind the others instead of stopping mid-height.
    // Keep the stacked sashes visually touching in the open state.
    // The middle and bottom sash should read as one tight stack with no visible daylight gap.
    const middleStackOffset = sashHeight * 0.002;
    const topStackOffset = sashHeight * 0.014;
    const openBotY = closedBotY;
    const openMidY = openBotY + middleStackOffset;
    const openTopY = openBotY + topStackOffset;
    const topY = THREE.MathUtils.lerp(closedTopY, openTopY, progress);
    const midY = THREE.MathUtils.lerp(closedMidY, openMidY, progress);
    const botY = openBotY;
    return (_jsxs("group", { position: position, rotation: rotation, children: [_jsx("mesh", { material: frameMaterial, position: [0, clearHeight / 2 + 0.036, 0], children: _jsx("boxGeometry", { args: [openingWidth, 0.018, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, -clearHeight / 2 - 0.036, 0], children: _jsx("boxGeometry", { args: [openingWidth, 0.018, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [-openingWidth / 2 + sideFrameWidth / 2, 0, 0], children: _jsx("boxGeometry", { args: [sideFrameWidth, clearHeight + 0.072, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [openingWidth / 2 - sideFrameWidth / 2, 0, 0], children: _jsx("boxGeometry", { args: [sideFrameWidth, clearHeight + 0.072, depth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, clearHeight / 2 + 0.002, 0], children: _jsx("boxGeometry", { args: [clearWidth, 0.01, trackDepth] }) }), _jsx("mesh", { material: frameMaterial, position: [0, -clearHeight / 2 - 0.002, 0], children: _jsx("boxGeometry", { args: [clearWidth, 0.01, trackDepth] }) }), _jsx(GuillotineSash, { panelWidth: clearWidth, panelHeight: sashHeight, depth: depth, frameMaterial: frameMaterial, glassTintMaterial: glassTintMaterial, position: [0, topY, -trackDepth * 0.55 * progress] }), _jsx(GuillotineSash, { panelWidth: clearWidth, panelHeight: sashHeight, depth: depth, frameMaterial: frameMaterial, glassTintMaterial: glassTintMaterial, position: [0, midY, 0] }), _jsx(GuillotineSash, { panelWidth: clearWidth, panelHeight: sashHeight, depth: depth, frameMaterial: frameMaterial, glassTintMaterial: glassTintMaterial, position: [0, botY, trackDepth * 0.2 * progress] })] }));
}
function WedgePanel({ side, projection, sideHeight, backHeight, material, frameColor, aluminium, }) {
    const sign = side === 'left' ? -1 : 1;
    const rise = Math.max(0.18, backHeight - sideHeight);
    const inset = 0.06;
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.lineTo(projection - inset, 0);
        s.lineTo(0, rise);
        s.closePath();
        return s;
    }, [projection, rise]);
    const extrudeSettings = useMemo(() => ({ depth: 0.018, bevelEnabled: false }), []);
    const wedgeWidth = projection - inset;
    const wedgeHeight = rise;
    const materials = useMemo(() => makePanelMaterials(frameColor), [frameColor]);
    const grooveCount = Math.max(2, Math.floor(wedgeHeight / 0.18));
    const wedgeDepth = 0.018;
    const wedgeZ = -projection / 2 + inset / 2;
    const leftInnerOffset = side === 'left' ? -wedgeDepth : 0;
    return (_jsxs("group", { position: [0.012 * sign, sideHeight + 0.01, wedgeZ], rotation: [0, -Math.PI / 2, 0], children: [_jsx("mesh", { material: aluminium ? materials.base : material, position: [0, 0, leftInnerOffset], children: _jsx("extrudeGeometry", { args: [shape, extrudeSettings] }) }), aluminium
                ? Array.from({ length: grooveCount }, (_, index) => {
                    const y = (wedgeHeight / (grooveCount + 1)) * (index + 1);
                    const lineWidth = Math.max(0.12, wedgeWidth * (1 - y / wedgeHeight) - 0.02);
                    if (lineWidth <= 0.08)
                        return null;
                    return (_jsx("mesh", { material: materials.groove, position: [lineWidth / 2 - 0.01, y, 0.0195 + leftInnerOffset], children: _jsx("boxGeometry", { args: [lineWidth, 0.008, 0.003] }) }, index));
                })
                : null] }));
}
function FabricPergolaRoof({ width, slopeLength, progress, position, rotation, frameMaterial, lightsEnabled, warm, nightMode, }) {
    const fabricMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#f1eee3',
        roughness: 0.96,
        metalness: 0.02,
        side: THREE.DoubleSide,
    }), []);
    const supportMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#e5e1d3',
        roughness: 0.86,
        metalness: 0.08,
    }), []);
    const ledBodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#f7f7f2',
        roughness: 0.45,
        metalness: 0.22,
    }), []);
    const ledLensMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: warm ? '#f8ebcf' : '#f1f5f6',
        emissive: warm ? '#f2dcaf' : '#e6eef2',
        emissiveIntensity: nightMode ? 1.9 : 0.65,
        transparent: true,
        opacity: 0.94,
    }), [nightMode, warm]);
    const usableWidth = Math.max(0.48, width - 0.14);
    const usableLength = Math.max(0.75, slopeLength - 0.12);
    const foldCount = Math.max(7, Math.min(14, Math.round(usableLength / 0.28)));
    const closedStep = usableLength / foldCount;
    const retractedLength = Math.min(Math.max(0.34, usableLength * 0.22), 0.72);
    const openStep = retractedLength / foldCount;
    const startZ = -usableLength / 2;
    const barPositions = Array.from({ length: foldCount + 1 }, (_, index) => {
        const closedZ = startZ + index * closedStep;
        const openZ = startZ + index * openStep;
        return THREE.MathUtils.lerp(closedZ, openZ, progress);
    });
    const ledXs = [-usableWidth * 0.28, 0, usableWidth * 0.28];
    return (_jsxs("group", { position: position, rotation: rotation, children: [_jsx("mesh", { material: frameMaterial, position: [0, 0.035, startZ + 0.06], children: _jsx("boxGeometry", { args: [usableWidth + 0.06, 0.055, 0.12] }) }), Array.from({ length: foldCount }, (_, index) => {
                const z0 = barPositions[index];
                const z1 = barPositions[index + 1];
                const segmentLength = Math.max(0.035, z1 - z0 - 0.008);
                const segmentZ = (z0 + z1) / 2;
                const segmentY = progress > 0.01 ? -0.007 - (index % 2 === 0 ? 0.002 : 0.007) * progress : -0.009;
                return (_jsx("mesh", { material: fabricMaterial, position: [0, segmentY, segmentZ], children: _jsx("boxGeometry", { args: [usableWidth, 0.012, segmentLength] }) }, `fabric-segment-${index}`));
            }), barPositions.map((z, index) => {
                const radius = index === foldCount ? 0.018 : 0.012;
                const y = index === foldCount ? -0.002 : -0.008;
                return (_jsxs("group", { position: [0, y, z], children: [_jsx("mesh", { material: index === foldCount ? frameMaterial : supportMaterial, rotation: [0, 0, Math.PI / 2], children: _jsx("cylinderGeometry", { args: [radius, radius, usableWidth, 20] }) }), lightsEnabled && index > 0 && index < foldCount ? (_jsx("group", { children: ledXs.map((x, ledIndex) => (_jsxs("group", { position: [x, -0.02, 0], children: [_jsx("mesh", { material: ledBodyMaterial, rotation: [Math.PI / 2, 0, 0], children: _jsx("cylinderGeometry", { args: [0.013, 0.013, 0.01, 18] }) }), _jsx("mesh", { material: ledLensMaterial, position: [0, -0.004, 0], rotation: [Math.PI / 2, 0, 0], children: _jsx("circleGeometry", { args: [0.009, 18] }) }), nightMode ? (_jsx("pointLight", { position: [0, -0.026, 0], distance: 2.7, intensity: warm ? 0.52 : 0.42, color: warm ? '#ffd8a0' : '#eef8ff', decay: 2 })) : null] }, `fabric-led-${index}-${ledIndex}`))) })) : null] }, `fabric-bar-${index}`));
            })] }));
}
function PergolaSlatLights({ width, z, warm, nightMode, }) {
    const xs = [-width * 0.28, 0, width * 0.28];
    return (_jsx("group", { position: [0, -0.035, z], children: xs.map((x, index) => (_jsxs("group", { position: [x, 0, 0], children: [_jsxs("mesh", { rotation: [Math.PI / 2, 0, 0], children: [_jsx("cylinderGeometry", { args: [0.014, 0.014, 0.01, 18] }), _jsx("meshStandardMaterial", { color: "#f7f7f2", roughness: 0.42, metalness: 0.22 })] }), _jsxs("mesh", { position: [0, -0.004, 0], rotation: [Math.PI / 2, 0, 0], children: [_jsx("circleGeometry", { args: [0.009, 18] }), _jsx("meshStandardMaterial", { color: warm ? '#f8ebcf' : '#f1f5f6', emissive: warm ? '#f2dcaf' : '#e6eef2', emissiveIntensity: nightMode ? 2.0 : 0.65, transparent: true, opacity: 0.94 })] }), nightMode ? (_jsx("pointLight", { position: [0, -0.024, 0], distance: 2.7, intensity: warm ? 0.46 : 0.38, color: warm ? '#ffd8a0' : '#eef8ff', decay: 2 })) : null] }, index))) }));
}
function BioclimaticPergolaRoof({ width, projection, progress, position, frameMaterial, slatColor, lightsEnabled, warm, nightMode, }) {
    const slatMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: slatColor, roughness: 0.5, metalness: 0.35 }), [slatColor]);
    const slatEdgeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(slatColor).lerp(new THREE.Color('#ffffff'), 0.08), roughness: 0.42, metalness: 0.4 }), [slatColor]);
    const usableWidth = Math.max(0.48, width - 0.14);
    const usableLength = Math.max(0.8, projection - 0.16);
    const slatCount = Math.max(12, Math.min(26, Math.round(usableLength / 0.14)));
    const pitch = usableLength / slatCount;
    const slatDepth = Math.max(0.065, pitch - 0.008);
    const startZ = -usableLength / 2 + pitch / 2;
    const openAngle = progress * 1.22;
    return (_jsxs("group", { position: position, children: [Array.from({ length: slatCount }, (_, index) => {
                const z = startZ + index * pitch;
                const showLights = lightsEnabled && index > 0 && index < slatCount - 1 && index % 3 === 1;
                return (_jsxs("group", { position: [0, 0, z], rotation: [openAngle, 0, 0], children: [_jsx("mesh", { material: slatMaterial, children: _jsx("boxGeometry", { args: [usableWidth, 0.03, slatDepth] }) }), _jsx("mesh", { material: slatEdgeMaterial, position: [0, 0.017, 0], children: _jsx("boxGeometry", { args: [usableWidth * 0.985, 0.004, slatDepth * 0.94] }) }), showLights ? _jsx(PergolaSlatLights, { width: usableWidth, z: 0, warm: warm, nightMode: nightMode }) : null] }, index));
            }), _jsx("mesh", { material: frameMaterial, position: [0, 0.02, -usableLength / 2 - 0.02], children: _jsx("boxGeometry", { args: [usableWidth + 0.05, 0.04, 0.05] }) }), _jsx("mesh", { material: frameMaterial, position: [0, 0.02, usableLength / 2 + 0.02], children: _jsx("boxGeometry", { args: [usableWidth + 0.05, 0.04, 0.05] }) })] }));
}
function LuxBioclimaticPergolaRoof({ width, projection, progress, position, frameMaterial, slatColor, lightsEnabled, warm, nightMode, }) {
    const slatMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: slatColor, roughness: 0.5, metalness: 0.35 }), [slatColor]);
    const slatEdgeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(slatColor).lerp(new THREE.Color('#ffffff'), 0.08), roughness: 0.42, metalness: 0.4 }), [slatColor]);
    const usableWidth = Math.max(0.48, width - 0.14);
    const usableLength = Math.max(0.8, projection - 0.16);
    const slatCount = Math.max(12, Math.min(26, Math.round(usableLength / 0.14)));
    const pitch = usableLength / slatCount;
    const slatDepth = Math.max(0.065, pitch - 0.008);
    const startZ = -usableLength / 2 + pitch / 2;
    const tiltPhase = Math.min(1, progress / 0.62);
    const slidePhase = progress <= 0.62 ? 0 : (progress - 0.62) / 0.38;
    const openAngle = tiltPhase * 1.2;
    const clusterPitch = 0.028;
    const clusterStart = -usableLength / 2 + slatDepth * 0.6;
    return (_jsxs("group", { position: position, children: [Array.from({ length: slatCount }, (_, index) => {
                const closedZ = startZ + index * pitch;
                const openZ = clusterStart + index * clusterPitch;
                const z = THREE.MathUtils.lerp(closedZ, openZ, slidePhase);
                const showLights = lightsEnabled && index % 3 === 1;
                return (_jsxs("group", { position: [0, 0, z], rotation: [openAngle, 0, 0], children: [_jsx("mesh", { material: slatMaterial, children: _jsx("boxGeometry", { args: [usableWidth, 0.03, slatDepth] }) }), _jsx("mesh", { material: slatEdgeMaterial, position: [0, 0.017, 0], children: _jsx("boxGeometry", { args: [usableWidth * 0.985, 0.004, slatDepth * 0.94] }) }), showLights ? _jsx(PergolaSlatLights, { width: usableWidth, z: 0, warm: warm, nightMode: nightMode }) : null] }, index));
            }), _jsx("mesh", { material: frameMaterial, position: [0, 0.02, -usableLength / 2 - 0.02], children: _jsx("boxGeometry", { args: [usableWidth + 0.05, 0.04, 0.05] }) }), _jsx("mesh", { material: frameMaterial, position: [0, 0.02, usableLength / 2 + 0.02], children: _jsx("boxGeometry", { args: [usableWidth + 0.05, 0.04, 0.05] }) })] }));
}
function RetractableRoofAwning({ width, slopeLength, progress, position, rotation, caseMaterial, fabricColor, }) {
    const fabricMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: new THREE.Color(fabricColor).multiplyScalar(0.82),
        roughness: 0.86,
        metalness: 0.03,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
    }), [fabricColor]);
    const barMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: new THREE.Color(fabricColor).lerp(new THREE.Color('#0f1317'), 0.12),
        roughness: 0.72,
        metalness: 0.12,
    }), [fabricColor]);
    const usableWidth = Math.max(0.46, width - 0.16);
    const usableLength = Math.max(0.72, slopeLength - 0.16);
    const startZ = -usableLength / 2;
    const minVisibleLength = Math.min(Math.max(0.18, usableLength * 0.08), 0.34);
    const visibleLength = THREE.MathUtils.lerp(usableLength, minVisibleLength, progress);
    const visible = visibleLength > 0.03;
    const frontEdgeZ = startZ + visibleLength;
    const sheetZ = startZ + visibleLength / 2;
    return (_jsxs("group", { position: position, rotation: rotation, children: [_jsx("mesh", { material: caseMaterial, position: [0, 0, startZ + 0.055], children: _jsx("boxGeometry", { args: [usableWidth + 0.08, 0.09, 0.11] }) }), visible ? (_jsxs(_Fragment, { children: [_jsx("mesh", { material: fabricMaterial, position: [0, -0.024, sheetZ], children: _jsx("boxGeometry", { args: [Math.max(0.08, usableWidth - 0.028), 0.012, visibleLength] }) }), _jsx("mesh", { material: barMaterial, position: [0, -0.024, frontEdgeZ - 0.016], children: _jsx("boxGeometry", { args: [Math.max(0.08, usableWidth - 0.018), 0.028, 0.036] }) })] })) : null] }));
}
function VerticalRollerAwning({ width, height, progress, position, rotation, caseMaterial, fabricColor, }) {
    const fabricMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: new THREE.Color(fabricColor).multiplyScalar(0.82),
        roughness: 0.86,
        metalness: 0.03,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
    }), [fabricColor]);
    const barMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: new THREE.Color(fabricColor).lerp(new THREE.Color('#0f1317'), 0.12),
        roughness: 0.72,
        metalness: 0.12,
    }), [fabricColor]);
    const casingDepth = 0.09;
    const casingHeight = 0.09;
    const openDrop = 0.06;
    const drop = THREE.MathUtils.lerp(height, openDrop, progress);
    const visible = drop > 0.03;
    return (_jsxs("group", { position: position, rotation: rotation, children: [_jsx("mesh", { material: caseMaterial, position: [0, 0, 0], children: _jsx("boxGeometry", { args: [width, casingHeight, casingDepth] }) }), visible ? (_jsxs(_Fragment, { children: [_jsx("mesh", { material: fabricMaterial, position: [0, -casingHeight / 2 - drop / 2, 0], children: _jsx("boxGeometry", { args: [Math.max(0.08, width - 0.028), drop, 0.012] }) }), _jsx("mesh", { material: barMaterial, position: [0, -casingHeight / 2 - drop + 0.018, 0], children: _jsx("boxGeometry", { args: [Math.max(0.08, width - 0.018), 0.036, 0.028] }) })] })) : null] }));
}
function VerandaModel({ dims, roofMaterial, wedgeMaterial, frameColor, pergolaColor, enclosures, lightsEnabled, lightTemperature, nightMode, doorsOpen, awningsOpen, roofOpen, doorOpenStates, awningOpenStates, roofAwningEnabled, sideAwnings, awningColor, isMobileView = false, showDimensions = true, }) {
    const postThickness = 0.085;
    const centerPostThickness = 0.115;
    const beamHeight = 0.12;
    const fixedRearRise = 0.5;
    const flatPergolaRoof = isFlatPergolaRoofMaterial(roofMaterial);
    const pergolaRoof = isPergolaRoofMaterial(roofMaterial);
    const rearRise = flatPergolaRoof ? 0 : fixedRearRise;
    const backHeight = dims.height + rearRise;
    const roofAngle = flatPergolaRoof ? 0 : Math.atan2(rearRise, dims.projection);
    const slopeLength = flatPergolaRoof ? dims.projection : Math.sqrt(dims.projection ** 2 + rearRise ** 2);
    const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.62, metalness: 0.26 }), [frameColor]);
    const pergolaFrameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: pergolaColor, roughness: 0.56, metalness: 0.32 }), [pergolaColor]);
    const roofSurfaceMaterial = roofMaterial === 'glass' ? glassMaterial : roofMaterial === 'polycarbonate' ? polyMaterial : null;
    const wedgeSurfaceMaterial = wedgeMaterial === 'glass' ? glassMaterial : polyMaterial;
    const panelMaterials = useMemo(() => makePanelMaterials(frameColor), [frameColor]);
    const warm = lightTemperature === 'warm';
    const panelCount = Math.max(4, Math.round(dims.width / 1.1));
    const panelWidth = dims.width / panelCount;
    const supportPostRequired = dims.width >= 5;
    const frontInset = postThickness + 0.012;
    const frontClearWidth = Math.max(0.6, dims.width - frontInset * 2);
    const splitBayWidth = Math.max(0.3, (frontClearWidth - centerPostThickness) / 2);
    const overallWidthLineZ = dims.projection + 0.72;
    const splitWidthLineZ = dims.projection + 0.26;
    const depthLineX = dims.width / 2 + 0.42;
    const frontHeightLineX = dims.width / 2 + 0.62;
    const roofSpanLineX = dims.width / 2 + 0.84;
    const rearHeightLineX = -dims.width / 2 - 0.42;
    const measureGroundY = 0.035;
    const sideLeafCount = dims.projection > 3 ? 4 : 3;
    const sideFixedCount = sideFixedGlassCount(dims.projection);
    const unsplitFrontLeafCount = dims.width > 4 ? 5 : dims.width > 3 ? 4 : 3;
    const unsplitFrontFixedCount = frontFixedGlassCount(dims.width);
    const dimensionLabelFontSizePx = isMobileView ? 17 : 15;
    const resolvedDoorOpenStates = useMemo(() => doorOpenStates ?? {
        front: doorsOpen,
        frontLeft: doorsOpen,
        frontRight: doorsOpen,
        left: doorsOpen,
        right: doorsOpen,
    }, [doorOpenStates, doorsOpen]);
    const resolvedAwningOpenStates = useMemo(() => awningOpenStates ?? {
        roof: awningsOpen,
        front: awningsOpen,
        frontLeft: awningsOpen,
        frontRight: awningsOpen,
        left: awningsOpen,
        right: awningsOpen,
    }, [awningOpenStates, awningsOpen]);
    const resolvedRoofOpen = roofOpen ?? doorsOpen;
    const [doorProgress, setDoorProgress] = useState({ front: 0, frontLeft: 0, frontRight: 0, left: 0, right: 0 });
    const [roofProgress, setRoofProgress] = useState(0);
    const [awningProgress, setAwningProgress] = useState({ roof: 0, front: 0, frontLeft: 0, frontRight: 0, left: 0, right: 0 });
    const previousEnclosuresRef = useRef(enclosures);
    const previousRoofMaterialRef = useRef(roofMaterial);
    const previousRoofAwningEnabledRef = useRef(roofAwningEnabled);
    const previousSideAwningsRef = useRef(sideAwnings);
    const doorProgressRef = useRef({ front: 0, frontLeft: 0, frontRight: 0, left: 0, right: 0 });
    const awningProgressRef = useRef({ roof: 0, front: 0, frontLeft: 0, frontRight: 0, left: 0, right: 0 });
    const animationFrameRef = useRef(null);
    const roofAnimationFrameRef = useRef(null);
    const roofAnimationStateRef = useRef({ from: 0, to: 0, start: 0, duration: 0, active: false });
    const awningAnimationFrameRef = useRef(null);
    const awningAnimationStateRef = useRef({
        roof: { from: 0, to: 0, start: 0, duration: 0, active: false },
        front: { from: 0, to: 0, start: 0, duration: 0, active: false },
        frontLeft: { from: 0, to: 0, start: 0, duration: 0, active: false },
        frontRight: { from: 0, to: 0, start: 0, duration: 0, active: false },
        left: { from: 0, to: 0, start: 0, duration: 0, active: false },
        right: { from: 0, to: 0, start: 0, duration: 0, active: false },
    });
    const animationStateRef = useRef({
        front: { from: 0, to: 0, start: 0, duration: 0, active: false },
        frontLeft: { from: 0, to: 0, start: 0, duration: 0, active: false },
        frontRight: { from: 0, to: 0, start: 0, duration: 0, active: false },
        left: { from: 0, to: 0, start: 0, duration: 0, active: false },
        right: { from: 0, to: 0, start: 0, duration: 0, active: false },
    });
    const setDoorProgressImmediate = (next) => {
        doorProgressRef.current = next;
        setDoorProgress(next);
    };
    const setAwningProgressImmediate = (next) => {
        awningProgressRef.current = next;
        setAwningProgress(next);
    };
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const runDoorAnimations = () => {
        if (animationFrameRef.current)
            cancelAnimationFrame(animationFrameRef.current);
        const animate = (now) => {
            let hasActive = false;
            const next = { ...doorProgressRef.current };
            ['front', 'frontLeft', 'frontRight', 'left', 'right'].forEach((side) => {
                const animation = animationStateRef.current[side];
                if (!animation.active)
                    return;
                const duration = Math.max(1, animation.duration);
                const elapsed = now - animation.start;
                const t = Math.min(1, elapsed / duration);
                const eased = easeInOutCubic(t);
                next[side] = animation.from + (animation.to - animation.from) * eased;
                if (t >= 1) {
                    next[side] = animation.to;
                    animation.active = false;
                }
                else {
                    hasActive = true;
                }
            });
            setDoorProgressImmediate(next);
            if (hasActive) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
            else {
                animationFrameRef.current = null;
            }
        };
        animationFrameRef.current = requestAnimationFrame(animate);
    };
    const animateDoorSide = (side, to, duration) => {
        const from = doorProgressRef.current[side];
        if (Math.abs(from - to) < 0.0001) {
            const next = { ...doorProgressRef.current, [side]: to };
            setDoorProgressImmediate(next);
            animationStateRef.current[side] = { from: to, to, start: 0, duration: 0, active: false };
            return;
        }
        animationStateRef.current[side] = {
            from,
            to,
            start: performance.now(),
            duration,
            active: true,
        };
        runDoorAnimations();
    };
    const runAwningAnimations = () => {
        if (awningAnimationFrameRef.current)
            cancelAnimationFrame(awningAnimationFrameRef.current);
        const animate = (now) => {
            let hasActive = false;
            const next = { ...awningProgressRef.current };
            ['roof', 'front', 'frontLeft', 'frontRight', 'left', 'right'].forEach((key) => {
                const animation = awningAnimationStateRef.current[key];
                if (!animation.active)
                    return;
                const duration = Math.max(1, animation.duration);
                const elapsed = now - animation.start;
                const t = Math.min(1, elapsed / duration);
                const eased = easeInOutCubic(t);
                next[key] = animation.from + (animation.to - animation.from) * eased;
                if (t >= 1) {
                    next[key] = animation.to;
                    animation.active = false;
                }
                else {
                    hasActive = true;
                }
            });
            setAwningProgressImmediate(next);
            if (hasActive) {
                awningAnimationFrameRef.current = requestAnimationFrame(animate);
            }
            else {
                awningAnimationFrameRef.current = null;
            }
        };
        awningAnimationFrameRef.current = requestAnimationFrame(animate);
    };
    const animateAwningKey = (key, to, duration) => {
        const from = awningProgressRef.current[key];
        if (Math.abs(from - to) < 0.0001) {
            const next = { ...awningProgressRef.current, [key]: to };
            setAwningProgressImmediate(next);
            awningAnimationStateRef.current[key] = { from: to, to, start: 0, duration: 0, active: false };
            return;
        }
        awningAnimationStateRef.current[key] = {
            from,
            to,
            start: performance.now(),
            duration,
            active: true,
        };
        runAwningAnimations();
    };
    const runRoofAnimation = () => {
        if (roofAnimationFrameRef.current)
            cancelAnimationFrame(roofAnimationFrameRef.current);
        const animate = (now) => {
            const animation = roofAnimationStateRef.current;
            if (!animation.active) {
                roofAnimationFrameRef.current = null;
                return;
            }
            const duration = Math.max(1, animation.duration);
            const elapsed = now - animation.start;
            const t = Math.min(1, elapsed / duration);
            const eased = easeInOutCubic(t);
            const next = animation.from + (animation.to - animation.from) * eased;
            setRoofProgress(next);
            if (t >= 1) {
                setRoofProgress(animation.to);
                animation.active = false;
                roofAnimationFrameRef.current = null;
            }
            else {
                roofAnimationFrameRef.current = requestAnimationFrame(animate);
            }
        };
        roofAnimationFrameRef.current = requestAnimationFrame(animate);
    };
    const animateRoof = (to, duration) => {
        const from = roofProgress;
        if (Math.abs(from - to) < 0.0001) {
            setRoofProgress(to);
            roofAnimationStateRef.current = { from: to, to, start: 0, duration: 0, active: false };
            return;
        }
        roofAnimationStateRef.current = {
            from,
            to,
            start: performance.now(),
            duration,
            active: true,
        };
        runRoofAnimation();
    };
    useEffect(() => {
        const previousEnclosures = previousEnclosuresRef.current;
        ['front', 'frontLeft', 'frontRight', 'left', 'right'].forEach((side) => {
            if (isDoorEnclosure(enclosures[side]) && previousEnclosures[side] !== enclosures[side]) {
                const next = { ...doorProgressRef.current, [side]: 1 };
                setDoorProgressImmediate(next);
                animateDoorSide(side, 0, 900);
            }
            if (!isDoorEnclosure(enclosures[side]) && isDoorEnclosure(previousEnclosures[side])) {
                const next = { ...doorProgressRef.current, [side]: 0 };
                setDoorProgressImmediate(next);
                animationStateRef.current[side].active = false;
            }
        });
        previousEnclosuresRef.current = enclosures;
    }, [enclosures]);
    useEffect(() => {
        ;
        ['front', 'frontLeft', 'frontRight', 'left', 'right'].forEach((side) => {
            if (isDoorEnclosure(enclosures[side])) {
                animateDoorSide(side, resolvedDoorOpenStates[side] ? 1 : 0, 760);
            }
        });
    }, [enclosures, resolvedDoorOpenStates]);
    useEffect(() => {
        const previousRoofMaterial = previousRoofMaterialRef.current;
        const hadPergola = isPergolaRoofMaterial(previousRoofMaterial);
        const hasPergola = isPergolaRoofMaterial(roofMaterial);
        if (!hasPergola) {
            if (roofAnimationFrameRef.current) {
                cancelAnimationFrame(roofAnimationFrameRef.current);
                roofAnimationFrameRef.current = null;
            }
            roofAnimationStateRef.current.active = false;
            setRoofProgress(0);
            previousRoofMaterialRef.current = roofMaterial;
            return;
        }
        if (!hadPergola || previousRoofMaterial !== roofMaterial) {
            setRoofProgress(1);
            const roofDuration = roofMaterial === 'lux-bioclimatic' ? 1450 : 900;
            roofAnimationStateRef.current = { from: 1, to: resolvedRoofOpen ? 1 : 0, start: performance.now(), duration: roofDuration, active: true };
            runRoofAnimation();
        }
        else {
            animateRoof(resolvedRoofOpen ? 1 : 0, roofMaterial === 'lux-bioclimatic' ? 1350 : 820);
        }
        previousRoofMaterialRef.current = roofMaterial;
    }, [resolvedRoofOpen, roofMaterial]);
    useEffect(() => {
        const previousSide = previousSideAwningsRef.current;
        ['front', 'frontLeft', 'frontRight', 'left', 'right'].forEach((key) => {
            if (sideAwnings[key] && !previousSide[key]) {
                const next = { ...awningProgressRef.current, [key]: 1 };
                setAwningProgressImmediate(next);
                animateAwningKey(key, 0, 920);
            }
            if (!sideAwnings[key] && previousSide[key]) {
                const next = { ...awningProgressRef.current, [key]: 0 };
                setAwningProgressImmediate(next);
                awningAnimationStateRef.current[key].active = false;
            }
        });
        previousSideAwningsRef.current = sideAwnings;
    }, [sideAwnings]);
    useEffect(() => {
        const previousRoofAwning = previousRoofAwningEnabledRef.current;
        if (roofAwningEnabled && !previousRoofAwning) {
            const next = { ...awningProgressRef.current, roof: 1 };
            setAwningProgressImmediate(next);
            animateAwningKey('roof', 0, 920);
        }
        if (!roofAwningEnabled && previousRoofAwning) {
            const next = { ...awningProgressRef.current, roof: 0 };
            setAwningProgressImmediate(next);
            awningAnimationStateRef.current.roof.active = false;
        }
        previousRoofAwningEnabledRef.current = roofAwningEnabled;
    }, [roofAwningEnabled]);
    useEffect(() => {
        ;
        ['roof', 'front', 'frontLeft', 'frontRight', 'left', 'right'].forEach((key) => {
            if (key === 'roof') {
                if (roofAwningEnabled)
                    animateAwningKey('roof', resolvedAwningOpenStates.roof ? 1 : 0, 780);
            }
            else if (sideAwnings[key]) {
                animateAwningKey(key, resolvedAwningOpenStates[key] ? 1 : 0, 780);
            }
        });
    }, [resolvedAwningOpenStates, roofAwningEnabled, sideAwnings]);
    useEffect(() => () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (roofAnimationFrameRef.current) {
            cancelAnimationFrame(roofAnimationFrameRef.current);
            roofAnimationFrameRef.current = null;
        }
        if (awningAnimationFrameRef.current) {
            cancelAnimationFrame(awningAnimationFrameRef.current);
            awningAnimationFrameRef.current = null;
        }
    }, []);
    const wallClearance = 0.16;
    return (_jsxs("group", { position: [VERANDA_LEFT_ANCHOR_X + dims.width / 2, 0, wallClearance], children: [_jsx("mesh", { position: [0, 0.01, dims.projection / 2], receiveShadow: true, material: warmDeckMaterial, children: _jsx("boxGeometry", { args: [dims.width, 0.02, dims.projection] }) }), Array.from({ length: Math.max(6, Math.round(dims.width / 0.9)) }, (_, index) => {
                const x = -dims.width / 2 + (index * dims.width) / Math.max(5, Math.round(dims.width / 0.9) - 1);
                return (_jsxs("mesh", { position: [x, 0.0215, dims.projection / 2], children: [_jsx("boxGeometry", { args: [0.006, 0.001, dims.projection] }), _jsx("meshStandardMaterial", { color: "#a79178", roughness: 1 })] }, `deck-line-${index}`));
            }), _jsx("mesh", { material: frameMaterial, position: [-dims.width / 2 + postThickness / 2, dims.height / 2, dims.projection - postThickness / 2], castShadow: true, children: _jsx("boxGeometry", { args: [postThickness, dims.height, postThickness] }) }), _jsx("mesh", { material: frameMaterial, position: [dims.width / 2 - postThickness / 2, dims.height / 2, dims.projection - postThickness / 2], castShadow: true, children: _jsx("boxGeometry", { args: [postThickness, dims.height, postThickness] }) }), supportPostRequired ? (_jsx("mesh", { material: frameMaterial, position: [0, dims.height / 2, dims.projection - centerPostThickness / 2], castShadow: true, children: _jsx("boxGeometry", { args: [centerPostThickness, dims.height, centerPostThickness] }) })) : null, _jsx("mesh", { material: frameMaterial, position: [0, dims.height - beamHeight / 2, dims.projection - postThickness / 2], castShadow: true, children: _jsx("boxGeometry", { args: [dims.width, beamHeight, postThickness] }) }), _jsx("mesh", { material: frameMaterial, position: [0, backHeight - beamHeight / 2, postThickness / 2], castShadow: true, children: _jsx("boxGeometry", { args: [dims.width, beamHeight, postThickness] }) }), _jsx("mesh", { material: frameMaterial, position: [-dims.width / 2 + postThickness / 2, (dims.height + backHeight) / 2 - beamHeight / 4, dims.projection / 2], rotation: [roofAngle, 0, 0], castShadow: true, children: _jsx("boxGeometry", { args: [postThickness, beamHeight * 0.95, slopeLength] }) }), _jsx("mesh", { material: frameMaterial, position: [dims.width / 2 - postThickness / 2, (dims.height + backHeight) / 2 - beamHeight / 4, dims.projection / 2], rotation: [roofAngle, 0, 0], castShadow: true, children: _jsx("boxGeometry", { args: [postThickness, beamHeight * 0.95, slopeLength] }) }), roofMaterial === 'fabric' && dims.width > 4 ? (_jsx("mesh", { material: frameMaterial, position: [0, (dims.height + backHeight) / 2 - beamHeight / 4, dims.projection / 2], rotation: [roofAngle, 0, 0], castShadow: true, children: _jsx("boxGeometry", { args: [postThickness * 0.92, beamHeight * 0.88, slopeLength] }) })) : null, !pergolaRoof
                ? Array.from({ length: panelCount - 1 }, (_, index) => {
                    const x = -dims.width / 2 + ((index + 1) * dims.width) / panelCount;
                    return (_jsx("mesh", { material: frameMaterial, position: [x, (dims.height + backHeight) / 2 - beamHeight / 4, dims.projection / 2], rotation: [roofAngle, 0, 0], castShadow: true, children: _jsx("boxGeometry", { args: [0.05, 0.08, slopeLength] }) }, `rafter-${index}`));
                })
                : null, roofMaterial === 'fabric' ? (_jsx(FabricPergolaRoof, { width: dims.width, slopeLength: slopeLength, progress: roofProgress, position: [0, (dims.height + backHeight) / 2 - 0.02, dims.projection / 2], rotation: [roofAngle, 0, 0], frameMaterial: pergolaFrameMaterial, lightsEnabled: lightsEnabled, warm: warm, nightMode: nightMode })) : roofMaterial === 'bioclimatic' ? (_jsx(BioclimaticPergolaRoof, { width: dims.width, projection: dims.projection, progress: roofProgress, position: [0, dims.height - 0.018, dims.projection / 2], frameMaterial: pergolaFrameMaterial, slatColor: pergolaColor, lightsEnabled: lightsEnabled, warm: warm, nightMode: nightMode })) : roofMaterial === 'lux-bioclimatic' ? (_jsx(LuxBioclimaticPergolaRoof, { width: dims.width, projection: dims.projection, progress: roofProgress, position: [0, dims.height - 0.018, dims.projection / 2], frameMaterial: pergolaFrameMaterial, slatColor: pergolaColor, lightsEnabled: lightsEnabled, warm: warm, nightMode: nightMode })) : (_jsx(_Fragment, { children: Array.from({ length: panelCount }, (_, index) => {
                    const x = -dims.width / 2 + panelWidth / 2 + index * panelWidth;
                    return roofMaterial === 'aluminium' ? (_jsx(RoofAluminiumPanel, { width: panelWidth - 0.065, length: slopeLength - 0.03, thickness: 0.022, frameColor: frameColor, position: [x, (dims.height + backHeight) / 2 - 0.012, dims.projection / 2], rotation: [roofAngle, 0, 0] }, `roof-panel-${index}`)) : (_jsx("mesh", { material: roofSurfaceMaterial ?? glassMaterial, position: [x, (dims.height + backHeight) / 2 - 0.012, dims.projection / 2], rotation: [roofAngle, 0, 0], children: _jsx("boxGeometry", { args: [panelWidth - 0.065, 0.018, slopeLength - 0.03] }) }, `roof-panel-${index}`));
                }) })), !pergolaRoof && roofAwningEnabled ? (_jsx(RetractableRoofAwning, { width: dims.width, slopeLength: slopeLength, progress: awningProgress.roof, position: [0, (dims.height + backHeight) / 2 - 0.045, dims.projection / 2], rotation: [roofAngle, 0, 0], caseMaterial: frameMaterial, fabricColor: awningColor })) : null, lightsEnabled && !pergolaRoof ? _jsx(RoofLights, { width: dims.width, projection: dims.projection, backHeight: backHeight, frontHeight: dims.height, panelCount: panelCount, warm: warm, nightMode: nightMode }) : null, (supportPostRequired ? (enclosures.frontLeft !== 'none' || enclosures.frontRight !== 'none') : enclosures.front !== 'none') ? (() => {
                const frontInset = postThickness + 0.012;
                const frontClearWidth = Math.max(0.6, dims.width - frontInset * 2);
                const splitBayNominalWidth = supportPostRequired ? (dims.width - centerPostThickness) / 2 : dims.width;
                const splitBayLeafCount = splitBayNominalWidth > 3 ? 4 : 3;
                return (_jsxs("group", { position: [0, 0, dims.projection - 0.02], children: [_jsx("mesh", { material: frameMaterial, position: [0, 0.04, 0], children: _jsx("boxGeometry", { args: [frontClearWidth, 0.08, 0.04] }) }), _jsx("mesh", { material: frameMaterial, position: [0, dims.height - 0.04, 0], children: _jsx("boxGeometry", { args: [frontClearWidth, 0.08, 0.04] }) }), supportPostRequired ? (_jsxs(_Fragment, { children: [_jsx("mesh", { material: frameMaterial, position: [0, dims.height / 2, 0], children: _jsx("boxGeometry", { args: [centerPostThickness, dims.height, 0.04] }) }), [-frontClearWidth / 2, -centerPostThickness / 2, centerPostThickness / 2, frontClearWidth / 2].map((x, index) => (_jsx("mesh", { material: frameMaterial, position: [x, dims.height / 2, 0], children: _jsx("boxGeometry", { args: [0.05, dims.height, 0.04] }) }, `front-frame-support-${index}`))), (() => {
                                    const bayWidth = (frontClearWidth - centerPostThickness) / 2;
                                    const panelHeight = dims.height - 0.1;
                                    const splitBayFixedCount = bayWidth > 3 ? 4 : bayWidth > 2 ? 3 : 2;
                                    const doorCenters = [
                                        -centerPostThickness / 2 - bayWidth / 2,
                                        centerPostThickness / 2 + bayWidth / 2,
                                    ];
                                    const splitTypes = [enclosures.frontLeft, enclosures.frontRight];
                                    const stackSides = ['left', 'right'];
                                    return doorCenters.map((centerX, bayIndex) => {
                                        const type = splitTypes[bayIndex];
                                        return type === 'sliding' ? (_jsx(SlidingDoorSystem, { openingWidth: bayWidth - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, progress: doorProgress[bayIndex === 0 ? 'frontLeft' : 'frontRight'], position: [centerX, dims.height / 2, 0], leafCount: splitBayLeafCount }, `front-bay-${bayIndex}`)) : type === 'bifold' ? (_jsx(BifoldDoorSystem, { openingWidth: bayWidth - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, progress: doorProgress[bayIndex === 0 ? 'frontLeft' : 'frontRight'], position: [centerX, dims.height / 2, 0], stackSide: stackSides[bayIndex], leafCount: splitBayLeafCount }, `front-bifold-bay-${bayIndex}`)) : type === 'guillotine' ? (_jsx(GuillotineGlassSystem, { openingWidth: bayWidth - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, progress: doorProgress[bayIndex === 0 ? 'frontLeft' : 'frontRight'], position: [centerX, dims.height / 2, 0] }, `front-guillotine-bay-${bayIndex}`)) : type === 'fixed' ? (_jsx(FixedGlassSystem, { openingWidth: bayWidth - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, pieceCount: splitBayFixedCount, position: [centerX, dims.height / 2, 0] }, `front-fixed-bay-${bayIndex}`)) : (_jsx("group", { position: [centerX, dims.height / 2, 0], children: _jsx(AluminiumPanelSurface, { width: bayWidth - 0.03, height: dims.height - 0.1, depth: 0.028, frameColor: frameColor }) }, `front-aluminium-bay-${bayIndex}`));
                                    });
                                })()] })) : (_jsx(_Fragment, { children: enclosures.front === 'sliding' ? (() => {
                                const panelHeight = dims.height - 0.1;
                                return (_jsx(SlidingDoorSystem, { openingWidth: frontClearWidth - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, progress: doorProgress.front, position: [0, dims.height / 2, 0], leafCount: unsplitFrontLeafCount }));
                            })() : enclosures.front === 'bifold' ? (() => {
                                const panelHeight = dims.height - 0.1;
                                return (_jsx(BifoldDoorSystem, { openingWidth: frontClearWidth - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, progress: doorProgress.front, position: [0, dims.height / 2, 0], stackSide: "left", leafCount: unsplitFrontLeafCount }));
                            })() : enclosures.front === 'guillotine' ? (() => {
                                const panelHeight = dims.height - 0.1;
                                if (dims.width > 4) {
                                    const bayWidth = (frontClearWidth - 0.05) / 2;
                                    return (_jsxs(_Fragment, { children: [_jsx("mesh", { material: frameMaterial, position: [0, dims.height / 2, 0], children: _jsx("boxGeometry", { args: [0.05, dims.height, 0.04] }) }), [-bayWidth / 2 - 0.025, bayWidth / 2 + 0.025].map((centerX, index) => (_jsx(GuillotineGlassSystem, { openingWidth: bayWidth, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, progress: doorProgress.front, position: [centerX, dims.height / 2, 0] }, `front-guillotine-${index}`)))] }));
                                }
                                return (_jsx(GuillotineGlassSystem, { openingWidth: frontClearWidth - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, progress: doorProgress.front, position: [0, dims.height / 2, 0] }));
                            })() : enclosures.front === 'fixed' ? (() => {
                                const panelHeight = dims.height - 0.1;
                                return (_jsx(FixedGlassSystem, { openingWidth: frontClearWidth - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, pieceCount: unsplitFrontFixedCount, position: [0, dims.height / 2, 0] }));
                            })() : (_jsxs(_Fragment, { children: [Array.from({ length: 4 }, (_, index) => {
                                        const x = -frontClearWidth / 2 + (index * frontClearWidth) / 3;
                                        return (_jsx("mesh", { material: frameMaterial, position: [x, dims.height / 2, 0], children: _jsx("boxGeometry", { args: [0.05, dims.height, 0.04] }) }, `front-frame-${index}`));
                                    }), _jsx("group", { position: [0, dims.height / 2, 0], children: _jsx(AluminiumPanelSurface, { width: (frontClearWidth - 0.03), height: (dims.height - 0.1), depth: 0.028, frameColor: frameColor }) })] })) }))] }));
            })() : null, supportPostRequired ? (() => {
                const frontInset = postThickness + 0.012;
                const frontClearWidth = Math.max(0.6, dims.width - frontInset * 2);
                const bayWidth = (frontClearWidth - centerPostThickness) / 2;
                const centers = [-centerPostThickness / 2 - bayWidth / 2, centerPostThickness / 2 + bayWidth / 2];
                const keys = ['frontLeft', 'frontRight'];
                return keys.map((key, index) => sideAwnings[key] ? (_jsx(VerticalRollerAwning, { width: bayWidth - 0.03, height: dims.height - 0.11, progress: awningProgress[key], position: [centers[index], dims.height - 0.045, dims.projection + 0.03], caseMaterial: frameMaterial, fabricColor: awningColor }, `awning-${key}`)) : null);
            })() : sideAwnings.front ? (_jsx(VerticalRollerAwning, { width: Math.max(0.6, dims.width - (postThickness + 0.012) * 2) - 0.03, height: dims.height - 0.11, progress: awningProgress.front, position: [0, dims.height - 0.045, dims.projection + 0.03], caseMaterial: frameMaterial, fabricColor: awningColor })) : null, ['left', 'right'].map((side) => {
                const sign = side === 'left' ? -1 : 1;
                const enclosure = enclosures[side];
                if (enclosure === 'none')
                    return null;
                const x = sign * (dims.width / 2 - 0.02);
                const sideDoor = enclosure === 'sliding' || enclosure === 'bifold' || enclosure === 'guillotine';
                const sideFixed = enclosure === 'fixed';
                const sideHeight = dims.height;
                return (_jsxs("group", { position: [x, 0, dims.projection / 2], children: [_jsx("mesh", { material: frameMaterial, position: [0, 0.04, 0], rotation: [0, Math.PI / 2, 0], children: _jsx("boxGeometry", { args: [dims.projection, 0.08, 0.04] }) }), _jsx("mesh", { material: frameMaterial, position: [0, sideHeight - 0.04, 0], rotation: [0, Math.PI / 2, 0], children: _jsx("boxGeometry", { args: [dims.projection, 0.08, 0.04] }) }), _jsx("mesh", { material: frameMaterial, position: [0, (sideHeight + backHeight) / 2, 0], rotation: [roofAngle, 0, 0], castShadow: true, children: _jsx("boxGeometry", { args: [0.04, 0.06, slopeLength] }) }), _jsx("mesh", { material: frameMaterial, position: [0, sideHeight / 2, dims.projection / 2], children: _jsx("boxGeometry", { args: [0.04, sideHeight, 0.04] }) }), _jsx("mesh", { material: frameMaterial, position: [0, backHeight / 2, -dims.projection / 2], children: _jsx("boxGeometry", { args: [0.04, backHeight, 0.04] }) }), sideDoor ? (() => {
                            const panelHeight = sideHeight - 0.1;
                            return enclosure === 'sliding' ? (_jsx(SlidingDoorSystem, { openingWidth: dims.projection - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, progress: doorProgress[side], position: [0, sideHeight / 2, 0], rotation: [0, Math.PI / 2, 0], leafCount: sideLeafCount })) : enclosure === 'bifold' ? (_jsx(BifoldDoorSystem, { openingWidth: dims.projection - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, progress: doorProgress[side], position: [0, sideHeight / 2, 0], rotation: [0, Math.PI / 2, 0], stackSide: side === 'left' ? 'right' : 'right', foldOutward: side === 'left', leafCount: sideLeafCount })) : (_jsx(GuillotineGlassSystem, { openingWidth: dims.projection - 0.02, panelHeight: panelHeight, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, progress: doorProgress[side], position: [0, sideHeight / 2, 0], rotation: [0, Math.PI / 2, 0] }));
                        })() : sideFixed ? (_jsx(FixedGlassSystem, { openingWidth: dims.projection - 0.02, panelHeight: sideHeight - 0.1, frameMaterial: frameMaterial, glassTintMaterial: glassMaterial, pieceCount: sideFixedCount, position: [0, sideHeight / 2, 0], rotation: [0, Math.PI / 2, 0] })) : (_jsx("group", { position: [0, sideHeight / 2, 0], children: _jsx(AluminiumPanelSurface, { width: dims.projection - 0.09, height: sideHeight - 0.12, depth: 0.024, frameColor: frameColor, rotation: [0, side === 'left' ? -Math.PI / 2 : Math.PI / 2, 0] }) })), sideAwnings[side] ? (_jsx(VerticalRollerAwning, { width: dims.projection - 0.03, height: sideHeight - 0.11, progress: awningProgress[side], position: [sign * 0.03, sideHeight - 0.045, 0], rotation: [0, Math.PI / 2, 0], caseMaterial: frameMaterial, fabricColor: awningColor })) : null, !flatPergolaRoof ? (_jsx(WedgePanel, { side: side, projection: dims.projection, sideHeight: sideHeight, backHeight: backHeight, material: wedgeSurfaceMaterial, frameColor: frameColor, aluminium: enclosure === 'aluminium' })) : null] }, side));
            }), showDimensions ? (_jsxs(_Fragment, { children: [_jsx(DimensionLine, { start: [-dims.width / 2, measureGroundY, overallWidthLineZ], end: [dims.width / 2, measureGroundY, overallWidthLineZ], guideStart: [-dims.width / 2, measureGroundY, dims.projection], guideEnd: [dims.width / 2, measureGroundY, dims.projection], markerAxis: "z", label: formatDimensionLabel('Genişlik', dims.width), labelOffset: [0, 0.01, 0.15], labelFlatOnGround: true, labelFontSizePx: dimensionLabelFontSizePx }), supportPostRequired ? (_jsxs(_Fragment, { children: [_jsx(DimensionLine, { start: [-frontClearWidth / 2, measureGroundY, splitWidthLineZ], end: [-centerPostThickness / 2, measureGroundY, splitWidthLineZ], guideStart: [-frontClearWidth / 2, measureGroundY, dims.projection], guideEnd: [-centerPostThickness / 2, measureGroundY, dims.projection], markerAxis: "z", label: formatDimensionLabel('Ön Genişlik 1', splitBayWidth), labelOffset: [0, 0.01, 0.13], labelFlatOnGround: true, labelFontSizePx: dimensionLabelFontSizePx }), _jsx(DimensionLine, { start: [centerPostThickness / 2, measureGroundY, splitWidthLineZ], end: [frontClearWidth / 2, measureGroundY, splitWidthLineZ], guideStart: [centerPostThickness / 2, measureGroundY, dims.projection], guideEnd: [frontClearWidth / 2, measureGroundY, dims.projection], markerAxis: "z", label: formatDimensionLabel('Ön Genişlik 2', splitBayWidth), labelOffset: [0, 0.01, 0.13], labelFlatOnGround: true, labelFontSizePx: dimensionLabelFontSizePx })] })) : (_jsx(DimensionLine, { start: [-frontClearWidth / 2, measureGroundY, splitWidthLineZ], end: [frontClearWidth / 2, measureGroundY, splitWidthLineZ], guideStart: [-frontClearWidth / 2, measureGroundY, dims.projection], guideEnd: [frontClearWidth / 2, measureGroundY, dims.projection], markerAxis: "z", label: formatDimensionLabel('Ön Genişlik', frontClearWidth), labelOffset: [0, 0.014, 0], labelFlatOnGround: true, labelFontSizePx: dimensionLabelFontSizePx })), _jsx(DimensionLine, { start: [depthLineX, measureGroundY, 0], end: [depthLineX, measureGroundY, dims.projection], guideStart: [dims.width / 2, measureGroundY, 0], guideEnd: [dims.width / 2, measureGroundY, dims.projection], markerAxis: "x", label: formatDimensionLabel('Derinlik', dims.projection), labelOffset: [0.12, 0.014, 0], labelFlatOnGround: true, labelFontSizePx: dimensionLabelFontSizePx }), _jsx(DimensionLine, { start: [frontHeightLineX, 0, dims.projection], end: [frontHeightLineX, dims.height, dims.projection], guideStart: [dims.width / 2, 0, dims.projection], guideEnd: [dims.width / 2, dims.height, dims.projection], markerAxis: "x", label: formatDimensionLabel('Net Yükseklik', dims.height), labelOffset: [0.24, 0, 0], labelRotationDeg: 0, labelFontSizePx: dimensionLabelFontSizePx }), _jsx(DimensionLine, { start: [rearHeightLineX, 0, 0], end: [rearHeightLineX, backHeight, 0], guideStart: [-dims.width / 2, 0, 0], guideEnd: [-dims.width / 2, backHeight, 0], markerAxis: "x", label: formatDimensionLabel('Arka Yükseklik', backHeight), labelOffset: [-0.24, 0, 0], labelRotationDeg: 0, labelFontSizePx: dimensionLabelFontSizePx }), _jsx(DimensionLine, { start: [roofSpanLineX, 0, 0], end: [roofSpanLineX, backHeight, 0], guideStart: [dims.width / 2, 0, 0], guideEnd: [dims.width / 2, backHeight, 0], markerAxis: "x", label: formatDimensionLabel('Toplam Yükseklik', backHeight), labelOffset: [0.28, 0, 0], labelRotationDeg: 0, labelFontSizePx: dimensionLabelFontSizePx })] })) : null] }));
}
function SceneContents(props) {
    const background = props.nightMode ? '#0f1419' : '#edf1f2';
    const orbitMinDistance = props.isMobileView ? 5.2 : 4.5;
    const orbitMaxDistance = props.isMobileView ? 12.2 : 11;
    const orbitTargetY = props.isMobileView ? 1.15 : 1.25;
    const isArPreview = props.sceneMode === 'ar-preview';
    const controlsRef = useRef(null);
    const previewBasePosition = isArPreview ? [-(VERANDA_LEFT_ANCHOR_X + props.animated.width / 2), 0, -0.16] : [0, 0, 0];
    const modelOffset = props.modelTransform?.position ?? [0, 0, 0];
    const modelPosition = [
        previewBasePosition[0] + modelOffset[0],
        previewBasePosition[1] + modelOffset[1],
        previewBasePosition[2] + modelOffset[2],
    ];
    const modelRotationY = props.modelTransform?.rotationY ?? 0;
    const modelScale = props.modelTransform?.scale ?? 1;
    useEffect(() => {
        props.runtimeRef.current.controls = controlsRef.current;
        return () => {
            if (props.runtimeRef.current.controls === controlsRef.current) {
                props.runtimeRef.current.controls = null;
            }
        };
    }, [props.runtimeRef]);
    return (_jsxs(_Fragment, { children: [!isArPreview ? _jsx("color", { attach: "background", args: [background] }) : null, _jsx(SceneCaptureBridge, { runtimeRef: props.runtimeRef }), _jsx(RendererQuality, { isArPreview: isArPreview }), _jsx("ambientLight", { intensity: isArPreview ? 1.38 : props.nightMode ? 0.24 : 1.3, color: props.nightMode ? '#b9c3d0' : '#ffffff' }), _jsx("directionalLight", { position: [5.5, 7.5, 6], intensity: isArPreview ? 1.22 : props.nightMode ? 0.22 : 1.1, color: props.nightMode ? '#aebbd0' : '#ffffff', castShadow: true, "shadow-mapSize-width": props.isMobileView ? 2048 : 3072, "shadow-mapSize-height": props.isMobileView ? 2048 : 3072, "shadow-bias": -0.00018, "shadow-normalBias": 0.02, "shadow-camera-near": 1, "shadow-camera-far": 22, "shadow-camera-left": -10, "shadow-camera-right": 10, "shadow-camera-top": 10, "shadow-camera-bottom": -10 }), _jsx("directionalLight", { position: [-4, 5, -2], intensity: isArPreview ? 0.34 : props.nightMode ? 0.12 : 0.25, color: props.nightMode ? '#6d7f97' : '#dbe6ea' }), !isArPreview ? (_jsx(Suspense, { fallback: null, children: _jsx(HouseEnvironment, {}) })) : null, _jsx("group", { position: modelPosition, rotation: [0, modelRotationY, 0], scale: modelScale, children: _jsx(VerandaModel, { dims: props.animated, roofMaterial: props.roofMaterial, wedgeMaterial: props.wedgeMaterial, frameColor: props.frameColor, pergolaColor: props.pergolaColor, enclosures: props.enclosures, lightsEnabled: props.lightsEnabled, lightTemperature: props.lightTemperature, nightMode: props.nightMode, doorsOpen: props.doorsOpen, awningsOpen: props.awningsOpen, roofOpen: props.roofOpen, doorOpenStates: props.doorOpenStates, awningOpenStates: props.awningOpenStates, roofAwningEnabled: props.roofAwningEnabled, sideAwnings: props.sideAwnings, awningColor: props.awningColor, isMobileView: props.isMobileView, showDimensions: !isArPreview && (props.measurementsVisible ?? true) }) }), !isArPreview ? (_jsx(OrbitControls, { ref: controlsRef, makeDefault: true, enablePan: true, enableDamping: true, dampingFactor: 0.08, minDistance: orbitMinDistance, maxDistance: orbitMaxDistance, maxPolarAngle: Math.PI / 2 - 0.03, minPolarAngle: 0.12, minAzimuthAngle: -1.1, maxAzimuthAngle: 1.1, target: [VERANDA_LEFT_ANCHOR_X + props.animated.width / 2, orbitTargetY, 1.15] })) : null] }));
}
const VerandaScene = forwardRef(function VerandaScene(props, ref) {
    const animated = useAnimatedDimensions(props.target);
    const [isMobileView, setIsMobileView] = useState(false);
    const runtimeRef = useRef({
        camera: null,
        controls: null,
        gl: null,
        scene: null,
        transitionFrame: null,
        transitionToken: 0,
    });
    useEffect(() => {
        const media = window.matchMedia('(max-width: 768px)');
        const update = () => setIsMobileView(media.matches);
        update();
        media.addEventListener?.('change', update);
        return () => media.removeEventListener?.('change', update);
    }, []);
    useEffect(() => () => {
        if (runtimeRef.current.transitionFrame !== null) {
            cancelAnimationFrame(runtimeRef.current.transitionFrame);
        }
        runtimeRef.current.transitionToken += 1;
    }, []);
    const sceneMode = props.sceneMode ?? 'default';
    const mobileCamera = { position: [6.35, 3.8, 6.85], fov: 40 };
    const desktopCamera = { position: [5.8, 3.4, 6.2], fov: 34 };
    const arPreviewCamera = { position: [0.1, 2.05, 6.6], fov: 30 };
    const activeCamera = sceneMode === 'ar-preview' ? arPreviewCamera : isMobileView ? mobileCamera : desktopCamera;
    useImperativeHandle(ref, () => {
        const cancelTransition = () => {
            if (runtimeRef.current.transitionFrame !== null) {
                cancelAnimationFrame(runtimeRef.current.transitionFrame);
                runtimeRef.current.transitionFrame = null;
            }
            runtimeRef.current.transitionToken += 1;
        };
        const moveCamera = async (state, options) => {
            const currentRuntime = runtimeRef.current;
            const defaultTarget = getOrbitTarget(animated, isMobileView);
            const fromState = getRuntimeCameraState(currentRuntime, defaultTarget);
            if (!fromState)
                return;
            cancelTransition();
            if (options?.immediate || !options?.durationMs) {
                applyRuntimeCameraState(currentRuntime, state);
                await waitForFrame();
                return;
            }
            const token = runtimeRef.current.transitionToken;
            const durationMs = Math.max(120, options.durationMs);
            const startTime = performance.now();
            await new Promise((resolve) => {
                const step = (now) => {
                    if (token !== runtimeRef.current.transitionToken) {
                        resolve();
                        return;
                    }
                    const progress = easeInOutCubic(clampProgress((now - startTime) / durationMs));
                    applyRuntimeCameraState(runtimeRef.current, {
                        position: [
                            THREE.MathUtils.lerp(fromState.position[0], state.position[0], progress),
                            THREE.MathUtils.lerp(fromState.position[1], state.position[1], progress),
                            THREE.MathUtils.lerp(fromState.position[2], state.position[2], progress),
                        ],
                        target: [
                            THREE.MathUtils.lerp(fromState.target[0], state.target[0], progress),
                            THREE.MathUtils.lerp(fromState.target[1], state.target[1], progress),
                            THREE.MathUtils.lerp(fromState.target[2], state.target[2], progress),
                        ],
                    });
                    if (progress >= 1) {
                        runtimeRef.current.transitionFrame = null;
                        resolve();
                        return;
                    }
                    runtimeRef.current.transitionFrame = requestAnimationFrame(step);
                };
                runtimeRef.current.transitionFrame = requestAnimationFrame(step);
            });
            await waitForFrame();
        };
        return {
            getCameraState: () => getRuntimeCameraState(runtimeRef.current, getOrbitTarget(animated, isMobileView)),
            getCanvas: () => runtimeRef.current.gl?.domElement ?? null,
            moveToView: (view, options) => moveCamera(getCaptureViewState(view, animated, isMobileView), options),
            restoreCameraState: (state, options) => moveCamera(state, options),
            captureBlob: async (options) => {
                const canvas = runtimeRef.current.gl?.domElement;
                if (!canvas) {
                    throw new Error('Sahne henüz hazır değil.');
                }
                await waitForFrame();
                if (options?.waitMs) {
                    await sleep(options.waitMs);
                }
                renderRuntimeScene(runtimeRef.current);
                const blob = await new Promise((resolve) => {
                    canvas.toBlob(resolve, options?.type ?? 'image/png', options?.quality ?? 1);
                });
                if (!blob) {
                    throw new Error('Sahne görseli yakalanamadı.');
                }
                return blob;
            },
            getCanvasStream: (fps = 30) => runtimeRef.current.gl?.domElement.captureStream?.(fps) ?? null,
        };
    }, [animated, isMobileView]);
    return (_jsx("div", { className: "h-full w-full", children: _jsxs(Canvas, { shadows: true, dpr: sceneMode === 'ar-preview' ? [1.25, 2] : isMobileView ? [1.25, 2.1] : [1.5, 2.6], camera: activeCamera, gl: { antialias: true, alpha: sceneMode === 'ar-preview', powerPreference: 'high-performance', preserveDrawingBuffer: true }, onCreated: ({ gl }) => {
                if (sceneMode === 'ar-preview')
                    gl.setClearColor(0x000000, 0);
            }, children: [_jsx(SceneContents, { ...props, sceneMode: sceneMode, animated: animated, isMobileView: isMobileView, runtimeRef: runtimeRef }), _jsx(Preload, { all: true })] }) }));
});
VerandaScene.displayName = 'VerandaScene';
export default VerandaScene;
