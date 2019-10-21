import "phaser";

import { show_all as scale_mode } from '../../common/js/game_scales'

import { BootScene } from "./scenes/bootScene";
import { MainScene } from "./scenes/mainScene";
import { GameScene1 } from "./scenes/gameScene1";
import { GameScene2 } from "./scenes/gameScene2";
import { GameScene3 } from "./scenes/gameScene3";
import { GameScene4 } from "./scenes/gameScene4";
import { GameScene5 } from "./scenes/gameScene5";
import { GameScene6 } from "./scenes/gameScene6";
import { GameScene7 } from "./scenes/gameScene7";

import { Logger } from "../../common/classes/logger";

Logger.log("top of polygondrop game.ts");

var width: number = 500;
var heigt: number = 640;

var config = {

  title: "polygondrop",
  url: "https://nschul4.github.io/www/phaser/polygondrop",
  version: "1.0",

  width: width,
  height: heigt,
  type: Phaser.AUTO,
  scene: [
    BootScene,
    MainScene,
    GameScene1, GameScene2, GameScene3, GameScene4, GameScene5, GameScene6, GameScene7,
  ],
  backgroundColor: "#000000",
  render: { pixelArt: false, antialias: true },
  scale: {
    parent: 'phaser-app',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: heigt,
  },

  physics: {
    default: 'matter',
    matter: {
      debug: true,
      debugShowInternalEdges: true,
      debugShowConvexHulls: true
    }
  },
};

var game = new Phaser.Game(config);
