import { createPolygon, createPolygonEx } from "../../../common/createPolygon";

export class GameScene extends Phaser.Scene {

  mainGameObject: any;
  wheelRight: any;
  wheelLeft: any;
  forceMajor = new Phaser.Math.Vector2(0.027, 0);
  forceMinor = new Phaser.Math.Vector2(0.01, 0);
  text: Phaser.GameObjects.Text;
  text2: Phaser.GameObjects.Text;
  initialTime: number = 0;
  runNumber: number = 1;

  lastSetText: number = 0;
  maxX: number = 0;

  angularVelocity: number = 0;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  private createGroundPoly(points: string, x: number, y: number) {
    var ground: any = this.add.polygon(0, 0, points, 0x00aa00);
    var p: any = this.matter.add.gameObject(
      ground,
      {
        shape: {
          type: 'fromVerts',
          verts: points,
          flagInternal: true
        },
        isStatic: true,
      }
    );
    p.setPosition(
      x + p.centerOfMass.x,
      y + p.centerOfMass.y - (p.getBottomLeft().y - p.getTopLeft().y)
    );
  }

  create(): void {
    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    this.matter.world.setGravity(0, 1);
    // this.matter.world.setBounds(0, 0, width, height);

    this.add.grid(
      -10, 10,
      100000, 100000,
      1000, 1000,
      0x000000, 0, 0x00ff00, 1,
    );

    var fontSize = 32;
    this.text = this.add.text(0, 0, "",
      {
        fontSize: 32 + 'px',
        color: 'gray',
        strokeThickness: 1,
      },
    );
    this.text2 = this.add.text(0, 0, "",
      {
        fontSize: 32 + 'px',
        color: 'gray',
        strokeThickness: 1,
      },
    );

    var i: number = 0;

    var j: number = 0;
    while (j < 7) {
      this.createGroundPoly('0 100 1000 100 1000 0 0 0',
        i++ * 1000, 0
      );
      ++j;
    }
    this.createGroundPoly('0 150 1000 150 1000 0 0 50',
      i++ * 1000, 0
    );
    this.createGroundPoly('0 250 1000 250 1000 0 0 100',
      i++ * 1000, 0
    );
    this.createGroundPoly('0 400 1000 400 1000 0 0 150',
      i++ * 1000, 0
    );
    this.createGroundPoly('0 600 1000 600 1000 0 0 200',
      i++ * 1000, 0
    );

    i++;
    i++;
    i++;

    var shift = 180
    this.createGroundPoly('0 600 1000 600 1000 200 0 0',
      i++ * 1000 + shift, 0
    );
    this.createGroundPoly('0 400 1000 400 1000 150 0 0',
      i++ * 1000 + shift, 0
    );
    this.createGroundPoly('0 250 1000 250 1000 100 0 0',
      i++ * 1000 + shift, 0
    );
    this.createGroundPoly('0 150 1000 150 1000 50 0 0',
      i++ * 1000 + shift, 0
    );

    var j: number = 0;
    while (j < 7) {
      this.createGroundPoly('0 100 1000 100 1000 0 0 0',
        i++ * 1000 + shift, 0
      );
      ++j;
    }

    const density = 0.001
    const friction = 0.9
    var x: number = 100;
    var y: number = -500;
    const wheelSize: number = 20;
    const wheelAOffset = 140;
    const wheelBOffset = -110;
    const wheelYOffset = 10;

    // let group = this.matter.world.nextGroup(true);

    var points: string = ""
      + "0 0"
      + " "
      + "0 50"
      + " "
      + "200 50"
      + " "
      + "200 30"
      + " "
      + "50 15"
      + " "
      + "20 0"
      ;

    this.mainGameObject = createPolygonEx(
      this,
      points,
      x,
      y,
      0x009900,
      false, {
        shape: {
          type: 'fromVerts',
          verts: points,
          flagInternal: true
        },
        isStatic: false,
        friction,
        density,
      }
    );

    var circleA = this.add.circle(x + wheelAOffset, y + wheelYOffset, wheelSize, 0x009900);
    var circleB = this.add.circle(x + wheelBOffset, y + wheelYOffset, wheelSize, 0x009900);

    this.wheelRight = this.matter.add.gameObject(
      circleA,
      {
        shape: {
          type: 'circle',
          radius: wheelSize,
          flagInternal: true
        },
        friction,
        density,
      }
    );
    this.wheelLeft = this.matter.add.gameObject(
      circleB,
      {
        shape: {
          type: 'circle',
          radius: wheelSize,
          flagInternal: true
        },
        friction,
        density,
      }
    );

    let axelA = this.matter.add.constraint(
      this.mainGameObject.body,
      this.wheelRight.body,
      0,
      0.2, {
        pointA: { x: wheelAOffset, y: wheelYOffset }
      })
    let axelB = this.matter.add.constraint(
      this.mainGameObject.body,
      this.wheelLeft.body,
      0,
      0.2, {
        pointA: { x: wheelBOffset, y: wheelYOffset }
      })

    this.input.on('pointerdown', function (pointer) {
      var position = new Phaser.Math.Vector2(
        this.mainGameObject.x - 100, this.mainGameObject.y + 10
      );
      var force = new Phaser.Math.Vector2(1, 0);
      this.mainGameObject.applyForceFrom(position, force);
    }, this);
  }

  private vDigit(d: number): string {
    var result: string = "";
    var roundedValue: number = Number(((d / 1000) * 1000).toFixed(0));
    if (roundedValue > 0) {
      result += "+";
    }
    result += roundedValue;
    return result;
  }

  private formatVector(vX: number, vY: number): string {
    return "<" + this.vDigit(vX) + "," + this.vDigit(-vY) + ">";
  }

  update(time: number, delta: number): void {
    var t: number = Number(
      ((time - this.initialTime) / 1000)
        .toFixed(1)
    );

    this.text.x = this.wheelLeft.x - 220;
    this.text.y = this.wheelLeft.y - 200;
    this.text2.x = this.wheelLeft.x;
    this.text2.y = this.wheelLeft.y - 200;

    if (time - this.lastSetText > 250) {
      this.lastSetText = time;
      this.text.setText(""
        + "run#" + this.runNumber
        + " "
        + "t=" + t.toFixed(0)
        + "\n"
        + "v="
        + this.formatVector(
          this.mainGameObject.body.velocity.x,
          this.mainGameObject.body.velocity.y,
        )
      );

      if (this.mainGameObject.body.velocity.x > this.maxX) {
        this.maxX = this.mainGameObject.body.velocity.x;
        // console.log("maxX=" + this.maxX.toFixed(0));
      }
    }

    this.cameras.main.centerOn(
      this.mainGameObject.x, this.mainGameObject.y
    );
    this.cameras.main.setZoom(0.5);

    // warming up
    var t0 = 2;
    // warm
    var t1 = 4;
    // hot
    var t2 = 6;
    // thrust: min
    var t3 = 10;
    // thrust: MAX
    var t4 = 15;
    // thrust: min
    var t5 = 18;
    // cooling
    var t6 = 25;
    // stop

    if (t <= t0) {
      this.t0();
    } else if (t > t0 && t <= t1) {
      this.t1();
    } else if (t > t1 && t <= t2) {
      this.t2();
    } else if (t > t2 && t <= t3) {
      this.t3();
    } else if (t > t3 && t <= t4) {
      this.t4();
    } else if (t > t4 && t <= t5) {
      this.t5();
    } else if (t > t5 && t <= t6) {
      this.t6();
    } else {
      this.initialTime = time;
      this.runNumber++;
      this.scene.restart();
    }
  }

  private t0() {
    this.text2.setText(""
      + "engine: cold"
      + "\n"
      + "thrust: disengaged"
    );
  }

  private t1() {
    this.text2.setText(""
      + "engine: warm"
      + "\n"
      + "thrust: disengaged"
    );
  }

  private t2() {
    this.text2.setText(""
      + "engine: hot"
      + "\n"
      + "thrust: disengaged"
    );
  }

  private t3() {
    this.thrustMin();
  }

  private t4() {
    this.thrustMax();
  }

  private t5() {
    this.thrustMin();
  }

  private t6() {
    this.text2.setText(""
      + "engine: cooling"
      + "\n"
      + "thrust: disengaged"
    );
  }

  private thrustMin() {
    this.text2.setText(""
      + "engine: hot"
      + "\n"
      + "thrust: ENGAGED: min"
    );
    var position = new Phaser.Math.Vector2(
      this.mainGameObject.x - 100, this.mainGameObject.y + 5
    );
    this.mainGameObject.applyForceFrom(position, this.forceMinor);
  }

  private thrustMax() {
    this.text2.setText(""
      + "engine: hot"
      + "\n"
      + "thrust: ENGAGED: MAX"
    );
    var position = new Phaser.Math.Vector2(
      this.mainGameObject.x - 100, this.mainGameObject.y + 5
    );
    this.mainGameObject.applyForceFrom(position, this.forceMajor);
  }
}
