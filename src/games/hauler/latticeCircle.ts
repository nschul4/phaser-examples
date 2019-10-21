import { ColliderType } from "./colliderType";
import { Lattice } from "./lattice";
import { scaleFromRangeToRange } from "../../common/scaleFromRangeToRange";

export class LatticeCircle implements Lattice {
    private n: number = 15;
    private spacing: number = 30;
    private size: number = 30;

    private constraintArrHorizontal: MatterJS.Constraint[][];
    private constraintArrVertical: MatterJS.Constraint[][];

    private textureKey: string = "textureKeyLatticeCircle";

    private circleArr: boolean[][];

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
        g.fillStyle(0xbbbb00);
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

        this.circleArr = new Array(this.n).fill(false).map(
            () => new Array(this.n).fill(false)
        );

        var noOfCircles: number = 7;
        var sectorSize: number = Math.PI / 16;
        var gg: number = 30;
        var q: number = 1;

        for (var i = 0; i <= noOfCircles; i += 0.1) {
            for (var j = 0; j < 2 * Math.PI; j += sectorSize) {
                var x: number =
                    Math.round(
                        ((gg * i) * Math.cos(j)) / q
                    ) * q
                    ;
                var y: number =
                    Math.round(
                        ((gg * i) * Math.sin(j)) / q
                    ) * q
                    ;
                var yScaled: number = Math.round(
                    scaleFromRangeToRange(
                        -gg * noOfCircles, gg * noOfCircles,
                        0, this.circleArr.length - 1,
                        y,
                    )
                )
                    ;
                var xScaled: number = Math.round(
                    scaleFromRangeToRange(
                        -gg * noOfCircles, gg * noOfCircles,
                        0, this.circleArr[yScaled].length - 1,
                        x,
                    )
                )
                    ;
                // scene.add.image(x, y, this.textureKey);
                this.circleArr[xScaled][yScaled] = true;
            }
        }

        for (var i = 0; i < this.circleArr.length; ++i) {
            for (var j = 0; j < this.circleArr[i].length; ++j) {
                if (this.circleArr[i][j]) {
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

                    if (i > 0) {
                        if (this.circleArr[i - 1][j]) {
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
                    }

                    if (j > 0) {
                        if (this.circleArr[i][j - 1]) {
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
        }

        // console.log(this.circleArrToString(this.circleArr));
    }

    private circleArrToString(circleArr: boolean[][]) {
        var s: string = "";
        for (var i = 0; i < circleArr.length; ++i) {
            s += this.pad(3, i) + ": ";
            for (var j = 0; j < circleArr[i].length; ++j) {
                if (circleArr[i][j]) {
                    s += " # ";
                } else {
                    s += "   ";
                }
            }
            s += "\n";
        }
        return s;
    }

    private pad(size, number): string {
        var s = String(Math.abs(number));
        while (s.length < (size || 2)) { s = "0" + s; }
        if (number >= 0) {
            s = "+" + s;
        } else {
            s = "-" + s;
        }
        return s;
    }

    remove(scene: Phaser.Scene, gameObject: Phaser.GameObjects.GameObject): void {
        var i: number = (<any>gameObject).i;
        var j: number = (<any>gameObject).j;

        if (i > 0) {
            if (this.circleArr[i - 1][j]) {
                scene.matter.world.remove(this.constraintArrHorizontal[i - 1][j], true);
            }
        }
        if (j > 0) {
            if (this.circleArr[i][j - 1]) {
                scene.matter.world.remove(this.constraintArrVertical[i][j - 1], true);
            }
        }
        if (i < this.n - 1) {
            if (this.circleArr[i + 1][j]) {
                scene.matter.world.remove(this.constraintArrHorizontal[i][j], true);
            }
        }
        if (j < this.n - 1) {
            if (this.circleArr[i][j + 1]) {
                scene.matter.world.remove(this.constraintArrVertical[i][j], true);
            }
        }

        gameObject.destroy();
    }
}
