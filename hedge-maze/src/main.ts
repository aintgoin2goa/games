import Phaser from "phaser";
import { loadFonts } from "./lib/typography";

import WelcomeScene from "./scenes/WelcomeScene";
import { HEIGHT, WIDTH } from "./lib/constants";
import MazeScene from "./scenes/MazeScene";

const preload = async () => {
  await loadFonts();
};

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: "#FFFFFF",
  physics: {
    default: "arcade",
  },
  scene: [WelcomeScene, MazeScene],
};

preload().then(() => new Phaser.Game(config));
