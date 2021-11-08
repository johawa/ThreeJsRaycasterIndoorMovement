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

import { handleClickOnShoe, handleClickOnFloor } from "./Events/handleClickHandlers";
import { handleResize, handelMouseMove } from "./Events/eventHandlers";
import createMaterialSphere from "./Objects/createMaterialShpere";

import { tweenAnimation1, resetTweenAnimation1 } from "./Animations/tweenAnimations";

CameraControls.install({ THREE: THREE });

// Variables
const state = { variant: "midnight" };
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
const cameraControls = new CameraControls(camera, renderer.domElement);

// Lights
scene.add(createAmbientLight());
scene.add(createDirectionalLight());

// Material Spheres
const materialSphere1 = createMaterialSphere({ index: -1 });
const materialSphere2 = createMaterialSphere({ index: 0 });
const materialSphere3 = createMaterialSphere({ index: 1 });
materialSphere1.name = "midnight";
materialSphere2.name = "beach";
materialSphere3.name = "street";

// Chair
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");
dracoLoader.setDecoderConfig({ type: "js" });

const gltfLoader = new GLTFLoader().setPath("/MaterialsVariantsShoe/glTF/");
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("MaterialsVariantsShoe.gltf", function (gltf) {
  gltf.scene.scale.set(10.0, 10.0, 10.0);
  scene.add(gltf.scene);
  parser = gltf.parser;
  variantsExtension = gltf.userData.gltfExtensions["KHR_materials_variants"];
  variants = variantsExtension.variants.map((variant) => variant.name);
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
    selectVariant(scene, parser, variantsExtension, currentMaterialSphereIntersect);
    console.log("click on MaterialSphere", currentMaterialSphereIntersect);
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

function selectVariant(scene, parser, extension, variantName) {
  const variantIndex = extension.variants.findIndex((v) => v.name.includes(variantName));

  scene.traverse(async (object) => {
    if (!object.isMesh || !object.userData.gltfExtensions) return;

    const meshVariantDef = object.userData.gltfExtensions["KHR_materials_variants"];

    if (!meshVariantDef) return;

    if (!object.userData.originalMaterial) {
      object.userData.originalMaterial = object.material;
    }

    const mapping = meshVariantDef.mappings.find((mapping) => mapping.variants.includes(variantIndex));

    if (mapping) {
      object.material = await parser.getDependency("material", mapping.material);
      parser.assignFinalMaterial(object);
    } else {
      object.material = object.userData.originalMaterial;
    }
  });
}

function addObjects(scene) {
  const floor = createFloor();
  scene.add(floor);

  const rollOverCircle = createRollOverCircle();
  scene.add(rollOverCircle);

  return { floor, rollOverCircle };
}
