import { createScene, updateObject } from './3d/scene.js';
import { scaleCanvasToWindow } from './3d/utilities.js';
import { startAnimation } from './3d/animation.js';
import { updateZoom, updateCameraForAspect } from './3d/camera.js';
import { updateLightColor, updateLightIntensity } from './3d/lighting.js';
import { invertColor } from './3d/utilities.js';
import { setLowResViewport } from './3d/renderer.js';

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

(async () => {
    const { scene, camera, renderer, light } = await createScene();

    const applyViewport = () => {
        const { aspect } = setLowResViewport(renderer);
        updateCameraForAspect(camera, aspect);
        scaleCanvasToWindow(renderer);
    };

    applyViewport();
    window.addEventListener('resize', applyViewport);

    const dropdownModel = document.getElementById('object-model');
    dropdownModel.addEventListener('change', async (event) => {
        console.log('model changed:', event.target.value);
        await updateObject(scene, event.target.value);

        const existingObject = scene.children.find(child => child.isMesh || child.isGroup);
        console.log('New object in scene:', typeof existingObject);

        // Output the texture size of the loaded object
        if (existingObject && existingObject.material && existingObject.material.map && existingObject.material.map.image) {
            const img = existingObject.material.map.image;
            console.log('Texture size:', img.width, 'x', img.height);
        } else if (existingObject && existingObject.children) {
            // If it's a group, check children for textures
            existingObject.traverse(child => {
            if (child.isMesh && child.material && child.material.map && child.material.map.image) {
                const img = child.material.map.image;
                console.log('Texture size:', img.width, 'x', img.height);
            }
            });
        } else {
            console.log('No texture found on the loaded object.');
        }
    });

    const zoomSlider = document.getElementById('zoom-slider');
    zoomSlider.addEventListener('input', (event) => {
        const a = zoomSlider.max - zoomSlider.min / zoomSlider.min - zoomSlider.max;
        const b = zoomSlider.max - a * zoomSlider.min;
        const zoom = a * parseFloat(event.target.value) + b;
        updateZoom(camera, zoom);
    });

    const scaleSlider = document.getElementById('zoom-slider');
    const scaleValue = document.getElementById('zoom-value');

    scaleSlider.addEventListener('input', function() {
    scaleValue.textContent = 'Scale: ' + (Math.round(scaleSlider.value * 10) / 10).toFixed(1);
    });

    const lightSlider = document.getElementById('light-slider');
    const lightValue = document.getElementById('light-value');

    lightSlider.addEventListener('input', function() {
        lightValue.textContent = 'Intensity: ' + (Math.round(lightSlider.value * 100) / 100).toFixed(1);
        updateLightIntensity(light, parseFloat(lightSlider.value));
    });

    const colorPicker = document.getElementById('color-picker');
    colorPicker.addEventListener('input', function() {
        updateLightColor(light, colorPicker.value);
        const invertedColor = invertColor(colorPicker.value);
        document.documentElement.style.setProperty('--color-art', colorPicker.value);
        document.documentElement.style.setProperty('--color-bg-primary', invertedColor);
    });

    const uiToggle = document.getElementById('ui-toggle');
    const uiContent = document.getElementById('ui-content');

    uiToggle.addEventListener('click', () => {
        uiContent.classList.toggle('collapsed');
        uiToggle.textContent = uiContent.classList.contains('collapsed') ? '|||' : '|||';
        if (uiContent.classList.contains('collapsed')) {
            document.documentElement.style.setProperty('--ui-content-padding', '0px');
        } else {
            document.documentElement.style.setProperty('--ui-content-padding', '5px');
        }
    });

    const gl = document.createElement('canvas').getContext('webgl');
    console.log('maxTextureSize', gl.getParameter(gl.MAX_TEXTURE_SIZE));

    startAnimation(camera, renderer, scene);

})();







