export function createPolygon(
    scene: Phaser.Scene,
    points: string,
    x: number,
    y: number,
    fillColor: number,
    isStatic: boolean,
): Phaser.GameObjects.Polygon {
    var polygon = scene.add.polygon(0, 0, points, fillColor);
    var gameObject: any = scene.matter.add.gameObject(
        polygon,
        {
            shape: {
                type: 'fromVerts',
                verts: points,
                flagInternal: true
            },
            isStatic: isStatic,
        }
    );
    gameObject.setPosition(
        x + gameObject.centerOfMass.x,
        y
        + gameObject.centerOfMass.y
        - (gameObject.getBottomLeft().y
            - gameObject.getTopLeft().y
        )
    );
    return gameObject;
}

export function createPolygonEx(
    scene: Phaser.Scene,
    points: string,
    x: number,
    y: number,
    fillColor: number,
    isStatic: boolean,
    config: any
): Phaser.GameObjects.GameObject {
    var polygon = scene.add.polygon(0, 0, points, fillColor);
    var gameObject: any = scene.matter.add.gameObject(polygon, config);
    gameObject.setPosition(
        x + gameObject.centerOfMass.x,
        y + gameObject.centerOfMass.y
        - (gameObject.getBottomLeft().y - gameObject.getTopLeft().y)
    );
    return gameObject;
}
