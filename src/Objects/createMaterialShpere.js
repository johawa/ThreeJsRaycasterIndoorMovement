import * as THREE from "three";
import { TextureLoader } from "three";

const beach = new THREE.TextureLoader().load("/MaterialsVariantsShoe/glTF/diffuseBeach.jpg");
const midnight = new THREE.TextureLoader().load("/MaterialsVariantsShoe/glTF/diffuseMidnight.jpg");
const street = new THREE.TextureLoader().load("/MaterialsVariantsShoe/glTF/diffuseStreet.jpg");

export default function createMaterialSphere({ index }) {
  const geomerty = new THREE.SphereGeometry(0.5, 16, 16);
  let material;

  switch (index) {
    case -1:
      material = new THREE.MeshBasicMaterial({ map: midnight, transparent: true, color: "white" });
      break;
    case 0:
      material = new THREE.MeshBasicMaterial({ map: beach, transparent: true, color: "white" });
      break;
    case 1:
      material = new THREE.MeshBasicMaterial({ map: street, transparent: true, color: "white" });
      break;
    default:
      material = new THREE.MeshBasicMaterial({ map: midnight, transparent: true, color: "white" });
      break;
  }

  const sphere = new THREE.Mesh(geomerty, material);

  sphere.scale.set(0.2, 0.2, 0.2);
  sphere.position.set(0.3 * index, -0.3, -1);

  sphere.material.opacity = 0;
  sphere.visible = true;

  return sphere;
}
