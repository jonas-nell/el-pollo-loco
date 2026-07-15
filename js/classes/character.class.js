import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MovableObject } from "./movable-object.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { SoundHub } from "./sound-hub.class.js";


/**
 * Represents the player character.
 *
 * Extends MovableObject with player controls, animations,
 * jumping, throwing bottles, sound effects, and character states.
 *
 * The Character class is responsible for handling all
 * player-related gameplay behavior.
 *
 * 
 * @extends MovableObject
 */
export class Character extends MovableObject {

    /**
     * Walking animation frames.
     *
     * @type {string[]}
     */
    IMAGES_WALKING = ImageHelper.PEPE.walk;


    /**
     * Jumping animation frames.
     *
     * @type {string[]}
     */
    IMAGES_JUMPING = ImageHelper.PEPE.jump;


    /**
     * Death animation frames.
     *
     * @type {string[]}
     */
    IMAGES_DEAD = ImageHelper.PEPE.dead;


    /**
     * Hurt animation frames.
     *
     * @type {string[]}
     */
    IMAGES_HURT = ImageHelper.PEPE.hurt;


    /**
     * Default idle animation frames.
     *
     * @type {string[]}
     */
    IMAGES_IDLE = ImageHelper.PEPE.idle;


    /**
     * Long idle animation frames.
     *
     * Played after the player has been inactive for a while.
     *
     * @type {string[]}
     */
    IMAGES_LONG_IDLE = ImageHelper.PEPE.longIdle;


    /**
     * Collision box offset.
     *
     * Reduces the collision area compared to the visible sprite.
     *
     * @type {Object}
     */
    offset = {
        top: 120,
        right: 25,
        bottom: 15,
        left: 25,
    };


    /**
     * Indicates whether the character is dead.
     *
     * @type {boolean}
     */
    dead = false;


    /**
     * Character sprite height.
     *
     * @type {number}
     */
    height = 280;


    /**
     * Initial vertical position.
     *
     * @type {number}
     */
    y = 0;


    /**
     * Character movement speed.
     *
     * @type {number}
     */
    speed = 6;


    /**
     * Reference to the current game world.
     *
     * Provides access to keyboard input,
     * level data, and throwable objects.
     *
     * @type {World}
     */
    world;


    /**
     * Available bottle ammunition.
     *
     * @type {number}
     */
    bottles = 2;


    /**
     * Amount of collected coins.
     *
     * @type {number}
     */
    coins = 0;


    /**
     * Timestamp of the player's last action.
     *
     * Used for detecting long idle states.
     *
     * @type {number}
     */
    lastAction = new Date().getTime();


    /**
     * Indicates whether the walking sound is active.
     *
     * @type {boolean}
     */
    isWalkingSound = false;


    /**
     * Indicates whether the snoring sound is active.
     *
     * @type {boolean}
     */
    isSnoring = false;


    /**
     * Timestamp of the last thrown bottle.
     *
     * @type {number}
     */
    lastThrow = 0;


    /**
     * Minimum delay between bottle throws in milliseconds.
     *
     * Prevents continuous bottle throwing.
     *
     * @type {number}
     */
    throwCooldown = 500;


    /**
     * Creates a new player character.
     *
     * Loads all animation images, starts animation updates,
     * and activates gravity.
     */
    constructor() {
        super();
        this.loadImage(ImageHelper.PEPE.idle[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.animate();
        this.applyGravity();
    }


    /**
     * Starts the character update intervals.
     *
     * Handles movement input and animation updates.
     *
     * @returns {void}
     */
    animate() {
        IntervalHub.startInterval(
            this.handleMovementInput,
            1000 / 60);

        IntervalHub.startInterval(
            this.updateAnimationState,
            90);
    }


    /**
     * Handles player movement input.
     *
     * Updates horizontal movement, jumping,
     * walking sounds, and camera position.
     *
     * @returns {void}
     */
    handleMovementInput = () => {
        this.handleHorizontalMovement();
        this.handleJumpInput();

        if (!this.world.keyboard.RIGHT &&
            !this.world.keyboard.LEFT) {
            this.stopWalkingSound();
        }

        this.world.camera_x = -this.x + 100;
    };


    /**
     * Handles left and right movement input.
     *
     * @returns {void}
     */
    handleHorizontalMovement() {
        if (
            this.world.keyboard.RIGHT &&
            this.x < this.world.level.level_end_x
        ) {
            this.lastAction = new Date().getTime();
            this.otherDirection = false;

            this.moveRight();

            this.stopSnoringSound();
            this.startWalkingSound();
        }


        if (
            this.world.keyboard.LEFT &&
            this.x > -300
        ) {
            this.lastAction = new Date().getTime();
            this.otherDirection = true;

            this.moveLeft();

            this.stopSnoringSound();
            this.startWalkingSound();
        }
    }


    /**
     * Handles jump input from keyboard controls.
     *
     * Allows jumping only while standing on the ground.
     *
     * @returns {void}
     */
    handleJumpInput() {
        if (
            (this.world.keyboard.UP ||
            this.world.keyboard.SPACE) &&
            !this.isAboveGround()
        ) {
            this.lastAction = new Date().getTime();
            this.jump();
            this.stopSnoringSound();
            SoundHub.playOne(SoundHub.CHARACTER.jump);
        }
    }


    /**
     * Updates the current character animation based on its state.
     *
     * Animation priority:
     * 1. Death animation
     * 2. Hurt animation
     * 3. Jump animation
     * 4. Walking animation
     * 5. Long idle animation
     * 6. Normal idle animation
     *
     * @returns {void}
     */
    updateAnimationState = () => {
        if (this.dead) {
            this.playAnimationOnce(this.IMAGES_DEAD, () => {
                    this.isFinished = true;
                },
            );

        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);

        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);

        } else if (
            this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);

        } else if (this.isIdleLong()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            this.startSnoringSound();

        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    };


    /**
     * Throws a bottle projectile.
     *
     * Creates a new ThrowableObject if the player has ammunition
     * available and the cooldown has expired.
     *
     * @returns {void}
     */
    throwBottle() {
        if (this.dead) return;
        const now = Date.now();
        if (this.bottles <= 0 || now - this.lastThrow < this.throwCooldown) {
            return;
        }
        this.lastThrow = now;
        const frame = this.getRealFrame();
        const bottle = new ThrowableObject(
            frame.x + frame.width - 125 / 2,
            frame.y + 25,
            this.otherDirection,
        );
        this.world.throwableObjects.push(bottle);
        this.bottles--;
    }


    /**
     * Checks whether the character has been inactive
     * long enough to trigger the long idle animation.
     *
     * @returns {boolean}
     */
    isIdleLong() {
        return (new Date().getTime() - this.lastAction > 5000);
    }


    /**
     * Kills the character.
     *
     * Stops movement, resets vertical velocity,
     * and triggers the death sound.
     *
     * The death animation is handled separately
     * by updateAnimationState().
     *
     * @returns {void}
     */
    die() {
        if (this.dead) return;
        this.dead = true;
        this.speed = 0;
        this.speedY = 0;
        SoundHub.playOne(SoundHub.CHARACTER.dead);
    }


    /**
     * Plays the damage sound when the character is hit.
     *
     * Overrides the parent class implementation.
     *
     * @returns {void}
     */
    playHitSound() {
        SoundHub.playOne(SoundHub.CHARACTER.damage);
    }


    /**
     * Starts the walking sound effect.
     *
     * Prevents multiple walking sounds from playing
     * simultaneously.
     *
     * @returns {void}
     */
    startWalkingSound() {
        if (!this.isWalkingSound) {
            SoundHub.playLoop(SoundHub.CHARACTER.run);
            this.isWalkingSound = true;
        }
    }


    /**
     * Stops the walking sound effect.
     *
     * @returns {void}
     */
    stopWalkingSound() {
        if (this.isWalkingSound) {
            SoundHub.stopLoop(SoundHub.CHARACTER.run);
            this.isWalkingSound = false;
        }
    }


    /**
     * Starts the snoring sound effect.
     *
     * Used during the long idle animation.
     *
     * @returns {void}
     */
    startSnoringSound() {
        if (!this.isSnoring) {
            SoundHub.playLoop(SoundHub.CHARACTER.snoring);
            this.isSnoring = true;
        }
    }


    /**
     * Stops the snoring sound effect.
     *
     * @returns {void}
     */
    stopSnoringSound() {
        if (this.isSnoring) {
            SoundHub.stopLoop(SoundHub.CHARACTER.snoring);
            this.isSnoring = false;
        }
    }
}