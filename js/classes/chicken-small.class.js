import { Chicken } from "./chicken.class.js";
import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";

export class ChickenSmall extends Chicken{
    IMAGES_WALKING = ImageHelper.CHICKEN_SMALL.walk;
    IMAGES_DEAD = ImageHelper.CHICKEN_SMALL.dead;

    offset = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    }
    y = 360;
    groundLevel = 360;
    height = 60;
    width = 60;
    speed = 0.2 + Math.random() * 0.4;
    border = true;

    constructor(minX, maxX){
        super(minX, maxX);
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.startJumping();
        this.applyGravity();
    }

    startJumping(){
        const delay = 2000 + Math.random() * 2000;

        setTimeout(() => {
            if (!this.isDead()) {
                this.speedY = 20 + Math.random() * 9; 
                this.startJumping();
            }
        }, delay);
    }

}