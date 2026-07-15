import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MovableObject } from "./movable-object.class.js";
import { SoundHub } from "./sound-hub.class.js";


/**
 * Represents a normal chicken enemy.
 *
 * Extends MovableObject with autonomous movement,
 * walking animations, damage handling, and a death sequence.
 *
 * Chickens become active when the player enters their
 * detection range and then move toward the character.
 *
 * 
 * @extends MovableObject
 */
export class Chicken extends MovableObject {


    /**
     * Walking animation frames.
     *
     * @type {string[]}
     */
    IMAGES_WALKING = ImageHelper.CHICKEN.walk;


    /**
     * Death animation frames.
     *
     * @type {string[]}
     */
    IMAGES_DEAD = ImageHelper.CHICKEN.dead;


    /**
     * Collision box offset.
     *
     * Adjusts the collision area compared to the sprite.
     *
     * @type {Object}
     */
    offset = {
        top: 5,
        right: 3,
        bottom: 6,
        left: 2,
    };


    /**
     * Vertical spawn position.
     *
     * @type {number}
     */
    y = 360;


    /**
     * Sprite height.
     *
     * @type {number}
     */
    height = 70;


    /**
     * Sprite width.
     *
     * @type {number}
     */
    width = 80;


    /**
     * Chicken health points.
     *
     * @type {number}
     */
    health = 10;


    /**
     * Indicates whether the chicken is currently dying.
     *
     * @type {boolean}
     */
    isDying = false;


    /**
     * Timestamp when the death animation started.
     *
     * @type {number}
     */
    deathTimer = 0;


    /**
     * Distance at which the chicken becomes active.
     *
     * @type {number}
     */
    activationRange = 720;


    /**
     * Creates a new chicken enemy.
     *
     * Loads animation resources, generates a random spawn
     * position inside the provided range, assigns a random
     * movement speed, and starts update loops.
     *
     * @param {number} minX - Minimum possible spawn position.
     * @param {number} maxX - Maximum possible spawn position.
     */
    constructor(minX, maxX) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = minX + Math.random() * (maxX - minX);
        this.speed = 0.15 + Math.random() * 0.4;
        this.animate();
    }


    /**
     * Starts chicken behavior loops.
     *
     * Handles movement updates and walking animation.
     *
     * @returns {void}
     */
    animate() {
        IntervalHub.startInterval(this.moveTowardsCharacter, 1000 / 60);
        IntervalHub.startInterval(this.updateWalkingAnimation, 230);
    }


    /**
     * Moves the chicken toward the player.
     *
     * Movement only starts when:
     * - the chicken is alive
     * - a world reference exists
     * - the player is within activation range
     *
     * @returns {void}
     */
    moveTowardsCharacter = () => {
        if (!this.isDying && this.world && Math.abs(this.world.character.x - this.x) < this.activationRange) {
            this.moveLeft();
        }
    };


    /**
     * Updates the current chicken animation.
     *
     * Switches between walking and death animations
     * depending on the current enemy state.
     *
     * @returns {void}
     */
    updateWalkingAnimation = () => {
        if (this.isDying) {
            this.playDeathAnimation();
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    };


    /**
     * Plays the chicken death animation.
     *
     * After the animation duration has passed,
     * the chicken is marked as finished and can
     * be removed from the level.
     *
     * @returns {void}
     */
    playDeathAnimation() {
        this.playAnimationOnce(this.IMAGES_DEAD);
        const timePassed = new Date().getTime() - this.deathTimer;
        if (timePassed > 1000) {
            this.isFinished = true;
        }
    }


    /**
     * Applies damage to the chicken.
     *
     * Reduces health and triggers the death sequence
     * when health reaches zero.
     *
     * Overrides the parent hit() implementation.
     *
     * @returns {void}
     */
    hit() {
        this.health -= 10;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }


    /**
     * Starts the chicken death sequence.
     *
     * Prevents repeated death triggers,
     * adjusts the collision box,
     * resets animation progress,
     * and plays the death sound.
     *
     * @returns {void}
     */
    die() {
        if (this.isDying) return;
        this.isDying = true;

        /*
         * Adjust collision box because the
         * sprite changes position during death.
         */
        this.offset.top = 50;
        this.deathTimer = new Date().getTime();
        this.currentImageOnce = 0;
        SoundHub.playOne(SoundHub.CHICKEN.dead1);
    }
}