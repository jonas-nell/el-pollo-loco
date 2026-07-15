
import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MovableObject } from "./movable-object.class.js";


/**
 * Represents a moving background cloud.
 *
 * Extends MovableObject to reuse movement functionality.
 * Clouds move continuously across the background to
 * create a parallax-like environment effect.
 *
 * 
 * @extends MovableObject
 */
export class Cloud extends MovableObject {


    /**
     * Vertical cloud position.
     *
     * @type {number}
     */
    y = 20;


    /**
     * Cloud sprite height.
     *
     * @type {number}
     */
    height = 250;


    /**
     * Cloud sprite width.
     *
     * @type {number}
     */
    width = 500;


    /**
     * Cloud movement speed.
     *
     * @type {number}
     */
    speed = 0.1;


    /**
     * Creates a new cloud object.
     *
     * Loads the cloud image, assigns a random starting
     * position, and starts the movement loop.
     */
    constructor() {
        super();
        this.loadImage(ImageHelper.BACKGROUND.clouds[0]);
        this.x = Math.random() * 500;
        this.animate();
    }


    /**
     * Starts the cloud movement loop.
     *
     * Moves the cloud slowly to the left
     * to create background motion.
     *
     * @returns {void}
     */
    animate() {
        IntervalHub.startInterval(() => this.moveLeft(), 1000 / 60);
    }
}