import { ImageHelper } from "./imgHelper.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;

    border = true;

    IMAGES_WALKING = ImageHelper.BOSS.walk;

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000);
    }
}
