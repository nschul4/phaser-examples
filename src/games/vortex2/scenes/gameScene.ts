import { scaleFromRangeToRange } from "../../../common/scaleFromRangeToRange";

export class GameScene extends Phaser.Scene {

  // private debug: boolean = true;
  private debug: boolean = false;
  private debugText: Phaser.GameObjects.Text;

  private width: number = 0;
  private height: number = 0;
  private maxDistance: number = 0;

  private gArr: Phaser.GameObjects.Graphics[] = [];
  private angleSpeedDrag: number = 0.02;
  private angleSpeed: number = 1;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  create(): void {
    this.width = <number>this.game.config.width;
    this.height = <number>this.game.config.height;
    this.maxDistance = Phaser.Math.Distance.Between(
      this.width / 2, this.height / 2,
      this.width, this.height
    );

    if (this.debug) {
      this.debugText = this.add.text(
        -this.width / 2, -this.height / 2,
        "",
        {
          fontSize: 32 + 'px',
          color: 'blue',
          backgroundColor: 'white',
          fontStyle: 'bold',
          strokeThickness: 2,
        },
      );
      this.debugText.setOrigin(0, 0);
      this.debugText.depth = 4;
    }

    this.input.addPointer(1);

    this.cameras.main.centerOn(0, 0);

    var radiusArr = [
      this.height / 6,
      this.height / 2 - 240,
      this.height / 2 - 38,
      this.height / 2 + 127,
    ];
    for (var i = 0; i < 4; ++i) {
      var g: Phaser.GameObjects.Graphics = this.add.graphics();
      g.lineStyle(32, 0x000000, 1);
      this.drawVortexPath(g, radiusArr[i], i + 2);
      this.gArr.push(g);
    }

    this.input.on('pointermove', function (pointer) {
      if (this.debug) {
        console.log("pointermove: " + pointer.distance);
      }
      this.angleSpeed = scaleFromRangeToRange(0, this.maxDistance, -2, 2, pointer.distance);
    }, this);
  }

  private drawVortexPath(g: Phaser.GameObjects.Graphics, radius: number, div: number) {
    for (var i = 0; i < 21; ++i) {
      var shift = i * 2 * Math.PI / 64;
      g.beginPath();
      for (var j = 0; j < div; ++j) {
        var radians = shift + j * 2 * Math.PI / div;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        if (j == 0) {
          g.moveTo(x, y);
        } else {
          g.lineTo(x, y);
        }
      }
      g.closePath();
    }
    g.stroke();
  }

  update(): void {

    if (this.debug) {
      var pointer = this.input.activePointer;
      this.debugText.setText([
        'x: ' + pointer.x,
        'y: ' + pointer.y,
        // 'mid x: ' + pointer.midPoint.x,
        // 'mid y: ' + pointer.midPoint.y,
        'velocity x: ' + pointer.velocity.x,
        'velocity y: ' + pointer.velocity.y,
        'movementX: ' + pointer.movementX,
        'movementY: ' + pointer.movementY
      ]);
    }

    for (var i = 0; i < this.gArr.length; ++i) {
      var g = this.gArr[i];
      if (i % 2 == 0) {
        g.angle = g.angle + this.angleSpeed;
      } else {
        g.angle = g.angle - this.angleSpeed;
      }
    }

    if (Math.abs(this.angleSpeed) < this.angleSpeedDrag) {
      this.angleSpeed = 0;
    }
    else if (this.angleSpeed > 0) {
      this.angleSpeed -= this.angleSpeedDrag;
    }
    else if (this.angleSpeed < 0) {
      this.angleSpeed += this.angleSpeedDrag;
    }
  }
}
