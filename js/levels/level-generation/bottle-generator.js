
import { Bottle } from "../../classes/bottle.class.js";


/**
 * Generates collectible bottles for a level.
 *
 * Creates two bottle pickups per level segment and places
 * them at predefined positions inside each segment.
 *
 * The generated bottles are stored in the Level instance
 * and can later be collected by the player.
 *
 * @param {number} segmentCount - Number of level segments.
 *
 * @returns {Bottle[]} Generated bottle objects.
 */
export function generateBottles(segmentCount) {
    const bottles = [];

    /**
     * Width of one level segment.
     *
     * @constant
     * @type {number}
     */
    const SEGMENT_WIDTH = 719;


    for (let i = 0; i < segmentCount - 1; i++) {
        const segmentStart = i * SEGMENT_WIDTH;

        /*
         * Creates two bottle pickups per segment.
         */
        bottles.push(
            new Bottle(segmentStart + 250, 360),
            new Bottle(segmentStart + 650, 360),
        );
    }
return bottles;
}