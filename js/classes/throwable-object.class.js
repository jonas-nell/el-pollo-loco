import { ImageHelper } from "./imgHelper.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { MovableObject } from "./movableObject.class.js";

export class ThrowableObject extends MovableObject{
    speedY = 30;
    height = 75;
    width = 60;
    groundLevel = 360;
    border = true;

    constructor(x, y){
        super();
        this.loadImage(ImageHelper.BOTTLE.rotation[0]);
        this.x = x;
        this.y = y;
        this.throw();        
    }
    
    
    throw(){
        this.applyGravity();
        IntervalHub.startInterval(this.bottleHorizontal, 25);
    }

    bottleHorizontal = () => {
        this.x += 10;
    }
}