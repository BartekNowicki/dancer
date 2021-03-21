import * as THREE from "three";

export const getPlane = (width: number, height: number) => {
  
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const planeMaterial = new THREE.MeshStandardMaterial(
        { 
          color: 0xD9FA5C, 
          side: THREE.DoubleSide, 
         });

    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.receiveShadow = true;
    return planeMesh;
}