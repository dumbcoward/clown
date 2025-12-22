import * as THREE from 'three';
import { createScene } from './scene.js';
import { scaleCanvasToWindow } from './utilities.js';
import { startAnimation } from './animation.js';

const { scene, camera, renderer, object, light } = createScene();

scaleCanvasToWindow(renderer);
window.addEventListener('resize', () => scaleCanvasToWindow(renderer));

startAnimation(object, camera, renderer, scene);