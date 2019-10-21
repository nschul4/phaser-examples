export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene"
    });
  }

  preload(): void {
    console.log("preload");
    // Load assets
    this.load.setPath('./src/games/rocketenginetest/assets/');
    this.load.atlas('flares', 'flares.png', 'flares.json');
    this.load.image('stars', 'starfield.jpg');
    // this.load.atlas('flares', 'lit-smoke.png');
  }

  update(): void {
    this.scene.start("GameScene");
  }
}
