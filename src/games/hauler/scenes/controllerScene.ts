import { GameScene } from "./gameScene";

export class ControllerScene extends Phaser.Scene {

  public thrusting: boolean = false;
  public rotatingLeft: boolean = false;
  public rotatingRight: boolean = false;

  private gameScene: GameScene = null;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKeyObj: Phaser.Input.Keyboard.Key;
  private escKeyObj: Phaser.Input.Keyboard.Key;

  private lastFireTime: number = 0;
  private MAX_FIRE_TIME_FREQ = 500;

  private oneThirdHeight: number;
  private twoThirdsHeight: number;
  private oneThirdWidth: number;
  private oneHalfWidth: number;
  private twoThirdsWidth: number;

  constructor() {
    super({
      key: "ControllerScene",
      active: true,
    });
  }

  create(): void {
    var width: number = <number>this.game.config.width;
    var height: number = <number>this.game.config.height;

    this.oneThirdHeight = Math.floor(height / 3);
    this.twoThirdsHeight = Math.floor((height * 2) / 3);
    this.oneThirdWidth = Math.floor(width / 3);
    this.oneHalfWidth = Math.floor(width / 2);
    this.twoThirdsWidth = Math.floor((width * 2) / 3);

    this.input.addPointer(3);
    this.gameScene = (<GameScene>this.scene.get('GameScene'));
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKeyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKeyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  private isPointingLeft(pointer: Phaser.Input.Pointer): boolean {
    return (pointer.y < this.oneThirdHeight // top
      && pointer.x < this.oneThirdWidth)
      ||
      (pointer.y >= this.oneThirdHeight && pointer.y < this.twoThirdsHeight // middle
        && pointer.x < this.oneHalfWidth)
      ||
      (pointer.y >= this.twoThirdsHeight // bottom
        && pointer.x < this.oneThirdWidth
      )
      ;
  }

  private isPointingRight(pointer: Phaser.Input.Pointer): boolean {
    return (pointer.y < this.oneThirdHeight // top
      && pointer.x >= this.twoThirdsWidth)
      ||
      (pointer.y >= this.oneThirdHeight && pointer.y < this.twoThirdsHeight // middle
        && pointer.x >= this.oneHalfWidth)
      ||
      (pointer.y >= this.twoThirdsHeight // bottom
        && pointer.x >= this.twoThirdsWidth
      )
      ;
  }

  private isThrusting(pointer: Phaser.Input.Pointer): boolean {
    return (pointer.y >= this.twoThirdsHeight // bottom
      && (pointer.x >= this.oneThirdWidth && pointer.x < this.twoThirdsWidth)
    )
      ;
  }

  private isFiring(pointer: Phaser.Input.Pointer): boolean {
    return (pointer.y < this.oneThirdHeight // top
      && (pointer.x >= this.oneThirdWidth && pointer.x < this.twoThirdsWidth)
    )
      ;
  }

  update(): void {

    this.thrusting = this.cursors.up.isDown
      ||
      (this.input.mousePointer.isDown && this.isThrusting(this.input.mousePointer))
      ||
      (this.input.pointer1.isDown && this.isThrusting(this.input.pointer1))
      ||
      (this.input.pointer2.isDown && this.isThrusting(this.input.pointer2))
      ||
      (this.input.pointer3.isDown && this.isThrusting(this.input.pointer3))
      ;

    this.rotatingLeft = this.cursors.left.isDown
      ||
      (this.input.mousePointer.isDown && this.isPointingLeft(this.input.mousePointer))
      ||
      (this.input.pointer1.isDown && this.isPointingLeft(this.input.pointer1))
      ||
      (this.input.pointer2.isDown && this.isPointingLeft(this.input.pointer2))
      ||
      (this.input.pointer3.isDown && this.isPointingLeft(this.input.pointer3))
      ;

    this.rotatingRight = this.cursors.right.isDown
      ||
      (this.input.mousePointer.isDown && this.isPointingRight(this.input.mousePointer))
      ||
      (this.input.pointer1.isDown && this.isPointingRight(this.input.pointer1))
      ||
      (this.input.pointer2.isDown && this.isPointingRight(this.input.pointer2))
      ||
      (this.input.pointer3.isDown && this.isPointingRight(this.input.pointer3))
      ;

    var isFiring: boolean = this.spaceKeyObj.isDown
      ||
      (this.input.mousePointer.isDown && this.isFiring(this.input.mousePointer))
      ||
      (this.input.pointer1.isDown && this.isFiring(this.input.pointer1))
      ||
      (this.input.pointer2.isDown && this.isFiring(this.input.pointer2))
      ||
      (this.input.pointer3.isDown && this.isFiring(this.input.pointer3))
      ;

    if (isFiring) {
      var time: number = this.time.now;
      if (time - this.lastFireTime > this.MAX_FIRE_TIME_FREQ) {
        this.lastFireTime = time;
        this.gameScene.fire();
      }
    }

    if (this.escKeyObj.isDown) {
      this.gameScene.pause();
    }
  }
}
