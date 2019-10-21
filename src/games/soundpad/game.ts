import "phaser";

import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";
import { ControllerScene } from "./scenes/controllerScene";
import { Logger } from "../../common/classes/logger";

Logger.log("top of soundpad game.ts");

export var g_version: string = "1.0.0";
var width: number = 720 * 3;
var height: number = 400 * 3;

var config = {

  title: "soundpad",
  url: "https://nschul4.github.io/www/phaser/soundpad",
  version: g_version,

  width: width,
  height: height,
  type: Phaser.AUTO,
  scene: [BootScene, GameScene, ControllerScene],
  backgroundColor: "#000000",
  render: { pixelArt: false, antialias: true },
  scale: {
    parent: 'phaser-app',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: height,
  },
};

var game = new Phaser.Game(config);
