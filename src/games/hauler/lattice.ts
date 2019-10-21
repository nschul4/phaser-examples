export interface Lattice {

    create(
        scene: Phaser.Scene,
        latticeId: number,
        x: number, y: number,
    ): void;

    remove(
        scene: Phaser.Scene,
        gameObject: Phaser.GameObjects.GameObject,
    ): void;
}
