
import { MovableObject } from "./movable-object.class.js";


/**
 * Represents a background image segment.
 *
 * Extends MovableObject to use the shared drawing structure.
 * Background objects are placed next to each other to create
 * the scrolling game world.
 *
 * 
 * @extends MovableObject
 */
export class BackgroundObject extends MovableObject {


    /**
     * Background segment width.
     *
     * Matches the canvas width to create seamless
     * horizontal level sections.
     *
     * @type {number}
     */
    width = 720;


    /**
     * Background segment height.
     *
     * Matches the game canvas height.
     *
     * @type {number}
     */
    height = 480;


    /**
     * Creates a background segment.
     *
     * Loads the background image and positions it
     * at the bottom edge of the game world.
     *
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position of the segment.
     */
    constructor(imagePath, x) {
        super();

        this.loadImage(
            imagePath,
        );

        this.x = x;

        this.y =
            480 - this.height;
    }
}