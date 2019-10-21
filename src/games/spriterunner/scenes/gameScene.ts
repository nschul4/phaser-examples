export class GameScene extends Phaser.Scene {

  private text: Phaser.GameObjects.Text;
  private image: Phaser.GameObjects.Image;
  private sprite: Phaser.GameObjects.Sprite;
  private sprite2: Phaser.GameObjects.Sprite;
  private sprite3: Phaser.GameObjects.Sprite;
  private sprite4: Phaser.GameObjects.Sprite;
  private sprite5: Phaser.GameObjects.Sprite;
  private sprite6: Phaser.GameObjects.Sprite;
  private sprite7: Phaser.GameObjects.Sprite;
  private counter: number = 0;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  create(): void {
    this.text = this.add.text(0, 0, "" + this.counter);
    this.image = this.add.image(200, 150, 'imagekey');

    var shiftCounter = 1;
    var xshift = 64;

    this.sprite = this.add.sprite(
      200 + (xshift * shiftCounter++),
      200,
      'spritesheetkey'
    );
    this.sprite.setScale(4, 4);

    this.anims.create(
      {
        key: 'walkforward',
        frames: this.anims.generateFrameNumbers(
          'spritesheetkey',
          { start: 0, end: 3 }
        ),
        frameRate: 5,
        repeat: -1
      }
    );
    this.anims.play('walkforward', this.sprite);

    this.sprite2 = this.add.sprite(
      200 + (xshift * shiftCounter++),
      204,
      'spritesheetkey'
    );
    this.sprite2.setScale(4, 4);
    this.anims.create(
      {
        key: 'walkaway',
        frames: this.anims.generateFrameNumbers(
          'spritesheetkey',
          { start: 34, end: 37 }
        ),
        frameRate: 5,
        repeat: -1
      }
    );
    this.anims.play('walkaway', this.sprite2);

    this.sprite3 = this.add.sprite(
      200 + (xshift * shiftCounter++),
      200,
      'spritesheetkey'
    );
    this.sprite3.setScale(4, 4);
    this.anims.create(
      {
        key: 'walkleft',
        frames: this.anims.generateFrameNumbers(
          'spritesheetkey',
          { start: 51, end: 54 }
        ),
        frameRate: 5,
        repeat: -1
      }
    );
    this.anims.play('walkleft', this.sprite3);

    this.sprite4 = this.add.sprite(
      200 + (xshift * shiftCounter++),
      200,
      'spritesheetkey'
    );
    this.sprite4.setScale(4, 4);
    this.anims.create(
      {
        key: 'walkright',
        frames: this.anims.generateFrameNumbers(
          'spritesheetkey',
          { start: 17, end: 20 }
        ),
        frameRate: 5,
        repeat: -1
      }
    );
    this.anims.play('walkright', this.sprite4);

    this.sprite5 = this.add.sprite(
      200 + (xshift * shiftCounter++),
      204,
      'spritesheetkey'
    );
    this.sprite5.setScale(4, 4);
    this.anims.create(
      {
        key: 'foo',
        frames: this.anims.generateFrameNumbers(
          'spritesheetkey',
          { start: 43, end: 46 }
        ),
        frameRate: 5,
        repeat: -1
      }
    );
    this.anims.play('foo', this.sprite5);

    this.sprite6 = this.add.sprite(
      200 + (xshift * shiftCounter++),
      200,
      'spritesheetkey2'
    );
    this.sprite6.setScale(4, 4);
    this.anims.create(
      {
        key: 'bar',
        frames: this.anims.generateFrameNumbers(
          'spritesheetkey2',
          { start: 32, end: 35 }
        ),
        frameRate: 5,
        repeat: -1
      }
    );
    this.anims.play('bar', this.sprite6);

    this.sprite7 = this.add.sprite(
      200 + (xshift * shiftCounter++),
      200,
      'spritesheetkey2'
    );
    this.sprite7.setScale(4, 4);
    this.anims.create(
      {
        key: 'baz',
        frames: this.anims.generateFrameNumbers(
          'spritesheetkey2',
          { start: 48, end: 51 }
        ),
        frameRate: 5,
        repeat: -1
      }
    );
    this.anims.play('baz', this.sprite7);
  }

  update(time: number, delta: number): void {
    this.text.setText("" + this.counter++);
  }
}
