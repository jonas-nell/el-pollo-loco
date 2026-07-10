import { ImageHelper } from "./imgHelper.class.js";
import { MovableObject } from "./movableObject.class.js";

export class Coin extends MovableObject{
    offset = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    }
    height = 90;
    width = 90;

    border = true;


    constructor(x, y){
        super();
        this.loadImage(ImageHelper.COIN.coin);
        this.x = x;
        this.y = y;
    }
}