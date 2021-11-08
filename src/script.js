import "./style.css";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import CameraControls from "camera-controls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import createSphere from "./Objects/createSphere";
import createFloor from "./Objects/createFloor";
import createRollOverCircle from "./Objects//createRollOverCircle";

import createCamera from "./Scene/createCamera";
import createRenderer from "./Scene/createRenderer";
import createAmbientLight from "./Scene/createAmbientLight";
import createDirectionalLight from "./Scene/createDirectionalLight";
import animate from "./Scene/animate";

import { handleClickOnSphere, handleClickOnFloor } from "./Events/handleClickHandlers";
import { handleResize, handelMouseMove } from "./Events/eventHandlers";
import createMaterialSphere from "./Objects/createMaterialShpere";

import { tweenAnimation1, resetTweenAnimation1 } from "./Animations/tweenAnimations";

CameraControls.install({ THREE: THREE });

// Variables
let currentShoeIntersect = null;
let currentFloorIntersect = null;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Init
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const renderer = createRenderer({ width: sizes.width, height: sizes.height });
const camera = createCamera({ width: sizes.width, height: sizes.height });
scene.add(camera);
const cameraControls = new CameraControls(camera, renderer.domElement);

// Lights
scene.add(createAmbientLight());
scene.add(createDirectionalLight());

// Material Spheres
const materialSphere1 = createMaterialSphere({ color: 0xff0000, index: -1 });
const materialSphere2 = createMaterialSphere({ color: 0x00ff00, index: 0 });
const materialSphere3 = createMaterialSphere({ color: 0x0000ff, index: 1 });

// Chair
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");
dracoLoader.setDecoderConfig({ type: "js" });

const gltfLoader = new GLTFLoader().setPath("/MaterialsVariantsShoe/glTF/");
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("MaterialsVariantsShoe.gltf", function (gltf) {
  gltf.scene.scale.set(10.0, 10.0, 10.0);

  scene.add(gltf.scene);

  console.log("MaterialsVariantsShoe", gltf.scene);
});

// Objects
const { floor, rollOverCircle } = addObjects(scene);

// Events
window.addEventListener("resize", () => {
  handleResize({ sizes, camera, renderer });
});

window.addEventListener("mousemove", (_event) => {
  handelMouseMove({ sizes, mouse, _event });
});

window.addEventListener("click", (event) => {
  event.stopPropagation();
  if (currentShoeIntersect) {
    handleClickOnSphere(currentShoeIntersect, cameraControls);
    camera.add(materialSphere1);
    camera.add(materialSphere2);
    camera.add(materialSphere3);
    tweenAnimation1(materialSphere1, materialSphere2, materialSphere3);
  } else if (currentFloorIntersect) {
    handleClickOnFloor(currentFloorIntersect, cameraControls);
    camera.remove(materialSphere1);
    camera.remove(materialSphere2);
    camera.remove(materialSphere3);
    resetTweenAnimation1(materialSphere1, materialSphere2, materialSphere3);
  }
});

animate(() => {
  const delta = clock.getDelta();

  cameraControls.update(delta);
  TWEEN.update();

  raycaster.setFromCamera(mouse, camera);

  // Floor
  const intersectedFloor = raycaster.intersectObject(floor);

  if (intersectedFloor.length) {
    const intersect = intersectedFloor[0];
    currentFloorIntersect = intersect;

    const floorIntersectPoint = new THREE.Vector3(intersect.point.x, intersect.point.y + 0.1, intersect.point.z);
    rollOverCircle.position.copy(floorIntersectPoint).add(intersect.face.normal);
  } else {
    currentFloorIntersect = null;
  }

  // Shoe
  const shoeObject = scene.getObjectByName("Shoeobj");

  if (shoeObject) {
    const intersectShoe = raycaster.intersectObject(shoeObject, true);

    if (intersectShoe.length) {
      currentShoeIntersect = intersectShoe[0];
    } else {
      currentShoeIntersect = null;
    }
  }

  // Material Spheres
  const materialSpheresToTest = [materialSphere1, materialSphere2, materialSphere3];
  const intersectedMaterialShpere = raycaster.intersectObjects([materialSphere1, materialSphere2, materialSphere3]);

  for (const object of materialSpheresToTest) {
  }

  for (const intersect of intersectedMaterialShpere) {
    intersect.object.rotation.y = Math.PI * clock.getElapsedTime() * 0.4;
  }

  renderer.render(scene, camera);
});

function addObjects(scene) {
  const floor = createFloor();
  scene.add(floor);

  /*   const object1 = createSphere({ color: "#ff0000", x: -2, y: 1, z: 0 });
  const object2 = createSphere({ color: "#ff0000", x: 0, y: 1, z: 0 });
  const object3 = createSphere({ color: "#ff0000", x: 2, y: 1, z: 0 });
  scene.add(object1, object2, object3);
 */
  const rollOverCircle = createRollOverCircle();
  scene.add(rollOverCircle);

  return { /* object1, object2, object3, */ floor, rollOverCircle };
}
