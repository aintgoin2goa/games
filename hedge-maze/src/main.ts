import Phaser from "phaser";
import { loadFonts } from "./typography";

import WelcomeScene from "./WelcomeScene";
import { HEIGHT, WIDTH } from "./constants";

const preload = async () => {
  await loadFonts();
};

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: WIDTH,
  height: HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [WelcomeScene],
};

preload().then(() => new Phaser.Game(config));
