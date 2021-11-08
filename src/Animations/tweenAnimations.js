import * as TWEEN from "@tweenjs/tween.js";

export function tweenAnimation1(sphere1, sphere2, sphere3) {
  sphere1.visible = true;
  const tween1 = new TWEEN.Tween(sphere1.material).to({ opacity: 1 }, 1000).easing(TWEEN.Easing.Quadratic.In);

  sphere2.visible = true;
  const tween2 = new TWEEN.Tween(sphere2.material).to({ opacity: 1 }, 1000).easing(TWEEN.Easing.Quadratic.In);

  sphere3.visible = true;
  const tween3 = new TWEEN.Tween(sphere3.material).to({ opacity: 1 }, 1000).easing(TWEEN.Easing.Quadratic.In);

  tween1.chain(tween2)
  tween2.chain(tween3);

  tween1.start();
}
