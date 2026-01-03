import { createScene, updateObject } from './3d/scene.js';
import { scaleCanvasToWindow } from './3d/utilities.js';
import { startAnimation } from './3d/animation.js';
import { DEFAULT_ZOOM, updateZoom, updateCameraForAspect } from './3d/camera.js';
import { updateLightColor, updateLightIntensity, updateLightPosition } from './3d/lighting.js';
import { invertColor } from './3d/utilities.js';
import { setLowResViewport, DEFAULT_BASE_HEIGHT } from './3d/renderer.js';
import { rotateObect } from './3d/objects.js';

(async () => {
    
    // initalize scene, camera, renderer, light
    const { scene, camera, renderer, light } = await createScene();

    initZoomControl(camera);
    initResolutionControl(renderer, camera);
    initUiControl();
    initModelSelector(scene);
    initBrightnessControl(light);
    initColorPicker(light);
    initLightModelRadios();
    initLightPositionInput(renderer, light);
    initModelRotationControl(scene, renderer);

    startAnimation(camera, renderer, scene);

})();

function initResolutionControl(renderer, camera) {
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
}

function initUiControl() {
    const uiToggle = document.getElementById('ui-toggle');
    const uiContent = document.getElementById('ui-content');
    uiToggle.addEventListener('click', () => {
        uiContent.classList.toggle('collapsed');
        uiToggle.textContent = uiContent.classList.contains('collapsed') ? 'o' : 'x';
    });
}

function getCurrentModel(scene) {
    const existingObject = scene.children.find(child => child.isMesh || child.isGroup);
    return existingObject;
}

function initModelSelector(scene) {
    const dropdownModel = document.getElementById('object-model');
    dropdownModel.addEventListener('change', async (event) => {
        console.log('model changed:', event.target.value);
        await updateObject(scene, event.target.value);

        const existingObject = getCurrentModel(scene);

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
}

function initZoomControl(camera) {
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
}

function initBrightnessControl(light) {
    const lightSlider = document.getElementById('light-slider');
    const lightValue = document.getElementById('light-value');
    lightSlider.addEventListener('input', function() {
        lightValue.textContent = 'Brightness: ' + (Math.round(lightSlider.value * 100) / 100).toFixed(1);
        updateLightIntensity(light, parseFloat(lightSlider.value));
    });
}

function initColorPicker(light) {
    const colorPicker = document.getElementById('color-picker');
    colorPicker.addEventListener('input', function() {
        updateLightColor(light, colorPicker.value);
        const invertedColor = invertColor(colorPicker.value);
        document.documentElement.style.setProperty('--color-art', colorPicker.value);
        document.documentElement.style.setProperty('--color-bg-primary', invertedColor);
    });
}

function initLightModelRadios() {
    const lightModeRadios = document.querySelectorAll('input[name="light-model-mode"]');
    lightModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            console.log('Selected mode:', e.target.value);
        });
    });
}

function getSelectedLightModelMode() {
    const lightRadio = document.querySelector('input[name="light-model-mode"][value="light"]');
    const modelRadio = document.querySelector('input[name="light-model-mode"][value="model"]');
    return { isLightMode: lightRadio.checked, isModelMode: modelRadio.checked };
}

function initLightPositionInput(renderer, light) {
    function normalizeCoordinates(x, y) {
        const normalizedX = (x - window.innerWidth / 2) / (window.innerWidth / 2) * 50;
        const normalizedY = - (y - window.innerHeight / 2) / (window.innerHeight / 2) * 50;
        return { x: normalizedX, y: normalizedY };
    }
    
    const canvas = renderer.domElement;
    canvas.addEventListener('click', (event) => {
        if (!getSelectedLightModelMode().isLightMode) return; // Only proceed if "light" mode is selected
        const {x, y} = normalizeCoordinates(event.clientX, event.clientY);
        updateLightPosition(light, x, y);
    });

    let isMouseDown = false;
    canvas.addEventListener('mousedown', () => { isMouseDown = true; });
    canvas.addEventListener('mouseup', () => { isMouseDown = false; });
    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown && getSelectedLightModelMode().isLightMode) {
            const {x, y} = normalizeCoordinates(event.clientX, event.clientY);
            updateLightPosition(light, x, y);
        }
    });

    let isTouchDown = false;
    canvas.addEventListener('touchstart', () => { isTouchDown = true; });
    canvas.addEventListener('touchend', () => { isTouchDown = false; });
    canvas.addEventListener('touchmove', (event) => {
        if (isTouchDown  && getSelectedLightModelMode().isLightMode) {
            const touch = event.touches[0];
            const {x, y} = normalizeCoordinates(touch.clientX, touch.clientY);
            updateLightPosition(light, x, y);
        }
    });
}

function initModelRotationControl(scene, renderer) {
    const canvas = renderer.domElement;
    let isMouseDown = false;
    canvas.addEventListener('mousedown', () => { isMouseDown = true; });
    canvas.addEventListener('mouseup', () => { isMouseDown = false; });
    canvas.addEventListener('mousemove', async (event) => {
        if (isMouseDown && getSelectedLightModelMode().isModelMode) {
            const model = getCurrentModel(scene);
            await rotateObect(model, event.movementX, event.movementY);
        }
    });

    let isTouchDown = false;
    let lastTouchX = 0, lastTouchY = 0;
    canvas.addEventListener('touchstart', (event) => {
        isTouchDown = true;
        const t = event.touches[0];
        lastTouchX = t.clientX;
        lastTouchY = t.clientY;
    });
    canvas.addEventListener('touchend', () => { isTouchDown = false; });
    canvas.addEventListener('touchmove', async (event) => {
        if (isTouchDown && getSelectedLightModelMode().isModelMode) {
            const t = event.touches[0];
            const dx = t.clientX - lastTouchX;
            const dy = t.clientY - lastTouchY;
            lastTouchX = t.clientX;
            lastTouchY = t.clientY;
            const model = getCurrentModel(scene);
            await rotateObect(model, dx, dy);
        }
    });
}