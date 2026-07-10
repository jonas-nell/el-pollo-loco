import { generateBackground } from "../background-generator.js";
import { generateBottles } from "../bottle-generator.js";
import { BackgroundObject } from "../classes/background-object.class.js";
import { Bottle } from "../classes/bottle.class.js";
import { ChickenSmall } from "../classes/chicken-small.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { Cloud } from "../classes/cloud.class.js";
import { Coin } from "../classes/coin.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { ImageHelper } from "../classes/imgHelper.class.js";
import { Level } from "../classes/level.class.js";

const endboss = new Endboss();
const segmentCount = 5;

export const level1 = new Level(
    [new Chicken(), new Chicken(), new Chicken(), new ChickenSmall(), endboss],
    [new Cloud()],
    generateBackground(segmentCount),
    endboss,
    generateBottles(segmentCount),
    [new Coin(360, 150), new Coin(400, 150)],
    (segmentCount * 719) - 719
);
