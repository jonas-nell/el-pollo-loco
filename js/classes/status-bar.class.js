
import { DrawableObject } from "./drawable-object.class.js";


/**
 * Represents a visual status bar.
 *
 * Extends DrawableObject to display changing game values
 * such as health, boss health, bottles, or collected coins.
 *
 * The displayed image changes depending on the current
 * percentage value.
 *
 * 
 * @extends DrawableObject
 */
export class StatusBar extends DrawableObject {


    /**
     * Current status percentage.
     *
     * Determines which status bar image is displayed.
     *
     * @type {number}
     */
    percentage = 100;


    /**
     * Horizontal position.
     *
     * @type {number}
     */
    x = 25;


    /**
     * Vertical position.
     *
     * @type {number}
     */
    y = 0;


    /**
     * Status bar width.
     *
     * @type {number}
     */
    width = 230;


    /**
     * Status bar height.
     *
     * @type {number}
     */
    height = 65;


    /**
     * Controls whether the status bar is rendered.
     *
     * @type {boolean}
     */
    visible = true;


    /**
     * Available status bar image frames.
     *
     * Contains different visual states from empty to full.
     *
     * @type {string[]}
     */
    IMAGES;


    /**
     * Creates a new status bar.
     *
     * Loads all image states and initializes the bar
     * with a full percentage value.
     *
     * @param {string[]} images - Status bar image paths.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    constructor(images, x, y) {
        super();
        this.IMAGES = images;
        this.x = x;
        this.y = y;
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }


    /**
     * Updates the displayed status bar value.
     *
     * Selects the correct image based on the
     * provided percentage.
     *
     * @param {number} percentage - Current value between 0 and 100.
     *
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;

        const path =
            this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    /**
     * Determines the correct image index.
     *
     * Converts the current percentage value into
     * one of six available visual states.
     *
     * @returns {number} Index of the matching image.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}