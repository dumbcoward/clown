import { createScene, updateObject } from './3d/scene.js';
import { scaleCanvasToWindow } from './3d/utilities.js';
import { startAnimation } from './3d/animation.js';
import { DEFAULT_ZOOM, updateZoom, updateCameraForAspect } from './3d/camera.js';
import { updateLightColor, updateLightIntensity, updateLightPosition } from './3d/lighting.js';
import { invertColor } from './3d/utilities.js';
import { setLowResViewport, DEFAULT_BASE_HEIGHT } from './3d/renderer.js';

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

(async () => {
    
    // initalize scene, camera, renderer, light
    const { scene, camera, renderer, light } = await createScene();

    // 3d internal resolution
    const resolutionSlider = document.getElementById('resolution-slider');
    const resolutionValue = document.getElementById('resolution-value');
    resolutionSlider.value = DEFAULT_BASE_HEIGHT;
    resolutionValue.textContent = 'Resolution: ' + DEFAULT_BASE_HEIGHT;
    resolutionSlider.addEventListener('input', function() {
        applyViewport();
        resolutionValue.textContent = 'Resolution: ' + parseInt(resolutionSlider.value);
    });

    const applyViewport = () => {
        // setLowResViewport returns the the target width, height, and aspect ratio. The { aspect } syntax extracts just the aspect property from the object returned by the setLowResViewport function.
        const { aspect } = setLowResViewport(renderer, parseInt(resolutionSlider.value));
        updateCameraForAspect(camera, aspect);
        scaleCanvasToWindow(renderer);
    };

    applyViewport();
    window.addEventListener('resize', applyViewport);

    const uiToggle = document.getElementById('ui-toggle');
    const uiContent = document.getElementById('ui-content');
    uiToggle.addEventListener('click', () => {
        console.log('toggling UI');
        uiContent.classList.toggle('collapsed');
        uiToggle.textContent = uiContent.classList.contains('collapsed') ? 'o' : 'x';
    });


    
    

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
    zoomSlider.value = DEFAULT_ZOOM;
    const zoomValue = document.getElementById('zoom-value');
    zoomValue.textContent = 'Zoom: ' + DEFAULT_ZOOM.toFixed(1);
    zoomSlider.addEventListener('input', function() {
        zoomValue.textContent = 'Zoom: ' + (Math.round(zoomSlider.value * 10) / 10).toFixed(1);
        //const a = zoomSlider.max - zoomSlider.min / zoomSlider.min - zoomSlider.max;
        //const b = zoomSlider.max - a * zoomSlider.min;
        //const zoom = a * parseFloat(zoomSlider.value) + b;
        updateZoom(camera, zoomSlider.value);
        
    });


    const lightSlider = document.getElementById('light-slider');
    const lightValue = document.getElementById('light-value');

    lightSlider.addEventListener('input', function() {
        lightValue.textContent = 'Brightness: ' + (Math.round(lightSlider.value * 100) / 100).toFixed(1);
        updateLightIntensity(light, parseFloat(lightSlider.value));
    });

    const colorPicker = document.getElementById('color-picker');
    colorPicker.addEventListener('input', function() {
        updateLightColor(light, colorPicker.value);
        const invertedColor = invertColor(colorPicker.value);
        document.documentElement.style.setProperty('--color-art', colorPicker.value);
        document.documentElement.style.setProperty('--color-bg-primary', invertedColor);
    });

    const canvas = renderer.domElement;
    canvas.addEventListener('click', (event) => {
        updateLightPosition(light, (event.clientX - window.innerWidth / 2) / 100, - (event.clientY - window.innerHeight / 2) / 100);
    });
    let isMouseDown = false;

    canvas.addEventListener('mousedown', () => {
        isMouseDown = true;
    });

    canvas.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            updateLightPosition(light, (event.clientX - window.innerWidth / 2) / 100, - (event.clientY - window.innerHeight / 2) / 100);
        }
    });

    let isTouchDown = false;

    canvas.addEventListener('touchstart', () => {
        isTouchDown = true;
    });

    canvas.addEventListener('touchend', () => {
        isTouchDown = false;
    });

    canvas.addEventListener('touchmove', (event) => {
        if (isTouchDown) {
            const touch = event.touches[0];
            updateLightPosition(light, (touch.clientX - window.innerWidth / 2) / 100, - (touch.clientY - window.innerHeight / 2) / 100);
        }
    });

    startAnimation(camera, renderer, scene);

})();







