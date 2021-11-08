import * as TWEEN from "@tweenjs/tween.js";
let tween1;
let tween2;
let tween3;

export function tweenAnimation1(sphere1, sphere2, sphere3) {
  sphere1.visible = true;
  tween1 = new TWEEN.Tween(sphere1.material).to({ opacity: 1 }, 500).easing(TWEEN.Easing.Quadratic.In);

  sphere2.visible = true;
  tween2 = new TWEEN.Tween(sphere2.material).to({ opacity: 1 }, 500).easing(TWEEN.Easing.Quadratic.In);

  sphere3.visible = true;
  tween3 = new TWEEN.Tween(sphere3.material).to({ opacity: 1 }, 500).easing(TWEEN.Easing.Quadratic.In);

  tween1.chain(tween2);
  tween2.chain(tween3);

  tween1.start();
}

export function resetTweenAnimation1(sphere1, sphere2, sphere3) {
  if (tween1) tween1.stop();
  if (tween2) tween2.stop();
  if (tween3) tween3.stop();

  sphere1.visible = false;
  sphere2.visible = false;
  sphere3.visible = false;

  sphere1.material.opacity = 0;
  sphere2.material.opacity = 0;
  sphere3.material.opacity = 0;
}
