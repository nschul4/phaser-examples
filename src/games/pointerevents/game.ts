import "phaser";

import { show_all as scale_mode } from '../../common/js/game_scales'

import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";
import { Logger } from "../../common/classes/logger";

Logger.log("top of pointerevents game.ts");

var width: number = 1100;
var height: number = 1600;

var config = {

  title: "pointerevents",
  url: "https://nschul4.github.io/www/phaser/pointerevents",
  version: "1.0",

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

let game = new Phaser.Game(config);
