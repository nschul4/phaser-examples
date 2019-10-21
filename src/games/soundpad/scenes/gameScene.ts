import { Controller2 } from "../../../common/classes/controller2";

export class GameScene extends Phaser.Scene {

  constructor() {
    super({
      key: "GameScene"
    });
  }

  create(): void {

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    var s1 = this.sound.add("s1");
    var s2 = this.sound.add("s2");
    var s3 = this.sound.add("s3");
    var s4 = this.sound.add("s4");
  }

  public play1(): void {
    this.sound.play("s1");
  }

  public play2(): void {
    this.sound.play("s2");
  }

  public play3(): void {
    this.sound.play("s3");
  }

  public play4(): void {
    this.sound.play("s4");
  }
}
