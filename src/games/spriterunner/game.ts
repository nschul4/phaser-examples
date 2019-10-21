import "phaser";

import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";
import { Logger } from "../../common/classes/logger";

Logger.log("top of spriterunner game.ts");

export var g_version: string = "1.0.0";
var width: number = 740;
var height: number = 360;

const config = {

  title: "spriterunner",
  url: "https://nschul4.github.io/www/phaser/spriterunner",
  version: g_version,

  type: Phaser.AUTO,
  width: width,
  height: height,
  scene: [BootScene, GameScene],
  scale: {
    parent: 'phaser-app',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: height,
  },
  backgroundColor: "#000000",
  render: { pixelArt: false, antialias: true },

  physics: {
    default: 'matter',
    matter: {
      // debug: true,
      // debugShowInternalEdges: true,
      // debugShowConvexHulls: true
    }
  },
};


let game = new Phaser.Game(config);
