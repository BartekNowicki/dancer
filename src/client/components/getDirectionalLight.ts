import * as THREE from "three";

export const getDirectionalLight = (color: THREE.Color, intensity: number): THREE.DirectionalLight => {
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    return directionalLight;
}