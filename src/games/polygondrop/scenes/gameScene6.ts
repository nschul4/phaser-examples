import { createPolygon } from "../../../common/createPolygon";
import { Goomba } from "../../super-mario-land/objects/goomba";

export class GameScene6 extends Phaser.Scene {

  private go: Phaser.GameObjects.GameObject;

  constructor() {
    super({
      key: "GameScene6"
    });
  }

  create(): void {
    console.log("GameScene6");

    // this.matter.world.setBounds(5, 5, width - 10, height - 10);
    this.matter.world.setGravity(0, 0);
    this.matter.world.on(
      'collisionstart', function (event, bodyA, bodyB) {
        console.log("collision");
      }
    );

    this.cameras.main.centerOn(0, 0);

    var pPoints: string = ''
      + '50 0'
      + ' '
      + '0 50'
      + ' '
      + '50 100'
      + ' '
      + '150 100'
      + ' '
      + '200 50'
      + ' '
      + '150 0'
      + ' '
      + '100 50'
      ;
    createPolygon(this, pPoints, 0, 0, 0x00aa00, true);

    this.add.text(-100, -250, "p = " + pPoints)
      .setWordWrapWidth(200)
      .setAlign("center")
      ;
  }
}
