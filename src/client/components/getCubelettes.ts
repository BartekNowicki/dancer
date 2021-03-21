import * as THREE from "three";
import { getCubelette } from './getCubelette';

export const getCubelettes = (size:number): THREE.Mesh[] => {
    const cubelettes: THREE.Mesh[] = [];
      const shift = 0;
      for (let i = 0; i <=4; i++) {
        const cubelette = getCubelette(new THREE.Color(0x8844aa));
        cubelettes.push(cubelette);
        cubelette.position.x = -1.5 + i*shift;
        cubelette.position.z = -0.5;
        cubelette.position.y = i*size + size/2;
      }      
      return cubelettes
};