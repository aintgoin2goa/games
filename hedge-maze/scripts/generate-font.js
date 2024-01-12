#!/usr/bin/env node

import generator from "@rtpa/phaser-bitmapfont-generator";
import Phaser from "phaser";

(async () => {
  //generate textures
  await generator.TextStyle2BitmapFont({
    path: "../fonts",
    fileName: "Impact",
    textSet: Phaser.GameObjects.RetroFont.TEXT_SET4,
    textStyle: {
      fontFamily: "Impact",
      fontSize: "50px",
      color: "#ffffff",
      shadow: {
        offsetX: 1,
        offsetY: 1,
        blur: 0,
        fill: true,
        stroke: true,
        color: "#000000",
      },
    },
  });

  //exit node
  return process.exit(1);
})();
