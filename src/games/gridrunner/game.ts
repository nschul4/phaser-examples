import "phaser";

import { show_all as scale_mode } from '../../common/js/game_scales'

import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";


import { Logger } from "../../common/classes/logger";

Logger.log("top of gridrunner game.ts");

var config = {

  title: "gridrunner",
  url: "https://nschul4.github.io/www/phaser/gridrunner",
  version: "1.0",

  type: Phaser.AUTO,
  width: 720,
  height: 400,
  parent: 'phaser-app',
  scene: [BootScene, GameScene],
  backgroundColor: "#000000",
  render: { pixelArt: false, antialias: true },
  scale: {
    parent: 'phaser-app',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 400,
  },

  physics: {
    default: 'matter',
    matter: {
      // debug: true,
      // debugShowInternalEdges: true,
      // debugShowConvexHulls: true
    }
  },
};

var game = new Phaser.Game(config);
