import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#dbe7ea',
    transparent: true,
    opacity: 0.38,
    transmission: 0.86,
    roughness: 0.16,
    metalness: 0.02,
    thickness: 0.012,
    ior: 1.45,
    side: THREE.DoubleSide,
});
const warmDeckMaterial = new THREE.MeshStandardMaterial({
    color: '#c8b399',
    roughness: 0.95,
    metalness: 0.02,
});
const polyMaterial = new THREE.MeshStandardMaterial({
    color: '#8f9aa1',
    transparent: true,
    opacity: 0.82,
    roughness: 0.8,
    metalness: 0.08,
});
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const isPergolaRoofMaterial = (type) => type === 'fabric' || type === 'bioclimatic' || type === 'lux-bioclimatic';
const isFlatPergolaRoofMaterial = (type) => type === 'bioclimatic' || type === 'lux-bioclimatic';
const sideFixedGlassCount = (length) => (length > 3 ? 4 : length > 2 ? 3 : 2);
const frontFixedGlassCount = (length) => (length > 4 ? 5 : length > 3 ? 4 : length > 2 ? 3 : 2);
function addMesh(parent, geometry, material, position, rotation) {
    const mesh = new THREE.Mesh(geometry, material);
    if (position)
        mesh.position.set(...position);
    if (rotation)
        mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
}
function addBox(parent, size, position, material, rotation) {
    return addMesh(parent, new THREE.BoxGeometry(...size), material, position, rotation);
}
function makePanelMaterials(frameColor) {
    const base = new THREE.Color(frameColor);
    const groove = base.clone().lerp(new THREE.Color('#101417'), 0.18);
    const edge = base.clone().lerp(new THREE.Color('#ffffff'), 0.06);
    return {
        base: new THREE.MeshStandardMaterial({ color: base, roughness: 0.78, metalness: 0.18 }),
        groove: new THREE.MeshStandardMaterial({ color: groove, roughness: 0.82, metalness: 0.16 }),
        edge: new THREE.MeshStandardMaterial({ color: edge, roughness: 0.72, metalness: 0.2 }),
    };
}
function createFrameMaterial(color) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.26 });
}
function addAluminiumPanelSurface(parent, width, height, depth, frameColor, position, rotation) {
    const group = new THREE.Group();
    group.position.set(...position);
    if (rotation)
        group.rotation.set(...rotation);
    parent.add(group);
    const materials = makePanelMaterials(frameColor);
    const grooveCount = Math.max(5, Math.floor(height / 0.18));
    const grooveSpacing = height / grooveCount;
    const grooveDepth = Math.min(depth * 0.5, 0.008);
    addBox(group, [width, height, depth], [0, 0, 0], materials.base);
    addBox(group, [width * 0.995, 0.018, 0.002], [0, height / 2 - 0.03, depth / 2 + 0.001], materials.edge);
    addBox(group, [width * 0.995, 0.018, 0.002], [0, -height / 2 + 0.03, depth / 2 + 0.001], materials.edge);
    for (let i = 1; i < grooveCount; i += 1) {
        const y = -height / 2 + i * grooveSpacing;
        addBox(group, [width * 0.992, 0.008, grooveDepth], [0, y, depth / 2 + 0.0008], materials.groove);
    }
    return group;
}
function addRoofAluminiumPanel(parent, width, length, thickness, frameColor, position, rotation) {
    const materials = makePanelMaterials(frameColor);
    const group = new THREE.Group();
    group.position.set(...position);
    group.rotation.set(...rotation);
    parent.add(group);
    addBox(group, [width, thickness, length], [0, 0, 0], materials.base);
    addBox(group, [width * 0.995, 0.003, length * 0.996], [0, thickness / 2 + 0.0008, 0], materials.edge);
    const ribCount = Math.max(2, Math.floor(width / 0.22));
    const ribSpacing = width / (ribCount + 1);
    for (let i = 0; i < ribCount; i += 1) {
        const x = -width / 2 + ribSpacing * (i + 1);
        addBox(group, [0.016, 0.004, length * 0.985], [x, thickness / 2 + 0.003, 0], materials.groove);
        addBox(group, [0.009, 0.003, length * 0.982], [x, thickness / 2 + 0.0065, 0], materials.edge);
    }
    addBox(group, [width * 0.996, thickness * 0.9, 0.01], [0, 0, length / 2 - 0.006], materials.edge);
    addBox(group, [width * 0.996, thickness * 0.9, 0.01], [0, 0, -length / 2 + 0.006], materials.edge);
    return group;
}
function addSlidingDoorLeaf(parent, panelWidth, panelHeight, depth, frameMaterial, position, rotation) {
    const group = new THREE.Group();
    group.position.set(...position);
    if (rotation)
        group.rotation.set(...rotation);
    parent.add(group);
    const stile = Math.min(0.03, Math.max(0.02, panelWidth * 0.08));
    const rail = 0.028;
    const glassWidth = Math.max(0.12, panelWidth - stile * 2 - 0.012);
    const glassHeight = Math.max(0.18, panelHeight - rail * 2 - 0.012);
    const glassDepth = Math.max(0.01, depth * 0.55);
    addBox(group, [glassWidth, glassHeight, glassDepth], [0, 0, 0], glassMaterial);
    addBox(group, [stile, panelHeight, depth], [-panelWidth / 2 + stile / 2, 0, 0], frameMaterial);
    addBox(group, [stile, panelHeight, depth], [panelWidth / 2 - stile / 2, 0, 0], frameMaterial);
    addBox(group, [panelWidth, rail, depth], [0, panelHeight / 2 - rail / 2, 0], frameMaterial);
    addBox(group, [panelWidth, rail, depth], [0, -panelHeight / 2 + rail / 2, 0], frameMaterial);
    return group;
}
function addFixedGlassSection(parent, sectionWidth, panelHeight, depth, frameMaterial, position) {
    const group = new THREE.Group();
    group.position.set(...position);
    parent.add(group);
    const stile = Math.min(0.032, Math.max(0.024, sectionWidth * 0.08));
    const outerRail = 0.03;
    const innerRail = 0.024;
    const glassWidth = Math.max(0.12, sectionWidth - stile * 2 - 0.012);
    const cellHeight = Math.max(0.18, (panelHeight - outerRail * 2 - innerRail * 2 - 0.016) / 3);
    const glassDepth = Math.max(0.01, depth * 0.52);
    const innerOffset = cellHeight + innerRail;
    [-innerOffset, 0, innerOffset].forEach((y) => {
        addBox(group, [glassWidth, cellHeight, glassDepth], [0, y, 0], glassMaterial);
    });
    addBox(group, [stile, panelHeight, depth], [-sectionWidth / 2 + stile / 2, 0, 0], frameMaterial);
    addBox(group, [stile, panelHeight, depth], [sectionWidth / 2 - stile / 2, 0, 0], frameMaterial);
    addBox(group, [sectionWidth, outerRail, depth], [0, panelHeight / 2 - outerRail / 2, 0], frameMaterial);
    addBox(group, [sectionWidth, outerRail, depth], [0, -panelHeight / 2 + outerRail / 2, 0], frameMaterial);
    addBox(group, [sectionWidth - stile * 0.4, innerRail, depth * 0.9], [0, innerOffset / 2, 0], frameMaterial);
    addBox(group, [sectionWidth - stile * 0.4, innerRail, depth * 0.9], [0, -innerOffset / 2, 0], frameMaterial);
    return group;
}
function addFixedGlassSystem(parent, openingWidth, panelHeight, frameMaterial, pieceCount, position, rotation, depth = 0.03) {
    const group = new THREE.Group();
    group.position.set(...position);
    if (rotation)
        group.rotation.set(...rotation);
    parent.add(group);
    const frameInset = 0.032;
    const clearWidth = Math.max(0.48, openingWidth - frameInset * 2);
    const safePieceCount = Math.max(2, pieceCount);
    const mullionWidth = Math.min(0.038, Math.max(0.026, clearWidth * 0.015));
    const sectionWidth = (clearWidth - mullionWidth * (safePieceCount - 1)) / safePieceCount;
    addBox(group, [openingWidth, 0.02, depth], [0, panelHeight / 2 + 0.036, 0], frameMaterial);
    addBox(group, [openingWidth, 0.02, depth], [0, -panelHeight / 2 - 0.036, 0], frameMaterial);
    addBox(group, [frameInset, panelHeight + 0.072, depth], [-openingWidth / 2 + frameInset / 2, 0, 0], frameMaterial);
    addBox(group, [frameInset, panelHeight + 0.072, depth], [openingWidth / 2 - frameInset / 2, 0, 0], frameMaterial);
    for (let i = 0; i < safePieceCount; i += 1) {
        const x = -clearWidth / 2 + sectionWidth / 2 + i * (sectionWidth + mullionWidth);
        addFixedGlassSection(group, sectionWidth, panelHeight, depth, frameMaterial, [x, 0, 0]);
        if (i < safePieceCount - 1) {
            addBox(group, [mullionWidth, panelHeight, depth], [x + sectionWidth / 2 + mullionWidth / 2, 0, 0], frameMaterial);
        }
    }
    return group;
}
function addSlidingDoorSystem(parent, openingWidth, panelHeight, frameMaterial, progress, position, rotation, depth = 0.03, leafCount = 3) {
    const group = new THREE.Group();
    group.position.set(...position);
    if (rotation)
        group.rotation.set(...rotation);
    parent.add(group);
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
    for (const offset of layerOffsets) {
        addBox(group, [openingWidth, 0.018, 0.014], [0, panelHeight / 2 + 0.036, offset], frameMaterial);
        addBox(group, [openingWidth, 0.018, 0.014], [0, -panelHeight / 2 - 0.036, offset], frameMaterial);
    }
    addBox(group, [frameInset, panelHeight + 0.072, depth], [-openingWidth / 2 + frameInset / 2, 0, 0], frameMaterial);
    addBox(group, [frameInset, panelHeight + 0.072, depth], [openingWidth / 2 - frameInset / 2, 0, 0], frameMaterial);
    for (let i = 0; i < safeLeafCount; i += 1) {
        const x = THREE.MathUtils.lerp(closedCenters[i], openCenters[i], progress);
        addSlidingDoorLeaf(group, panelWidth, panelHeight, depth, frameMaterial, [x, 0, layerOffsets[i]]);
    }
    return group;
}
function addBifoldDoorLeaf(parent, panelWidth, panelHeight, depth, frameMaterial, hingeSide, position, rotation) {
    const group = new THREE.Group();
    group.position.set(...position);
    if (rotation)
        group.rotation.set(...rotation);
    parent.add(group);
    const localX = hingeSide === 'left' ? panelWidth / 2 : -panelWidth / 2;
    addSlidingDoorLeaf(group, panelWidth, panelHeight, depth, frameMaterial, [localX, 0, 0]);
    return group;
}
function addBifoldDoorChain(parent, options) {
    const { index, leafCount, leafWidth, panelHeight, depth, frameMaterial, progress, isLeft, sideSign, foldSign } = options;
    const group = new THREE.Group();
    parent.add(group);
    const magnitude = index === 0 ? 84 : index % 2 === 1 ? 168 : 152;
    const direction = isLeft ? (index % 2 === 0 ? -1 : 1) : index % 2 === 0 ? 1 : -1;
    const angle = THREE.MathUtils.degToRad(magnitude) * direction * progress * foldSign;
    const stackDepth = Math.max(0.012, depth * 0.62) * progress * foldSign;
    const stackLift = 0.012 * progress * Math.max(1, index) * foldSign;
    group.rotation.y = angle;
    addBifoldDoorLeaf(group, leafWidth, panelHeight, depth, frameMaterial, isLeft ? 'left' : 'right', [0, 0, stackLift]);
    if (index < leafCount - 1) {
        const child = new THREE.Group();
        child.position.set(sideSign * leafWidth, 0, stackDepth);
        group.add(child);
        addBifoldDoorChain(child, { ...options, index: index + 1 });
    }
    return group;
}
function addBifoldDoorSystem(parent, openingWidth, panelHeight, frameMaterial, progress, position, rotation, depth = 0.03, stackSide = 'left', foldOutward = false, leafCount = 3) {
    const group = new THREE.Group();
    group.position.set(...position);
    if (rotation)
        group.rotation.set(...rotation);
    parent.add(group);
    const frameInset = 0.03;
    const clearWidth = Math.max(0.72, openingWidth - frameInset * 2);
    const safeLeafCount = Math.max(2, leafCount);
    const leafWidth = Math.max(0.18, clearWidth / safeLeafCount);
    const isLeft = stackSide === 'left';
    const sideSign = isLeft ? 1 : -1;
    const jambX = isLeft ? -openingWidth / 2 + frameInset : openingWidth / 2 - frameInset;
    const foldSign = foldOutward ? -1 : 1;
    addBox(group, [openingWidth, 0.018, 0.018], [0, panelHeight / 2 + 0.036, 0], frameMaterial);
    addBox(group, [openingWidth, 0.018, 0.018], [0, -panelHeight / 2 - 0.036, 0], frameMaterial);
    addBox(group, [frameInset, panelHeight + 0.072, depth], [-openingWidth / 2 + frameInset / 2, 0, 0], frameMaterial);
    addBox(group, [frameInset, panelHeight + 0.072, depth], [openingWidth / 2 - frameInset / 2, 0, 0], frameMaterial);
    const root = new THREE.Group();
    root.position.set(jambX, 0, 0);
    group.add(root);
    addBifoldDoorChain(root, { index: 0, leafCount: safeLeafCount, leafWidth, panelHeight, depth, frameMaterial, progress, isLeft, sideSign, foldSign });
    return group;
}
function addGuillotineSash(parent, panelWidth, panelHeight, depth, frameMaterial, position, zOffset = 0) {
    const group = new THREE.Group();
    group.position.set(...position);
    parent.add(group);
    const stile = Math.min(0.03, Math.max(0.022, panelWidth * 0.07));
    const rail = Math.min(0.032, Math.max(0.024, panelHeight * 0.09));
    const glassWidth = Math.max(0.12, panelWidth - stile * 2 - 0.012);
    const glassHeight = Math.max(0.14, panelHeight - rail * 2 - 0.012);
    const glassDepth = Math.max(0.01, depth * 0.55);
    addBox(group, [glassWidth, glassHeight, glassDepth], [0, 0, zOffset], glassMaterial);
    addBox(group, [stile, panelHeight, depth], [-panelWidth / 2 + stile / 2, 0, zOffset], frameMaterial);
    addBox(group, [stile, panelHeight, depth], [panelWidth / 2 - stile / 2, 0, zOffset], frameMaterial);
    addBox(group, [panelWidth, rail, depth], [0, panelHeight / 2 - rail / 2, zOffset], frameMaterial);
    addBox(group, [panelWidth, rail, depth], [0, -panelHeight / 2 + rail / 2, zOffset], frameMaterial);
    return group;
}
function addGuillotineGlassSystem(parent, openingWidth, panelHeight, frameMaterial, progress, position, rotation, depth = 0.032) {
    const group = new THREE.Group();
    group.position.set(...position);
    if (rotation)
        group.rotation.set(...rotation);
    parent.add(group);
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
    const middleStackOffset = sashHeight * 0.002;
    const topStackOffset = sashHeight * 0.014;
    const openBotY = closedBotY;
    const openMidY = openBotY + middleStackOffset;
    const openTopY = openBotY + topStackOffset;
    const topY = THREE.MathUtils.lerp(closedTopY, openTopY, progress);
    const midY = THREE.MathUtils.lerp(closedMidY, openMidY, progress);
    const botY = openBotY;
    addBox(group, [openingWidth, 0.018, depth], [0, clearHeight / 2 + 0.036, 0], frameMaterial);
    addBox(group, [openingWidth, 0.018, depth], [0, -clearHeight / 2 - 0.036, 0], frameMaterial);
    addBox(group, [sideFrameWidth, clearHeight + 0.072, depth], [-openingWidth / 2 + sideFrameWidth / 2, 0, 0], frameMaterial);
    addBox(group, [sideFrameWidth, clearHeight + 0.072, depth], [openingWidth / 2 - sideFrameWidth / 2, 0, 0], frameMaterial);
    addBox(group, [clearWidth, 0.01, trackDepth], [0, clearHeight / 2 + 0.002, 0], frameMaterial);
    addBox(group, [clearWidth, 0.01, trackDepth], [0, -clearHeight / 2 - 0.002, 0], frameMaterial);
    addGuillotineSash(group, clearWidth, sashHeight, depth, frameMaterial, [0, topY, -trackDepth * 0.55 * progress]);
    addGuillotineSash(group, clearWidth, sashHeight, depth, frameMaterial, [0, midY, 0]);
    addGuillotineSash(group, clearWidth, sashHeight, depth, frameMaterial, [0, botY, trackDepth * 0.2 * progress]);
    return group;
}
function addWedgePanel(parent, side, projection, sideHeight, backHeight, material, frameColor, aluminium, position) {
    const sign = side === 'left' ? -1 : 1;
    const rise = Math.max(0.18, backHeight - sideHeight);
    const inset = 0.06;
    const wedgeDepth = 0.018;
    const wedgeZ = -projection / 2 + inset / 2;
    const leftInnerOffset = side === 'left' ? -wedgeDepth : 0;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(projection - inset, 0);
    shape.lineTo(0, rise);
    shape.closePath();
    const group = new THREE.Group();
    group.position.set(position[0] + 0.012 * sign, position[1] + sideHeight + 0.01, position[2] + wedgeZ);
    group.rotation.set(0, -Math.PI / 2, 0);
    parent.add(group);
    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, { depth: wedgeDepth, bevelEnabled: false });
    const materials = makePanelMaterials(frameColor);
    addMesh(group, extrudeGeometry, aluminium ? materials.base : material, [0, 0, leftInnerOffset]);
    if (aluminium) {
        const wedgeWidth = projection - inset;
        const wedgeHeight = rise;
        const grooveCount = Math.max(2, Math.floor(wedgeHeight / 0.18));
        for (let i = 0; i < grooveCount; i += 1) {
            const y = (wedgeHeight / (grooveCount + 1)) * (i + 1);
            const lineWidth = Math.max(0.12, wedgeWidth * (1 - y / wedgeHeight) - 0.02);
            if (lineWidth <= 0.08)
                continue;
            addBox(group, [lineWidth, 0.008, 0.003], [lineWidth / 2 - 0.01, y, 0.0195 + leftInnerOffset], materials.groove);
        }
    }
    return group;
}
function addRoofLights(parent, width, projection, backHeight, frontHeight, panelCount, warm, zOffset = 0) {
    const bezelMaterial = new THREE.MeshStandardMaterial({
        color: '#1f2428',
        roughness: 0.42,
        metalness: 0.55,
    });
    const lensMaterial = new THREE.MeshStandardMaterial({
        color: warm ? '#f8ebcf' : '#f1f5f6',
        emissive: warm ? '#f2dcaf' : '#e6eef2',
        emissiveIntensity: 0.72,
        transparent: true,
        opacity: 0.9,
    });
    const rafterPositions = Array.from({ length: Math.max(1, panelCount - 1) }, (_, index) => -width / 2 + ((index + 1) * width) / panelCount);
    const z = zOffset + projection * 0.56;
    const y = THREE.MathUtils.lerp(backHeight, frontHeight, (z - zOffset) / projection) - 0.06;
    const faceRotation = [Math.PI / 2 + Math.atan2(backHeight - frontHeight, projection), 0, 0];
    for (const x of rafterPositions) {
        addMesh(parent, new THREE.CylinderGeometry(0.04, 0.04, 0.012, 28), bezelMaterial, [x, y, z], faceRotation);
        addMesh(parent, new THREE.CircleGeometry(0.026, 28), lensMaterial, [x, y - 0.004, z], faceRotation);
    }
}
function addPergolaSlatLights(parent, width, z, warm) {
    const xs = [-width * 0.28, 0, width * 0.28];
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#f7f7f2', roughness: 0.42, metalness: 0.22 });
    const lensMat = new THREE.MeshStandardMaterial({
        color: warm ? '#f8ebcf' : '#f1f5f6',
        emissive: warm ? '#f2dcaf' : '#e6eef2',
        emissiveIntensity: 0.65,
        transparent: true,
        opacity: 0.94,
    });
    xs.forEach((x) => {
        addMesh(parent, new THREE.CylinderGeometry(0.014, 0.014, 0.01, 18), bodyMat, [x, -0.035, z], [Math.PI / 2, 0, 0]);
        addMesh(parent, new THREE.CircleGeometry(0.009, 18), lensMat, [x, -0.039, z], [Math.PI / 2, 0, 0]);
    });
}
function addFabricPergolaRoof(parent, width, slopeLength, progress, position, rotation, frameMaterial, lightsEnabled, warm) {
    const group = new THREE.Group();
    group.position.set(...position);
    group.rotation.set(...rotation);
    parent.add(group);
    const fabricMaterial = new THREE.MeshStandardMaterial({ color: '#f1eee3', roughness: 0.96, metalness: 0.02, side: THREE.DoubleSide });
    const supportMaterial = new THREE.MeshStandardMaterial({ color: '#e5e1d3', roughness: 0.86, metalness: 0.08 });
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
    addBox(group, [usableWidth + 0.06, 0.055, 0.12], [0, 0.035, startZ + 0.06], frameMaterial);
    for (let i = 0; i < foldCount; i += 1) {
        const z0 = barPositions[i];
        const z1 = barPositions[i + 1];
        const segmentLength = Math.max(0.035, z1 - z0 - 0.008);
        const segmentZ = (z0 + z1) / 2;
        const segmentY = progress > 0.01 ? -0.007 - (i % 2 === 0 ? 0.002 : 0.007) * progress : -0.009;
        addBox(group, [usableWidth, 0.012, segmentLength], [0, segmentY, segmentZ], fabricMaterial);
    }
    barPositions.forEach((z, index) => {
        const radius = index === foldCount ? 0.018 : 0.012;
        addMesh(group, new THREE.CylinderGeometry(radius, radius, usableWidth, 20), index === foldCount ? frameMaterial : supportMaterial, [0, index === foldCount ? -0.002 : -0.008, z], [0, 0, Math.PI / 2]);
        if (lightsEnabled && index > 0 && index < foldCount)
            addPergolaSlatLights(group, usableWidth, z, warm);
    });
}
function addBioclimaticPergolaRoof(parent, width, projection, progress, position, frameMaterial, slatColor, lightsEnabled, warm, lux) {
    const group = new THREE.Group();
    group.position.set(...position);
    parent.add(group);
    const slatMaterial = new THREE.MeshStandardMaterial({ color: slatColor, roughness: 0.5, metalness: 0.35 });
    const slatEdgeMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(slatColor).lerp(new THREE.Color('#ffffff'), 0.08), roughness: 0.42, metalness: 0.4 });
    const usableWidth = Math.max(0.48, width - 0.14);
    const usableLength = Math.max(0.8, projection - 0.16);
    const slatCount = Math.max(12, Math.min(26, Math.round(usableLength / 0.14)));
    const pitch = usableLength / slatCount;
    const slatDepth = Math.max(0.065, pitch - 0.008);
    const startZ = -usableLength / 2 + pitch / 2;
    const tiltPhase = lux ? Math.min(1, progress / 0.62) : progress;
    const slidePhase = lux && progress > 0.62 ? (progress - 0.62) / 0.38 : 0;
    const openAngle = tiltPhase * 1.2;
    const clusterPitch = 0.028;
    const clusterStart = -usableLength / 2 + slatDepth * 0.6;
    for (let i = 0; i < slatCount; i += 1) {
        const closedZ = startZ + i * pitch;
        const openZ = clusterStart + i * clusterPitch;
        const z = THREE.MathUtils.lerp(closedZ, openZ, slidePhase);
        const slatGroup = new THREE.Group();
        slatGroup.position.set(0, 0, z);
        slatGroup.rotation.x = openAngle;
        group.add(slatGroup);
        addBox(slatGroup, [usableWidth, 0.03, slatDepth], [0, 0, 0], slatMaterial);
        addBox(slatGroup, [usableWidth * 0.985, 0.004, slatDepth * 0.94], [0, 0.017, 0], slatEdgeMaterial);
        if (lightsEnabled && i % 3 === 1)
            addPergolaSlatLights(slatGroup, usableWidth, 0, warm);
    }
    addBox(group, [usableWidth + 0.05, 0.04, 0.05], [0, 0.02, -usableLength / 2 - 0.02], frameMaterial);
    addBox(group, [usableWidth + 0.05, 0.04, 0.05], [0, 0.02, usableLength / 2 + 0.02], frameMaterial);
}
function addRetractableRoofAwning(parent, width, slopeLength, progress, position, rotation, caseMaterial, fabricColor) {
    const group = new THREE.Group();
    group.position.set(...position);
    group.rotation.set(...rotation);
    parent.add(group);
    const fabricMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(fabricColor).multiplyScalar(0.82),
        roughness: 0.86,
        metalness: 0.03,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
    });
    const barMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(fabricColor).lerp(new THREE.Color('#0f1317'), 0.12),
        roughness: 0.72,
        metalness: 0.12,
    });
    const usableWidth = Math.max(0.46, width - 0.16);
    const usableLength = Math.max(0.72, slopeLength - 0.16);
    const startZ = -usableLength / 2;
    const minVisibleLength = Math.min(Math.max(0.18, usableLength * 0.08), 0.34);
    const visibleLength = THREE.MathUtils.lerp(usableLength, minVisibleLength, progress);
    const frontEdgeZ = startZ + visibleLength;
    const sheetZ = startZ + visibleLength / 2;
    addBox(group, [usableWidth + 0.08, 0.09, 0.11], [0, 0, startZ + 0.055], caseMaterial);
    if (visibleLength > 0.03) {
        addBox(group, [Math.max(0.08, usableWidth - 0.028), 0.012, visibleLength], [0, -0.024, sheetZ], fabricMaterial);
        addBox(group, [Math.max(0.08, usableWidth - 0.018), 0.028, 0.036], [0, -0.024, frontEdgeZ - 0.016], barMaterial);
    }
}
function addVerticalRollerAwning(parent, width, height, progress, position, caseMaterial, fabricColor, rotation) {
    const group = new THREE.Group();
    group.position.set(...position);
    if (rotation)
        group.rotation.set(...rotation);
    parent.add(group);
    const fabricMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(fabricColor).multiplyScalar(0.82),
        roughness: 0.86,
        metalness: 0.03,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
    });
    const barMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(fabricColor).lerp(new THREE.Color('#0f1317'), 0.12),
        roughness: 0.72,
        metalness: 0.12,
    });
    const casingDepth = 0.09;
    const casingHeight = 0.09;
    const openDrop = 0.06;
    const drop = THREE.MathUtils.lerp(height, openDrop, progress);
    addBox(group, [width, casingHeight, casingDepth], [0, 0, 0], caseMaterial);
    if (drop > 0.03) {
        addBox(group, [Math.max(0.08, width - 0.028), drop, 0.012], [0, -casingHeight / 2 - drop / 2, 0], fabricMaterial);
        addBox(group, [Math.max(0.08, width - 0.018), 0.036, 0.028], [0, -casingHeight / 2 - drop + 0.018, 0], barMaterial);
    }
}
function addEnclosure(parent, type, openingWidth, panelHeight, frameColor, frameMaterial, progress, position, rotation, options) {
    switch (type) {
        case 'sliding':
            return addSlidingDoorSystem(parent, openingWidth, panelHeight, frameMaterial, progress, position, rotation, 0.03, options?.leafCount ?? 3);
        case 'bifold':
            return addBifoldDoorSystem(parent, openingWidth, panelHeight, frameMaterial, progress, position, rotation, 0.03, options?.stackSide ?? 'left', options?.foldOutward ?? false, options?.leafCount ?? 3);
        case 'guillotine':
            return addGuillotineGlassSystem(parent, openingWidth, panelHeight, frameMaterial, progress, position, rotation);
        case 'fixed':
            return addFixedGlassSystem(parent, openingWidth, panelHeight, frameMaterial, options?.fixedCount ?? 3, position, rotation);
        case 'aluminium':
            return addAluminiumPanelSurface(parent, openingWidth - 0.03, panelHeight - 0.02, 0.028, frameColor, position, rotation);
        default:
            return null;
    }
}
export function buildArVerandaModel(config) {
    const root = new THREE.Group();
    const dims = {
        width: clamp(config.target.width, 2, 7),
        projection: clamp(config.target.projection, 2, 4),
        height: clamp(config.target.height, 2, 3.5),
    };
    const frameColor = config.frameColor;
    const frameMaterial = createFrameMaterial(frameColor);
    const pergolaFrameMaterial = createFrameMaterial(config.pergolaColor);
    const postThickness = 0.085;
    const centerPostThickness = 0.115;
    const beamHeight = 0.12;
    const fixedRearRise = 0.5;
    const flatPergolaRoof = isFlatPergolaRoofMaterial(config.roofMaterial);
    const pergolaRoof = isPergolaRoofMaterial(config.roofMaterial);
    const rearRise = flatPergolaRoof ? 0 : fixedRearRise;
    const backHeight = dims.height + rearRise;
    const roofAngle = flatPergolaRoof ? 0 : Math.atan2(rearRise, dims.projection);
    const slopeLength = flatPergolaRoof ? dims.projection : Math.sqrt(dims.projection ** 2 + rearRise ** 2);
    const panelCount = Math.max(4, Math.round(dims.width / 1.1));
    const panelWidth = dims.width / panelCount;
    const supportPostRequired = dims.width >= 5;
    const sideLeafCount = dims.projection > 3 ? 4 : 3;
    const sideFixedCount = sideFixedGlassCount(dims.projection);
    const unsplitFrontLeafCount = dims.width > 4 ? 5 : dims.width > 3 ? 4 : 3;
    const unsplitFrontFixedCount = frontFixedGlassCount(dims.width);
    const resolvedDoorOpenStates = config.doorOpenStates ?? {
        front: config.doorsOpen,
        frontLeft: config.doorsOpen,
        frontRight: config.doorsOpen,
        left: config.doorsOpen,
        right: config.doorsOpen,
    };
    const resolvedAwningOpenStates = config.awningOpenStates ?? {
        roof: config.awningsOpen,
        front: config.awningsOpen,
        frontLeft: config.awningsOpen,
        frontRight: config.awningsOpen,
        left: config.awningsOpen,
        right: config.awningsOpen,
    };
    const roofProgress = (config.roofOpen ?? config.doorsOpen) ? 1 : 0;
    const wallClearance = 0.16;
    const model = new THREE.Group();
    model.position.set(0, 0, -dims.projection / 2 - wallClearance / 2);
    root.add(model);
    // Deck / base
    addBox(model, [dims.width, 0.02, dims.projection], [0, 0.01, wallClearance + dims.projection / 2], warmDeckMaterial);
    const deckLines = Math.max(6, Math.round(dims.width / 0.9));
    for (let i = 0; i < deckLines; i += 1) {
        const x = -dims.width / 2 + (i * dims.width) / Math.max(5, deckLines - 1);
        addBox(model, [0.006, 0.001, dims.projection], [x, 0.0215, wallClearance + dims.projection / 2], new THREE.MeshStandardMaterial({ color: '#a79178', roughness: 1 }));
    }
    // Front posts / beams
    addBox(model, [postThickness, dims.height, postThickness], [-dims.width / 2 + postThickness / 2, dims.height / 2, wallClearance + dims.projection - postThickness / 2], frameMaterial);
    addBox(model, [postThickness, dims.height, postThickness], [dims.width / 2 - postThickness / 2, dims.height / 2, wallClearance + dims.projection - postThickness / 2], frameMaterial);
    if (supportPostRequired) {
        addBox(model, [centerPostThickness, dims.height, centerPostThickness], [0, dims.height / 2, wallClearance + dims.projection - centerPostThickness / 2], frameMaterial);
    }
    addBox(model, [dims.width, beamHeight, postThickness], [0, dims.height - beamHeight / 2, wallClearance + dims.projection - postThickness / 2], frameMaterial);
    addBox(model, [dims.width, beamHeight, postThickness], [0, backHeight - beamHeight / 2, wallClearance + postThickness / 2], frameMaterial);
    addBox(model, [postThickness, beamHeight * 0.95, slopeLength], [-dims.width / 2 + postThickness / 2, (dims.height + backHeight) / 2 - beamHeight / 4, wallClearance + dims.projection / 2], frameMaterial, [roofAngle, 0, 0]);
    addBox(model, [postThickness, beamHeight * 0.95, slopeLength], [dims.width / 2 - postThickness / 2, (dims.height + backHeight) / 2 - beamHeight / 4, wallClearance + dims.projection / 2], frameMaterial, [roofAngle, 0, 0]);
    if (config.roofMaterial === 'fabric' && dims.width > 4) {
        addBox(model, [postThickness * 0.92, beamHeight * 0.88, slopeLength], [0, (dims.height + backHeight) / 2 - beamHeight / 4, wallClearance + dims.projection / 2], frameMaterial, [roofAngle, 0, 0]);
    }
    if (!pergolaRoof) {
        for (let i = 0; i < panelCount - 1; i += 1) {
            const x = -dims.width / 2 + ((i + 1) * dims.width) / panelCount;
            addBox(model, [0.05, 0.08, slopeLength], [x, (dims.height + backHeight) / 2 - beamHeight / 4, wallClearance + dims.projection / 2], frameMaterial, [roofAngle, 0, 0]);
        }
    }
    // Roof systems
    if (config.roofMaterial === 'fabric') {
        addFabricPergolaRoof(model, dims.width, slopeLength, roofProgress, [0, (dims.height + backHeight) / 2 - 0.02, wallClearance + dims.projection / 2], [roofAngle, 0, 0], pergolaFrameMaterial, config.lightsEnabled, config.lightTemperature === 'warm');
    }
    else if (config.roofMaterial === 'bioclimatic') {
        addBioclimaticPergolaRoof(model, dims.width, dims.projection, roofProgress, [0, dims.height - 0.018, wallClearance + dims.projection / 2], pergolaFrameMaterial, config.pergolaColor, config.lightsEnabled, config.lightTemperature === 'warm', false);
    }
    else if (config.roofMaterial === 'lux-bioclimatic') {
        addBioclimaticPergolaRoof(model, dims.width, dims.projection, roofProgress, [0, dims.height - 0.018, wallClearance + dims.projection / 2], pergolaFrameMaterial, config.pergolaColor, config.lightsEnabled, config.lightTemperature === 'warm', true);
    }
    else {
        const roofSurfaceMaterial = config.roofMaterial === 'glass' ? glassMaterial : config.roofMaterial === 'polycarbonate' ? polyMaterial : null;
        for (let i = 0; i < panelCount; i += 1) {
            const x = -dims.width / 2 + panelWidth / 2 + i * panelWidth;
            if (config.roofMaterial === 'aluminium') {
                addRoofAluminiumPanel(model, panelWidth - 0.065, slopeLength - 0.03, 0.022, frameColor, [x, (dims.height + backHeight) / 2 - 0.012, wallClearance + dims.projection / 2], [roofAngle, 0, 0]);
            }
            else {
                addBox(model, [panelWidth - 0.065, 0.018, slopeLength - 0.03], [x, (dims.height + backHeight) / 2 - 0.012, wallClearance + dims.projection / 2], roofSurfaceMaterial ?? glassMaterial, [roofAngle, 0, 0]);
            }
        }
    }
    if (config.lightsEnabled && !pergolaRoof) {
        addRoofLights(model, dims.width, dims.projection, backHeight, dims.height, panelCount, config.lightTemperature === 'warm', wallClearance);
    }
    if (!pergolaRoof && config.roofAwningEnabled) {
        addRetractableRoofAwning(model, dims.width, slopeLength, resolvedAwningOpenStates.roof ? 1 : 0, [0, (dims.height + backHeight) / 2 - 0.045, wallClearance + dims.projection / 2], [roofAngle, 0, 0], frameMaterial, config.awningColor);
    }
    // Front enclosures
    const frontInset = postThickness + 0.012;
    const frontClearWidth = Math.max(0.6, dims.width - frontInset * 2);
    if (supportPostRequired ? (config.enclosures.frontLeft !== 'none' || config.enclosures.frontRight !== 'none') : config.enclosures.front !== 'none') {
        const frontGroup = new THREE.Group();
        frontGroup.position.set(0, 0, wallClearance + dims.projection - 0.02);
        model.add(frontGroup);
        addBox(frontGroup, [frontClearWidth, 0.08, 0.04], [0, 0.04, 0], frameMaterial);
        addBox(frontGroup, [frontClearWidth, 0.08, 0.04], [0, dims.height - 0.04, 0], frameMaterial);
        if (supportPostRequired) {
            addBox(frontGroup, [centerPostThickness, dims.height, 0.04], [0, dims.height / 2, 0], frameMaterial);
            [-frontClearWidth / 2, -centerPostThickness / 2, centerPostThickness / 2, frontClearWidth / 2].forEach((x) => {
                addBox(frontGroup, [0.05, dims.height, 0.04], [x, dims.height / 2, 0], frameMaterial);
            });
            const bayWidth = (frontClearWidth - centerPostThickness) / 2;
            const panelHeight = dims.height - 0.1;
            const splitBayFixedCount = bayWidth > 3 ? 4 : bayWidth > 2 ? 3 : 2;
            const doorCenters = [-centerPostThickness / 2 - bayWidth / 2, centerPostThickness / 2 + bayWidth / 2];
            const splitKeys = ['frontLeft', 'frontRight'];
            const splitTypes = [config.enclosures.frontLeft, config.enclosures.frontRight];
            const stackSides = ['left', 'right'];
            doorCenters.forEach((centerX, bayIndex) => {
                const type = splitTypes[bayIndex];
                addEnclosure(frontGroup, type, bayWidth - 0.02, panelHeight, frameColor, frameMaterial, resolvedDoorOpenStates[splitKeys[bayIndex]] ? 1 : 0, [centerX, dims.height / 2, 0], undefined, { leafCount: bayWidth > 3 ? 4 : 3, stackSide: stackSides[bayIndex], fixedCount: splitBayFixedCount });
            });
        }
        else {
            const panelHeight = dims.height - 0.1;
            if (config.enclosures.front === 'guillotine' && dims.width > 4) {
                const bayWidth = (frontClearWidth - 0.05) / 2;
                addBox(frontGroup, [0.05, dims.height, 0.04], [0, dims.height / 2, 0], frameMaterial);
                [-bayWidth / 2 - 0.025, bayWidth / 2 + 0.025].forEach((centerX) => {
                    addGuillotineGlassSystem(frontGroup, bayWidth, panelHeight, frameMaterial, resolvedDoorOpenStates.front ? 1 : 0, [centerX, dims.height / 2, 0]);
                });
            }
            else {
                addEnclosure(frontGroup, config.enclosures.front, frontClearWidth - 0.02, panelHeight, frameColor, frameMaterial, resolvedDoorOpenStates.front ? 1 : 0, [0, dims.height / 2, 0], undefined, { leafCount: unsplitFrontLeafCount, stackSide: 'left', fixedCount: unsplitFrontFixedCount });
            }
        }
    }
    // Front vertical awnings
    if (supportPostRequired) {
        const bayWidth = (frontClearWidth - centerPostThickness) / 2;
        const centers = [-centerPostThickness / 2 - bayWidth / 2, centerPostThickness / 2 + bayWidth / 2];
        ['frontLeft', 'frontRight'].forEach((key, index) => {
            if (config.sideAwnings[key]) {
                addVerticalRollerAwning(model, bayWidth - 0.03, dims.height - 0.11, resolvedAwningOpenStates[key] ? 1 : 0, [centers[index], dims.height - 0.045, wallClearance + dims.projection + 0.03], frameMaterial, config.awningColor);
            }
        });
    }
    else if (config.sideAwnings.front) {
        addVerticalRollerAwning(model, Math.max(0.6, dims.width - (postThickness + 0.012) * 2) - 0.03, dims.height - 0.11, resolvedAwningOpenStates.front ? 1 : 0, [0, dims.height - 0.045, wallClearance + dims.projection + 0.03], frameMaterial, config.awningColor);
    }
    // Side enclosures and wedges
    ;
    ['left', 'right'].forEach((side) => {
        const sign = side === 'left' ? -1 : 1;
        const enclosure = config.enclosures[side];
        if (enclosure === 'none')
            return;
        const x = sign * (dims.width / 2 - 0.02);
        const sideHeight = dims.height;
        const sideGroup = new THREE.Group();
        sideGroup.position.set(x, 0, wallClearance + dims.projection / 2);
        model.add(sideGroup);
        addBox(sideGroup, [dims.projection, 0.08, 0.04], [0, 0.04, 0], frameMaterial, [0, Math.PI / 2, 0]);
        addBox(sideGroup, [dims.projection, 0.08, 0.04], [0, sideHeight - 0.04, 0], frameMaterial, [0, Math.PI / 2, 0]);
        addBox(sideGroup, [0.04, 0.06, slopeLength], [0, (sideHeight + backHeight) / 2, 0], frameMaterial, [roofAngle, 0, 0]);
        addBox(sideGroup, [0.04, sideHeight, 0.04], [0, sideHeight / 2, dims.projection / 2], frameMaterial);
        addBox(sideGroup, [0.04, backHeight, 0.04], [0, backHeight / 2, -dims.projection / 2], frameMaterial);
        const panelHeight = sideHeight - 0.1;
        if (enclosure === 'sliding') {
            addSlidingDoorSystem(sideGroup, dims.projection - 0.02, panelHeight, frameMaterial, resolvedDoorOpenStates[side] ? 1 : 0, [0, sideHeight / 2, 0], [0, Math.PI / 2, 0], 0.03, sideLeafCount);
        }
        else if (enclosure === 'bifold') {
            addBifoldDoorSystem(sideGroup, dims.projection - 0.02, panelHeight, frameMaterial, resolvedDoorOpenStates[side] ? 1 : 0, [0, sideHeight / 2, 0], [0, Math.PI / 2, 0], 0.03, 'right', side === 'left', sideLeafCount);
        }
        else if (enclosure === 'guillotine') {
            addGuillotineGlassSystem(sideGroup, dims.projection - 0.02, panelHeight, frameMaterial, resolvedDoorOpenStates[side] ? 1 : 0, [0, sideHeight / 2, 0], [0, Math.PI / 2, 0]);
        }
        else if (enclosure === 'fixed') {
            addFixedGlassSystem(sideGroup, dims.projection - 0.02, panelHeight, frameMaterial, sideFixedCount, [0, sideHeight / 2, 0], [0, Math.PI / 2, 0]);
        }
        else if (enclosure === 'aluminium') {
            addAluminiumPanelSurface(sideGroup, dims.projection - 0.09, sideHeight - 0.12, 0.024, frameColor, [0, sideHeight / 2, 0], [0, side === 'left' ? -Math.PI / 2 : Math.PI / 2, 0]);
        }
        if (config.sideAwnings[side]) {
            addVerticalRollerAwning(sideGroup, dims.projection - 0.03, sideHeight - 0.11, resolvedAwningOpenStates[side] ? 1 : 0, [sign * 0.03, sideHeight - 0.045, 0], frameMaterial, config.awningColor, [0, Math.PI / 2, 0]);
        }
        if (!flatPergolaRoof) {
            addWedgePanel(sideGroup, side, dims.projection, sideHeight, backHeight, config.roofMaterial === 'glass' ? glassMaterial : polyMaterial, frameColor, enclosure === 'aluminium', [0, 0, 0]);
        }
    });
    // subtle ground shadow for AR placement
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(dims.width + 0.9, dims.projection + 0.9), new THREE.ShadowMaterial({ color: '#000000', opacity: 0.1 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0.001, wallClearance + dims.projection / 2);
    root.add(floor);
    return root;
}
export async function exportConfigToGlb(config) {
    const exporter = new GLTFExporter();
    const group = buildArVerandaModel(config);
    const result = await new Promise((resolve, reject) => {
        exporter.parse(group, (value) => {
            if (value instanceof ArrayBuffer) {
                resolve(value);
                return;
            }
            reject(new Error('AR modeli dışa aktarılamadı.'));
        }, (error) => reject(error), { binary: true, trs: false, onlyVisible: true });
    });
    return URL.createObjectURL(new Blob([result], { type: 'model/gltf-binary' }));
}
