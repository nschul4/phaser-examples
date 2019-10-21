import { createPolygon } from "../../../common/createPolygon";

export class GameScene4 extends Phaser.Scene {

  constructor() {
    super({
      key: "GameScene4"
    });
  }

  create(): void {
    console.log("GameScene4");

    // this.matter.world.setBounds(5, 5, width - 10, height - 10);
    this.matter.world.setGravity(0, 0);
    this.matter.world.on(
      'collisionstart', function (event, bodyA, bodyB) {
        console.log("collision");
      }
    );

    this.cameras.main.centerOn(0, 0);

    var pPoints: string = ''
      + '0 0'
      + ' '
      + '0 150'
      + ' '
      + '50 150'
      + ' '
      + '50 50'
      ;
    createPolygon(this, pPoints, 0, 0, 0x00aa00, true);

    this.add.text(-100, -250, "p = " + pPoints)
      .setWordWrapWidth(200)
      .setAlign("center")
      ;
  }
}
