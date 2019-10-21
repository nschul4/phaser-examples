import { ColliderType } from "./colliderType";

export class GrapplingHook {

    private grapplingHook: any;
    private FIRE_FACTOR: number = 5;
    private active: boolean = false;

    isActive(): boolean {
        return this.active;
    }

    fire(
        scene: Phaser.Scene,
        radians: number,
        x: number,
        y: number,
    ): void {
        var sinOfR: number = Math.sin(radians);
        var cosOfR: number = Math.cos(radians);
        this.grapplingHook = scene.add.circle(
            x + (-30 * sinOfR), y + (30 * cosOfR),
            5,
            0xff0000
        );
        scene.matter.add.gameObject(
            this.grapplingHook,
            {
                shape: {
                    type: 'circle',
                    radius: 5,
                    flagInternal: true,
                }
            }
        );
        this.grapplingHook.setVelocityX(-this.FIRE_FACTOR * sinOfR);
        this.grapplingHook.setVelocityY(this.FIRE_FACTOR * cosOfR);
        this.grapplingHook.colliderType = ColliderType.GRAPPLING_HOOK;
        var now: number = scene.time.now;
        this.grapplingHook.creationTime = now;
        scene.time.delayedCall(5000, function () {
            if (this.grapplingHook != null && this.grapplingHook.creationTime == now) {
                this.grapplingHook.destroy();
                this.grapplingHook = null;
                this.active = false;
            }
        }, null, this);
        this.active = true;
    }

    remove(): void {
        this.grapplingHook.destroy();
        this.grapplingHook = null;
        this.active = false;
    }
}
