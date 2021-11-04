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
import createMaterialSphere from "./Objects/createMaterialShpere";

CameraControls.install({ THREE: THREE });

// Variables
let currentSphereIntersect = null;
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

const sphere1 = createMaterialSphere({ color: 0xff0000 });
const sphere2 = createMaterialSphere({ color: 0x00ff00 });
const sphere3 = createMaterialSphere({ color: 0x0000ff });

camera.add(sphere1);
camera.add(sphere2);
camera.add(sphere3);

sphere1.position.set(0, -0.3, -1);
sphere1.scale.set(0.2, 0.2, 0.2);

sphere2.position.set(-0.3, -0.3, -1);
sphere2.scale.set(0.2, 0.2, 0.2);

sphere3.position.set(0.3, -0.3, -1);
sphere3.scale.set(0.2, 0.2, 0.2);

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
  if (currentSphereIntersect) handleClickOnSphere(currentSphereIntersect, cameraControls);
  else if (currentFloorIntersect) handleClickOnFloor(currentFloorIntersect, cameraControls);
});

console.log(object1);

animate(() => {
  const elapsed = clock.getElapsedTime();
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
  const spheresToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(spheresToTest);

  for (const object of spheresToTest) {
    object.material.color.set("#ff0000");
  }

  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }

  if (intersects.length) {
    if (currentSphereIntersect === null) {
      /* console.log("mouse enter", intersects[0].object); */
    }

    currentSphereIntersect = intersects[0];
  } else {
    if (currentSphereIntersect) {
      /*  console.log("mouse leave", currentSphereIntersect.object); */
    }
    currentSphereIntersect = null;
  }

  // Material Spheres
  const materialSpheresToTest = [sphere1, sphere2, sphere3];
  const intersectedMaterialShpere = raycaster.intersectObjects([sphere1, sphere2, sphere3]);

  for (const object of materialSpheresToTest) {
  }

  for (const intersect of intersectedMaterialShpere) {
    intersect.object.rotation.y = Math.PI * elapsed * 0.4;
    object1.material.color.set("#ffffff");
    object2.material.color.set("#ffffff");
    object3.material.color.set("#ffffff");
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
