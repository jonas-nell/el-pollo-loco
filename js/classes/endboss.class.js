import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MovableObject } from "./movable-object.class.js";
import { SoundHub } from "./sound-hub.class.js";


/**
 * Represents the final boss enemy.
 *
 * Extends MovableObject with advanced enemy behavior,
 * including alerting, attacking movement, damage reactions,
 * and a custom death sequence.
 *
 * The Endboss uses different animation states depending
 * on the current gameplay situation.
 *
 * @class Endboss
 * @extends MovableObject
 */
export class Endboss extends MovableObject {


    /**
     * Walking animation frames.
     *
     * @type {string[]}
     */
    IMAGES_WALKING = ImageHelper.BOSS.walk;


    /**
     * Alert animation frames.
     *
     * Played when the boss notices the player.
     *
     * @type {string[]}
     */
    IMAGES_ALERT = ImageHelper.BOSS.alert;


    /**
     * Hurt animation frames.
     *
     * @type {string[]}
     */
    IMAGES_HURT = ImageHelper.BOSS.hurt;


    /**
     * Death animation frames.
     *
     * @type {string[]}
     */
    IMAGES_DEAD = ImageHelper.BOSS.dead;


    /**
     * Collision box offset.
     *
     * @type {Object}
     */
    offset = {
        top: 68,
        right: 20,
        bottom: 14,
        left: 20,
    };


    /**
     * Boss sprite height.
     *
     * @type {number}
     */
    height = 400;


    /**
     * Boss sprite width.
     *
     * @type {number}
     */
    width = 250;


    /**
     * Initial vertical position.
     *
     * @type {number}
     */
    y = 60;


    /**
     * Boss health points.
     *
     * @type {number}
     */
    health = 30;


    /**
     * Boss movement speed.
     *
     * @type {number}
     */
    speed = 4;


    /**
     * Indicates whether the death sequence is active.
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
     * Indicates whether the boss is currently hurt.
     *
     * @type {boolean}
     */
    isHurtState = false;


    /**
     * Timestamp when the current hurt state started.
     *
     * @type {number}
     */
    hurtTimer = 0;


    /**
     * Timer controlling hurt animation frame updates.
     *
     * @type {number}
     */
    hurtFrameTimer = 0;


    /**
     * Indicates whether the boss alert animation is playing.
     *
     * @type {boolean}
     */
    isAlerting = false;


    /**
     * Prevents the alert animation from triggering repeatedly.
     *
     * @type {boolean}
     */
    hasAlerted = false;


    /**
     * Determines whether the boss actively moves toward the player.
     *
     * @type {boolean}
     */
    isRunning = false;


    /**
     * Creates a new endboss instance.
     *
     * Loads all animation resources,
     * sets the spawn position,
     * and starts animation and movement updates.
     *
     * @param {number} x - Initial horizontal position.
     */
    constructor(x) {
        super();

        this.loadImage(
            this.IMAGES_WALKING[0],
        );

        this.loadImages(
            this.IMAGES_WALKING,
        );

        this.loadImages(
            this.IMAGES_HURT,
        );

        this.loadImages(
            this.IMAGES_DEAD,
        );

        this.loadImages(
            this.IMAGES_ALERT,
        );

        this.x = x;

        this.animate();
        this.move();
    }


    /**
     * Starts the boss animation update loop.
     *
     * Selects the correct animation depending on
     * the current boss state.
     *
     * Animation priority:
     * 1. Death
     * 2. Hurt
     * 3. Alert
     * 4. Walking
     *
     * @returns {void}
     */
    animate() {
        IntervalHub.startInterval(() => {

            if (this.isDying) {
                this.playDeathAnimation();

            } else if (this.isHurtState) {
                this.playHurtAnimation();

            } else if (this.isAlerting) {
                this.playAlertAnimation();

            } else {
                this.playAnimation(
                    this.IMAGES_WALKING,
                );
            }

        }, 130);
    }


    /**
     * Plays the boss death animation.
     *
     * After the animation has finished, the boss is marked
     * as completed and can be removed from the level.
     *
     * @returns {void}
     */
    playDeathAnimation() {
        this.playAnimationOnce(
            this.IMAGES_DEAD,
        );

        const timePassed =
            new Date().getTime() - this.deathTimer;

        if (timePassed > 2000) {
            this.isFinished = true;
        }
    }


    /**
     * Plays the boss hurt animation.
     *
     * Controls the timing of hurt animation frames
     * and resets the hurt state after a short duration.
     *
     * @returns {void}
     */
    playHurtAnimation() {
        const timePassed =
            new Date().getTime() - this.hurtFrameTimer;

        if (timePassed > 200) {
            this.playAnimationOnce(
                this.IMAGES_HURT,
            );

            this.hurtFrameTimer =
                new Date().getTime();
        }


        const hurtDuration =
            new Date().getTime() - this.hurtTimer;


        if (hurtDuration > 800) {
            this.isHurtState = false;
            this.currentImageOnce = 0;
        }
    }


    /**
     * Plays the boss alert animation.
     *
     * Triggered when the player enters the boss detection range.
     *
     * After completion, the boss returns to its normal state.
     *
     * @returns {void}
     */
    playAlertAnimation() {
        this.playAnimationOnce(
            this.IMAGES_ALERT,
        );

        if (
            this.currentImageOnce >=
            this.IMAGES_ALERT.length
        ) {
            this.isAlerting = false;
            this.currentImageOnce = 0;
        }
    }


    /**
     * Applies damage to the boss.
     *
     * Reduces health, triggers the hurt state,
     * and starts the death sequence if health reaches zero.
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

            return;
        }


        this.isHurtState = true;

        this.hurtTimer =
            new Date().getTime();

        this.hurtFrameTimer =
            new Date().getTime();

        this.currentImageOnce = 0;

        this.playAnimationOnce(
            this.IMAGES_HURT,
        );

        this.isRunning = true;
    }


    /**
     * Starts the boss death sequence.
     *
     * Stops movement, resets animation progress,
     * and plays the death sound.
     *
     * Overrides the parent die() implementation.
     *
     * @returns {void}
     */
    die() {
        if (this.isDying) return;

        this.isDying = true;

        this.deathTimer =
            new Date().getTime();

        this.currentImageOnce = 0;

        this.speed = 0;

        SoundHub.playOne(
            SoundHub.CHICKEN.dead2,
        );
    }


    /**
     * Activates the boss alert state.
     *
     * The alert animation is only played once.
     *
     * @returns {void}
     */
    alert() {
        if (this.hasAlerted) return;

        this.isAlerting = true;
        this.hasAlerted = true;

        this.currentImageOnce = 0;

        SoundHub.playOne(
            SoundHub.CHICKEN.bossApproach,
        );
    }


    /**
     * Controls boss movement.
     *
     * The boss starts moving toward the player
     * once the running state is activated.
     *
     * @returns {void}
     */
    move() {
        IntervalHub.startInterval(() => {

            if (this.isRunning) {
                this.moveLeft();
            }

        }, 1000 / 60);
    }
}