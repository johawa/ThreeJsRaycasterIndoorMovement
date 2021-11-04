import * as THREE from "three";

export default function createCamera({ width, height }) {
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 100);

  camera.position.set(4, 2, 5);

  return camera;
}
