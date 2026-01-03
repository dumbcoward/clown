import { ROTATION_SPEED } from '../params.js';

export function animate(camera, renderer, scene) {
    requestAnimationFrame(() => animate(camera, renderer, scene));
    
    const existingObject = scene.children.find(child => child.isMesh || child.isGroup);
    
    if (!existingObject) return;

    const rotEl = document.getElementById('rotation-readout');
    if (rotEl) {
        rotEl.textContent = formatRotation(existingObject);
    }
    renderer.render(scene, camera);
}

export function startAnimation(camera, renderer, scene) {
    animate(camera, renderer, scene);
}

function formatRotation(obj) {
    const rx = obj.rotation.x.toFixed(1);
    const ry = obj.rotation.y.toFixed(1);
    return `x: ${rx} rad, y: ${ry} rad`;
}
