import { generateBackground } from "./level-generation/background-generator.js";
import { generateBottles } from "./level-generation/bottle-generator.js";
import { BackgroundObject } from "../classes/background-object.class.js";
import { Bottle } from "../classes/bottle.class.js";
import { ChickenSmall } from "../classes/chicken-small.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { Cloud } from "../classes/cloud.class.js";
import { Coin } from "../classes/coin.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { ImageHelper } from "../classes/img-helper.class.js";
import { Level } from "../classes/level.class.js";
import { generateCoins } from "./level-generation/coin-generator.js";
import { generateClouds } from "./level-generation/cloud-generator.js";

const segmentCount = 5;
const SEGMENT_WIDTH = 719;

export function level1(){
    const endboss = new Endboss((segmentCount - 1) * SEGMENT_WIDTH + 50);

    return new Level(
        [
            //first segment
            new Chicken(400, SEGMENT_WIDTH), new Chicken(400, SEGMENT_WIDTH),
            //second segment
            new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 2), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 2), new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 2),
            //third segment
            new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 3), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 3), new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 3),
        
            endboss
        ],
        generateClouds(segmentCount),
        generateBackground(segmentCount),
        endboss,
        generateBottles(segmentCount),
        generateCoins(segmentCount),
        (segmentCount * 719) - 719,
        0,
        80,
        );
}
