import { ImageHelper } from "./imgHelper.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { MovableObject } from "./movableObject.class.js";
import { Level } from "./level.class.js";
import { ThrowableObject } from "./throwable-object.class.js";

export class Character extends MovableObject {
    IMAGES_WALKING = ImageHelper.PEPE.walk;
    IMAGES_JUMPING = ImageHelper.PEPE.jump;
    IMAGES_DEAD = ImageHelper.PEPE.dead;
    IMAGES_HURT = ImageHelper.PEPE.hurt;

    offset = {
        top: 120,
        right: 25,
        bottom: 15,
        left: 25
    }

    height = 280;
    y = 0;
    speed = 6;
    world;
    canThrow = true;

    border = true;

    constructor() {
        super();
        this.loadImage(ImageHelper.PEPE.idle[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.animate();
        this.applyGravity();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (
                this.world.keyboard.RIGHT &&
                this.x < this.world.level.level_end_x
            ) {
                this.otherDirection = false;
                this.moveRight();
            }

            if (this.world.keyboard.LEFT && this.x > -300) {
                this.otherDirection = true;
                this.moveLeft();
            }

            if((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()){
                this.jump();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            if (this.isDead()){
                this.playAnimation(this.IMAGES_DEAD)
            }
            else if (this.isHurt()){
                this.playAnimation(this.IMAGES_HURT)
            }
            else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    //walk animation
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 90);
    }

    throwBottle(){
        const frame = this.getRealFrame();
        if (!this.canThrow) return;

        let bottle = new ThrowableObject(
            frame.x + frame.width - 125 / 2,
            frame.y + 25,
            this.otherDirection
        );

        this.world.throwableObjects.push(bottle);
        this.canThrow = false;
        setTimeout(() => {
            this.canThrow = true;
        }, 500);
    }
    
}
