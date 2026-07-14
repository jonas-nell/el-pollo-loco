import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MovableObject } from "./movable-object.class.js";
import { SoundHub } from "./sound-hub.class.js";

export class ThrowableObject extends MovableObject{
    IMAGES_ROTATION = ImageHelper.BOTTLE.rotation;
    IMAGES_SPLASH = ImageHelper.BOTTLE.splash;

        offset = {
        top: 10,
        right: 5,
        bottom: 10,
        left: 5
    }

    speedY = 30;
    height = 75;
    width = 60;
    groundLevel = 360;
    isBroken = false;
    rotationImage = 0;


    border = true;

    constructor(x, y, otherDirection){
        super();
        this.otherDirection = otherDirection;
        this.loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.throw();
        this.animate();
    }

    animate(){
        IntervalHub.startInterval(() => {
            if(this.isBroken){
                this.playSplashAnimation();
            } else {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 115);
    }

    playSplashAnimation(){
        this.playAnimationOnce(this.IMAGES_SPLASH);
        if(this.currentImageOnce >= this.IMAGES_SPLASH.length){
            this.isFinished = true;
        }
    }
    
    throw(){
        this.applyGravity();
        IntervalHub.startInterval(this.bottleHorizontal, 25);
    }

    bottleHorizontal = () => {
        if(!this.isBroken){
            if(this.otherDirection){
                this.x -= 8;
            } else {
                this.x += 8;
            }
        }
    }

    break(){
        if(this.isBroken) return;

        SoundHub.playOne(SoundHub.COLLECTIBLES.bottleBreak);
        this.isBroken = true;
        this.speedY = 0;
        this.currentImageOnce = 0;
    }
}