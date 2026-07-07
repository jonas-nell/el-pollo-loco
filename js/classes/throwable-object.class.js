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
                this.playAnimation(this.IMAGES_SPLASH);
            } else {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 115);
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