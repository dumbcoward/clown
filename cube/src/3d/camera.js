import * as THREE from 'three';
export const DEFAULT_ZOOM = 1.5;

export function createCamera() {
    const aspect = window.innerWidth / window.innerHeight;

    const camera = new THREE.OrthographicCamera(
        -aspect * DEFAULT_ZOOM,
        aspect * DEFAULT_ZOOM,
        DEFAULT_ZOOM,
        -DEFAULT_ZOOM,
        0.5,
        1000
    );
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    return camera;
}

// Get zoom value from slider element with id 'zoom-slider'
function getZoomFromSlider() {
    const slider = document.getElementById('zoom-slider');
    if (slider) {
        return parseFloat(slider.value);
    }
    return DEFAULT_ZOOM;
}

export function updateCameraForAspect(camera, aspect) {
    const zoom = getZoomFromSlider();
    camera.left = -aspect * zoom;
    camera.right = aspect * zoom;
    camera.top = zoom;
    camera.bottom = -zoom;
    camera.updateProjectionMatrix();
}

export function updateZoom(camera) {
    const zoom = getZoomFromSlider();
    const aspect = window.innerWidth / window.innerHeight;
    updateCameraForAspect(camera, aspect, zoom);
}