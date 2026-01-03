// 3d resolution
const res_snes = { width: 256, height: 224 };
const res_ps1 = { width: 320, height: 240 };
const res_hd = { width: 1920, height: 1080 };
const res_square = { width: 300, height: 300 };
export const rez = {
    snes: res_snes,
    ps1: res_ps1,
    hd: res_hd,
    square: res_square,
};

// camera
export const ZOOM = 0.15;

// lighting
export const LIGHT_COLOR = 0xFFFFFF;
export const LIGHT_INTENSITY = 5;
export const CUBE_COLOR = 0xBAC9B4;
export const LIGHT_POSITION = { x: 2, y: 7, z: 3 };

// animation
export const ROTATION_SPEED = 0.01;