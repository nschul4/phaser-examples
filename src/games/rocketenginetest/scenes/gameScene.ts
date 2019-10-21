import { ReadOut } from "../../../common/classes/readOut";
import { deepCopy } from "../../../common/js/util";

export class GameScene extends Phaser.Scene {

  private g_emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private g_emitter2: Phaser.GameObjects.Particles.ParticleEmitter;

  private g_shipShiftY: number = 25;
  private g_emmiterShiftX: number = 16;
  private g_emmiterShiftY: number = -50;
  private g_y: number;
  private g_acc: number = 0.001;
  private g_spaceShip: Phaser.GameObjects.Graphics;
  private g_timeSegment: number = 5000;

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

  private createParticleEmitterConfig(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    var defaultConfigTemplate: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
      frame: ['white'],
      x: x,
      y: y,
      lifespan: 100000,
      angle: { min: 70, max: 110 },
      speed: { min: 0, max: 15 },
      scale: { start: 0.1, end: 0.01 },
      // gravityY: 1000,
      // gravityX: -10,
      // bounce: 0.75,
      bounds: {
        x: -width,
        y: -height,
        w: width * 3,
        h: height * 3
      },
      // collideTop: false,
      // collideBottom: false,
      // collideLeft: true,
      // collideRight: true,
      blendMode: 'ADD'
    };

    return deepCopy(defaultConfigTemplate);
  }

  create(): void {
    this.cameras.main.lerp = new Phaser.Math.Vector2(0.1);

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;
    this.g_y = height / 2;

    var background = this.add.tileSprite(
      width / 2,
      height / 2,
      width * 4,
      height * 4,
      "background"
    );

    var particles = this.add.particles('flares');

    var emitterConfig =
      this.createParticleEmitterConfig(
        width / 2 - this.g_emmiterShiftX,
        this.g_y - this.g_emmiterShiftY,
        width,
        height
      );

    var emitterConfig1 = deepCopy(emitterConfig);
    emitterConfig1.frame = ['blue'];
    emitterConfig1.angle = { min: 180, max: 180 };
    var emitterConfig2 = deepCopy(emitterConfig);
    emitterConfig2.frame = ['blue'];
    emitterConfig2.angle = { min: 0, max: 0 };

    this.g_emitter = particles.createEmitter(emitterConfig1);
    // this.g_emitter.setScale(0.1);
    this.g_emitter2 = particles.createEmitter(emitterConfig2);
    // this.g_emitter2.setScale(0.1);

    this.g_spaceShip = this.add.graphics();
    this.drawSpaceShip(this.g_spaceShip);
    this.g_spaceShip.fillStyle(0x00aa00);
    this.g_spaceShip.fillPath();
    this.g_spaceShip.x = width / 2;
    this.g_spaceShip.y = this.g_y + this.g_shipShiftY;
    // this.g_spaceShip.visible = false;

    var groundLine = this.add.graphics();
    groundLine.beginPath();
    groundLine.lineTo(-128, 0);
    groundLine.lineTo(128, 0);
    groundLine.lineTo(0, height);
    groundLine.lineTo(-128, 0);
    groundLine.closePath();
    groundLine.fillStyle(0xaa0000);
    groundLine.fillPath();
    groundLine.x = this.g_spaceShip.x;
    groundLine.y = this.g_spaceShip.y + this.g_shipShiftY;
    // groundLine.depth = -1;
    // groundLine.visible = false;

    background.depth = 1;
    groundLine.depth = 2;
    this.g_spaceShip.depth = 3;
    particles.depth = 4;
  }

  update(time: number, delta: number): void {
    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    this.g_y -= this.g_acc;
    this.g_spaceShip.y = this.g_y + this.g_shipShiftY;
    this.g_emitter.setPosition(width / 2 - this.g_emmiterShiftX, this.g_y - this.g_emmiterShiftY);
    this.g_emitter2.setPosition(width / 2 + this.g_emmiterShiftX, this.g_y - this.g_emmiterShiftY);

    if (this.g_y < -height - height / 2) {
      this.g_y = 0;
    }

    var segment: number = 2;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=0");
    }

    segment++;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=1");
      this.cameras.main.shake(500, 0.002);
    }

    segment++;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=2");
      this.cameras.main.shake(500, 0.003);
    }

    segment++;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=3");
      this.cameras.main.shake(500, 0.004);
    }

    segment++;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=4");
      this.cameras.main.shake(500, 0.005);
      this.g_acc += 0.0001;
    }

    segment++;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=5");
      this.cameras.main.shake(500, 0.006);
      this.g_acc += 0.0001;
    }

    segment++;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=6");
      this.cameras.main.shake(500, 0.005);
      this.g_acc += 0.0001;
    }

    segment++;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=7");
      this.cameras.main.shake(500, 0.004);
      this.g_acc += 0.0001;
    }

    segment++;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=8");
      this.cameras.main.shake(500, 0.003);
      this.g_acc += 0.0001;
    }

    segment++;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=9");
      this.cameras.main.shake(500, 0.002);
      this.g_acc += 0.0001;
    }

    segment++;

    if (time > segment * this.g_timeSegment && time <= (segment + 1) * this.g_timeSegment) {
      console.log("t=10");
      this.g_acc += 0.0001;
    }

    segment++;

    if (time > segment * this.g_timeSegment) {
      this.g_acc += 0.0001;
    }

    this.cameras.main.centerOn(
      this.g_spaceShip.x,
      this.g_spaceShip.y * 1.5
    );
  }
}
