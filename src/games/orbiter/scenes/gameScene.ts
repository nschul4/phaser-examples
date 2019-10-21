export class GameScene extends Phaser.Scene {
  private g_circle: Phaser.GameObjects.Graphics;
  private curve: Phaser.Curves.Ellipse;
  private g_containerA: Phaser.GameObjects.Container;
  private g_containerB: Phaser.GameObjects.Container;
  private g_containerC: Phaser.GameObjects.Container;
  private tweenTargetA: any = { t: 0, pointVector: new Phaser.Math.Vector2() };
  private tweenTargetB: any = { t: 0, pointVector: new Phaser.Math.Vector2() };
  private tweenTargetC: any = { t: 0, pointVector: new Phaser.Math.Vector2() };

  constructor() {
    super({
      key: "GameScene"
    });
  }

  create(): void {

    this.input.on('pointerdown', function (pointer) {
      this.g_debug = true;
    }, this);
    this.input.on('pointerup', function (pointer) {
      this.g_debug = false;
    }, this);

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    this.g_circle = this.add.graphics();
    this.g_circle.depth = 1;
    this.g_circle.x = width / 2;
    this.g_circle.y = height / 2;
    this.g_circle.fillStyle(0x22aa00, 1.0);
    this.g_circle.fillCircle(0, 0, width / 4);
    // this.g_circle.visible = false;

    this.curve = new Phaser.Curves.Ellipse({
      x: width / 2,
      y: height / 2,
      xRadius: width / 3,
      yRadius: height / 3,
    });

    var curveGraphicRear = this.add.graphics();
    curveGraphicRear.setScale(1, 0.5);
    curveGraphicRear.lineStyle(8, 0xffff00);
    curveGraphicRear.beginPath();
    curveGraphicRear.arc(
      0, 0,
      width / 3,
      Phaser.Math.DegToRad(0),
      Phaser.Math.DegToRad(180)
    );
    curveGraphicRear.strokePath();
    curveGraphicRear.x = width / 2;
    curveGraphicRear.y = height / 2;
    curveGraphicRear.depth = 1;

    var curveGraphicFront = this.add.graphics();
    curveGraphicFront.setScale(1, 0.5);
    curveGraphicFront.lineStyle(8, 0xffff00);
    curveGraphicFront.beginPath();
    curveGraphicFront.arc(
      0, 0,
      width / 3,
      Phaser.Math.DegToRad(180),
      Phaser.Math.DegToRad(0)
    );
    curveGraphicFront.strokePath();
    curveGraphicFront.x = width / 2;
    curveGraphicFront.y = height / 2;

    var foo: number = width / 24;
    var bar: number = width / 32;

    var gA1 = this.add.graphics();
    gA1.lineStyle(5, 0xffffff, 1);
    gA1.strokeRect(-foo, -foo, foo * 2, foo * 2);
    var gA2 = this.add.graphics();
    gA2.fillStyle(0xffffff);
    gA2.fillTriangle(0, -bar, bar, bar, -bar, bar);

    var gB1 = this.add.graphics();
    gB1.lineStyle(5, 0xffffff, 1);
    gB1.strokeRect(-foo, -foo, foo * 2, foo * 2);
    var gB2 = this.add.graphics();
    gB2.fillStyle(0xffffff);
    gB2.fillCircle(0, 0, bar);

    var gC1 = this.add.graphics();
    gC1.lineStyle(5, 0xffffff, 1);
    gC1.strokeRect(-foo, -foo, foo * 2, foo * 2);
    var gC2 = this.add.graphics();
    gC2.fillStyle(0xffffff);
    gC2.fillRect(-foo / 2, -foo / 2, foo, foo);
    gC2.angle = 45;

    this.g_containerA = this.add.container(0, 0);
    this.g_containerA.add([gA1, gA2]);
    this.g_containerB = this.add.container(0, 0);
    this.g_containerB.add([gB1, gB2]);
    this.g_containerC = this.add.container(0, 0);
    this.g_containerC.add([gC1, gC2]);

    this.tweens.add({
      targets: this.tweenTargetA,
      t: 1,
      ease: "Linear",
      duration: 20000,
      repeat: -1
    });
    this.tweens.add({
      targets: this.tweenTargetB,
      t: 1,
      ease: 'Linear',
      duration: 20000,
      repeat: -1
    }
    );
    this.tweens.add({
      targets: this.tweenTargetC,
      t: 1,
      ease: 'Linear',
      duration: 20000,
      repeat: -1
    });
  }

  update(): void {
    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    this.curve.getPoint(this.tweenTargetA.t, this.tweenTargetA.pointVector);
    this.g_containerA.setPosition(
      this.tweenTargetA.pointVector.x,
      this.tweenTargetA.pointVector.y
    );
    this.g_containerA.angle -= 0.01;
    if (this.tweenTargetA.pointVector.y > height / 2) {
      this.g_containerA.depth = 2;
    } else {
      this.g_containerA.depth = 0;
    }

    this.curve.getPoint(
      this.tweenTargetB.t + 0.33,
      this.tweenTargetB.pointVector
    );
    this.g_containerB.setPosition(
      this.tweenTargetB.pointVector.x,
      this.tweenTargetB.pointVector.y
    );
    this.g_containerB.angle -= 0.01;
    if (this.tweenTargetB.pointVector.y > height / 2) {
      this.g_containerB.depth = 2;
    } else {
      this.g_containerB.depth = 0;
    }

    this.curve.getPoint(
      this.tweenTargetC.t + 0.66,
      this.tweenTargetC.pointVector
    );
    this.g_containerC.setPosition(
      this.tweenTargetC.pointVector.x,
      this.tweenTargetC.pointVector.y
    );
    this.g_containerC.angle -= 0.01;
    if (this.tweenTargetC.pointVector.y > height / 2) {
      this.g_containerC.depth = 2;
    } else {
      this.g_containerC.depth = 0;
    }
  }
}
