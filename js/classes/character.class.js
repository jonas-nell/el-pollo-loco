import { ImageHelper } from "./imgHelper.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Character extends MovableObject {
    height = 280;
    y = 155;
    IMAGES_WALKING = ImageHelper.PEPE.walk;

    currentImage = 0;

    constructor() {
        super().loadImage(ImageHelper.PEPE.idle[0]);
        this.loadImages(ImageHelper.PEPE.walk);
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            let i = this.currentImage % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 120);
    }

    jump() {}
}
