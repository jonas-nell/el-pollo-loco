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
    bottles = 2;
    coins = 0;
    lastAction = new Date().getTime();
    isWalkingSound = false;
    isSnoring = false;
    lastThrow = 0;
    throwCooldown = 500;

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
                this.stopSnoringSound();
                this.startWalkingSound();
            }

            if (this.world.keyboard.LEFT && this.x > -300) {
                this.lastAction = new Date().getTime();
                this.otherDirection = true;
                this.moveLeft();
                this.stopSnoringSound();
                this.startWalkingSound();
            }

            if((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()){
                this.lastAction = new Date().getTime();
                this.jump();
                this.stopSnoringSound();
                SoundHub.playOne(SoundHub.CHARACTER.jump);
            }

            if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
                this.stopWalkingSound();
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
                this.startSnoringSound();
            }
            else {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 90);
    }

    throwBottle(){
        if (this.dead) return;

        const now = Date.now();

        if(this.bottles <= 0 || now - this.lastThrow < this.throwCooldown)
            return;

        this.lastThrow = now;

        const frame = this.getRealFrame();

        let bottle = new ThrowableObject(
            frame.x + frame.width - 125 / 2,
            frame.y + 25,
            this.otherDirection
        );

        this.world.throwableObjects.push(bottle);
        this.bottles--;
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

    startWalkingSound(){
        if (!this.isWalkingSound) {
            SoundHub.playLoop(SoundHub.CHARACTER.run);
            this.isWalkingSound = true;
        }
    }

    stopWalkingSound(){
        if (this.isWalkingSound) {
            SoundHub.stopLoop(SoundHub.CHARACTER.run);
            this.isWalkingSound = false;
        }
    }

    startSnoringSound(){
        if (!this.isSnoringSound) {
            SoundHub.playLoop(SoundHub.CHARACTER.snoring);
            this.isSnoringSound = true;
        }
    }

stopSnoringSound(){
        if (this.isSnoringSound) {
            SoundHub.stopLoop(SoundHub.CHARACTER.snoring);
            this.isSnoringSound = false;
        }
    }


}