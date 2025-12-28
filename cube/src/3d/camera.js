import * as THREE from 'three';
import { rez, ZOOM } from '../params.js';

export function createCamera() {
    const aspect = rez.snes.width / rez.snes.height;
    
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

export function updateZoom(camera, zoom) {
    const aspect = rez.snes.width / rez.snes.height;
    camera.left = -aspect * zoom;
    camera.right = aspect * zoom;
    camera.top = zoom;
    camera.bottom = -zoom;
    camera.updateProjectionMatrix();
}