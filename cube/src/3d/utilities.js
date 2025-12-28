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