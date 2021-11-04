import * as THREE from "three";

export default function createRollOverCircle() {
  const geomerty = new THREE.CircleGeometry(1, 32);
  const material = new THREE.MeshBasicMaterial({ color: "white", opacity: 0.5, transparent: true });
  const rollOverCircle = new THREE.Mesh(geomerty, material);
  rollOverCircle.rotation.x = -Math.PI * 0.5;

  return rollOverCircle;
}
