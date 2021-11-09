import * as THREE from "three";

export default function createCamera({ width, height }) {
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 100);
  const EPS = 1e-5;
  // in order to archive FPS look, set EPSILON for the distance to the center
  camera.position.set(0, 0, EPS);

  return camera;
}
