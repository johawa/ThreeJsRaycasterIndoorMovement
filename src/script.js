import "./style.css";
import * as THREE from "three";
import CameraControls from "camera-controls";

CameraControls.install({ THREE: THREE });

let currentIntersect = null;
let currentFloorIntersect = null;
const width = window.innerWidth;
const height = window.innerHeight;
const canvas = document.querySelector("canvas.webgl");
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 100);

camera.position.set(4, 2, 5);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);

const cameraControls = new CameraControls(camera, renderer.domElement);

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;
object1.position.y = 1;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object2.position.y = 1;

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;
object3.position.y = 1;

scene.add(object1, object2, object3);
/**
 * Floor
 */

const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: "#a9c388" }));
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

const rollOverGeo = new THREE.CircleGeometry(1, 32);
const rollOverMaterial = new THREE.MeshBasicMaterial({ color: "white", opacity: 0.5, transparent: true });
const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
rollOverMesh.rotation.x = -Math.PI * 0.5;

scene.add(rollOverMesh);
console.log(rollOverMesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
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

    cameraControls.moveTo(
      currentIntersect.object.position.x,
      currentIntersect.object.position.y,
      currentIntersect.object.position.z,
      true
    );
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

  const intersectGround = raycaster.intersectObject(floor);

  if (intersectGround.length) {
    const intersect = intersectGround[0];
    currentFloorIntersect = intersect;

    const point = new THREE.Vector3(intersect.point.x, intersect.point.y + 0.1, intersect.point.z);
    rollOverMesh.position.copy(point).add(intersect.face.normal);
  } else {
    currentFloorIntersect = null;
  }

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
