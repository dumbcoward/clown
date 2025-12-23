import { createScene } from './scene.js';
import { scaleCanvasToWindow } from './utilities.js';
import { startAnimation } from './animation.js';
import { initBackground } from './background.js';

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}




(async () => {
    const { scene, camera, renderer, object, light } = await createScene();

    scaleCanvasToWindow(renderer);
    window.addEventListener('resize', () => scaleCanvasToWindow(renderer));

    startAnimation(object, camera, renderer, scene);

    // initialize background with parallax options
    initBackground({
        bgMin: -400,
        bgMax: 100,
        parallaxFactor: 0.3
    });
})();







