import { Scene } from "./scene";
import type { Types } from "phaser";
import { Game, AUTO, Scale } from "phaser";
import { FONTS, HEIGHT, WIDTH } from "./constants";

function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont
    .load()
    .then(function (loaded) {
      document.fonts.add(loaded);
    })
    .catch(function (error) {
      return error;
    });
}

loadFont(FONTS.AvantGardeGothic, "assets/ITCAvantGardeGothicBold.otf");

const config: Types.Core.GameConfig = {
  title: "Connect4",
  type: AUTO,
  backgroundColor: "#ffffff",
  //   transparent: true,
  width: WIDTH,
  height: HEIGHT,
  scale: {
    mode: Scale.FIT,
  },
  scene: Scene,
};

new Game(config);
