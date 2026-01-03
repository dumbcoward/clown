import * as THREE from 'three';

export const DEFAULT_BASE_HEIGHT = 240;

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    document.getElementById('app').appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 0);
    setLowResViewport(renderer, DEFAULT_BASE_HEIGHT);
    return renderer;
}

export function setLowResViewport(renderer, baseHeight) {
    const aspect = window.innerWidth / window.innerHeight;
    const targetHeight = baseHeight;
    const targetWidth = Math.max(1, Math.round(targetHeight * aspect));

    renderer.setSize(targetWidth, targetHeight, false);
    renderer.setPixelRatio(1);

    return { width: targetWidth, height: targetHeight, aspect };
}