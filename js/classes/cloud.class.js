import { ImageHelper } from "./imgHelper.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Cloud extends MovableObject{
    y = 20;
    height = 250;
    width = 500;

    constructor(){
        super().loadImage(ImageHelper.BACKGROUND.clouds[0]);
        this.x = Math.random() * 500;
        this.animate();        
    }

    animate(){
        IntervalHub.startInterval(() => this.x -= .15, 1000 / 60);
    }

}