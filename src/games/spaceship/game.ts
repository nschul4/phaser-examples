/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @description  Asteroid: Game
 * @license      Digitsensitive
 */

import "phaser";

import { show_all as scale_mode } from './game_scales'

import { BootScene } from "./scenes/bootScene";
import { MainMenuScene } from "./scenes/mainMenuScene";
import { GameScene } from "./scenes/gameScene";

var game;

function createGame() {
  var canvas = document.getElementById('game');
  var config = {
    width: 400,
    height: 640,
    type: Phaser.AUTO,
    scene: [BootScene, MainMenuScene, GameScene],
    input: {
      keyboard: true,
      mouse: true,
      touch: false,
      gamepad: false
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    },
  };
  game = new Phaser.Game(config);
}

function on_window_resize() { scale_mode(game) }
window.addEventListener("load", createGame, false);
window.addEventListener('load', on_window_resize, false)
window.addEventListener('resize', on_window_resize, false)
