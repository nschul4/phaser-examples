export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene"
    });
  }

  preload(): void {
    // Load assets
    this.load.setPath('./src/games/gridrunner/assets/');
  }

  update(): void {
    this.scene.start("GameScene");
  }
}
