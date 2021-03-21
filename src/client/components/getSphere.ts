import * as THREE from "three";
import planet from '../textures/planet.jpg';

const sphereTexture: THREE.Texture = new THREE.TextureLoader().load(planet);
sphereTexture.wrapS = THREE.RepeatWrapping;
sphereTexture.wrapT = THREE.RepeatWrapping;
const timesToRepeatHorizontally: number = 10;
const timesToRepeatVertically: number = 10;
sphereTexture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

export const getSphere = (radius: number): THREE.Mesh => {
    const sphereGeometry = new THREE.SphereGeometry(radius, 24, 24);
    const sphereMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        map: sphereTexture,
        bumpMap: sphereTexture,
        roughnessMap: sphereTexture,
        roughness: 0.65,
        metalness: 0.75,
        bumpScale: 0.01,        
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    return sphereMesh; 
}