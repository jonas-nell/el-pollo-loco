import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MovableObject } from "./movable-object.class.js";
import { SoundHub } from "./sound-hub.class.js";

export class Chicken extends MovableObject {
    IMAGES_WALKING = ImageHelper.CHICKEN.walk;
    IMAGES_DEAD = ImageHelper.CHICKEN.dead;

        offset = {
        top: 5,
        right: 3,
        bottom: 6,
        left: 2
    }

    y = 360;
    height = 70;
    width = 80;
    health = 10;
    isDying = false;
    deathTimer = 0;


    constructor(minX, maxX) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = minX + Math.random() * (maxX - minX);
        this.speed = 0.15 + Math.random() * 0.4;
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if(!this.isDying){
                this.moveLeft();
            }
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            if(this.isDying){
                this.playDeathAnimation();
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 230);
    }

    playDeathAnimation(){
        this.playAnimationOnce(this.IMAGES_DEAD);
        let timePassed = new Date().getTime() - this.deathTimer;
        if(timePassed > 1000){            
            this.isFinished = true;
        }
    }

    hit(){
        this.health -= 10;

        if(this.health <= 0){
            this.health = 0;
            this.die();
        }
    }

    die(){
        if(this.isDying) return;

        this.isDying = true;
        this.offset.top = 50;
        this.deathTimer = new Date().getTime();
        this.currentImageOnce = 0;
        SoundHub.playOne(SoundHub.CHICKEN.dead1);
    }
}
