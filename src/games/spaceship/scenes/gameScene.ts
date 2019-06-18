/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @description  Asteroid: Game Scene
 * @license      Digitsensitive
 */

import { Asteroid } from "../objects/asteroid";
import { Bullet } from "../objects/bullet";
import { Ship } from "../objects/ship";
import { CONST } from "../const/const";

export class GameScene extends Phaser.Scene {
  private g_grid: Phaser.GameObjects.Grid;
  private g_text: Phaser.GameObjects.Text;
  private g_text2: Phaser.GameObjects.Text;
  private g_gCircle: Phaser.GameObjects.Graphics;
  private g_spaceShip: Phaser.GameObjects.Graphics;
  private g_courseAdjuster: Phaser.GameObjects.Graphics;
  private g_newCourse: number;
  private g_drot: number = 1;

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
    this.g_courseAdjuster.visible = true;
    var angleRadians = Phaser.Math.Angle.Between(
      this.g_spaceShip.body.x,
      this.g_spaceShip.body.y,
      pointer.x + this.cameras.main.scrollX,
      pointer.y + this.cameras.main.scrollY,
    );
    var angleDegrees = Phaser.Math.RadToDeg(angleRadians) + 90;
    this.g_courseAdjuster.angle = angleDegrees;
    this.g_text2.x = pointer.x + this.cameras.main.scrollX - 70;
    this.g_text2.y = pointer.y + this.cameras.main.scrollY - 70;
    this.g_text2.setText(this.formatAngle(angleDegrees));
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
      this.g_newCourse = this.adjustCourse(pointer);
    }, this);

    this.input.on('pointermove', function (pointer) {
      if (isPointerDown) {
        this.adjustCourse(pointer);
      }
    }, this);

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    this.g_grid = this.add.grid(
      0,
      0,
      width * 3,
      height * 2,
      32,
      32,
      0x057605
    );

    this.g_text = this.add.text(50, -20, "");
    this.physics.add.existing(this.g_text, false);

    this.g_text2 = this.add.text(0, 0, "");
    this.physics.add.existing(this.g_text2, false);

    this.g_gCircle = this.add.graphics();
    this.g_gCircle.x = 0;
    this.g_gCircle.y = 0;
    this.g_gCircle.fillStyle(0xff0000, 0.3);
    this.g_gCircle.fillCircle(256, 256, 256);

    this.g_spaceShip = this.add.graphics();
    this.physics.add.existing(this.g_spaceShip, false);
    this.drawSpaceShip(this.g_spaceShip);
    this.g_spaceShip.fillStyle(0x00ff00);
    this.g_spaceShip.fillPath();

    this.g_courseAdjuster = this.add.graphics();
    this.physics.add.existing(this.g_courseAdjuster, false);
    this.g_courseAdjuster.visible = false;
    this.g_courseAdjuster.fillStyle(0x00ff00, 0.2);
    this.g_courseAdjuster.fillCircle(0, 0, 42);
    this.drawSpaceShip(this.g_courseAdjuster);
    this.g_courseAdjuster.fillPath();
  }

  update(): void {

    var shortestBetween = Phaser.Math.Angle.ShortestBetween(
      this.g_spaceShip.angle,
      this.g_newCourse
    );

    if (shortestBetween == 0) {
    } else if (Math.abs(shortestBetween) <= this.g_drot) {
      this.g_newCourse = this.g_spaceShip.angle;
      this.g_text.setText("\n" + this.formatAngle(this.g_spaceShip.angle));
      this.time.delayedCall(2000, function () {
        this.g_text.setText("");
      }, null, this);
      this.time.delayedCall(1000, function () {
        var shortestBetween2 = Phaser.Math.Angle.ShortestBetween(
          this.g_spaceShip.angle,
          this.g_newCourse
        );
        if (Math.abs(shortestBetween2) <= this.g_drot) {
          this.g_text2.setText("");
          this.g_courseAdjuster.visible = false;
        }
      }, null, this);
    } else if (shortestBetween > 0) {
      this.g_spaceShip.angle += this.g_drot;
      this.g_text.setText(
        "     -0°" +
        "\n" + this.formatAngle(this.g_spaceShip.angle) +
        "\n     +" + this.formatAngle(shortestBetween)
      );
    } else if (shortestBetween < 0) {
      this.g_spaceShip.angle -= this.g_drot;
      this.g_text.setText(
        "     -" + this.formatAngle(360 - shortestBetween) +
        "\n" + this.formatAngle(this.g_spaceShip.angle) +
        "\n     +0°"
      );
    }

    var radians = Phaser.Math.DegToRad(this.g_spaceShip.angle);
    var vx = 20 * Math.sin(radians);
    var vy = -20 * Math.cos(radians);
    this.g_spaceShip.body.setVelocity(vx, vy);
    this.g_courseAdjuster.body.setVelocity(vx, vy);

    this.g_text.body.setVelocity(vx, vy);
    this.g_text2.body.setVelocity(vx, vy);

    this.cameras.main.centerOn(this.g_spaceShip.body.x, this.g_spaceShip.body.y);
  }
}
