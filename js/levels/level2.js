import { ChickenSmall } from "../classes/chicken-small.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { Level } from "../classes/level.class.js";
import { generateBackground } from "./level-generation/background-generator.js";
import { generateBottles } from "./level-generation/bottle-generator.js";
import { generateClouds } from "./level-generation/cloud-generator.js";
import { generateCoins } from "./level-generation/coin-generator.js";


/**
 * Number of background segments in this level.
 *
 * @constant
 * @type {number}
 */
const segmentCount = 6;


/**
 * Width of one level segment.
 *
 * @constant
 * @type {number}
 */
const SEGMENT_WIDTH = 719;


/**
 * Creates the second game level.
 *
 * Builds a complete level configuration containing:
 * - enemies
 * - endboss
 * - background objects
 * - clouds
 * - bottles
 * - coins
 * - player spawn position
 *
 * Level 2 contains a higher number of enemies and
 * introduces a greater amount of small chickens.
 *
 * @returns {Level} Configured level instance.
 */
export function level2() {

    /**
     * Creates the endboss at the end of the level.
     *
     * @type {Endboss}
     */
    const endboss =
        new Endboss(
            (segmentCount - 1) * SEGMENT_WIDTH + 50,
        );


    return new Level(

        /*
         * Enemies and endboss
         */
        [
            // first segment
            new ChickenSmall(
                400,
                SEGMENT_WIDTH,
            ),

            new ChickenSmall(
                400,
                SEGMENT_WIDTH,
            ),


            // second segment
            new ChickenSmall(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 2,
            ),

            new ChickenSmall(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 2,
            ),

            new ChickenSmall(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 2,
            ),

            new Chicken(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 2,
            ),


            // third segment
            new ChickenSmall(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 3,
            ),

            new ChickenSmall(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 3,
            ),

            new Chicken(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 3,
            ),


            // fourth segment
            new ChickenSmall(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 4,
            ),

            new ChickenSmall(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 4,
            ),

            new Chicken(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 4,
            ),

            new ChickenSmall(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 4,
            ),


            // fifth segment
            new Chicken(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 5,
            ),

            new ChickenSmall(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 5,
            ),

            new Chicken(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 5,
            ),

            new ChickenSmall(
                SEGMENT_WIDTH,
                SEGMENT_WIDTH * 5,
            ),


            endboss,
        ],


        /*
         * Environment
         */
        generateClouds(segmentCount),

        generateBackground(segmentCount),


        /*
         * Boss reference
         */
        endboss,


        /*
         * Collectibles
         */
        generateBottles(segmentCount),

        generateCoins(segmentCount),


        /*
         * Level boundary and player spawn
         */
        segmentCount * SEGMENT_WIDTH - SEGMENT_WIDTH,

        0,

        80,
    );
}