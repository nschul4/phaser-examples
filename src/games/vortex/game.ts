import "phaser";
import { GameScene } from "./scenes/gameScene";
import { Logger } from "../../common/classes/logger";

var nameOfTheGame: string = "vortex";

Logger.log("top of " + nameOfTheGame + " game.ts");

var width: number = 1000;
var height: number = 1440;

var config = {

  title: nameOfTheGame,
  url: "https://nschul4.github.io/www/phaser/" + nameOfTheGame,
  version: "1.0",

  type: Phaser.AUTO,
  width: width,
  height: height,
  parent: 'phaser-app',
  scene: [GameScene],
  backgroundColor: "#ffffff",
  // render: {
  //   pixelArt: false,
  //   antialias: true,
  // },
  scale: {
    parent: 'phaser-app',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: height,
  },
};

let game = new Phaser.Game(config);
