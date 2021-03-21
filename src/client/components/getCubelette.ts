import * as THREE from "three";
import floor from '../textures/floor.jpg';

const cubeletteTexture: THREE.Texture = new THREE.TextureLoader().load(floor);
cubeletteTexture.wrapS = THREE.RepeatWrapping;
cubeletteTexture.wrapT = THREE.RepeatWrapping;
const timesToRepeatHorizontally: number = 3;
const timesToRepeatVertically: number = 3;
cubeletteTexture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

export const getCubelette = (color: THREE.Color): THREE.Mesh => {
    const a: number = 0.5;
    const b: number = 0.5;
    const c: number = 0.5;
    const cubeletteGeometry = new THREE.BoxGeometry(a, b, c);
    const cubeletteMaterial = new THREE.MeshStandardMaterial({ 
        map: cubeletteTexture,
        bumpMap: cubeletteTexture,
        roughnessMap: cubeletteTexture,
    });
    const cubeletteMesh = new THREE.Mesh(cubeletteGeometry, cubeletteMaterial);
    cubeletteMesh.castShadow = true;
    cubeletteMesh.receiveShadow = true;
    cubeletteMesh.name = 'cubelette';
    return cubeletteMesh; 
}