import { ColliderType } from "./colliderType";
import { Lattice } from "./lattice";

export class LatticeTriangle implements Lattice {
    private n: number = 15;
    private spacing: number = 30;
    private size: number = 30;

    private constraintArrHorizontal: MatterJS.Constraint[][];
    private constraintArrVertical: MatterJS.Constraint[][];

    private textureKey: string = "textureKeyLatticeTriangle";

    create(
        scene: Phaser.Scene,
        latticeId: number,
        centerX: number, centerY: number
    ): void {
        var gameObjectArr: any[][] = [];
        this.constraintArrHorizontal = [];
        this.constraintArrVertical = [];
        for (var i = 0; i < this.n; ++i) {
            gameObjectArr.push([]);
            this.constraintArrHorizontal.push([]);
            this.constraintArrVertical.push([]);
        }

        var g = scene.add.graphics();

        // blue background
        // g.fillStyle(0x0000ff, 0.5);
        // g.fillRect(0, 0, this.size, this.size);

        // outer circle
        g.fillStyle(0x999999);
        g.fillCircle(
            this.size / 2, this.size / 2,
            this.size / 2.5,
        );

        // inner circle
        g.fillStyle(0x000000);
        g.fillCircle(
            this.size / 2 + 2, this.size / 2,
            this.size / 4
        );

        g.generateTexture(this.textureKey, this.size, this.size);
        g.destroy();

        for (var i = 0; i < this.n; ++i) {
            for (var j = 0; j <= i; ++j) {

                var gameObject: any = scene.matter.add.gameObject(
                    scene.add.image(
                        centerX + this.spacing * i, centerY + centerY / 2 + this.spacing * j,
                        this.textureKey),
                    {
                        shape: {
                            type: 'circle',
                            radius: this.size / 2.5,
                            flagInternal: true,
                        }
                    }
                );

                gameObject.setFriction(0);
                gameObject.colliderType = ColliderType.HAUL_ABLE;
                gameObjectArr[i][j] = gameObject;

                gameObject.latticeId = latticeId;
                gameObject.i = i;
                gameObject.j = j;

                if (j < i) {
                    var newConstraintHorizontal: MatterJS.Constraint = scene.matter.add.constraint(
                        gameObject,
                        gameObjectArr[i - 1][j],
                        this.spacing,
                        1,
                        {
                            pointA:
                                { x: 0, y: 0 },
                            pointB:
                                { x: 0, y: 0 },
                            render: {
                                visible: true,
                                lineWidth: 1,
                                strokeStyle: '#009900',
                                type: 'line',
                                anchors: false
                            },
                        }
                    );
                    this.constraintArrHorizontal[i - 1][j] = newConstraintHorizontal;
                }

                if (j > 0) {
                    var newConstraintVertical: MatterJS.Constraint = scene.matter.add.constraint(
                        gameObject,
                        gameObjectArr[i][j - 1],
                        this.spacing,
                        1,
                        {
                            pointA:
                                { x: 0, y: 0 },
                            pointB:
                                { x: 0, y: 0 },
                            render: {
                                visible: true,
                                lineWidth: 1,
                                strokeStyle: '#009900',
                                type: 'line',
                                anchors: false
                            },
                        }
                    );
                    this.constraintArrVertical[i][j - 1] = newConstraintVertical;
                }
            }
        }
    }

    remove(scene: Phaser.Scene, gameObject: Phaser.GameObjects.GameObject): void {
        var i: number = (<any>gameObject).i;
        var j: number = (<any>gameObject).j;

        if (j < i) {
            scene.matter.world.remove(this.constraintArrHorizontal[i - 1][j], true);
        }
        if (j > 0) {
            scene.matter.world.remove(this.constraintArrVertical[i][j - 1], true);
        }
        if (i < this.n - 1) {
            scene.matter.world.remove(this.constraintArrHorizontal[i][j], true);
        }
        if (j < i) {
            scene.matter.world.remove(this.constraintArrVertical[i][j], true);
        }

        gameObject.destroy();
    }
}
