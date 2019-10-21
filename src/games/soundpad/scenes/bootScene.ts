import { g_version } from "../game";
import { timingSafeEqual } from "crypto";

export class BootScene extends Phaser.Scene {

  private helloMessage: string = "soundpad v" + g_version;

  constructor() {
    super({
      key: "BootScene"
    });
  }

  preload(): void {
    // Load assets
    this.load.setPath('./src/games/soundpad/assets/');
    this.load.audio('s1', 'ModernMixing.com - Trap Drums HQ (Demo Kit)/MM-TDHQ-1.Clean 808 Kit/MM-TDHQ-Clean808-HC.mp3');
    this.load.audio('s2', 'ModernMixing.com - Trap Drums HQ (Demo Kit)/MM-TDHQ-1.Clean 808 Kit/MM-TDHQ-Clean808-HH1.mp3');
    this.load.audio('s3', 'ModernMixing.com - Trap Drums HQ (Demo Kit)/MM-TDHQ-1.Clean 808 Kit/MM-TDHQ-Clean808-HH2.mp3');
    this.load.audio('s4', 'ModernMixing.com - Trap Drums HQ (Demo Kit)/MM-TDHQ-FX/MM-TDHQ-FX-04.mp3');
  }

  create(): void {
    // console.log("BootScene.create");
    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    var text = this.add.text(
      width / 2, height / 2,
      this.helloMessage,
      {
        fontSize: 128 + "px",
        color: 'white',
        strokeThickness: 5,
      },
    );
    text.setOrigin();
  }

  update(): void {
    // console.log("BootScene.update");
    this.time.delayedCall(1000, function () {
      this.scene.start("GameScene");
    },
      null,
      this,
    );
  }
}
