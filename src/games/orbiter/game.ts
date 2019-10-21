import "phaser";

import { show_all as scale_mode } from '../../common/js/game_scales'

import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";

const config = {

  title: "orbiter",
  url: "https://nschul4.github.io/www/phaser/orbiter",
  version: "1.0",

  type: Phaser.AUTO,
  width: 1440,
  height: 720,
  parent: 'phaser-app',
  scene: [BootScene, GameScene],
  backgroundColor: "#111111",

  scale: {
    parent: 'phaser-app',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1440,
    height: 720
  },
};

let game = new Phaser.Game(config);
