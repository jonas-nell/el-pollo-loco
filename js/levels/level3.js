import { ChickenSmall } from "../classes/chicken-small.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { Level } from "../classes/level.class.js";
import { generateBackground } from "./level-generation/background-generator.js";
import { generateBottles } from "./level-generation/bottle-generator.js";
import { generateClouds } from "./level-generation/cloud-generator.js";
import { generateCoins } from "./level-generation/coin-generator.js";

const endboss = new Endboss();
const segmentCount = 6;
const SEGMENT_WIDTH = 719;

export const level3 = new Level(
    [
        //first segement
        new Chicken(400, SEGMENT_WIDTH), new ChickenSmall(400, SEGMENT_WIDTH),
        //second segment
        new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 2), new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 2), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 2), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 2),
        //third segment
        new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 3), new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 3), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 3), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 3),
        //fourth segment
        new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 4), new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 4), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 4), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 4),

        endboss
    ],
    generateClouds(segmentCount),
    generateBackground(segmentCount),
    endboss,
    generateBottles(segmentCount),
    generateCoins(segmentCount),
    (segmentCount * 719) - 719,
    0,
    80
);