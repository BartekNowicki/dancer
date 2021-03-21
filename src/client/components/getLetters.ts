import * as THREE from "three";

const loader = new THREE.FontLoader();

export const getLetters = (text: string, color: THREE.Color, mainScene: THREE.Scene) => {

    let letterMesh: THREE.Mesh;
    
    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry(text, {
        //THESE VALUES HAVE THEIR LIMITS
        font: font,
        size: 1, //THIS IS ACTUALLY HIGHT
        height: 0.5, //THIS IS ACTUALLY THICKNESS
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 10,
    });

    const textMaterial = new THREE.MeshPhongMaterial( 
    {
        color: 0xff0000, 
    }
  );

    letterMesh = new THREE.Mesh(textGeometry, textMaterial);
    mainScene.add(letterMesh);
    letterMesh.position.set(-1.75, 0.5, -2.5);
    });
}

