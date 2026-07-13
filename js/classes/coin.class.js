import { ImageHelper } from "./img-helper.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Coin extends MovableObject{
    offset = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    }
    height = 90;
    width = 90;

    constructor(x, y){
        super();
        this.loadImage(ImageHelper.COIN.coin);
        this.x = x;
        this.y = y;
    }
}