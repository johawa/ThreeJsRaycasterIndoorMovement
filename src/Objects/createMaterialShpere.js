import * as THREE from "three";

export default function createMaterialSphere({ color, index }) {
  const geomerty = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
  const sphere = new THREE.Mesh(geomerty, material);

  sphere.scale.set(0.2, 0.2, 0.2);
  sphere.position.set(0.3 * index, -0.3, -1);

  return sphere;
}
