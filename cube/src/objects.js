import * as THREE from 'three';
import { CUBE_COLOR } from './constants.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({
        color: CUBE_COLOR
    });
    
    const cube = new THREE.Mesh(geometry, material);

    // Create outline
    const outlineGeometry = new THREE.BoxGeometry();
    const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.BackSide,
        wireframe: false
    });
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    outline.scale.set(1.05, 1.05, 1.05); // Slightly larger
    
    const group = new THREE.Group();
    group.add(outline);
    group.add(cube);
    group.rotation.x = 0.5;

    return group;
}

export function createHumanBody() {
    const group = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: CUBE_COLOR });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    group.add(head);
    
    // Torso
    const torsoGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
    const torsoMaterial = new THREE.MeshStandardMaterial({ color: CUBE_COLOR });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = 0.75;
    group.add(torso);
    
    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
    const armMaterial = new THREE.MeshStandardMaterial({ color: CUBE_COLOR });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.7, 0.75, 0);
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.7, 0.75, 0);
    group.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const legMaterial = new THREE.MeshStandardMaterial({ color: CUBE_COLOR });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, -0.75, 0);
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, -0.75, 0);
    group.add(rightLeg);

    group.rotation.x = 0.5;
    
    return group;
}

export async function createJohn() {
    const john = await loadGLB('john.glb', { scale: 1.5, center: true, castShadow: true });
    john.rotation.x = 0.5;

    return john;
}

export async function loadGLB(url, { scale = 1, center = true, castShadow = false } = {}) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    const root = gltf.scene || gltf.scenes[0];

    // Optional: shadow flags
    root.traverse((o) => {
        if (o.isMesh) {
            o.castShadow = castShadow;
            o.receiveShadow = castShadow;
        }
    });

    // Wrap and normalize
    const group = new THREE.Group();
    group.add(root);
    group.scale.setScalar(scale);

    if (center) {
        const box = new THREE.Box3().setFromObject(root);
        const c = box.getCenter(new THREE.Vector3());
        root.position.sub(c); // center at origin
    }

    return group;
}