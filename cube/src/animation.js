import * as THREE from 'three';

export function animate(object, camera, renderer, scene) {
    requestAnimationFrame(() => animate(object, camera, renderer, scene));
    
    object.rotation.y += 0.025;
    
    renderer.render(scene, camera);
}

export function startAnimation(object, camera, renderer, scene) {
    animate(object, camera, renderer, scene);
}