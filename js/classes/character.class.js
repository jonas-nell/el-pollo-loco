import { ImageHelper } from "./imgHelper.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { MovableObject } from "./movableObject.class.js";
import { Level } from "./level.class.js";

export class Character extends MovableObject {
    height = 280;
    y = 155;
    speed = 6;
    IMAGES_WALKING = ImageHelper.PEPE.walk;
    world;

    constructor() {
        super().loadImage(ImageHelper.PEPE.idle[0]);
        this.loadImages(ImageHelper.PEPE.walk);
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > -300) {
                this.x -= this.speed;
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                //walk animation
                let i = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 90);
    }

    jump() {}
}
