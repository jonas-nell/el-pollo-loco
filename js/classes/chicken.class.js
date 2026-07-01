import { ImageHelper } from "./imgHelper.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Chicken extends MovableObject{
    y = 360;
    height = 70;
    width = 80;

    constructor(){
        super().loadImage(ImageHelper.CHICKEN.walk[0]);

        this.x = 200 + Math.random() * 500;
    }

}
