export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene"
    });
  }

  preload(): void {
    console.log("preload");
    // Load assets
    this.load.setPath('./src/games/polygondrop/assets/');
  }

  update(): void {
    this.scene.start("MainScene");
  }
}
