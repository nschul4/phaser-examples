export class GameScene extends Phaser.Scene {

  private C: number = 150;
  private text: Phaser.GameObjects.Text;
  private textTimeout: number = 1000;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  create(): void {
    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    var geomRectangle = new Phaser.Geom.Rectangle(
      0, 0,
      this.C, this.C,
    );
    var gRectangle = this.add.graphics();
    gRectangle.setPosition(width / 12, height / 3);
    gRectangle.fillStyle(0x00ff00);
    gRectangle.fillRectShape(geomRectangle);

    var geomTriangle = new Phaser.Geom.Triangle(
      0, 0,
      this.C, this.C,
      0, this.C,
    );
    var gTriangle = this.add.graphics();
    gTriangle.setPosition(5 * width / 12, height / 3);
    gTriangle.fillStyle(0xff0000);
    gTriangle.fillTriangleShape(geomTriangle);

    var geomCircle = new Phaser.Geom.Circle(
      0, 0,
      this.C / 2
    )
    var gCircle = this.add.graphics();
    gCircle.setPosition(10 * width / 12, height / 3 + this.C / 2);
    gCircle.fillStyle(0x0000ff);
    gCircle.fillCircleShape(geomCircle);

    this.text = this.add.text(0, 0, "");

    gRectangle.setInteractive(geomRectangle, Phaser.Geom.Rectangle.Contains);
    gRectangle.on('pointerdown', function () {
      this.text.setText("rectangle");
      this.time.delayedCall(this.textTimeout, this.textClear, ["rectangle"], this);
    }, this);

    gTriangle.setInteractive(geomTriangle, Phaser.Geom.Triangle.Contains);
    gTriangle.on('pointerdown', function () {
      this.text.setText("triangle");
      this.time.delayedCall(this.textTimeout, this.textClear, ["triangle"], this);
    }, this);

    gCircle.setInteractive(geomCircle, Phaser.Geom.Circle.Contains);
    gCircle.on('pointerdown', function () {
      this.text.setText("circle");
      this.time.delayedCall(this.textTimeout, this.textClear, ["circle"], this);
    }, this);
  }

  private textClear(source: string) {
    // console.log(source);
    this.text.setText(null);
  }
}
