import * as THREE from 'three';
// Use a small internal buffer and scale the canvas to fill the viewport.
// BASE_HEIGHT keeps the pixelated aesthetic while adapting width to the window aspect.
const BASE_HEIGHT = 200;

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    document.getElementById('app').appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 0);
    setLowResViewport(renderer);
    return renderer;
}

export function setLowResViewport(renderer) {
    const aspect = window.innerWidth / window.innerHeight;
    const targetHeight = BASE_HEIGHT;
    const targetWidth = Math.max(1, Math.round(targetHeight * aspect));

    renderer.setSize(targetWidth, targetHeight, false);
    renderer.setPixelRatio(1);

    return { width: targetWidth, height: targetHeight, aspect };
}