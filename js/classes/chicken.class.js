import { ImageHelper } from "./imgHelper.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Chicken extends MovableObject {
    IMAGES_WALKING = ImageHelper.CHICKEN.walk;
    IMAGES_DEAD = ImageHelper.CHICKEN.dead;
    y = 360;
    height = 70;
    width = 80;
    health = 10;
    isDying = false;
    deathTimer = 0;

    border = true;


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 200 + Math.random() * 500;
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
        this.deathTimer = new Date().getTime();
        this.currentImageOnce = 0;
    }
}
