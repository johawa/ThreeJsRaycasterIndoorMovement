import * as THREE from "three";

export default function createFloor() {
  const geomerty = new THREE.PlaneGeometry(20, 20);
  const material = new THREE.MeshBasicMaterial({ color: "green" });
  const floor = new THREE.Mesh(geomerty, material);

  floor.rotation.x = -Math.PI * 0.5;
  floor.position.y = 0;

  return floor;
}
