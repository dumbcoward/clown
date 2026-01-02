import * as THREE from 'three';
import { rez } from '../params.js';

export function scaleCanvasToWindow(renderer) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const internalAspect = rez.snes.width / rez.snes.height;
    const windowAspect = windowWidth / windowHeight;
    
    let displayWidth, displayHeight;
    
    if (windowAspect > internalAspect) {
        displayHeight = windowHeight;
        displayWidth = displayHeight * internalAspect;
    } else {
        displayWidth = windowWidth;
        displayHeight = displayWidth / internalAspect;
    }
    
    const canvas = renderer.domElement;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
}

export function invertColor(hexColor) {
    // Remove the # if present
    hexColor = hexColor.replace('#', '');

    // Convert hex to RGB
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    // Invert each channel
    const inverted = '#' + 
    (255 - r).toString(16).padStart(2, '0') +
    (255 - g).toString(16).padStart(2, '0') +
    (255 - b).toString(16).padStart(2, '0');

    return inverted;
}