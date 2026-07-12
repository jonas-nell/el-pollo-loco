import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MovableObject } from "./movable-object.class.js";
import { Level } from "./level.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { SoundHub } from "./sound-hub.class.js";

export class Character extends MovableObject {
    IMAGES_WALKING = ImageHelper.PEPE.walk;
    IMAGES_JUMPING = ImageHelper.PEPE.jump;
    IMAGES_DEAD = ImageHelper.PEPE.dead;
    IMAGES_HURT = ImageHelper.PEPE.hurt;
    IMAGES_IDLE = ImageHelper.PEPE.idle;
    IMAGES_LONG_IDLE = ImageHelper.PEPE.longIdle;

    offset = {
        top: 120,
        right: 25,
        bottom: 15,
        left: 25
    }

    dead = false;
    height = 280;
    y = 0;
    speed = 6;
    world;
    canThrow = true;
    bottles = 2;
    coins = 0;
    lastAction = new Date().getTime();

    border = true;

    constructor() {
        super();
        this.loadImage(ImageHelper.PEPE.idle[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.animate();
        this.applyGravity();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (
                this.world.keyboard.RIGHT &&
                this.x < this.world.level.level_end_x
            ) {
                this.lastAction = new Date().getTime();
                this.otherDirection = false;
                this.moveRight();
            }

            if (this.world.keyboard.LEFT && this.x > -300) {
                this.lastAction = new Date().getTime();
                this.otherDirection = true;
                this.moveLeft();
            }

            if((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()){
                this.lastAction = new Date().getTime();
                this.jump();
                SoundHub.playOne(SoundHub.CHARACTER.jump);
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            if (this.dead){
                this.playAnimationOnce(this.IMAGES_DEAD, () => {
                    this.isFinished = true;
                });
            }
            else if (this.isHurt()){
                this.playAnimation(this.IMAGES_HURT);
            }
            else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            }
            else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            }
            else if (this.isIdleLong()){
                this.playAnimation(this.IMAGES_LONG_IDLE);
            }
            else {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 90);
    }

    throwBottle(){
        if (this.dead) return;
        if (!this.canThrow || this.bottles <= 0) return;
        this.lastAction = new Date().getTime();
        const frame = this.getRealFrame();
        
        let bottle = new ThrowableObject(
            frame.x + frame.width - 125 / 2,
            frame.y + 25,
            this.otherDirection
        );

        this.world.throwableObjects.push(bottle);
        this.bottles--;
        this.world.bottleBar.setPercentage(
            this.bottles / 5 * 100
        );

        this.canThrow = false;
        setTimeout(() => {
            this.canThrow = true;
        }, 500);
    }

    isIdleLong(){
        return new Date().getTime() - this.lastAction > 5000;
    }
    
    die(){
        if (this.dead) return;

        this.dead = true;
        this.speed = 0;
        this.speedY = 0;

        SoundHub.playOne(SoundHub.CHARACTER.dead);
    }

    playHitSound(){
        SoundHub.playOne(SoundHub.CHARACTER.damage);
    }

//     hit(){
//         SoundHub.playOne(SoundHub.CHARACTER.damage);
//         super.hit();
//     }

// }
}