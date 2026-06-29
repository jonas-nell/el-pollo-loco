import { ImageHelper } from "./imgHelper.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Cloud extends MovableObject{
    y = 20;
    height = 250;
    width = 500;

    constructor(){
        super().loadImage(ImageHelper.CLOUD[0]);
        this.x = Math.random() * 500;
    }

}