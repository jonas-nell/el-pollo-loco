import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Cloud extends MovableObject{
    y = 20;
    height = 250;
    width = 500;
    speed = 0.1;


    constructor(){
        super().loadImage(ImageHelper.BACKGROUND.clouds[0]);
        this.x = Math.random() * 500;
        this.animate();        
    }

    animate(){
        IntervalHub.startInterval(() => (this.moveLeft()), 1000 / 60);
    }
}