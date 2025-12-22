import * as THREE from 'three';
import { LIGHT_COLOR, LIGHT_INTENSITY } from './constants.js';

export function createLight() {
    const light = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
    light.position.set(3, 3, 5);
    
    return light;
}