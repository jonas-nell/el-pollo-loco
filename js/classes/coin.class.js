
import { ImageHelper } from "./img-helper.class.js";
import { MovableObject } from "./movable-object.class.js";


/**
 * Represents a collectible coin.
 *
 * Extends MovableObject to use the shared collision system.
 * Coins remain static in the level and are collected when
 * the character touches them.
 *
 * 
 * @extends MovableObject
 */
export class Coin extends MovableObject {


    /**
     * Collision box offset.
     *
     * Reduces the collision area compared to the sprite size
     * to create a more accurate pickup area.
     *
     * @type {Object}
     */
    offset = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30,
    };


    /**
     * Coin sprite height.
     *
     * @type {number}
     */
    height = 90;


    /**
     * Coin sprite width.
     *
     * @type {number}
     */
    width = 90;


    /**
     * Creates a new coin.
     *
     * Loads the coin image and sets its position
     * inside the level.
     *
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    constructor(x, y) {
        super();

        this.loadImage(
            ImageHelper.COIN.coin,
        );

        this.x = x;
        this.y = y;
    }
}