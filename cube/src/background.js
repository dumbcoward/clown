function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

let wheelHandler = null;
let accumulatedY = 0;

export function initBackground(opts = {}) {
    const bgMin = opts.bgMin ?? -400;
    const bgMax = opts.bgMax ?? 100;
    const parallaxFactor = opts.parallaxFactor ?? 0.3;

    function updateBgFromWheel(e) {
        accumulatedY += e.deltaY * parallaxFactor * 1; // scale deltaY (can be large)
        const y = clamp(accumulatedY, bgMin, bgMax);
        console.log('wheel event fired! deltaY:', e.deltaY, 'accumulatedY:', accumulatedY, 'clamped y:', y);
        document.documentElement.style.setProperty('--bg-y', `${y}px`);
    }

    wheelHandler = updateBgFromWheel;
    window.addEventListener('wheel', wheelHandler, { passive: true });
    
    // initial set (0)
    document.documentElement.style.setProperty('--bg-y', '0px');
}

export function disposeBackground() {
    window.removeEventListener('wheel', wheelHandler);
    wheelHandler = null;
    accumulatedY = 0;
}