import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MovableObject } from "./movable-object.class.js";
import { SoundHub } from "./sound-hub.class.js";

export class Endboss extends MovableObject {
    IMAGES_WALKING = ImageHelper.BOSS.walk;
    IMAGES_ALERT = ImageHelper.BOSS.alert;
    IMAGES_HURT = ImageHelper.BOSS.hurt;
    IMAGES_DEAD = ImageHelper.BOSS.dead;

    offset = {
        top: 68,
        right: 20,
        bottom: 14,
        left: 20,
    };

    height = 400;
    width = 250;
    y = 60;
    health = 30;
    speed = 4;
    isDying = false;
    deathTimer = 0;
    isHurtState = false;
    hurtTimer = 0;
    hurtFrameTimer = 0;
    isAlerting = false;
    hasAlerted = false;
    isRunning = false;

    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ALERT);
        this.x = x;
        this.animate();
        this.move();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (this.isDying) {
                this.playDeathAnimation();
            } else if (this.isHurtState) {
                this.playHurtAnimation();
            } else if (this.isAlerting) {
                this.playAlertAnimation();
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 130);
    }

    playDeathAnimation() {
        this.playAnimationOnce(this.IMAGES_DEAD);
        let timePassed = new Date().getTime() - this.deathTimer;
        if (timePassed > 2000) {
            this.isFinished = true;
        }
    }

    playHurtAnimation() {
        let timePassed = new Date().getTime() - this.hurtFrameTimer;
        if (timePassed > 200) {
            this.playAnimationOnce(this.IMAGES_HURT);
            this.hurtFrameTimer = new Date().getTime();
        }
        let hurtDuration = new Date().getTime() - this.hurtTimer;

        if (hurtDuration > 800) {
            this.isHurtState = false;
            this.currentImageOnce = 0;
        }
    }

    playAlertAnimation() {
        this.playAnimationOnce(this.IMAGES_ALERT);
        if (this.currentImageOnce >= this.IMAGES_ALERT.length) {
            this.isAlerting = false;
            this.currentImageOnce = 0;
        }
    }

    hit() {
        this.health -= 10;

        if (this.health <= 0) {
            this.health = 0;
            this.die();
            return;
        }
        this.isHurtState = true;
        this.hurtTimer = new Date().getTime();
        this.hurtFrameTimer = new Date().getTime();
        this.currentImageOnce = 0;
        this.playAnimationOnce(this.IMAGES_HURT);
        this.isRunning = true;
    }

    die() {
        if (this.isDying) return;
        this.isDying = true;
        this.deathTimer = new Date().getTime();
        this.currentImageOnce = 0;
        this.speed = 0;
        SoundHub.playOne(SoundHub.CHICKEN.dead2);
    }

    alert() {
        if (this.hasAlerted) return;
        this.isAlerting = true;
        this.hasAlerted = true;
        this.currentImageOnce = 0;
        SoundHub.playOne(SoundHub.CHICKEN.bossApproach);
    }

    move() {
        IntervalHub.startInterval(() => {
            if (this.isRunning) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }
}
