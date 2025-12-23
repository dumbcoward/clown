import * as THREE from 'three';
import { LIGHT_COLOR, LIGHT_INTENSITY, LIGHT_POSITION } from './params.js';

export function createLight() {
    const light = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
    light.position.set(
        LIGHT_POSITION.x,
        LIGHT_POSITION.y,
        LIGHT_POSITION.z
    );
    
    return light;
}