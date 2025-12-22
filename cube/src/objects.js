import * as THREE from 'three';
import { CUBE_COLOR } from './constants.js';

export function createCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: CUBE_COLOR });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = 0.5;
    
    return cube;
}

export function createHumanBody() {
    const group = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    group.add(head);
    
    // Torso
    const torsoGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
    const torsoMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = 0.75;
    group.add(torso);
    
    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.7, 0.75, 0);
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.7, 0.75, 0);
    group.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2c5f2d });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, -0.75, 0);
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, -0.75, 0);
    group.add(rightLeg);

    group.rotation.x = 0.75;
    
    return group;
}