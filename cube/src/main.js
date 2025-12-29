import { createScene } from './3d/scene.js';
import { scaleCanvasToWindow } from './3d/utilities.js';
import { startAnimation } from './3d/animation.js';
import { updateZoom } from './3d/camera.js';

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
    const scaleValue = document.getElementById('scale-value');

    scaleSlider.addEventListener('input', function() {
      scaleValue.textContent = 'Scale: ' + scaleSlider.value;
    });

    const colorPicker = document.getElementById('color-picker');
    colorPicker.addEventListener('input', function() {
    // Add functionality to use the selected color
    console.log('Selected color:', colorPicker.value);
    });

    startAnimation(object, camera, renderer, scene);


})();







