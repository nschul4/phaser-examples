export class Tether {

    private subTetherLength: number = 75;
    private stiffness: number = 1;
    private radius: number = 5;
    private linkColor: number = 0x005500;
    private MIN_DISTANCE: number = 150;

    private bodies: Phaser.GameObjects.GameObject[] = [];
    private constraints: MatterJS.Constraint[] = [];

    remove(
        scene: Phaser.Scene,
    ) {
        this.bodies.forEach(element => {
            element.destroy();
        });
        this.constraints.forEach(element => {
            scene.matter.world.remove(element, true);
        });
    }

    createTether(
        scene: Phaser.Scene,
        from: MatterJS.Body,
        to: MatterJS.Body
    ) {
        var x1: number = (<any>from).gameObject.x;
        var y1: number = (<any>from).gameObject.y;
        var x2: number = (<any>to).gameObject.x;
        var y2: number = (<any>to).gameObject.y;

        var distance: number = Phaser.Math.Distance.Between(
            x1, y1,
            x2, y2
        );
        if (distance < this.MIN_DISTANCE) {
            console.log(distance);
            return;
        }

        var noOfSubTethers: number = Math.floor(distance / this.subTetherLength);

        var prevBody: MatterJS.Body = from;
        for (var i: number = 1; i < noOfSubTethers; ++i) {
            var newGameObject = scene.add.circle(
                x1 + i * (x2 - x1) / noOfSubTethers,
                y1 + i * (y2 - y1) / noOfSubTethers,
                this.radius,
                this.linkColor,
            );
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
            var newConstraint: MatterJS.Constraint = scene.matter.add.constraint(
                prevBody,
                matterResult.body,
                this.subTetherLength,
                this.stiffness,
                {
                    render: {
                        visible: true,
                        lineWidth: 1,
                        strokeStyle: '#009900',
                        type: 'line',
                        anchors: false
                    },
                }
            );
            this.bodies.push(matterResult);
            this.constraints.push(newConstraint);
            prevBody = matterResult.body;
        }
        var lastNewConstraint: MatterJS.Constraint = scene.matter.add.constraint(
            prevBody,
            to,
            this.subTetherLength,
            this.stiffness,
            {
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
