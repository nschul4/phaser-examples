import { ReadOut } from "../../../common/classes/readOut";

export class GameScene extends Phaser.Scene {
  private readOut: ReadOut = new ReadOut;

  private text: Phaser.GameObjects.Text;
  private text2: Phaser.GameObjects.Text;
  private spaceShip: Phaser.GameObjects.Graphics;
  private courseAdjuster: Phaser.GameObjects.Graphics;
  private newCourse: number;
  private container: Phaser.GameObjects.Container;
  private drot: number = 1;
  private ZOOM: number = 2;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  private drawSpaceShip(g: Phaser.GameObjects.Graphics) {
    g.beginPath();
    g.lineTo(0, -42);
    g.lineTo(-30, 30);
    g.lineTo(0, 20);
    g.lineTo(30, 30);
    g.closePath();
  }

  private formatAngle(degrees: number) {
    var rad = Phaser.Math.DegToRad(degrees);
    var radNormalized = Phaser.Math.Angle.Normalize(rad);
    var tmp = Phaser.Math.RadToDeg(radNormalized);
    return Number((tmp).toFixed(1)) + "°";
  }

  private adjustCourse(pointer) {
    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    this.courseAdjuster.visible = true;
    var angleRadians = Phaser.Math.Angle.Between(
      this.container.body.x,
      this.container.body.y,
      pointer.x + this.cameras.main.scrollX,
      pointer.y + this.cameras.main.scrollY,
    );

    var angleDegrees = Phaser.Math.RadToDeg(angleRadians) + 90;
    this.courseAdjuster.angle = angleDegrees;

    this.text2.x = (pointer.x / this.ZOOM) - (1.25 * width) / (2 * this.ZOOM);
    this.text2.y = (pointer.y / this.ZOOM) - (1.25 * height) / (2 * this.ZOOM);

    this.text2.setText(this.formatAngle(angleDegrees));

    return angleDegrees;
  }

  create(): void {
    var isPointerDown = false;

    this.input.on('pointerdown', function (pointer) {
      this.adjustCourse(pointer);
      isPointerDown = true;
    }, this);

    this.input.on('pointerup', function (pointer) {
      isPointerDown = false;
      this.newCourse = this.adjustCourse(pointer);
    }, this);

    this.input.on('pointermove', function (pointer) {
      if (isPointerDown) {
        this.adjustCourse(pointer);
      }
    }, this);

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    this.add.grid(
      0, 0,
      width * 3, height * 2,
      32,
      32,
      0x057605
    );

    this.text = this.add.text(50, -20, "");
    this.text2 = this.add.text(0, 0, "");

    var circle = this.add.graphics();
    circle.x = 0;
    circle.y = 0;
    circle.fillStyle(0xff0000, 0.3);
    circle.fillCircle(256, 256, 256);

    this.spaceShip = this.add.graphics();
    this.drawSpaceShip(this.spaceShip);
    this.spaceShip.fillStyle(0x00ff00);
    this.spaceShip.fillPath();

    this.courseAdjuster = this.add.graphics();
    this.courseAdjuster.visible = false;
    this.courseAdjuster.fillStyle(0x00ff00, 0.2);
    this.courseAdjuster.fillCircle(0, 0, 42);
    this.drawSpaceShip(this.courseAdjuster);
    this.courseAdjuster.fillPath();

    this.container = this.add.container(0, 0);
    this.physics.add.existing(this.container, false);
    this.container.add([this.text, this.text2, this.spaceShip, this.courseAdjuster]);

    this.cameras.main.startFollow(this.container, false);
    this.cameras.main.setZoom(this.ZOOM);
  }

  update(): void {

    var shortestBetween = Phaser.Math.Angle.ShortestBetween(
      this.spaceShip.angle,
      this.newCourse
    );

    if (shortestBetween == 0) {
    } else if (Math.abs(shortestBetween) <= this.drot) {
      this.newCourse = this.spaceShip.angle;
      this.readOut.clear();
      this.readOut.setText("\n" + this.formatAngle(this.spaceShip.angle));
      this.time.delayedCall(2000, function () {
        this.readOut.clear();
      }, null, this);
      this.time.delayedCall(1000, function () {
        var shortestBetween2 = Phaser.Math.Angle.ShortestBetween(
          this.spaceShip.angle,
          this.newCourse
        );
        if (Math.abs(shortestBetween2) <= this.drot) {
          this.text2.setText("");
          this.courseAdjuster.visible = false;
        }
      }, null, this);
    } else if (shortestBetween > 0) {
      this.spaceShip.angle += this.drot;
      this.readOut.setText(
        "     -0°" +
        "\n" + this.formatAngle(this.spaceShip.angle) +
        "\n     +" + this.formatAngle(shortestBetween)
      );
    } else if (shortestBetween < 0) {
      this.spaceShip.angle -= this.drot;
      this.readOut.setText(
        "     -" + this.formatAngle(360 - shortestBetween) +
        "\n" + this.formatAngle(this.spaceShip.angle) +
        "\n     +0°"
      );
    }

    var radians = Phaser.Math.DegToRad(this.spaceShip.angle);
    var vx = 20 * Math.sin(radians);
    var vy = -20 * Math.cos(radians);
    this.container.body.setVelocity(vx, vy);

    this.text.setText(this.readOut.getText());
  }
}
