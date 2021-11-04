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

CameraControls.install({ THREE: THREE });

let currentIntersect = null;
let currentFloorIntersect = null;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = createCamera({ width: sizes.width, height: sizes.height });
const renderer = createRenderer({ width: sizes.width, height: sizes.height });
const cameraControls = new CameraControls(camera, renderer.domElement);

const floor = createFloor();
scene.add(floor);

const object1 = createSphere({ color: "#ff0000", x: -2, y: 1, z: 0 });
const object2 = createSphere({ color: "#ff0000", x: 0, y: 1, z: 0 });
const object3 = createSphere({ color: "#ff0000", x: 2, y: 1, z: 0 });
scene.add(object1, object2, object3);

const rollOverCircle = createRollOverCircle();
scene.add(rollOverCircle);


const ambientLight = createAmbientLight();
scene.add(ambientLight);

const directionalLight = createDirectionalLight();
scene.add(directionalLight);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (_event) => {
  mouse.x = (_event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(_event.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", (event) => {
  event.stopPropagation();

  if (currentIntersect) {
    console.log("click", currentIntersect.object);

    cameraControls.fitToBox(currentIntersect.object, true);
  } else if (currentFloorIntersect) {
    console.log("click on Floor", currentFloorIntersect);

    cameraControls.moveTo(
      currentFloorIntersect.point.x,
      currentFloorIntersect.point.y,
      currentFloorIntersect.point.z,
      true
    );
  }
});

(function anim() {
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  cameraControls.update(delta);

  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  /*   const intersectGround = raycaster.intersectObject(floor);

  if (intersectGround.length) {
    const intersect = intersectGround[0];
    currentFloorIntersect = intersect;

    const point = new THREE.Vector3(intersect.point.x, intersect.point.y + 0.1, intersect.point.z);
    rollOverMesh.position.copy(point).add(intersect.face.normal);
  } else {
    currentFloorIntersect = null;
  }
 */
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
  requestAnimationFrame(anim);
})();
