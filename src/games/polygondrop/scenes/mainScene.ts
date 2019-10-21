import { createPolygon } from "../../../common/createPolygon";

export class MainScene extends Phaser.Scene {

  private escKeyObj: Phaser.Input.Keyboard.Key;
  private sceneKeys = [
    "GameScene1",
    "GameScene2",
    "GameScene3",
    "GameScene4",
    "GameScene5",
    "GameScene6",
    "GameScene7"
  ];
  private sceneKeyIndex = 0;
  private text: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  private pad(size, number): string {
    var s = String(Math.abs(number));
    while (s.length < (size || 2)) { s = "0" + s; }
    if (number == 0) {
      s = " " + s;
    } else
      if (number > 0) {
        s = "+" + s;
      } else {
        s = "-" + s;
      }
    return s;
  }

  private sceneKeyIndexNext() {
    return this.sceneKeyIndex % this.sceneKeys.length;
  }

  private sceneKeyIndexPrevious() {
    return (this.sceneKeyIndex - 1) % this.sceneKeys.length;
  }

  private changeScene() {
    this.scene.stop(this.sceneKeys[this.sceneKeyIndexPrevious()]);
    this.scene.launch(this.sceneKeys[this.sceneKeyIndexNext()]);
    this.sceneKeyIndex++;
    this.text.setText("" + this.sceneKeyIndexPrevious());
  }

  create(): void {
    console.log("MainScene");

    this.input.on('pointerdown', function (pointer) {
      this.changeScene();
    }, this);

    this.escKeyObj =
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.scene.launch(this.sceneKeys[this.sceneKeyIndexNext()]);
    this.sceneKeyIndex++;

    var width: any = this.game.config.width;
    var height: any = this.game.config.height;

    this.add.grid(
      0, 0,
      width, height,
      10, 10,
      0x000000, 0, 0x00ff00, 0.2,
    );

    for (var i = -150; i <= 150; i += 25) {
      this.add.text(-170, i - 7, this.pad(3, i)).setFontSize(12);
      var g = this.add.graphics();
      g.lineStyle(1, 0xffffff, 1);
      g.beginPath()
      g.moveTo(-110, i);
      g.lineTo(-100 + (i % 100 == 0 ? 10 : 0), i);
      g.closePath();
      g.stroke();
    }

    for (var i = -150; i <= 150; i += 25) {
      var tmp = this.add.text(i + 5, 210, this.pad(3, i)).setFontSize(14);
      tmp.angle = 90;
      var g = this.add.graphics();
      g.lineStyle(1, 0xffffff, 1);
      g.beginPath()
      g.moveTo(i, 200);
      g.lineTo(i, 190 - (i % 100 == 0 ? 10 : 0));
      g.closePath();
      g.stroke();
    }

    var g = this.add.graphics();
    g.lineStyle(1, 0xffffff, 1);
    for (var i = 10; i < 70; i += 10) {
      g.strokeCircle(0, 0, i);
    }

    this.cameras.main.centerOn(0, 0);

    this.text = this.add.text(
      20 - width / 2,
      10 - height / 2,
      "" + this.sceneKeyIndexPrevious()
    )
      .setFontSize(30)
      .setFontFamily("Roboto Condensed")
      ;
    ;
  }

  update(): void {
    if (this.escKeyObj.isDown) {
      this.changeScene();
    }
  }
}
