import * as THREE from 'three';
import { INTERNAL_WIDTH, INTERNAL_HEIGHT, ZOOM } from './params.js';

export function createCamera() {
    const aspect = INTERNAL_WIDTH / INTERNAL_HEIGHT;
    
    const camera = new THREE.OrthographicCamera(
        -aspect * ZOOM,
        aspect * ZOOM,
        ZOOM,
        -ZOOM,
        0.5,
        1000
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    camera.position.z = 3;
    
    return camera;
}