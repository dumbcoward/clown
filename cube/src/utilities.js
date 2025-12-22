import * as THREE from 'three';
import { INTERNAL_WIDTH, INTERNAL_HEIGHT } from './constants.js';

export function scaleCanvasToWindow(renderer) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const internalAspect = INTERNAL_WIDTH / INTERNAL_HEIGHT;
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