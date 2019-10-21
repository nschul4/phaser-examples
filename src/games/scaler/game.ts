import "phaser";

import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";
import { GameSceneOverlay } from "./scenes/gameSceneOverlay";
import { ControllerScene } from "./scenes/controllerScene";
import { Logger } from "../../common/classes/logger";

Logger.log("top of scaler game.ts");

export var g_version: string = "1.0.0";
var width: number = 1000;
var height: number = 1440;

const config = {

  title: "scaler",
  url: "https://nschul4.github.io/www/phaser/scaler",
  version: g_version,

  type: Phaser.AUTO,
  width: width,
  height: height,
  parent: 'phaser-app',
  scene: [BootScene, ControllerScene, GameSceneOverlay, GameScene],
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
      // showBodies: false,
      // debugWireframes: false,
      // debugShowInternalEdges: true,
      // debugShowConvexHulls: true,
    }
  },
};

let game = new Phaser.Game(config);
