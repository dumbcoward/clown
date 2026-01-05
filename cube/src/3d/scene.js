import * as THREE from 'three';
import { createCamera } from './camera.js';
import { createRenderer } from './renderer.js';
import { createLight } from './lighting.js';
import { loadGLB } from './objects.js';

// If you add `x.glb` to `src/assets/x.glb`, Vite will bundle it and
// provide a correct URL for production. Import it with `?url` so we get a
// runtime URL that respects the configured `base`.
import chopUrl from '../assets/chop.glb?url';
import doomscrollUrl from '../assets/doomscroll.glb?url';
import mokaUrl from '../assets/moka.glb?url';
import monkeysUrl from '../assets/monkeys.glb?url';
import parryUrl from '../assets/parry.glb?url';
import pepsiUrl from '../assets/pepsi.glb?url';
import totemUrl from '../assets/totem.glb?url';

export async function createScene() {
    const scene = new THREE.Scene();
    const camera = createCamera();
    const renderer = createRenderer();
    const object = await loadGLB(monkeysUrl, { scale: 1.5, center: true, castShadow: true });
    const light = createLight();
    scene.add(object);
    scene.add(light);

    return { scene, camera, renderer, light };
}

export async function updateObject(scene, type) {
    // Remove existing object
    const existingObject = scene.children.find(child => child.isMesh || child.isGroup);
    if (existingObject) {
        scene.remove(existingObject);
    }

    let newObject;
    let url;
    // Create and add new object based on type
    switch (type) {
    case 'chop':
        url = chopUrl;
        break;
    case 'doomscroll':
        url = doomscrollUrl;
        break;
    case 'moka':
        url = mokaUrl;
        break;
    case 'monkeys':
        url = monkeysUrl;
        break;
    case 'parry':
        url = parryUrl;
        break;
    case 'pepsi':
        url = pepsiUrl;
        break;
    case 'totem':
        url = totemUrl;
        break;
}
    console.log('Loading model from URL:', type, url);
    newObject = await loadGLB(url, { scale: 1.5, center: true, castShadow: true });
    newObject.name = type;

    scene.add(newObject);
}