import * as THREE from 'three';
import { FPS } from './constants.js';

export function animate(object, camera, renderer, scene) {
    requestAnimationFrame(() => animate(object, camera, renderer, scene));
    
    object.rotation.y += 0.01;
    
    renderer.render(scene, camera);
}

export function startAnimation(object, camera, renderer, scene) {
    animate(object, camera, renderer, scene);
}