export function scaleCanvasToWindow(renderer) {
    const canvas = renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
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