import { ImageHelper } from "./imgHelper.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Chicken extends MovableObject {
    y = 360;
    height = 70;
    width = 80;
    IMAGES_WALKING = ImageHelper.CHICKEN.walk;


    constructor() {
        super().loadImage(ImageHelper.CHICKEN.walk[0]);
        this.loadImages(ImageHelper.CHICKEN.walk);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.4;
        this.animate();
    }

    animate() {
        this.moveLeft();

        IntervalHub.startInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 230);
    }
}
