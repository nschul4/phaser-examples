import { ControllerScene } from "./controllerScene";
import { GameSceneOverlay } from "./gameSceneOverlay";
import { GrapplingHook } from "../grapplingHook";
import { Tether } from "../tether";
import { ColliderType } from "../colliderType";

import { Lattice } from "../lattice";
import { LatticeSquare } from "../latticeSquare";
import { LatticeSquare2 } from "../latticeSquare2";
import { LatticeTriangle } from "../latticeTriangle";
import { LatticeCircle } from "../latticeCircle";

export class GameScene extends Phaser.Scene {

  private debug: boolean = false;
  // private debug: boolean = true;

  public lander: any;

  private controllerScene = null;

  private thrustPoly: any;

  private worldBoundsRectangleColorTop: number = 0x555555;
  private worldBoundsRectangleColorBottom: number = 0x555555;
  private worldBoundsRectangleColorLeft: number = 0x555555;
  private worldBoundsRectangleColorRight: number = 0x555555;

  // test values
  // private worldBoundsRectangleColorTop: number = 0x55;
  // private worldBoundsRectangleColorBottom: number = 0x55;
  // private worldBoundsRectangleColorLeft: number = 0x88;
  // private worldBoundsRectangleColorRight: number = 0x88;

  private grapplingHook: GrapplingHook = new GrapplingHook();
  private tether: Tether = new Tether();

  private AIR_FRICTION: number = 0.05;
  private THRUST_FACTOR: number = 0.0005;
  private THRUST_FACTOR2: number = this.THRUST_FACTOR * 2;
  private TURN_FACTOR: number = 0.025;

  private cameraCenter: Phaser.GameObjects.Graphics;
  private lerp: number = 0.04;

  private latticeIdCounter: number = 0;
  private latticeSquare: Lattice = new LatticeSquare();
  private latticeSquare2: Lattice = new LatticeSquare2();
  private latticeTriangle: Lattice = new LatticeTriangle();
  private latticeCircle: Lattice = new LatticeCircle();
  private latticeMap: { [latticeId: number]: Lattice } = {};

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

    var landerPoly = this.add.polygon(
      0, 0,
      landerPoints,
      0x999999
    );

    // this shifts the lander Poly back so it lines up with the physics body
    landerPoly.setPosition(0, -4);

    this.thrustPoly = this.add.polygon(
      0, 0,
      thrustFlamePints,
      0xffffff
    );

    var decoration = this.add.polygon(
      0, 0,
      ""
      + "10 0"
      + " "
      + "0 20"
      + " "
      + "10 30"
      + " "
      + "20 20"
      + " "
      + "10 0",
      0x000000,
    );

    this.lander = this.add.container(0, 0);
    this.lander.add([landerPoly, this.thrustPoly, decoration]);
    this.matter.add.gameObject(
      this.lander,
      {
        shape: {
          type: 'fromVerts',
          verts: landerPoints,
          flagInternal: true,
        }
      }
    );

    // test values
    // this.lander.setPosition(25, -900); // left top
    // this.lander.setPosition(25, -100); // left bottom
    // this.lander.setPosition(2900, -900); // right top
    // this.lander.setPosition(2900, -100); // right bottom

    (<any>this.lander).setFrictionAir(this.AIR_FRICTION);
    (<any>this.lander).colliderType = ColliderType.VEHICLE;
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
    if (this.tether.isActive()) {
      this.tether.remove(this);
    } else {
      if (this.grapplingHook.isActive()) {
        this.grapplingHook.remove();
      }
      this.grapplingHook.fire(
        this,
        Phaser.Math.DegToRad(this.lander.angle),
        this.lander.x,
        this.lander.y
      );
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
    var centerX: number = 500;
    var centerY: number = -500;
    this.lander.setPosition(centerX, centerY);

    this.latticeSquare.create(
      this,
      this.latticeIdCounter,
      centerX - 460, centerY - 140,
    );
    this.latticeMap[this.latticeIdCounter++] = this.latticeSquare;

    this.latticeCircle.create(
      this,
      this.latticeIdCounter,
      centerX + 40, centerY - 140,
    );
    this.latticeMap[this.latticeIdCounter++] = this.latticeCircle;

    this.latticeSquare2.create(
      this,
      this.latticeIdCounter,
      centerX + 40, centerY + 190,
    );
    this.latticeMap[this.latticeIdCounter++] = this.latticeSquare2;

    this.latticeTriangle.create(
      this,
      this.latticeIdCounter,
      // centerX - 40, centerY + 80,
      centerX - 460, centerY + 190,
    );
    this.latticeMap[this.latticeIdCounter++] = this.latticeTriangle;

    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
      for (let eventPair of event.pairs) {
        if (
          eventPair.bodyA.gameObject != null
          &&
          eventPair.bodyB.gameObject != null
        ) {
          this.collisionHandler(eventPair.bodyA, eventPair.bodyB);
        }
      }
    }, this);

    this.matter.world.disableGravity();

    var g = this.add.graphics();
    g.lineStyle(2, 0xff0000);
    g.strokeCircle(0, 0, 30);
    g.stroke();

    this.cameraCenter = g;
    if (this.debug) {
      this.cameraCenter.visible = true;
    } else {
      this.cameraCenter.visible = false;
    }

    this.cameras.main.startFollow(this.cameraCenter, true, this.lerp, this.lerp);
    this.cameras.main.setZoom(1.5);
    // test values
    // this.cameras.main.centerOn(1500, -500);
    // this.cameras.main.setZoom(0.22);
    // this.cameras.main.centerOn(this.lander.x, this.lander.y);
  }

  private collisionHandler(body1, body2) {
    var colliderType1: ColliderType = body1.gameObject.colliderType;
    var colliderType2: ColliderType = body2.gameObject.colliderType;
    if (colliderType1 == ColliderType.GRAPPLING_HOOK && colliderType2 == ColliderType.HAUL_ABLE) {
      this.tetherBodies(body1, body2);
    }
    else if (colliderType2 == ColliderType.GRAPPLING_HOOK && colliderType1 == ColliderType.HAUL_ABLE) {
      this.tetherBodies(body2, body1);
    }
    else if (colliderType1 == ColliderType.VEHICLE && colliderType2 == ColliderType.HAUL_ABLE) {
      this.removeHaulAble(body2);
    }
    else if (colliderType2 == ColliderType.VEHICLE && colliderType1 == ColliderType.HAUL_ABLE) {
      this.removeHaulAble(body1);
    }
  }

  private removeHaulAble(body: MatterJS.Body) {

    if (this.tether.getTetheredBodyFrom() == body) {
      this.tether.remove(this);
    }

    var gameObject = (<any>body).gameObject;
    this.latticeMap[gameObject.latticeId].remove(this, gameObject);
  }

  private tetherBodies(bodyGrapplingHook, bodyOther) {
    if (this.grapplingHook.isActive()) {
      this.grapplingHook.remove();
    }
    this.tether.createTether(this, bodyOther, this.lander.body);
  }

  update(time: number, delta: number): void {

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    if (this.controllerScene.thrusting == true) {
      this.thrustPoly.visible = true;
      var radians = Phaser.Math.DegToRad(this.lander.angle);
      var sinOfR: number = Math.sin(radians);
      var negativeCosOfR: number = -Math.cos(radians);
      if (!this.tether.isActive()) {
        var forceV = new Phaser.Math.Vector2(sinOfR * this.THRUST_FACTOR, negativeCosOfR * this.THRUST_FACTOR);
        this.lander.applyForce(forceV);
      } else {
        var forceV = new Phaser.Math.Vector2(sinOfR * this.THRUST_FACTOR2, negativeCosOfR * this.THRUST_FACTOR2);
        this.lander.applyForce(forceV);
      }
    } else {
      this.thrustPoly.visible = false;
    }

    this.lander.setAngularVelocity(0);
    if (this.controllerScene.rotatingLeft == true) {
      this.lander.setAngularVelocity(-this.TURN_FACTOR);
    }
    if (this.controllerScene.rotatingRight == true) {
      this.lander.setAngularVelocity(this.TURN_FACTOR);
    }

    this.cameras.main.setAngle(-this.lander.angle);

    if (this.tether.isActive()) {
      this.cameraCenter.x = (this.lander.x + (<any>this.tether.getTetheredBodyFrom()).gameObject.x) / 2;
      this.cameraCenter.y = (this.lander.y + (<any>this.tether.getTetheredBodyFrom()).gameObject.y) / 2;
    } else {
      this.cameraCenter.x = this.lander.x;
      this.cameraCenter.y = this.lander.y;
    }
  }
} 
