import "phaser";

import { show_all as scale_mode } from '../../common/js/game_scales'

import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";

var game;

function createGame() {
  var config = {
    title: "rocketenginetest",
    url: "https://nschul4.github.io/www/phaser/rocketenginetest",
    version: "1.0",
    width: 400,
    height: 640,
    type: Phaser.AUTO,
    scene: [BootScene, GameScene],
    backgroundColor: "#000000",
    render: { pixelArt: false, antialias: true }
  };
  game = new Phaser.Game(config);
}

function on_window_resize() { scale_mode(game) }
window.addEventListener("load", createGame, false);
window.addEventListener('load', on_window_resize, false)
window.addEventListener('resize', on_window_resize, false)
