
import { BackgroundObject } from "../../classes/background-object.class.js";
import { ImageHelper } from "../../classes/img-helper.class.js";


/**
 * Generates all background objects for a level.
 *
 * Creates repeating background segments consisting of
 * multiple layers:
 * - sky
 * - orange background
 * - red background
 * - cactus background
 *
 * The generated objects are returned as an array and later
 * assigned to the current Level instance.
 *
 * @param {number} segmentCount - Number of horizontal background segments.
 *
 * @returns {BackgroundObject[]} Generated background objects.
 */
export function generateBackground(segmentCount) {

    const background = [];

    /**
     * Width of one background segment.
     *
     * @constant
     * @type {number}
     */
    const BACKGROUND_WIDTH = 719;


    /*
     * Starts at -1 to create an additional segment before
     * the player spawn position and prevent empty areas
     * during camera movement.
     */
    for (let i = -1; i < segmentCount; i++) {

        const x =
            i * BACKGROUND_WIDTH;


        background.push(

            /*
             * Sky layer
             */
            new BackgroundObject(
                ImageHelper.BACKGROUND.heavenbg[0],
                x,
            ),


            /*
             * Orange background layer
             */
            new BackgroundObject(
                ImageHelper.BACKGROUND.orangebg[
                    i % 2 === 0 ? 0 : 1
                ],
                x,
            ),


            /*
             * Red background layer
             */
            new BackgroundObject(
                ImageHelper.BACKGROUND.redbg[
                    i % 2 === 0 ? 0 : 1
                ],
                x,
            ),


            /*
             * Cactus background layer
             */
            new BackgroundObject(
                ImageHelper.BACKGROUND.cactusbg[
                    i % 2 === 0 ? 0 : 1
                ],
                x,
            ),
        );
    }


    return background;
}