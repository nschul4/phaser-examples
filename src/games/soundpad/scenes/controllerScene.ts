import { GameScene } from "./gameScene";

enum PadNumber {
  triangleNW = 0,
  triangleSW = 1,
  triangleSE = 2,
  triangleNE = 3,
}

interface Pad {
  padNumber: PadNumber,
  g: Phaser.GameObjects.Graphics;
  color: number;
  tx: Phaser.Geom.Triangle;
}

export class ControllerScene extends Phaser.Scene {

  private gameScene: GameScene = null;

  private keyNW: Phaser.Input.Keyboard.Key;
  private keySW: Phaser.Input.Keyboard.Key;
  private keySE: Phaser.Input.Keyboard.Key;
  private keyNE: Phaser.Input.Keyboard.Key;

  private blue: number = 0x0000ff;
  private green: number = 0x008800;

  private padMap: Map<PadNumber, Pad> = new Map();

  private prevNW: number = 0;
  private prevSW: number = 0;
  private prevSE: number = 0;
  private prevNE: number = 0;

  constructor() {
    super({
      key: "ControllerScene",
      active: true,
    });
  }
  private setupClickableTriangle(
    scene: Phaser.Scene,
    color: number,
    tx: Phaser.Geom.Triangle,
    padNumber: PadNumber,
  ) {
    var g = scene.add.graphics();
    this.padMap.set(padNumber, {
      padNumber: padNumber,
      g: g,
      color: color,
      tx: tx,
    });
    (<any>g).padNumber = padNumber;
    g.setInteractive(tx, Phaser.Geom.Triangle.Contains);
    g.fillStyle(color, 0.5);
    g.fillTriangleShape(tx);
  }

  private setPadColor(pad: Pad, color: number, alpha: number) {
    var g = pad.g;
    g.clear();
    g.fillStyle(color, alpha);
    g.fillTriangleShape(pad.tx);
  }

  private setPadColorAllExceptOne(exceptName: PadNumber) {
    for (let pad of Array.from(this.padMap.values())) {
      if (pad.padNumber === exceptName) {
        this.setPadColor(pad, pad.color, 1);
      } else {
        this.setPadColor(pad, pad.color, 0.5);
      }
    }
  }

  private resetAllButtonColors() {
    for (let pad of Array.from(this.padMap.values())) {
      this.setPadColor(pad, pad.color, 0.5);
    }
  }

  ignore(camera: Phaser.Cameras.Scene2D.Camera) {
    for (let pad of Array.from(this.padMap.values())) {
      camera.ignore(pad.g);
    }
  }

  setPosition(x: number, y: number) {
    for (let pad of Array.from(this.padMap.values())) {
      pad.g.setPosition(x, y);
    }
  }

  create(): void {
    // console.log("ControllerScene.create");

    this.gameScene = (<GameScene>this.scene.get('GameScene'));

    var width: number = <number>this.game.config.width;
    var height: number = <number>this.game.config.height;

    this.input.addPointer(4);

    var triangleNW = new Phaser.Geom.Triangle(
      width / 2, 0, // center top
      0, height, // left bottom
      0, 0, // left top
    );
    var triangleSW = new Phaser.Geom.Triangle(
      width / 2, 0, // center top
      width / 2, height, // center bottom
      0, height, // left bottom
    );

    var triangleSE = new Phaser.Geom.Triangle(
      width / 2, 0, // center top
      width, height, // right bottom
      width / 2, height, // center bottom
    );
    var triangleNE = new Phaser.Geom.Triangle(
      width / 2, 0, // center top
      width, 0, //  right top
      width, height, // left bottom
    );

    this.keyNW = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.keySW = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z
    );
    this.keySE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.C
    );
    this.keyNE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );

    this.setupClickableTriangle(
      this, this.green, triangleNW, PadNumber.triangleNW,
    );
    this.setupClickableTriangle(
      this, this.blue, triangleSW, PadNumber.triangleSW,
    );
    this.setupClickableTriangle(
      this, this.green, triangleSE, PadNumber.triangleSE,
    );
    this.setupClickableTriangle(
      this, this.blue, triangleNE, PadNumber.triangleNE,
    );
  }

  isPointerHittingPad(mousePointer: Phaser.Input.Pointer, padNumber: PadNumber): boolean {
    var hitTest = this.input.hitTestPointer(mousePointer);
    if (hitTest.length > 0) {
      for (var i = 0; i < hitTest.length; ++i) {
        var go = hitTest[i];
        if ((<any>go).padNumber === padNumber) {
          return true;
        }
      }
    }
    return false;
  }

  update(): void {

    var nw: number = 0;
    if (this.keyNW.isDown) {
      nw++;
    }
    if (this.input.mousePointer.isDown && this.isPointerHittingPad(this.input.mousePointer, PadNumber.triangleNW)) {
      nw++;
    }
    if (this.input.pointer1.isDown && this.isPointerHittingPad(this.input.pointer1, PadNumber.triangleNW)) {
      nw++;
    }
    if (this.input.pointer2.isDown && this.isPointerHittingPad(this.input.pointer2, PadNumber.triangleNW)) {
      nw++;
    }
    if (this.input.pointer3.isDown && this.isPointerHittingPad(this.input.pointer3, PadNumber.triangleNW)) {
      nw++;
    }
    if (this.input.pointer4.isDown && this.isPointerHittingPad(this.input.pointer4, PadNumber.triangleNW)) {
      nw++;
    }

    var sw: number = 0;
    if (this.keySW.isDown) {
      sw++;
    }
    if (this.input.mousePointer.isDown && this.isPointerHittingPad(this.input.mousePointer, PadNumber.triangleSW)) {
      sw++;
    }
    if (this.input.pointer1.isDown && this.isPointerHittingPad(this.input.pointer1, PadNumber.triangleSW)) {
      sw++;
    }
    if (this.input.pointer2.isDown && this.isPointerHittingPad(this.input.pointer2, PadNumber.triangleSW)) {
      sw++;
    }
    if (this.input.pointer3.isDown && this.isPointerHittingPad(this.input.pointer3, PadNumber.triangleSW)) {
      sw++;
    }
    if (this.input.pointer4.isDown && this.isPointerHittingPad(this.input.pointer4, PadNumber.triangleSW)) {
      sw++;
    }

    var se: number = 0;
    if (this.keySE.isDown) {
      se++;
    }
    if (this.input.mousePointer.isDown && this.isPointerHittingPad(this.input.mousePointer, PadNumber.triangleSE)) {
      se++;
    }
    if (this.input.pointer1.isDown && this.isPointerHittingPad(this.input.pointer1, PadNumber.triangleSE)) {
      se++;
    }
    if (this.input.pointer2.isDown && this.isPointerHittingPad(this.input.pointer2, PadNumber.triangleSE)) {
      se++;
    }
    if (this.input.pointer3.isDown && this.isPointerHittingPad(this.input.pointer3, PadNumber.triangleSE)) {
      se++;
    }
    if (this.input.pointer4.isDown && this.isPointerHittingPad(this.input.pointer4, PadNumber.triangleSE)) {
      se++;
    }

    var ne: number = 0;
    if (this.keyNE.isDown) {
      ne++;
    }
    if (this.input.mousePointer.isDown && this.isPointerHittingPad(this.input.mousePointer, PadNumber.triangleNE)) {
      ne++;
    }
    if (this.input.pointer1.isDown && this.isPointerHittingPad(this.input.pointer1, PadNumber.triangleNE)) {
      ne++;
    }
    if (this.input.pointer2.isDown && this.isPointerHittingPad(this.input.pointer2, PadNumber.triangleNE)) {
      ne++;
    }
    if (this.input.pointer3.isDown && this.isPointerHittingPad(this.input.pointer3, PadNumber.triangleNE)) {
      ne++;
    }
    if (this.input.pointer4.isDown && this.isPointerHittingPad(this.input.pointer4, PadNumber.triangleNE)) {
      ne++;
    }

    if (nw > this.prevNW) {
      var pad = this.padMap.get(PadNumber.triangleNW)
      this.setPadColor(pad, pad.color, 1);
      this.gameScene.play1();
    } else if (nw < this.prevNW) {
      var pad = this.padMap.get(PadNumber.triangleNW)
      this.setPadColor(pad, pad.color, 0.5);
    }

    if (sw > this.prevSW) {
      var pad = this.padMap.get(PadNumber.triangleSW)
      this.setPadColor(pad, pad.color, 1);
      this.gameScene.play2();
    } else if (sw < this.prevSW) {
      var pad = this.padMap.get(PadNumber.triangleSW)
      this.setPadColor(pad, pad.color, 0.5);
    }

    if (se > this.prevSE) {
      var pad = this.padMap.get(PadNumber.triangleSE)
      this.setPadColor(pad, pad.color, 1);
      this.gameScene.play3();
    } else if (se < this.prevSE) {
      var pad = this.padMap.get(PadNumber.triangleSE)
      this.setPadColor(pad, pad.color, 0.5);
    }

    if (ne > this.prevNE) {
      var pad = this.padMap.get(PadNumber.triangleNE)
      this.setPadColor(pad, pad.color, 1);
      this.gameScene.play4();
    } else if (ne < this.prevNE) {
      var pad = this.padMap.get(PadNumber.triangleNE)
      this.setPadColor(pad, pad.color, 0.5);
    }

    this.prevNW = nw;
    this.prevSW = sw;
    this.prevSE = se;
    this.prevNE = ne;
  }
}
