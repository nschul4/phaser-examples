import { createPolygon } from "../../../common/createPolygon";

export class GameScene1 extends Phaser.Scene {

  constructor() {
    super({
      key: "GameScene1"
    });
  }

  create(): void {
    console.log("GameScene1");

    // this.matter.world.setBounds(5, 5, width - 10, height - 10);
    this.matter.world.setGravity(0, 0);
    this.matter.world.on(
      'collisionstart', function (event, bodyA, bodyB) {
        console.log("collision");
      }
    );

    this.cameras.main.centerOn(0, 0);

    var g: Phaser.GameObjects.Graphics = this.add.graphics();
    g.lineStyle(2, 0x00ff00, 1);
    g.beginPath();

    var radius: number = 220;

    for (var shift: number = 0; shift < 2 * Math.PI; shift += 2 * Math.PI / 7) {
      for (var i = 0; i <= 4; ++i) {
        var radians = shift + i * Math.PI / 2;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        g.lineTo(x, y);
      }
    }

    // g.closePath();
    g.stroke();
  }
}
