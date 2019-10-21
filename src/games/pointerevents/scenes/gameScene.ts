export class GameScene extends Phaser.Scene {

  private text: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "GameScene"
    });
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

  create(): void {
    var isPointerDown = false;

    this.input.on('pointerdown', function (pointer) {
      // console.log("pointerdown");
      this.text.setText("pointerdown " + this.objectToString(pointer));
      isPointerDown = true;
    }, this);

    this.input.on('pointerup', function (pointer) {
      // console.log("pointerup");
      this.text.setText("pointerup " + this.objectToString(pointer));
      isPointerDown = false;
    }, this);

    this.input.on('pointermove', function (pointer) {
      // console.log("pointermove");
      this.text.setText("pointermove " + this.objectToString(pointer));
      if (isPointerDown) {
      }
    }, this);

    this.text = this.add.text(0, 0, "create",
      {
        fontSize: 11 + 'px',
        // color: 'gray',
        // strokeThickness: 1,
      },
    );
    // this.text.setOrigin();

    this.cameras.main.setZoom(3);
  }

  update(): void {
    var textBounds = this.text.getBounds();
    this.cameras.main.centerOn(textBounds.width / 2, textBounds.height / 2);
  }
}
