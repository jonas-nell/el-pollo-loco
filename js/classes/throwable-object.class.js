import { ImageHelper } from "./imgHelper.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { MovableObject } from "./movableObject.class.js";

export class ThrowableObject extends MovableObject{
    IMAGES_ROTATION = ImageHelper.BOTTLE.rotation;
    IMAGES_SPLASH = ImageHelper.BOTTLE.splash;

    speedY = 30;
    height = 75;
    width = 60;
    groundLevel = 360;
    isBroken = false;
    rotationImage = 0;
    splashImage = 0;


    border = true;

    constructor(x, y){
        super();
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
        if(this.splashImage < this.IMAGES_SPLASH.length){
            let path = this.IMAGES_SPLASH[this.splashImage];
            this.img = this.imageCache[path];
            this.splashImage++;
        } else {
            this.isFinished = true;
        }
    }
    
    throw(){
        this.applyGravity();
        IntervalHub.startInterval(this.bottleHorizontal, 25);
    }

    bottleHorizontal = () => {
        if(!this.isBroken){
            this.x += 8;
        }
    }

    break(){
        if(this.isBroken) return;

        this.isBroken = true;
        this.speedY = 0;
    }
}