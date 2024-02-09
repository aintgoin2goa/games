import { Scene } from "phaser";
import VirtualJoyStick from "phaser3-rex-plugins/plugins/virtualjoystick";
import { HEIGHT, WIDTH } from "./lib/constants";

const RADIUS = 75;
const KNOB_RADIUS = 25;

const ATLAS_KEY = "joystick";
const ATLAS_IMG = "sprites/joystick.png";
const ATLAS_JSON = "sprites/joystick.json";

enum Textures {
  OUTER = "joystick-outer",
  INNER = "joytick-inner",
}

enum Frames {
  OUTER = "Joystick.png",
  INNER = "SmallHandleFilled.png",
}

export class Joystick {
  joystick: VirtualJoyStick;
  scene: Scene;
  disabled: boolean;

  static load(scene: Scene) {
    scene.load.atlas(ATLAS_KEY, ATLAS_IMG, ATLAS_JSON);
  }

  constructor(scene: Scene) {
    scene.textures.addSpriteSheetFromAtlas(Textures.OUTER, {
      atlas: ATLAS_KEY,
      frame: Frames.OUTER,
      frameWidth: RADIUS * 2,
      frameHeight: RADIUS * 2,
    });
    scene.textures.addSpriteSheetFromAtlas(Textures.INNER, {
      atlas: ATLAS_KEY,
      frame: Frames.INNER,
      frameWidth: KNOB_RADIUS * 2,
      frameHeight: KNOB_RADIUS * 2,
    });

    this.joystick = new VirtualJoyStick(scene, {
      radius: RADIUS,
      x: WIDTH - RADIUS,
      y: HEIGHT - RADIUS,
      base: scene.make.sprite({ key: Textures.OUTER }),
      thumb: scene.make.sprite({ key: Textures.INNER }),
    });
    this.disable();
    window.addEventListener("touchstart", () => {
      this.enable();
    });
  }

  cursorKeys() {
    return this.joystick.createCursorKeys();
  }

  disable() {
    this.disabled = true;
    this.hide();
  }

  enable() {
    this.disabled = false;
    this.show();
  }

  hide() {
    this.joystick.setVisible(false);
    this.joystick.setEnable(false);
  }

  show() {
    if (this.disabled) {
      return;
    }

    this.joystick.setVisible(true);
    this.joystick.setEnable(true);
  }
}
