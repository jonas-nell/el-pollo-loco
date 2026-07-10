import { generateBackground } from "./level-generation/background-generator.js";
import { generateBottles } from "./level-generation/bottle-generator.js";
import { BackgroundObject } from "../classes/background-object.class.js";
import { Bottle } from "../classes/bottle.class.js";
import { ChickenSmall } from "../classes/chicken-small.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { Cloud } from "../classes/cloud.class.js";
import { Coin } from "../classes/coin.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { ImageHelper } from "../classes/imgHelper.class.js";
import { Level } from "../classes/level.class.js";
import { generateCoins } from "./level-generation/coin-generator.js";
import { generateClouds } from "./level-generation/cloud-generator.js";

const endboss = new Endboss();
const segmentCount = 5;

export const level1 = new Level(
    [new Chicken(), new Chicken(), new Chicken(), new ChickenSmall(), endboss],
    generateClouds(segmentCount),
    generateBackground(segmentCount),
    endboss,
    generateBottles(segmentCount),
    generateCoins(segmentCount),
    (segmentCount * 719) - 719
);
