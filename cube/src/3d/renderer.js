import * as THREE from 'three';
import { rez } from '../params.js';

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    document.getElementById('app').appendChild(renderer.domElement);
    
    // Set initial size and pixel ratio to snes resolution
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    
    return renderer;
}

export function updateRendererSize(renderer, resolution_key) {
    const resolution = rez[resolution_key];
    if (resolution) {
        renderer.setSize(resolution.width, resolution.height, false);
    }
}