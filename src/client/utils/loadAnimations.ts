import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';  //FOR VANGUARD ANIMATIONS EXCEPT RUNNING

const gltfLoader: GLTFLoader = new GLTFLoader();
let mixer: THREE.AnimationMixer;
let animationActions: THREE.AnimationAction[] = new Array();
let activeAction: THREE.AnimationAction;
let modelMesh: THREE.Group; ///WILL BE USED LATER IN VANGUARD RUNNING, TYPE INFERRED FROM USAGE

interface DataInterface {
    modelReady: boolean,
    mixer: THREE.AnimationMixer,
    animationActions: THREE.AnimationAction[],
    modelMesh: THREE.Group;
}

// export const loadAnimations = (): Promise<DataInterface> => {
export const loadAnimations = (): Promise<any> => {
    
    return new Promise<DataInterface>((resolve, reject) => {
        gltfLoader.load('models/sittingidle.glb',
                (gltf) => {
                    // PREVENT THE MODEL FROM DISAPPEARING COMPLETELY WHEN CAMERA GETS TOO CLOSE
                    gltf.scene.traverse(function (child) {
                        if ((<THREE.Mesh>child).isMesh) {
                            let m = <THREE.Mesh>child
                            m.castShadow = true
                            m.frustumCulled = false;
                            m.geometry.computeVertexNormals()
                        }
                    });
            
                    mixer = new THREE.AnimationMixer(gltf.scene);
            
                    let animationAction = mixer.clipAction((gltf as any).animations[0]);
                    animationActions.push(animationAction);
                    //animationsFolder.add(animations, "default");
                    activeAction = animationActions[0];            
                    //scene.add(gltf.scene);
                    modelMesh = gltf.scene; 
                    modelMesh.position.set(0, 0, 0.5);
                    
                    
                    //add an animation from another file
                    
                    gltfLoader.load('models/rumba.glb',
                        (gltf) => {
                            console.log("loaded rumba");
                            document.documentElement.style.setProperty("--loadProgress", "-75%");
                            let animationAction = mixer.clipAction((gltf as any).animations[0]);
                            animationActions.push(animationAction);
                            //animationsFolder.add(animations, "rumba");
            
                            //add an animation from another file
                            gltfLoader.load('models/hiphop.glb',
                                (gltf) => {
                                    console.log("loaded hiphop");
                                    document.documentElement.style.setProperty("--loadProgress", "-50%");
                                    let animationAction = mixer.clipAction((gltf as any).animations[0]);
                                    animationActions.push(animationAction);
                                    //animationsFolder.add(animations, "hiphop");
            
                                    //add an animation from another file
                                    //make sure the mixamo export option was "walk in place" or the model will move off stage
                                    gltfLoader.load('models/stand.glb',
                                        (gltf) => {
                                            console.log("loaded stand");
                                            document.documentElement.style.setProperty("--loadProgress", "-25%");
                                            //console.log('ANIMACJA I JEJ ŚCIEŻKI: ', gltf.animations[0]);
                                            //MIGHT HAVE TO DELETE SOME TRACKS LIKE... delete the specific track that moves the object forward while running
                                            (gltf as any).animations[0].tracks.shift();
                                            let animationAction = mixer.clipAction((gltf as any).animations[0]);
                                            animationActions.push(animationAction);
                                            //animationsFolder.add(animations, "stand");
                                            
                                                            //add an animation from another file
                                                            //make sure the mixamo export option was "walk in place" or the model will move off stage
                                                            gltfLoader.load('models/gestureno.glb',
                                                                (gltf) => {
                                                                    console.log("loaded gestureno");
                                                                    document.documentElement.style.setProperty("--loadProgress", "-0%");
                                                                    //console.log('ANIMACJA I JEJ ŚCIEŻKI: ', gltf.animations[0]);
                                                                    //MIGHT HAVE TO DELETE SOME TRACKS LIKE... delete the specific track that moves the object forward while running
                                                                    (gltf as any).animations[0].tracks.shift();
                                                                    let animationAction = mixer.clipAction((gltf as any).animations[0]);
                                                                    animationActions.push(animationAction);
                                                                    //animationsFolder.add(animations, "gestureno");
                                                                    
                                                                    //PROMISE SHALL RESOLVE WITH THE FOLLOWING DATA:
                                                                    const data: DataInterface = {
                                                                        modelReady: true,
                                                                        mixer: mixer,
                                                                        animationActions: animationActions,
                                                                        modelMesh: modelMesh,
                                                                    }
                                                                    resolve(data); //CONTENT OF RESOLVE ENDS UP IN gltfData = await loadAnimations();

                                                                },
                                                                (xhr) => {
                                                                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                                                                },
                                                                (error) => {
                                                                    console.log(error);
                                                                }
                                                            )
                                        },
                                        (xhr) => {
                                            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                                        },
                                        (error) => {
                                            console.log(error);
                                        }
                                    )
                                },
                                (xhr) => {
                                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                                },
                                (error) => {
                                    console.log(error);
                                }
                            )
                        },
                        (xhr) => {
                            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                        },
                        (error) => {
                            console.log(error);
                        }
                    )
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.log(error);
                }
            )
  });    
}