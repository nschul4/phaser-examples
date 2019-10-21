import { GameScene } from "./gameScene";

export class ControllerScene extends Phaser.Scene {

  public thrusting: boolean = false;
  public rotatingLeft: boolean = false;
  public rotatingRight: boolean = false;

  private gameScene: GameScene = null;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private escKeyObj: Phaser.Input.Keyboard.Key;
  private isPointerDown: boolean = false;

  private spaceKeyObj: Phaser.Input.Keyboard.Key;
  private lastFireTime: number = 0;
  private MAX_FIRE_TIME_FREQ = 100;

  constructor() {
    super({
      key: "ControllerScene",
      active: true,
    });
  }

  private resetPointerInput(): void {
    this.thrusting = false;
    this.rotatingLeft = false;
    this.rotatingRight = false;
  }

  private handlePointerInput(pointer): void {
    // console.log("x=" + pointer.x + ", y=" + pointer.y);
    var width: number = <number>this.game.config.width;
    var height: number = <number>this.game.config.height;
    // console.log("width=" + width + ", height=" + height);
    var twoThirdsHeight: number = (height * 2) / 3;
    var oneThirdWidth: number = width / 3;
    var twoThirdsWidth: number = (width * 2) / 3;
    this.resetPointerInput();
    if ((<number>pointer.y) > twoThirdsHeight) {
      this.thrusting = true;
      // console.log("thrusting");
    }
    if ((<number>pointer.x) < oneThirdWidth) {
      this.rotatingLeft = true;
      // console.log("rotatingLeft");
    } else if ((<number>pointer.x) > twoThirdsWidth) {
      this.rotatingRight = true;
      // console.log("rotatingRight");
    }
  }

  create(): void {
    this.gameScene = (<GameScene>this.scene.get('GameScene'));
    this.cursors = this.input.keyboard.createCursorKeys();
    this.escKeyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.input.on('pointerdown', function (pointer) {
      this.isPointerDown = true;
      this.handlePointerInput(pointer);
    }, this);
    this.input.on('pointerup', function (pointer) {
      this.isPointerDown = false;
      this.resetPointerInput(pointer);
    }, this);
    this.input.on('pointermove', function (pointer) {
      if (this.isPointerDown) {
        this.handlePointerInput(pointer);
      }
    }, this);
    this.spaceKeyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update(time: number, delta: number): void {

    if (this.escKeyObj.isDown) {
      this.gameScene.pause();
    }

    if (this.cursors.up.isDown) {
      this.thrusting = true;
    } else if (!this.isPointerDown) {
      this.thrusting = false;
    }

    if (this.cursors.left.isDown) {
      this.rotatingLeft = true;
      this.rotatingRight = false;
    } else if (this.cursors.right.isDown) {
      this.rotatingLeft = false;
      this.rotatingRight = true;
    } else if (!this.isPointerDown) {
      this.rotatingLeft = false;
      this.rotatingRight = false;
    }

    if (this.spaceKeyObj.isDown) {
      if (time - this.lastFireTime > this.MAX_FIRE_TIME_FREQ) {
        this.lastFireTime = time;
        this.gameScene.fire();
      }
    }
  }
}
