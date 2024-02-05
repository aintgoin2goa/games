import { Scene } from "phaser";

export type Animation = {
  key: string;
  texture: string;
  prefix: string;
  start: number;
  end: number;
  frameRate: number;
  repeat: number;
};

export const createAnimation = (scene: Scene, animation: Animation) => {
  if (scene.anims.exists(animation.key)) {
    return;
  }

  const { prefix, start, end, key, frameRate, repeat } = animation;

  const frames = scene.anims.generateFrameNames(animation.texture, {
    prefix,
    suffix: ".png",
    start,
    end,
    zeroPad: 3,
  });

  scene.anims.create({
    key,
    frames,
    frameRate,
    repeat,
  });
};

export const createAnimations = (scene: Scene, animations: Animation[]) => {
  for (const anim of animations) {
    createAnimation(scene, anim);
  }
};
