
import { Chicken } from "./chicken.class.js";
import { ImageHelper } from "./img-helper.class.js";


/**
 * Represents a smaller chicken enemy variant.
 *
 * Extends Chicken and inherits its movement,
 * collision handling, damage system, and death behavior.
 *
 * The ChickenSmall class adds jumping behavior
 * to create a more dynamic enemy type.
 *
 * @class ChickenSmall
 * @extends Chicken
 */
export class ChickenSmall extends Chicken {


    /**
     * Walking animation frames.
     *
     * Overrides the parent Chicken animation set.
     *
     * @type {string[]}
     */
    IMAGES_WALKING = ImageHelper.CHICKEN_SMALL.walk;


    /**
     * Death animation frames.
     *
     * Overrides the parent Chicken death animation set.
     *
     * @type {string[]}
     */
    IMAGES_DEAD = ImageHelper.CHICKEN_SMALL.dead;


    /**
     * Collision box offset.
     *
     * Smaller collision area adapted to the smaller sprite.
     *
     * @type {Object}
     */
    offset = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
    };


    /**
     * Vertical spawn position.
     *
     * @type {number}
     */
    y = 360;


    /**
     * Ground level used for gravity calculations.
     *
     * @type {number}
     */
    groundLevel = 360;


    /**
     * Sprite height.
     *
     * @type {number}
     */
    height = 60;


    /**
     * Sprite width.
     *
     * @type {number}
     */
    width = 60;


    /**
     * Movement speed.
     *
     * A random value creates variation between enemies.
     *
     * @type {number}
     */
    speed = 0.2 + Math.random() * 0.4;


    /**
     * Creates a small chicken enemy.
     *
     * Uses the parent constructor for basic enemy setup
     * and adds jumping behavior.
     *
     * @param {number} minX - Minimum spawn position.
     * @param {number} maxX - Maximum spawn position.
     */
    constructor(minX, maxX) {
        super(minX, maxX);

        this.loadImage(
            this.IMAGES_WALKING[0],
        );

        this.loadImages(
            this.IMAGES_WALKING,
        );

        this.loadImages(
            this.IMAGES_DEAD,
        );

        this.startJumping();

        this.applyGravity();
    }


    /**
     * Starts the random jumping behavior.
     *
     * The chicken jumps after a random delay
     * and schedules its next jump afterwards.
     *
     * @returns {void}
     */
    startJumping() {
        const delay =
            2000 + Math.random() * 2000;


        setTimeout(() => {

            if (!this.isDead()) {
                this.speedY =
                    20 + Math.random() * 9;

                this.startJumping();
            }

        }, delay);
    }
}