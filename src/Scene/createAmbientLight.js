import * as THREE from "three";

export default function createAmbientLight() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);

  return ambientLight;
}
