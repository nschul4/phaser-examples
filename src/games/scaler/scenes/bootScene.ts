import { g_version } from "../game";

export class BootScene extends Phaser.Scene {

  private helloMessage: string = "scaler v" + g_version;

  constructor() {
    super({
      key: "BootScene"
    });
  }

  preload(): void {
    // console.log("BootScene.preload");
    // Load assets
    this.load.setPath('./src/games/lander/assets/');
    // this.load.image('background', 'starfield.jpg');
  }

  create(): void {
    // console.log("BootScene.create");
    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    var text = this.add.text(
      width / 2, 100,
      this.helloMessage,
      {
        fontSize: 64 + "px",
        color: 'gray',
        strokeThickness: 1,
      },
    );
    // text.setOrigin();
  }

  update(): void {
    // console.log("BootScene.update");
    this.scene.start("GameScene");
  }
}
