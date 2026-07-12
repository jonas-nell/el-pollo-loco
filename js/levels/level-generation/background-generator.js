import { BackgroundObject } from "../../classes/background-object.class.js";
import { ImageHelper } from "../../classes/img-helper.class.js";

export function generateBackground(segmentCount){
    let background = [];
    const BACKGROUND_WIDTH = 719;

    for(let i = -1; i < segmentCount; i++){
        let x = i * BACKGROUND_WIDTH;
        background.push(
            new BackgroundObject(ImageHelper.BACKGROUND.heavenbg[0], x),
            new BackgroundObject(ImageHelper.BACKGROUND.orangebg[i % 2 === 0 ? 0 : 1], x),
            new BackgroundObject(ImageHelper.BACKGROUND.redbg[i % 2 === 0 ? 0 : 1], x),
            new BackgroundObject(ImageHelper.BACKGROUND.cactusbg[i % 2 === 0 ? 0 : 1], x)
        );
    }

    return background;
}