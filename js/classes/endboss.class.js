import { ImageHelper } from "./imgHelper.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Endboss extends MovableObject {
    IMAGES_WALKING = ImageHelper.BOSS.walk;
    IMAGES_ALERT = ImageHelper.BOSS.alert;
    IMAGES_HURT = ImageHelper.BOSS.hurt;
    IMAGES_DEAD = ImageHelper.BOSS.dead;

    height = 400;
    width = 250;
    y = 60;
    health = 30;
    isDying = false;
    deathTimer = 0;

    border = true;


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if(this.isDying){
                this.playDeathAnimation();
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 130);
    }

    playDeathAnimation(){
        this.playAnimationOnce(this.IMAGES_DEAD);
        let timePassed = new Date().getTime() - this.deathTimer;
        if(timePassed > 2000){
            this.isFinished = true;
        }
    }

    hit(){
        this.health -= 10;
        console.log(this.health);

        if(this.health <= 0){
            this.health = 0;
            this.die();
        }
    }

    die(){
        if(this.isDying) return;
        this.isDying = true;
        this.deathTimer = new Date().getTime();
        this.currentImageOnce = 0;
    }
}
