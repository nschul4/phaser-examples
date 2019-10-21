export class Tether {

    private debug: boolean = false;

    private active: boolean = false;

    private subTetherLength: number = 10;
    private stiffness: number = 0.75;
    private radius: number = 3;
    private linkColor: number = 0x550000;

    private bodies: Phaser.GameObjects.GameObject[] = [];
    private constraints: MatterJS.Constraint[] = [];

    private from: MatterJS.Body;
    private to: MatterJS.Body;

    public isActive(): boolean {
        return this.active;
    }

    public getTetheredBodyFrom(): MatterJS.Body {
        return this.from;
    }

    public getTetheredBodyTo(): MatterJS.Body {
        return this.to;
    }

    remove(
        scene: Phaser.Scene,
    ) {
        if (this.active) {

            this.bodies.forEach(element => {
                element.destroy();
            });
            this.constraints.forEach(element => {
                scene.matter.world.remove(element, true);
            });

            this.from = null;
            this.to = null;

            this.active = false;
        }
    }

    createTether(
        scene: Phaser.Scene,
        from: MatterJS.Body,
        to: MatterJS.Body,
    ): void {

        if (this.active) {
            this.remove(scene);
        }

        var x1: number = (<any>from).gameObject.x;
        var y1: number = (<any>from).gameObject.y;
        var x2: number = (<any>to).gameObject.x;
        var y2: number = (<any>to).gameObject.y;

        var distance: number = Phaser.Math.Distance.Between(
            x1, y1,
            x2, y2
        );

        var C1: number = 25;
        var C2: number = 25;

        if (distance < (C1 + C2 + 20)) {
            return;
        }

        var p1 = new Phaser.Geom.Point(x1, y1);
        var p2 = new Phaser.Geom.Point(x2, y2);
        var radians: number = Phaser.Math.Angle.BetweenPoints(p1, p2);
        var c1CosR = C1 * Math.cos(radians);
        var c1SinR = C1 * Math.sin(radians);

        var radians2: number = Phaser.Math.DegToRad((<any>to).gameObject.angle);
        var c2CosR = C2 * Math.sin(radians2);
        var c2SinR = -C2 * Math.cos(radians2);

        var bumpedX1: number = x1 + c1CosR;
        var bumpedY1: number = y1 + c1SinR;
        var bumpedX2: number = x2 - c2CosR;
        var bumpedY2: number = y2 - c2SinR;

        if (this.debug) {
            scene.add.circle(bumpedX1, bumpedY1, 2, 0x990099);
            scene.add.circle(bumpedX2, bumpedY2, 2, 0x009999);
        }

        var bumpedDistance: number = Phaser.Math.Distance.Between(
            bumpedX1, bumpedY1,
            bumpedX2, bumpedY2
        );

        var noOfSubTethers: number = Math.floor(bumpedDistance / this.subTetherLength);

        var prevBody: MatterJS.Body = from;
        for (var i: number = 1; i < noOfSubTethers; ++i) {
            var newGameObject = scene.add.circle(
                bumpedX1 + i * (bumpedX2 - bumpedX1) / noOfSubTethers,
                bumpedY1 + i * (bumpedY2 - bumpedY1) / noOfSubTethers,
                this.radius,
                this.linkColor,
            );
            if (this.debug) {
                scene.add.circle(
                    bumpedX1 + i * (bumpedX2 - bumpedX1) / noOfSubTethers,
                    bumpedY1 + i * (bumpedY2 - bumpedY1) / noOfSubTethers,
                    2, 0x999900
                );
            }
            var matterResult = scene.matter.add.gameObject(
                newGameObject,
                {
                    shape: {
                        type: 'circle',
                        radius: this.radius,
                        flagInternal: true
                    }
                },
            );
            var newConstraint: MatterJS.Constraint;
            if (i == 1) {
                newConstraint = scene.matter.add.constraint(
                    prevBody,
                    matterResult.body,
                    this.subTetherLength,
                    this.stiffness,
                    {
                        pointA:
                            { x: c1CosR, y: c1SinR },
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
            } else {
                newConstraint = scene.matter.add.constraint(
                    prevBody,
                    matterResult.body,
                    this.subTetherLength,
                    this.stiffness,
                    {
                        pointA: { x: 0, y: 0 },
                        pointB: { x: 0, y: 0 },
                        render: {
                            visible: true,
                            lineWidth: 1,
                            strokeStyle: '#009900',
                            type: 'line',
                            anchors: false
                        },
                    }
                );
            }
            this.bodies.push(matterResult);
            this.constraints.push(newConstraint);
            prevBody = matterResult.body;

            this.from = from;
            this.to = to;

            this.active = true;
        }

        var lastNewConstraint: MatterJS.Constraint = scene.matter.add.constraint(
            prevBody,
            to,
            this.subTetherLength,
            this.stiffness,
            {
                pointA:
                    { x: 0, y: 0 },
                pointB:
                    { x: -c2CosR, y: -c2SinR },
                render: {
                    visible: true,
                    lineWidth: 1,
                    strokeStyle: '#009900',
                    type: 'line',
                    anchors: false
                },
            }
        );
        this.constraints.push(lastNewConstraint);
    }
}
