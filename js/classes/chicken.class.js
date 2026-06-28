import { ImageHelper } from "./imgHelper.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Chicken extends MovableObject{

    constructor(){
        super().loadImage(ImageHelper.CHICKEN.walk[0]);
    }

}