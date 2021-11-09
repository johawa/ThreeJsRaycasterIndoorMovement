import "./style.css";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import CameraControls from "camera-controls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import createFloor from "./Objects/createFloor";
import createRollOverCircle from "./Objects//createRollOverCircle";

import createCamera from "./Scene/createCamera";
import createRenderer from "./Scene/createRenderer";
import createAmbientLight from "./Scene/createAmbientLight";
import createDirectionalLight from "./Scene/createDirectionalLight";
import animate from "./Scene/animate";

import { handleClickOnShoe, handleClickOnFloor } from "./Events/handleClickHandlers";
import { handleResize, handelMouseMove } from "./Events/eventHandlers";
import createMaterialSphere from "./Objects/createMaterialShpere";

import { tweenAnimation1, resetTweenAnimation1 } from "./Animations/tweenAnimations";
import { selectShoeVariant } from "./Animations/selectShoeVariant";

/* CameraControls.install({ THREE: THREE }); */

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");
dracoLoader.setDecoderConfig({ type: "js" });

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Variables
const state = { variant: "midnight" };
let drag = false;
let parser;
let variantsExtension;
let materialShperesVisible = false;
let variants;
let currentMaterialSphereIntersect = null;
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

// Orbitcamera for dev
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.target.set(0, 0, 0);
cameraControls.maxDistance = 2;
cameraControls.minDistance = 1;
cameraControls.update();

// First Person Camera
/* const cameraControls = new CameraControls(camera, renderer.domElement); */
/* cameraControls.minDistance = cameraControls.maxDistance = 1;
cameraControls.azimuthRotateSpeed = -0.3; // negative value to invert rotation direction
cameraControls.polarRotateSpeed = -0.3; // negative value to invert rotation direction
cameraControls.truckSpeed = 10;
cameraControls.mouseButtons.wheel = null;
cameraControls.saveState();
 */

// Lights
scene.add(createAmbientLight());
scene.add(createDirectionalLight());

// Skybox
addSkybox(scene);

// Material Spheres
const materialSphere1 = createMaterialSphere({ index: -1 });
const materialSphere2 = createMaterialSphere({ index: 0 });
const materialSphere3 = createMaterialSphere({ index: 1 });
materialSphere1.name = "midnight";
materialSphere2.name = "beach";
materialSphere3.name = "street";

// Objects
const { floor, rollOverCircle } = addObjects(scene);

// Shoe
/* gltfLoader.load("/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf", function (gltf) {
  gltf.scene.scale.set(10.0, 10.0, 10.0);
  parser = gltf.parser;
  variantsExtension = gltf.userData.gltfExtensions["KHR_materials_variants"];
  variants = variantsExtension.variants.map((variant) => variant.name);
  scene.add(gltf.scene);
});
 */
// Glass
gltfLoader.load("room.glb", function (glb) {
  var model = glb.scene;

  model.position.y = -1;
/* 
  const mirrorGlass = model.children.find((c) => c.name === "Mirror_Glass");

  var box = new THREE.Box3().setFromObject(mirrorGlass);
  console.log(box);

  const geometry = new THREE.CircleGeometry(0.4, 64);
  const groundMirror = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: 20,
    textureHeight: 20,
    color: 0x777777,
  });

  groundMirror.rotateX(Math.PI / 2);

  mirrorGlass.add(groundMirror); */

  console.log(mirrorGlass);

  /*   const glassMaterial = new Reflector(mirrorGlass.geometry, {
    clipBias: 0.003,
    color: 0x889999,
  });  */

  /*   const glassMaterial =  new THREE.MeshStandardMaterial({ color: 0xff0000 });
   */
  /*   mirrorGlass.traverse((o) => {
    if (o.isMesh) o.material = glassMaterial;
  }); */

  scene.add(model);
});

// Events
document.addEventListener("mousedown", () => (drag = false));
document.addEventListener("mousemove", () => (drag = true));

window.addEventListener("resize", () => {
  handleResize({ sizes, camera, renderer });
});

window.addEventListener("mousemove", (_event) => {
  handelMouseMove({ sizes, mouse, _event });
});

window.addEventListener("mouseup", (event) => {
  event.stopPropagation();
  if (drag) return;

  if (currentShoeIntersect) {
    handleClickOnShoe(currentShoeIntersect, cameraControls);
    materialShperesVisible = true;
    camera.add(materialSphere1);
    camera.add(materialSphere2);
    camera.add(materialSphere3);
    tweenAnimation1(materialSphere1, materialSphere2, materialSphere3);
  } else if (currentFloorIntersect) {
    handleClickOnFloor(currentFloorIntersect, cameraControls);
    materialShperesVisible = false;
    camera.remove(materialSphere1);
    camera.remove(materialSphere2);
    camera.remove(materialSphere3);
    resetTweenAnimation1(materialSphere1, materialSphere2, materialSphere3);
  }
  if (currentMaterialSphereIntersect) {
    selectShoeVariant(scene, parser, variantsExtension, currentMaterialSphereIntersect);
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

    const floorIntersectPoint = new THREE.Vector3(intersect.point.x, intersect.point.y + 0.001, intersect.point.z);
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
  if (materialShperesVisible) {
    const materialSpheresToTest = [materialSphere1, materialSphere2, materialSphere3];
    const intersectedMaterialShpere = raycaster.intersectObjects(materialSpheresToTest);

    for (const intersect of intersectedMaterialShpere) {
      intersect.object.rotation.y = Math.PI * clock.getElapsedTime() * 0.4;
    }

    if (intersectedMaterialShpere.length) {
      currentMaterialSphereIntersect = intersectedMaterialShpere[0].object.name;
    } else {
      currentMaterialSphereIntersect = null;
    }
  }

  renderer.render(scene, camera);
});

function addSkybox(scene) {
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    "SkyBox/posx.jpg",
    "SkyBox/negx.jpg",
    "SkyBox/posy.jpg",
    "SkyBox/negy.jpg",
    "SkyBox/posz.jpg",
    "SkyBox/negz.jpg",
  ]);
  scene.background = texture;
}

function addObjects(scene) {
  const floor = createFloor();
  scene.add(floor);

  const rollOverCircle = createRollOverCircle();
  scene.add(rollOverCircle);

  return { floor, rollOverCircle };
}
