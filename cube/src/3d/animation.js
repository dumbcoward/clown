import { ROTATION_SPEED } from '../params.js';
import audioUrl from '../assets/windowlicker.m4a?url';

export let audioContext;
export let analyser;
export let dataArray;
export let audioElement;
export let source;
let lastBassSpike = 0;

export async function initAudio() {
    audioElement = new Audio(audioUrl);
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
}

export function animate(camera, renderer, scene) {
    requestAnimationFrame(() => animate(camera, renderer, scene));
    
    const existingObject = scene.children.find(child => child.isMesh || child.isGroup);
    
    if (!existingObject) return;

    // Get audio data
    if (analyser && dataArray && !audioElement?.paused) {
        analyser.getByteFrequencyData(dataArray);
        const low = dataArray.slice(0, dataArray.length / 3).reduce((a, b) => a + b) / (dataArray.length / 3);
        const high = dataArray.slice((dataArray.length * 2) / 3).reduce((a, b) => a + b) / (dataArray.length / 3);
        // Trigger scale on bass spike
        if (high > 0 && Date.now() - lastBassSpike > 200) {
            lastBassSpike = Date.now();
            scaleModelQuick(scene, 33);
        }
    }


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

function scaleModelQuick(scene, duration = 16) {
    const model = scene.children.find(child => child.isMesh || child.isGroup);
    if (!model) return;

    const startScale = model.scale.x;
    const targetScale = startScale * 1.2;
    const startTime = Date.now();
    const totalDuration = duration * 2; // Time to go up AND come back down

    function animateScale() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        
        let easeProgress;
        if (progress < 0.5) {
            // First half: scale up
            easeProgress = progress * 2;
            easeProgress = easeProgress < 0.5 ? 2 * easeProgress * easeProgress : -1 + (4 - 2 * easeProgress) * easeProgress;
        } else {
            // Second half: scale back down
            easeProgress = (progress - 0.5) * 2;
            easeProgress = easeProgress < 0.5 ? 2 * easeProgress * easeProgress : -1 + (4 - 2 * easeProgress) * easeProgress;
            easeProgress = 1 - easeProgress; // Reverse for return
        }
        
        const currentScale = startScale + (targetScale - startScale) * easeProgress;
        model.scale.setScalar(currentScale);

        if (progress < 1) {
            requestAnimationFrame(animateScale);
        }
    }

    animateScale();
}

export function getDetailedAudioData() {
    if (!analyser || !dataArray) return null;
    analyser.getByteFrequencyData(dataArray);
    
    const bands = [];
    const totalBands = dataArray.length;
    
    // Logarithmic band distribution
    // First 4 bands get more detail, last band groups the rest
    const bandRanges = [
        { start: 0, end: 0.1 },      // Band 0: 0-10%
        { start: 0.1, end: 0.25 },   // Band 1: 10-25%
        { start: 0.25, end: 0.4 },   // Band 2: 25-40%
        { start: 0.4, end: 0.55 },   // Band 3: 40-55%
        { start: 0.55, end: 1.0 }    // Band 4: 55-100% (grouped)
    ];
    
    bandRanges.forEach(range => {
        const start = Math.floor(range.start * totalBands);
        const end = Math.floor(range.end * totalBands);
        const bandAverage = dataArray.slice(start, end).reduce((a, b) => a + b) / (end - start);
        bands.push(bandAverage);
    });
    
    return {
        bands,
        peak: Math.max(...bands),
        average: dataArray.reduce((a, b) => a + b) / dataArray.length
    };
}