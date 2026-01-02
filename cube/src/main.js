import { createScene } from './3d/scene.js';
import { scaleCanvasToWindow } from './3d/utilities.js';
import { startAnimation } from './3d/animation.js';
import { updateZoom } from './3d/camera.js';
import { updateLightColor, updateLightIntensity } from './3d/lighting.js';
import { invertColor } from './3d/utilities.js';

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}




(async () => {
    const { scene, camera, renderer, object, light } = await createScene();

    scaleCanvasToWindow(renderer);
    window.addEventListener('resize', () => scaleCanvasToWindow(renderer));
    
    const dropdown = document.getElementById('internal-resolution');

    dropdown.addEventListener('change', (event) => {
        console.log('Dropdown changed:', event.target.value);
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
        document.documentElement.style.setProperty('--color-art', colorPicker.value);
        const invertedColor = invertColor(colorPicker.value);
        document.documentElement.style.setProperty('--color-bg-primary', invertedColor);
    });

    const uiToggle = document.getElementById('ui-toggle');
    const uiContent = document.getElementById('ui-content');

    uiToggle.addEventListener('click', () => {
    uiContent.classList.toggle('collapsed');
    uiToggle.textContent = uiContent.classList.contains('collapsed') ? '▶' : '▼';
    });

    startAnimation(object, camera, renderer, scene);

})();







