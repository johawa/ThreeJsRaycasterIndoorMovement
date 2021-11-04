import * as THREE from "three";

export default function createSphere({ color, x, y, z }) {
  const geomerty = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color });
  const sphere = new THREE.Mesh(geomerty, material);
  
  sphere.position.set(x, y, z);

  return sphere;
}
