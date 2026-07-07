import { DrawableObject } from "./drawable-object.class.js";
import { ImageHelper } from "./imgHelper.class.js";

export class StatusBar extends DrawableObject{
    IMAGES = ImageHelper.STATUSBAR.health;
    percentage = 100;
    x = 25;
    y = 0;
    width = 230;
    height = 65;


    constructor(){
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }

    setPercentage(percentage){
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex(){
        if (this.percentage == 100){
            return 5;
        } else if (this.percentage > 80){
            return 4;
        } else if (this.percentage > 60){
            return 3;
        } else if (this.percentage > 40){
            return 2;
        } else if (this.percentage > 20){
            return 1;
        } else {
            return 0;
        }
    }

}