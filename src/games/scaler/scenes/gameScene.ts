import { GameSceneOverlay } from "./gameSceneOverlay";
import { ControllerScene } from "./controllerScene";
import { Tether } from "../tether";

export class GameScene extends Phaser.Scene {

  public lander: any;

  private controllerScene = null;

  private thrust: any;

  private worldBoundsRectangleColorTop: number = 0x555555;
  private worldBoundsRectangleColorBottom: number = 0x555555;
  private worldBoundsRectangleColorLeft: number = 0x555555;
  private worldBoundsRectangleColorRight: number = 0x555555;

  // test values
  // private worldBoundsRectangleColorTop: number = 0x55;
  // private worldBoundsRectangleColorBottom: number = 0x55;
  // private worldBoundsRectangleColorLeft: number = 0x88;
  // private worldBoundsRectangleColorRight: number = 0x88;

  private grapplingHook: any;
  private tether: Tether = null;

  private GRAPPLING_HOOK_NAME: string = "GRAPPLING_HOOK";
  private HAUL_ABLE_NAME: string = "HAUL_ABLE_NAME";

  private THRUST_FACTOR: number = 0.0005;
  private AIR_FRICTION: number = 0.05;
  private FIRE_FACTOR: number = 4;

  private centerX: number = 500;
  private centerY: number = -500;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  /**
   * TODO: is this necessary?
   */
  public pause() {
    this.scene.pause();
  }

  private objectToString(target: any): string {
    var result: string = "";
    Object.getOwnPropertyNames(target).forEach(
      (name) => {
        result += " ";
        result += name;
        result += ": ";
        result += target[name];
        result += ",\n";
      }
    );
    return "{\n" + result + "}";
  }

  private setupLander(): void {
    var xLeft: number = 0;
    var xMiddle: number = 20;
    var xRight: number = 40;

    var yTop: number = 0;
    var yMiddle: number = 30;
    var yBottom: number = 40;

    var landerPoints: string = ""
      + xLeft + " " + yBottom // left
      + " "
      + xMiddle + " " + yMiddle // center
      + " "
      + xRight + " " + yBottom // right
      + " "
      + xMiddle + " " + yTop // peak
      ;

    var xRight2: number = xRight;
    var xMiddle2: number = xMiddle;
    var xLeft2: number = xLeft;

    var mysteryShifter = -12;
    var yTop2: number = yMiddle + mysteryShifter;
    var yMiddle2: number = yBottom + mysteryShifter;
    var yBottom2: number = yBottom + mysteryShifter + 10;

    var thrustFlamePints: string = ""
      + xLeft2 + " " + yMiddle2 // left
      + " "
      + xMiddle2 + " " + yBottom2 // center
      + " "
      + xRight2 + " " + yMiddle2 // right
      + " "
      + xMiddle2 + " " + yTop2 // peak
      ;

    this.lander = this.add.polygon(0, 0, landerPoints, 0x999999);
    this.matter.add.gameObject(
      this.lander,
      {
        shape: {
          type: 'fromVerts',
          verts: landerPoints,
          flagInternal: true
        }
      }
    );

    // test values
    // this.lander.setPosition(25, -900); // left top
    // this.lander.setPosition(25, -100); // left bottom
    // this.lander.setPosition(2900, -900); // right top
    // this.lander.setPosition(2900, -100); // right bottom

    this.lander.setFrictionAir(this.AIR_FRICTION);
    // this.lander.setBounce(0, 0);

    this.lander.setName("lander");

    this.thrust = this.add.polygon(
      this.lander.x,
      this.lander.y,
      thrustFlamePints,
      0xffffff
    );
    this.thrust.setName("thrust");

    this.thrust.depth = 1;
    this.lander.depth = 1;
  }

  private fail() {
    var overlayScene = (<GameSceneOverlay>this.scene.get('GameSceneOverlay'));
    overlayScene.fail();
    this.time.delayedCall(3000, function () {
      this.scene.restart();
      overlayScene.restart();
    }, null, this);
  }

  public fire() {
    if (this.tether != null) {
      this.tether.remove(this);
      this.tether = null;
    } else if (this.grapplingHook == null) {
      var radians = Phaser.Math.DegToRad(this.lander.angle);
      var sinOfR: number = Math.sin(radians);
      var negCosR: number = -Math.cos(radians);
      this.grapplingHook = this.add.circle(
        this.lander.x + (30 * sinOfR),
        this.lander.y + (30 * negCosR),
        5,
        0xff0000
      );
      this.matter.add.gameObject(
        this.grapplingHook,
        {
          shape: {
            type: 'circle',
            radius: 5,
            flagInternal: true
          }
        }
      );
      this.grapplingHook.setVelocityX(this.FIRE_FACTOR * sinOfR);
      this.grapplingHook.setVelocityY(this.FIRE_FACTOR * negCosR);
      this.grapplingHook.setName(this.GRAPPLING_HOOK_NAME);
      var now: number = this.time.now;
      this.grapplingHook.creationTime = this.time.now;
      this.time.delayedCall(5000, function () {
        if (this.grapplingHook != null && this.grapplingHook.creationTime == now) {
          this.grapplingHook.destroy();
          this.grapplingHook = null;
        }
      }, null, this);
    }
  }

  create(): void {

    this.scene.bringToTop("GameSceneOverlay");
    this.controllerScene = (<ControllerScene>this.scene.get('ControllerScene'));

    var grid = this.add.grid(
      1500, -500,
      3000, 1000,
      256, 256,
      0x000000, 0, 0x005500, 1,
    );

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    this.matter.world.setBounds(0, -1000, 3000, 1000);
    var boundSize: number = 1000;
    var worldBoundsRectTop = this.add.rectangle(
      -boundSize, -1000 - boundSize,
      3000 + boundSize * 2, boundSize,
      this.worldBoundsRectangleColorTop,
    );
    worldBoundsRectTop.setOrigin(0, 0);
    var worldBoundsRectBottom = this.add.rectangle(
      0 - boundSize, 0,
      3000 + boundSize * 2, boundSize,
      this.worldBoundsRectangleColorBottom,
    );
    worldBoundsRectBottom.setOrigin(0, 0);
    var worldBoundsRectLeft = this.add.rectangle(
      -boundSize, -1000,
      boundSize, 1000,
      this.worldBoundsRectangleColorLeft,
    );
    worldBoundsRectLeft.setOrigin(0, 0);
    var worldBoundsRectRight = this.add.rectangle(
      3000, -1000,
      boundSize, 1000,
      this.worldBoundsRectangleColorRight,
    );
    worldBoundsRectRight.setOrigin(0, 0);

    this.setupLander();
    this.lander.setPosition(2500, -500);
    this.lander.angle = -90;

    var arrangementDiameter = 275;
    var rectCount = 9;
    for (var i: number = 0; i < rectCount; ++i) {
      var wedge: number = Phaser.Math.DegToRad(360 / rectCount);
      switch (i % 3) {

        case 0:
          // console.log("rectangle");

          var rectangle: any = this.add.rectangle(
            this.centerX + arrangementDiameter * Math.cos(wedge * i),
            this.centerY + arrangementDiameter * Math.sin(wedge * i),
            100, 100,
            0x009900
          );
          var gameObject: any = this.matter.add.gameObject(
            rectangle,
            {
              shape: {
                // type: 'rectangle',
                flagInternal: true
              }
            }
          );
          gameObject.setFriction(0);
          gameObject.name = this.HAUL_ABLE_NAME;
          gameObject.setAngularVelocity(0.1);

          break;

        case 1:
          // console.log("circle");

          var circle: any = this.add.circle(
            this.centerX + arrangementDiameter * Math.cos(wedge * i),
            this.centerY + arrangementDiameter * Math.sin(wedge * i),
            55,
            0x009900
          );
          var gameObject: any = this.matter.add.gameObject(
            circle,
            {
              shape: {
                type: 'circle',
                radius: 55,
                flagInternal: true
              }
            }
          );
          gameObject.setFriction(0);
          gameObject.name = this.HAUL_ABLE_NAME;

          break;

        case 2:

          console.log("polygon");

          var polygonPoints = ''
            + '0 0'
            + ' '
            + '0 100'
            + ' '
            + '100 100'
            ;

          var polygon: any = this.add.polygon(
            this.centerX + arrangementDiameter * Math.cos(wedge * i),
            this.centerY + arrangementDiameter * Math.sin(wedge * i),
            polygonPoints,
            0x009900
          );
          var gameObject: any = this.matter.add.gameObject(
            polygon,
            {
              shape: {
                type: 'fromVerts',
                verts: polygonPoints,
                flagInternal: true
              },
            }
          );
          gameObject.setFriction(0);
          gameObject.name = this.HAUL_ABLE_NAME;
          gameObject.setAngularVelocity(0.05);

          gameObject.setPosition(
            gameObject.x + gameObject.centerOfMass.x,
            gameObject.y
            + gameObject.centerOfMass.y
            - (gameObject.getBottomLeft().y
              - gameObject.getTopLeft().y)
          );

          break;
      }
    }

    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
      if (bodyA.gameObject != null && bodyB.gameObject != null) {
        this.collisionHandler(bodyA, bodyB);
      }
    }, this);

    this.matter.world.disableGravity();
    this.cameras.main.startFollow(this.lander, true);
    // test values
    // this.cameras.main.centerOn(1500, -500);
    // this.cameras.main.setZoom(0.22);
  }

  private collisionHandler(body1, body2) {
    if (body1.gameObject.name == this.GRAPPLING_HOOK_NAME && body2.gameObject.name == this.HAUL_ABLE_NAME) {
      this.tetherBodies(body1, body2);
    } else if (body2.gameObject.name == this.GRAPPLING_HOOK_NAME && body1.gameObject.name == this.HAUL_ABLE_NAME) {
      this.tetherBodies(body2, body1);
    }
  }

  private tetherBodies(bodyGrapplingHook, bodyOther) {
    if (this.grapplingHook != null) {
      this.grapplingHook.destroy();
      this.grapplingHook = null;
    }
    if (this.tether != null) {
      this.tether.remove(this);
    }
    this.tether = new Tether();
    this.tether.createTether(this, bodyOther, this.lander.body);
  }

  update(time: number, delta: number): void {

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    if (this.controllerScene.thrusting == true) {
      this.thrust.visible = true;
      var radians = Phaser.Math.DegToRad(this.lander.angle);
      var sinOfR: number = Math.sin(radians);
      var negativeCosOfR: number = -Math.cos(radians);
      var forceV = new Phaser.Math.Vector2(sinOfR * this.THRUST_FACTOR, negativeCosOfR * this.THRUST_FACTOR);
      this.lander.applyForce(forceV);
    } else {
      this.thrust.visible = false;
    }

    this.lander.setAngularVelocity(0);
    if (this.controllerScene.rotatingLeft == true) {
      this.lander.setAngularVelocity(-0.05);
    }
    if (this.controllerScene.rotatingRight == true) {
      this.lander.setAngularVelocity(0.05);
    }

    this.thrust.x = this.lander.x;
    this.thrust.y = this.lander.y;
    this.thrust.angle = this.lander.angle;
    // this.background.x = this.lander.x * 0.5;
    // this.background.y = this.lander.y * 0.5;

    this.cameras.main.setAngle(-this.lander.angle);

    var distanceFromCenter = Phaser.Math.Distance.Between(
      this.lander.x, this.lander.y,
      this.centerX, this.centerY
    );

    var x: number = 2500 - distanceFromCenter;
    // console.log("x=" + x);

    var minX: number = 0;
    var maxX: number = 2500;
    var a: number = 0.001;
    var b: number = 4;

    // "In general, to scale your variable x into a range [a,b] you can use:"
    var xNormalized = (b - a) * ((x - minX) / (maxX - minX)) + a;
    // console.log("xNormalized=" + xNormalized);

    this.cameras.main.setZoom(xNormalized);
  }
}
