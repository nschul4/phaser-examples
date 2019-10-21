import { Controller1 } from "../../../common/classes/controller1";
import { createPolygon } from "../../../common/createPolygon";

export class GameScene extends Phaser.Scene {

  private controller: Controller1 = new Controller1();
  private cursor: Phaser.GameObjects.GameObject;
  private text: Phaser.GameObjects.Text;
  private cameraRotation: number = 0;
  private polygonArray: Phaser.GameObjects.Polygon[] = [];
  private lastUpdate: number = 0;
  private updateRefreshRate: number = 1000;

  private curve: Phaser.Curves.Ellipse;
  private follower1: any = { t: 0, vec: new Phaser.Math.Vector2() };
  private rect: Phaser.GameObjects.Rectangle;

  private forcePush: number = 0.025;
  private vectorSW = new Phaser.Math.Vector2(-this.forcePush, this.forcePush);
  private vectorSE = new Phaser.Math.Vector2(this.forcePush, this.forcePush);
  private vectorNW = new Phaser.Math.Vector2(-this.forcePush, -this.forcePush);
  private vectorNE = new Phaser.Math.Vector2(this.forcePush, -this.forcePush);

  constructor() {
    super({
      key: "GameScene"
    });
  }

  private gameObjectIsStill(gameObject: Phaser.GameObjects.GameObject) {
    if
      (
      gameObject.body.velocity.x == 0
      &&
      gameObject.body.velocity.y == 0
    ) {
      return true;
    } else {
      console.log("x=" + gameObject.body.velocity.x);
      console.log("y=" + gameObject.body.velocity.y);
      return false;
    }
  }

  private moveSW(): void {
    (<any>this.cursor).applyForce(this.vectorSW);
  }

  private moveSE(): void {
    (<any>this.cursor).applyForce(this.vectorSE);
  }

  private moveNW(): void {
    (<any>this.cursor).applyForce(this.vectorNW);
  }

  private moveNE(): void {
    (<any>this.cursor).applyForce(this.vectorNE);
  }

  private moveToCenter(): void {
  }

  private createWorldObjects(
    overlayCamIgnoreArray: Phaser.GameObjects.GameObject[]
  ): void {

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    var grid1 = this.add.grid(
      0, 0,
      width, height,
      width / 8, height / 8,
      0x006600
    );
    grid1.angle = 45;
    overlayCamIgnoreArray.push(grid1);

    var g = this.add.graphics();
    g.fillStyle(0x0000ff);
    g.fillCircle(0, 0, 20);
    this.cursor = this.matter.add.gameObject(
      g,
      {
        shape: {
          type: 'circle',
          radius: 20,
          flagInternal: true
        }
      },
    );
    (<any>this.cursor).setFrictionAir(0.1);
    overlayCamIgnoreArray.push(this.cursor);

    var p1 = createPolygon(this, ''
      + '0 1000'
      + ' '
      + '0 0'
      + ' '
      + '100 0'
      + ' '
      + '100 1000'
      , -300, 500,
      0x555555,
      true
    );
    p1.name = "p1";
    overlayCamIgnoreArray.push(p1);
    this.polygonArray.push(p1);

    var p2 = createPolygon(this, ''
      + '0 1000'
      + ' '
      + '0 0'
      + ' '
      + '100 0'
      + ' '
      + '100 1000'
      , 200, 500,
      0x555555,
      true
    );
    p2.name = "p2";
    overlayCamIgnoreArray.push(p2);
    this.polygonArray.push(p2);

    this.curve = new Phaser.Curves.Ellipse(
      {
        x: 0,
        y: -400,
        xRadius: 125,
        yRadius: 125,
      }
    );
    var curveGraphic = this.add.graphics();
    curveGraphic.lineStyle(4, 0xffffff, 1);
    this.curve.draw(curveGraphic);
    this.tweens.add(
      {
        targets: this.follower1,
        t: 1,
        ease: 'Linear',
        duration: 5000,
        repeat: -1
      }
    );
    this.rect = this.add.rectangle(0, 0, 100, 100, 0x660000);
    this.matter.add.gameObject(
      this.rect,
      {
      }
    );
  }

  create(): void {

    var overlayCamIgnoreArray: Phaser.GameObjects.GameObject[] = [];

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    this.matter.world.setGravity(0, 0);

    this.controller.create(
      this,
      width, height,
      false,
      this.moveSW,
      this.moveSE,
      this.moveNW,
      this.moveNE,
      this.moveToCenter,
    );

    var background = this.add.rectangle(
      -width * 2, -height * 2,
      width * 8, height * 8,
      0x000000
    );
    overlayCamIgnoreArray.push(background);

    this.createWorldObjects(overlayCamIgnoreArray);

    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
    }, this);

    this.controller.ignore(this.cameras.main);

    this.text = this.add.text(0, 0, "gridrunner", { fontSize: 12 + 'px', });

    // this.cameras.main.setZoom(1.0);
    this.cameras.main.startFollow(this.cursor, true, 0.1, 0.1);
    this.cameras.main.ignore(this.text);

    var overlayCamRect = this.add.graphics();
    overlayCamRect.lineStyle(4, 0xffffff, 1);
    overlayCamRect.strokeRect(width - width / 3 - 10, 10, width / 3, height / 2);
    this.cameras.main.ignore(overlayCamRect);

    var overlayCam = this.cameras.add(0, 0, width, height);
    for (let it of overlayCamIgnoreArray) {
      overlayCam.ignore(overlayCamIgnoreArray);
    }

    var hudCam = this.cameras.add(width - width / 3 - 10, 10, width / 3, height / 2);
    hudCam.setZoom(0.25);
    hudCam.startFollow(this.cursor, true, 0.1, 0.1);
    this.controller.ignore(hudCam);
    hudCam.ignore(this.text);
    hudCam.ignore(overlayCamRect);
  }

  update(time: number, delta: number): void {
    if (time - this.lastUpdate > this.updateRefreshRate) {
      this.lastUpdate = time;
      this.text.setText(
        ""
        + (<any>this.cursor).x.toFixed(1)
        + ","
        + (<any>this.cursor).y.toFixed(1)
      );
    }

    this.cameras.main.setRotation(this.cameraRotation);
    // this.cameraRotation += 0.001;
    for (let it of this.polygonArray) {
      it.setRotation(-this.cameraRotation);
    }

    this.curve.getPoint(this.follower1.t, this.follower1.vec);
    this.rect.x = this.follower1.vec.x;
    this.rect.y = this.follower1.vec.y;
    this.rect.angle -= 1;
  }
}
