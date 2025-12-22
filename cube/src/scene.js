import * as THREE from 'three';
import { createCamera } from './camera.js';
import { createRenderer } from './renderer.js';
import { createLight } from './lighting.js';
import { createCube, createHumanBody, createJohn } from './objects.js';

export async function createScene() {
    const scene = new THREE.Scene();
    const camera = createCamera();
    const renderer = createRenderer();
    const object = await createJohn();
    const light = createLight();
    scene.add(object);
    scene.add(light);

    return { scene, camera, renderer, object, light };
}