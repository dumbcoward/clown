import * as THREE from 'three';
import { INTERNAL_WIDTH, INTERNAL_HEIGHT } from './params.js';

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    document.getElementById('app').appendChild(renderer.domElement);
    
    renderer.setSize(INTERNAL_WIDTH, INTERNAL_HEIGHT, false);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    
    return renderer;
}