import { createScene, updateObject } from './3d/scene.js';
import { scaleCanvasToWindow } from './3d/utilities.js';
import { startAnimation, initAudio, analyser, dataArray, audioContext, audioElement, getDetailedAudioData } from './3d/animation.js';
import { DEFAULT_ZOOM, updateZoom, updateCameraForAspect } from './3d/camera.js';
import { updateLightColor, updateLightIntensity, updateLightPosition } from './3d/lighting.js';
import { invertColor } from './3d/utilities.js';
import { setLowResViewport, DEFAULT_BASE_HEIGHT } from './3d/renderer.js';
import { rotateObect } from './3d/objects.js';


(async () => {
    const audio = new Audio('assets/windowlicker.m4a');
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audio);


    console.log('Sample Rate:', audioContext.sampleRate);
    console.log('Duration:', audio.duration);

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
    await initAudio();
    initAudioControl(scene);

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
        uiToggle.textContent = uiContent.classList.contains('collapsed') ? '😮' : '😐';
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
        if (!getSelectedLightModelMode().isLightMode && event.button === 0) return; // Only proceed if "light" mode is selected
        const {x, y} = normalizeCoordinates(event.clientX, event.clientY);
        updateLightPosition(light, x, y);
    });

    let isMouseDown = false;
    canvas.addEventListener('mousedown', (event) => { isMouseDown = event.button === 0; });
    canvas.addEventListener('mouseup', () => { isMouseDown = false; });
    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown && getSelectedLightModelMode().isLightMode && event.button === 0) {
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
    let isWheelDown = false;
    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) isMouseDown = true;
        if (e.button === 1) isWheelDown = true;
    });
    canvas.addEventListener('mouseup', (e) => {
        if (e.button === 0) isMouseDown = false;
        if (e.button === 1) isWheelDown = false;
    });
    canvas.addEventListener('mouseleave', () => {
        isMouseDown = false;
        isWheelDown = false;
    });

    canvas.addEventListener('mousemove', async (event) => {
        if ((getSelectedLightModelMode().isModelMode && isMouseDown) || isWheelDown) {
            const model = getCurrentModel(scene);
            await rotateObect(model, event.movementX, event.movementY);
        }
    });

    let isTouchDown = false;
    let lastTouchX = 0, lastTouchY = 0;
    canvas.addEventListener('touchstart', (event) => {
        event.preventDefault();
        isTouchDown = true;
        switch (event.touches.length) {
            case 1:
                // single touch
                lastTouchX = event.touches[0].clientX;
                lastTouchY = event.touches[0].clientY;
                break;
            case 2:
                // two-finger touch
                lastTouchX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
                lastTouchY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
                break;
        }
    });
    canvas.addEventListener(
        'touchend',            // event type
        () => { isTouchDown = false; }, // handler (arrow function)
        { passive: false }     // options object
    );
    canvas.addEventListener('touchmove', async (event) => {
        event.preventDefault();
        let dx = 0, dy = 0;
        switch (event.touches.length) {
            case 1:
                // single touch
                dx = event.touches[0].clientX - lastTouchX;
                dy = event.touches[0].clientY - lastTouchY;
                lastTouchX = event.touches[0].clientX;
                lastTouchY = event.touches[0].clientY;
                break;
            case 2:
                // two-finger touch
                const currentTouchX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
                const currentTouchY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
                dx = currentTouchX - lastTouchX;
                dy = currentTouchY - lastTouchY;
                lastTouchX = currentTouchX;
                lastTouchY = currentTouchY;
                break;
        }
        
        const model = getCurrentModel(scene);

        if (isTouchDown && ((getSelectedLightModelMode().isModelMode && event.touches.length == 1))) {
            await rotateObect(model, dx, dy);
        }
    });
}

function initAudioControl() {
    function getBandData() {
        if (!analyser || !dataArray) return;
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate different frequency bands
        const low = dataArray.slice(0, dataArray.length / 3).reduce((a, b) => a + b) / (dataArray.length / 3);
        const mid = dataArray.slice(dataArray.length / 3, (dataArray.length * 2) / 3).reduce((a, b) => a + b) / (dataArray.length / 3);
        const high = dataArray.slice((dataArray.length * 2) / 3).reduce((a, b) => a + b) / (dataArray.length / 3);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

        return { low, mid, high, average };
    }

    function updateAudioReadout() {
        if (!analyser || !dataArray) return;

        const { bands, average } = getDetailedAudioData();

        // Update readout display
        const readout = document.getElementById('audio-readout');
        if (readout) {
            const bandValues = bands.map((b, i) => `${i}: ${Math.round(b)}`).join(' | ');
            readout.textContent = `${bandValues} | Avg: ${Math.round(average)}`;
        }
    }

    function toggleAudio() {
        if (!audioContext) {
            initAudio();
        }
        
        if (audioElement.paused) {
            audioContext.resume();
            audioElement.play();
            return true;
        } else {
            audioElement.pause();
            return false;
        }
    }

    const audioButton = document.getElementById('audio-toggle');
    audioButton.addEventListener('click', async () => {
        if (!audioContext) {
            initAudio();
        }
        const isPlaying = await toggleAudio();
        audioButton.textContent = isPlaying ? '⏸️' : '▶️';
    });

    function renderAudioBars(bands) {
        const container = document.getElementById('audio-readout');
        if (!container) return;
        if (!container.hasChildNodes()) {
            // create bar elements once
            for (let i = 0; i < 8; i++) {
                const wrap = document.createElement('div');
                wrap.className = 'audio-bar';
                const bar = document.createElement('div');
                bar.className = 'bar';
                const val = document.createElement('div');
                val.className = 'value';
                wrap.appendChild(bar);
                wrap.appendChild(val);
                container.appendChild(wrap);
            }
        }
        const bars = container.querySelectorAll('.audio-bar');
        bands.forEach((b, i) => {
            const barEl = bars[i].querySelector('.bar');
            const valEl = bars[i].querySelector('.value');
            const h = Math.max(2, Math.round(b * 1.5)); // 1.5x pixels
            barEl.style.height = `${h}px`;
            valEl.textContent = Math.round(b);
        });
    }

    function updateAudioReadout() {
        const data = getDetailedAudioData();
        if (!data) return;
        renderAudioBars(data.bands);
    }

    // call at ~60fps
    setInterval(updateAudioReadout, 16);
}