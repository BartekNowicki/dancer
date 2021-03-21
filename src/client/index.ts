import './sass/index.scss';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { getSphere } from './components/getSphere';
import { getCubelettes } from './components/getCubelettes';
import { getButton } from './components/getButton';
import { loadAnimations } from './utils/loadAnimations';
import { getPlane } from './components/getPlane';
import { getDirectionalLight } from './components/getDirectionalLight';
import { getLetters } from './components/getLetters';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { getLoaderBlind } from './components/getLoaderBlind';
import * as CANNON from 'cannon';


const { innerWidth, innerHeight } = window;
const camera = new THREE.PerspectiveCamera(50, 1/1, 0.1, 100);
const wgl = document.getElementById('webgl');
let toppling = false;
const criticalTopCubeletteShift = 0.1;

interface Dimentions {
    w: number;
    h: number;
}


interface ModelDataInterface {
    modelReady: boolean,
    mixer: THREE.AnimationMixer,
    animationActions: THREE.AnimationAction[],
    modelMesh: THREE.Group;
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    animate();
}


const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
if (!wgl) {
    console.warn('WEBGL ELEMENT NOT FOUND');
} else {
    const squareWrapDimentions = Math.min(innerWidth, innerHeight);
    wgl.style.width = squareWrapDimentions * 0.99 + 'px';
    wgl.style.height = squareWrapDimentions * 0.99 + 'px';
    const dimentions: Dimentions = {w: wgl.clientWidth, h: wgl.clientHeight};
    renderer.shadowMap.enabled = true;
    renderer.setSize(dimentions.w, dimentions.h);
    wgl.appendChild(renderer.domElement);    
}


window.addEventListener('resize', onWindowResize, false);

const scene = new THREE.Scene();

const directionalLight = getDirectionalLight(new THREE.Color(0xffffff), 1);
directionalLight.castShadow = true;
directionalLight.position.set( 60, 10, 100 ); 

const plane = getPlane(5.5, 5.5);
plane.position.set(0, 0, 0);
const planeTiltFactor = 1.8; //2
plane.rotation.x = Math.PI/planeTiltFactor;

const sphereRadius = 0.3;
const sphere = getSphere(sphereRadius);

const letters = getLetters('dancer', new THREE.Color(0xff0000), scene);

const cubeletteSize: number = 0.4;
const cubelettes: THREE.Mesh[] = getCubelettes(cubeletteSize);
cubelettes.forEach(cubelette => scene.add(cubelette));

scene.add(plane);
scene.add(directionalLight);

camera.position.set(0, 1, 8);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const stats = Stats();
document.body.appendChild(stats.dom);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.allowSleep = true;

let cannonCubes: CANNON.Body[] = [];
cubelettes.forEach(cubelette => {
    const cannonCubeSize = cubeletteSize / 2;
    const cbs = cannonCubeSize;
    const cannonCube = new CANNON.Box(new CANNON.Vec3(cbs, cbs, cbs));
    const cannonCubeBody = new CANNON.Body({ mass: 1 });
    cannonCubeBody.addShape(cannonCube);
    cannonCubeBody.position.x = cubelette.position.x;
    cannonCubeBody.position.y = cubelette.position.y;
    cannonCubeBody.position.z = cubelette.position.z;
    cannonCubes.push(cannonCubeBody);
    world.addBody(cannonCubeBody);
});

const cannonPlane = new CANNON.Plane();
const planeBody = new CANNON.Body({ mass: 0 });
planeBody.addShape(cannonPlane);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0.9, 0, 0), -Math.PI / (planeTiltFactor + 0.2));
world.addBody(planeBody);

const clock: THREE.Clock = new THREE.Clock();

let mixer: THREE.AnimationMixer;
let modelReady = false;
let model: THREE.Group;
let animationActions: THREE.AnimationAction[] = new Array();
let activeAction: THREE.AnimationAction;
let lastAction: THREE.AnimationAction;

async function getAnimations(): Promise<ModelDataInterface> {
   const gltfData = await loadAnimations();
   return gltfData
}

let initialModelX: number;
let initialModelY: number;
let initialModelZ: number;

getLoaderBlind();

getAnimations().then(promisedData => {
    animationActions = promisedData.animationActions;
    activeAction = animationActions[0];    
    mixer = promisedData.mixer;
    modelReady = promisedData.modelReady;
    model = promisedData.modelMesh;
    scene.add(model);
    scene.add(sphere);
    initialModelX = model.position.x;
    initialModelY = model.position.y;
    initialModelZ = model.position.z;
    sphere.position.set(model.position.x, model.position.y + sphereRadius / 2, model.position.z);
})
.catch(error => {
  console.error('BŁĄD ŁADOWANIA ANIMACJI: ', error);
});

const positionModel = (toX: number, toY: number, toZ: number):void => {    
    TWEEN.removeAll();
    new TWEEN.Tween(model.position).to({ x: toX, y: toY, z: toZ}, 500)
        .onUpdate(() => {})
        .start()
        .onComplete(() => {})
}

let animations = {
    default: function () {
        setAction(animationActions[0]);
    },
    rumba: function () {
        setAction(animationActions[1]);
    },
    hiphop: function () {
        setAction(animationActions[2]);
    },
    stand: function () {
        setAction(animationActions[3]);
    },
    gestureno: function () {
        setAction(animationActions[4]);
    },    
}

const setAction = (toAction: THREE.AnimationAction) => {
    if (toAction != activeAction) {
        lastAction = activeAction;
        activeAction = toAction;
        lastAction.fadeOut(1);
        activeAction.reset();
        activeAction.fadeIn(1);
        activeAction.play();
    }
}


const buttons = [];
const btnWrapper:HTMLDivElement = document.createElement('div');
btnWrapper.classList.add('btnWrapper');
document.getElementById('webgl')?.appendChild(btnWrapper);

const sitButton = getButton('sit');
sitButton.addEventListener('click', () => {
    positionModel(initialModelX, initialModelY, initialModelZ);
    setAction(animationActions[0]);
});
buttons.push(sitButton);

const rumbaButton = getButton('rumba');
rumbaButton.addEventListener('click', () => {
    positionModel(0, -0.2, 1);
    setAction(animationActions[1]);
    if (toppling && getTopCubeletteShift() < criticalTopCubeletteShift) {
        toppling = !toppling
    };
});
buttons.push(rumbaButton);

const hiphopButton = getButton('hiphop');
hiphopButton.addEventListener('click', () => {
    positionModel(0, -0.2, 1);
    setAction(animationActions[2]);
    setTimeout(()=> {
        if (!toppling) {toppling = !toppling}}, 2000);
});
buttons.push(hiphopButton);

const standButton = getButton('stand');
standButton.addEventListener('click', () => {
    positionModel(0, 0.2, 1);
    setAction(animationActions[3]);
    if (toppling && getTopCubeletteShift() < criticalTopCubeletteShift) {
        toppling = !toppling
    };
});
buttons.push(standButton);

buttons.forEach(button => btnWrapper.appendChild(button));


const raycaster = new THREE.Raycaster();
const mouseCalibratedInCanvas = new THREE.Vector2();

function onDoubleClick(event: { clientX: number; clientY: number; }) {
        
    const canvas = document.getElementById('webgl');
    const canvasWidth = canvas?.getBoundingClientRect().width || 1;
    const canvasHeight = canvas?.getBoundingClientRect().height || 1;
    const canvasLeft = canvas?.getBoundingClientRect().left || 1;
    const canvasTop = canvas?.getBoundingClientRect().top || 1;

    mouseCalibratedInCanvas.x = ((event.clientX - canvasLeft) / canvasWidth) * 2 - 1;
    mouseCalibratedInCanvas.y = ((event.clientY - canvasTop) / canvasHeight) * 2 - 1;

    raycaster.setFromCamera(mouseCalibratedInCanvas, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0 && intersects[0].object.name === 'cubelette') {
        const howLong = animationActions[4].getClip().duration * 1000;
        setAction(animationActions[4]);
        positionModel(0, 0.2, 1);
        setTimeout(() => {        
            positionModel(initialModelX, initialModelY, initialModelZ);
            setAction(animationActions[0]);        
        }, howLong);
    }
}

wgl?.addEventListener('click', onDoubleClick, false);
const initialTopCubeletteX = cubelettes[cubelettes.length - 1].position.x;
const initialTopCubeletteZ = cubelettes[cubelettes.length - 1].position.z;
const getTopCubeletteShift = () => Math.max(Math.abs(cubelettes[cubelettes.length - 1].position.x - initialTopCubeletteX), Math.abs(cubelettes[cubelettes.length - 1].position.z - initialTopCubeletteZ));


const animate = () => {
    stats.update();
    renderer.render(scene, camera);
    let delta = clock.getDelta();
    if (delta > .1) { delta = .1; }
    if (toppling) {
        world.step(0.01);
    }
    cubelettes.forEach((cubelette, index) => {
        cubelette.position.set(cannonCubes[index].position.x, cannonCubes[index].position.y, cannonCubes[index].position.z);
        cubelette.quaternion.set(cannonCubes[index].quaternion.x, cannonCubes[index].quaternion.y, cannonCubes[index].quaternion.z, cannonCubes[index].quaternion.w);
    });


    if (modelReady) {
        document.querySelector('.blind')?.remove();
        mixer.update(0.015);
    }

    TWEEN.update();

    requestAnimationFrame(animate);    
};

animate();