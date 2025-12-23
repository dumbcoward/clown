import { ROTATION_SPEED } from './params.js';

export function animate(object, camera, renderer, scene) {
    requestAnimationFrame(() => animate(object, camera, renderer, scene));
    
    object.rotation.y += ROTATION_SPEED;

    const rotEl = document.getElementById('rotation-readout');
    if (rotEl) {
        rotEl.textContent = formatRotation(object);
    }
    renderer.render(scene, camera);
}

export function startAnimation(object, camera, renderer, scene) {
    animate(object, camera, renderer, scene);
}



function formatRotation(obj) {
    const rx = obj.rotation.x.toFixed(1);
    const ry = obj.rotation.y.toFixed(1);
    return `x: ${rx} rad, y: ${ry} rad`;
}
