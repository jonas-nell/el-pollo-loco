import { ChickenSmall } from "../classes/chicken-small.class";
import { Chicken } from "../classes/chicken.class";
import { Level } from "../classes/level.class";
import { generateBackground } from "./level-generation/background-generator";
import { generateBottles } from "./level-generation/bottle-generator";
import { generateClouds } from "./level-generation/cloud-generator";
import { generateCoins } from "./level-generation/coin-generator";

const endboss = new Endboss();
const segmentCount = 6;
const SEGMENT_WIDTH = 719;

export const level1 = new Level(
    [
        //first segment
        new ChickenSmall(400, SEGMENT_WIDTH), new ChickenSmall(400, SEGMENT_WIDTH),
        //second segment
        new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 2), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 2), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 2), new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 2),
        //third segment
        new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 3), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 3), new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 3),
        //fourth segment
        new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 4), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 4), new Chicken(SEGMENT_WIDTH, SEGMENT_WIDTH * 4), new ChickenSmall(SEGMENT_WIDTH, SEGMENT_WIDTH * 4),

        endboss
    ],
    generateClouds(segmentCount),
    generateBackground(segmentCount),
    endboss,
    generateBottles(segmentCount),
    generateCoins(segmentCount),
    (segmentCount * 719) - 719
);