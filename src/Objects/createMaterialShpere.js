import * as THREE from "three";

export default function createMaterialSphere({ color }) {
  const geomerty = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
  const sphere = new THREE.Mesh(geomerty, material);

  return sphere;
}
