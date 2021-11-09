export function handleClickOnShoe(currentIntersect, cameraControls) {
  cameraControls.fitToBox(currentIntersect.object, true);
}

export function handleClickOnFloor(currentFloorIntersect, cameraControls) {
  cameraControls.moveTo(
    currentFloorIntersect.point.x,
    currentFloorIntersect.point.y + 1,
    currentFloorIntersect.point.z,
    true
  );
}
