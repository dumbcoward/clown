import * as THREE from 'three';

const scene = new THREE.Scene();
const INTERNAL_WIDTH = 256;
const INTERNAL_HEIGHT = 224;

// CAMERA
const aspect = INTERNAL_WIDTH / INTERNAL_HEIGHT;
const zoom = 3; // controls how much of the scene you see

const camera = new THREE.OrthographicCamera(
    -aspect * zoom,  // left
    aspect * zoom,   // right
    zoom,            // top
    -zoom,           // bottom
    0.5,             // near. objects closer than this won't be rendered
    1000             // far. objects further than this won't be rendered
);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);


const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('app'),
    alpha: true
});

renderer.setSize(
    INTERNAL_WIDTH,
    INTERNAL_HEIGHT,
    false
);
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0); // 0 = fully transparent
scaleCanvasToWindow();
window.addEventListener('resize', scaleCanvasToWindow);

function scaleCanvasToWindow() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const internalAspect = INTERNAL_WIDTH / INTERNAL_HEIGHT;
    const windowAspect = windowWidth / windowHeight;

    let displayWidth, displayHeight;

    if (windowAspect > internalAspect) {
        // Window is wider → match height
        displayHeight = windowHeight;
        displayWidth = displayHeight * internalAspect;
    } else {
        // Window is taller → match width
        displayWidth = windowWidth;
        displayHeight = displayWidth / internalAspect;
    }

    const canvas = renderer.domElement;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
}

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0xBAC9B4 });


const cube = new THREE.Mesh(geometry, material);
cube.rotation.x = 0.5;
scene.add(cube);

// lighting
const light = new THREE.DirectionalLight(0x8fae72, 1.0);
light.position.set(3, 3, 5);
scene.add(light);


camera.position.z = 3;
//zamn
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    cube.rotation.y += 0.025;

    // Convert mouse to world space
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0);
    vector.unproject(camera);

    // Move cube
    cube.position.x = vector.x;
    cube.position.y = vector.y;




    renderer.render(scene, camera);
}

animate();