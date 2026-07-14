import { ImageHelper } from "./img-helper.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Bottle extends MovableObject {
    offset = {
        top: 15,
        right: 27,
        bottom: 14,
        left: 27,
    };

    width = 90;
    height = 80;

    constructor(x, y) {
        super();
        this.loadImage(ImageHelper.BOTTLE.onGround);
        this.x = x;
        this.y = y;
    }
}
