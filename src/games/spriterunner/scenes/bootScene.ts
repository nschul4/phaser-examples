export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene"
    });
  }

  preload(): void {
    console.log("preload");
    // Load assets
    this.load.setPath('./src/games/spriterunner/assets/');
    this.load.image('imagekey', 'gfx/character.png');
    this.load.spritesheet('spritesheetkey', 'gfx/character.png',
      {
        frameWidth: 16,
        frameHeight: 32
      }
    );
    this.load.spritesheet('spritesheetkey2', 'gfx/character.png',
      {
        frameWidth: 32,
        frameHeight: 32
      }
    );

  }

  update(): void {
    this.scene.start("GameScene");
  }
}
