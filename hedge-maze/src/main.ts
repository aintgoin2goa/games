import Phaser from "phaser";
import { loadFonts } from "./lib/typography";

import WelcomeScene from "./scenes/WelcomeScene";
import { HEIGHT, WIDTH } from "./lib/constants";
import MazeScene from "./scenes/MazeScene";
import LevelIntroScene from "./scenes/LevelIntro";

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
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [WelcomeScene, MazeScene, LevelIntroScene],
  transparent: true,
};

preload().then(() => new Phaser.Game(config));
