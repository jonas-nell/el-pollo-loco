
import { Cloud } from "../../classes/cloud.class.js";


/**
 * Generates cloud objects for a level.
 *
 * Creates one cloud per level segment and places each
 * cloud at a different horizontal position.
 *
 * The generated clouds are later added to the Level instance
 * and rendered as background elements.
 *
 * @param {number} segmentCount - Number of level segments.
 *
 * @returns {Cloud[]} Generated cloud objects.
 */
export function generateClouds(segmentCount) {
    const clouds = [];

    /**
     * Creates and positions clouds based on
     * the level segment index.
     */
    for (let i = 0; i < segmentCount; i++) {
        const cloud = new Cloud();
        cloud.x += i * 719;
        clouds.push(cloud);
    }
    return clouds;
}