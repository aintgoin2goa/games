import Phaser from "phaser";
import { loadFonts } from "./typography";

import WelcomeScene from "./scenes/WelcomeScene";
import { HEIGHT, WIDTH } from "./constants";
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
    // arcade: {
    //   gravity: { y: 200 },
    // },
  },
  scene: [MazeScene],
};

preload().then(() => new Phaser.Game(config));
