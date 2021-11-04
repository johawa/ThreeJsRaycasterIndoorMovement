import "./style.css";
import * as THREE from "three";
import CameraControls from "camera-controls";

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

CameraControls.install({ THREE: THREE });

// Variables
let currentIntersect = null;
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
const cameraControls = new CameraControls(camera, renderer.domElement);

// Lights
scene.add(createAmbientLight());
scene.add(createDirectionalLight());

// Objects
const { object1, object2, object3, floor, rollOverCircle } = addObjects(scene);

// Events
window.addEventListener("resize", () => {
  handleResize({ sizes, camera, renderer });
});

window.addEventListener("mousemove", (_event) => {
  handelMouseMove({ sizes, mouse, _event });
});

window.addEventListener("click", (event) => {
  event.stopPropagation();
  if (currentIntersect) handleClickOnSphere(currentIntersect, cameraControls);
  else if (currentFloorIntersect) handleClickOnFloor(currentFloorIntersect, cameraControls);
});

animate(() => {
  // const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta();

  cameraControls.update(delta);
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

  // Sphere
  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  for (const object of objectsToTest) {
    object.material.color.set("#ff0000");
  }

  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }

  if (intersects.length) {
    if (currentIntersect === null) {
      /* console.log("mouse enter", intersects[0].object); */
    }

    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      /*  console.log("mouse leave", currentIntersect.object); */
    }
    currentIntersect = null;
  }

  renderer.render(scene, camera);
});

function addObjects(scene) {
  const floor = createFloor();
  scene.add(floor);

  const object1 = createSphere({ color: "#ff0000", x: -2, y: 1, z: 0 });
  const object2 = createSphere({ color: "#ff0000", x: 0, y: 1, z: 0 });
  const object3 = createSphere({ color: "#ff0000", x: 2, y: 1, z: 0 });
  scene.add(object1, object2, object3);

  const rollOverCircle = createRollOverCircle();
  scene.add(rollOverCircle);

  return { object1, object2, object3, floor, rollOverCircle };
}
