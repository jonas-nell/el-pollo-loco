import { BackgroundObject } from "../classes/background-object.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { Cloud } from "../classes/cloud.class.js";
import { ImageHelper } from "../classes/imgHelper.class.js";
import { Level } from "../classes/level.class.js";

export const level1 = new Level(
    [new Chicken(), new Chicken(), new Chicken()],
    [new Cloud()],
    [
        new BackgroundObject(ImageHelper.BACKGROUND.heavenbg[0], -719),
        new BackgroundObject(ImageHelper.BACKGROUND.orangebg[1], -719),
        new BackgroundObject(ImageHelper.BACKGROUND.redbg[1], -719),
        new BackgroundObject(ImageHelper.BACKGROUND.cactusbg[1], -719),
        new BackgroundObject(ImageHelper.BACKGROUND.heavenbg[0], 0),
        new BackgroundObject(ImageHelper.BACKGROUND.orangebg[0], 0),
        new BackgroundObject(ImageHelper.BACKGROUND.redbg[0], 0),
        new BackgroundObject(ImageHelper.BACKGROUND.cactusbg[0], 0),
        new BackgroundObject(ImageHelper.BACKGROUND.heavenbg[0], 719),
        new BackgroundObject(ImageHelper.BACKGROUND.orangebg[1], 719),
        new BackgroundObject(ImageHelper.BACKGROUND.redbg[1], 719),
        new BackgroundObject(ImageHelper.BACKGROUND.cactusbg[1], 719),
        new BackgroundObject(ImageHelper.BACKGROUND.heavenbg[0], 719 * 2),
        new BackgroundObject(ImageHelper.BACKGROUND.orangebg[0], 719 * 2),
        new BackgroundObject(ImageHelper.BACKGROUND.redbg[0], 719 * 2),
        new BackgroundObject(ImageHelper.BACKGROUND.cactusbg[0], 719 * 2),
        new BackgroundObject(ImageHelper.BACKGROUND.heavenbg[0], 719 * 3),
        new BackgroundObject(ImageHelper.BACKGROUND.orangebg[1], 719 * 3),
        new BackgroundObject(ImageHelper.BACKGROUND.redbg[1], 719 * 3),
        new BackgroundObject(ImageHelper.BACKGROUND.cactusbg[1], 719 * 3),
    ],
);
