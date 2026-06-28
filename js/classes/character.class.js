import { ImageHelper } from "./imgHelper.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Character extends MovableObject{

    constructor(){
        super().loadImage(ImageHelper.PEPE.idle[0]);
    }


    jump(){

    }
}