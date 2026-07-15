import { ImageHelper } from "./img-helper.class.js";
import { MovableObject } from "./movable-object.class.js";


/**
 * Represents a collectible bottle item.
 *
 * Extends MovableObject to use the shared collision system.
 * Bottles are placed in the level and increase the player's
 * available ammunition when collected.
 *
 * This class represents bottles before they are thrown.
 * The projectile behavior is handled by ThrowableObject.
 *
 * @class Bottle
 * @extends MovableObject
 */
export class Bottle extends MovableObject {


    /**
     * Collision box offset.
     *
     * Creates a smaller pickup area than the sprite dimensions.
     *
     * @type {Object}
     */
    offset = {
        top: 15,
        right: 27,
        bottom: 14,
        left: 27,
    };


    /**
     * Bottle sprite width.
     *
     * @type {number}
     */
    width = 90;


    /**
     * Bottle sprite height.
     *
     * @type {number}
     */
    height = 80;


    /**
     * Creates a collectible bottle.
     *
     * Loads the bottle image and sets its position
     * inside the level.
     *
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    constructor(x, y) {
        super();

        this.loadImage(
            ImageHelper.BOTTLE.onGround,
        );

        this.x = x;
        this.y = y;
    }
}