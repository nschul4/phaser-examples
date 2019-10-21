import "phaser";

import { show_all as scale_mode } from '../../common/js/game_scales'

import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";


import { Logger } from "../../common/classes/logger";

Logger.log("top of spaceship game.ts");

var width: number = 400 * 2;
var height: number = 640 * 2;

var config = {

  title: "spaceship",
  url: "https://nschul4.github.io/www/phaser/spaceship",
  version: "1.0.0",

  type: Phaser.AUTO,
  width: width,
  height: height,
  parent: 'phaser-app',
  scene: [BootScene, GameScene],
  backgroundColor: "#000000",
  render: { pixelArt: false, antialias: true },
  scale: {
    parent: 'phaser-app',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: height,
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
};

var game = new Phaser.Game(config);
