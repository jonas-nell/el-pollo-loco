import { DrawableObject } from "./drawable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

/**
 * Base class for all movable game objects.
 *
 * Extends DrawableObject with movement, gravity, collision detection,
 * animations, health handling, and damage states.
 *
 * 
 */
export class MovableObject extends DrawableObject {
    /**
     * Defines the invisible collision frame offset from the visible object.
     *
     * Allows collision detection to ignore transparent areas of sprites.
     *
     * @type {Object}
     */
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };

    /**
     * Movement speed of the object.
     *
     * @type {number}
     */
    speed = 0.15;

    /**
     * Determines whether the object is facing the opposite direction.
     *
     * @type {boolean}
     */
    otherDirection = false;

    /**
     * Vertical movement speed used for jumping and gravity.
     *
     * @type {number}
     */
    speedY = 0;

    /**
     * Gravity acceleration applied while the object is in the air.
     *
     * @type {number}
     */
    acceleration = 2.5;

    /**
     * Default y-position where the object touches the ground.
     *
     * @type {number}
     */
    groundLevel = 155;

    /**
     * Current health points of the object.
     *
     * @type {number}
     */
    health = 100;

    /**
     * Timestamp of the last received hit.
     *
     * Used to calculate the hurt animation duration.
     *
     * @type {number}
     */
    lastHit = 0;

    /**
     * Indicates whether an object animation or action has finished.
     *
     * @type {boolean}
     */
    isFinished = false;


    /**
     * Calculates the actual collision frame of the object.
     *
     * The collision frame can be smaller than the visible sprite
     * by using the defined offsets.
     *
     * @returns {{
     * x: number,
     * y: number,
     * width: number,
     * height: number
     * }}
     */
    getRealFrame() {
        return {
            x: this.x + this.offset.left,
            y: this.y + this.offset.top,
            width: this.width - this.offset.left - this.offset.right,
            height: this.height - this.offset.top - this.offset.bottom,
        };
    }


    /**
     * Plays a looping animation sequence.
     *
     * The animation automatically restarts after reaching the last image.
     *
     * @param {string[]} images - Array containing image paths of the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }


    /**
     * Plays an animation sequence once.
     *
     * Executes an optional callback after the final frame has been displayed.
     *
     * @param {string[]} images - Array containing image paths of the animation.
     * @param {Function|null} onFinished - Callback executed after animation completion.
     */
    playAnimationOnce(images, onFinished = null) {
        let i = this.currentImageOnce;
        if (i < images.length) {
            this.img = this.imageCache[images[i]];
            this.currentImageOnce++;

            if (this.currentImageOnce === images.length && onFinished) {
                onFinished();
            }
        }
    }


    /**
     * Moves the object to the right.
     */
    moveRight() {
        if (this.isDead()) return;
        this.x += this.speed;
    }


    /**
     * Moves the object to the left.
     */
    moveLeft() {
        if (this.isDead()) return;
        this.x -= this.speed;
    }


    /**
     * Applies gravity to the object.
     *
     * Updates vertical movement at a fixed interval until the object
     * reaches the ground level.
     */
    applyGravity() {
        IntervalHub.startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;

                if (this.y > this.groundLevel) {
                    this.y = this.groundLevel;
                    this.speedY = 0;
                }
            }
        }, 1000 / 25);
    }


    /**
     * Checks whether the object is currently above the ground.
     *
     * @returns {boolean}
     */
    isAboveGround() {
        return this.y < this.groundLevel;
    }


    /**
     * Makes the object jump.
     */
    jump() {
        if (this.isDead()) return;
        this.speedY = 30;
    }


    /**
     * Checks if this object is colliding with another movable object.
     *
     * @param {MovableObject} mo - Object to check collision against.
     * @returns {boolean} Whether both collision frames overlap.
     */
    isColliding(mo) {
        const myFrame = this.getRealFrame();
        const otherFrame = mo.getRealFrame();

        return (
            myFrame.x + myFrame.width > otherFrame.x &&
            myFrame.y + myFrame.height > otherFrame.y &&
            myFrame.x < otherFrame.x + otherFrame.width &&
            myFrame.y < otherFrame.y + otherFrame.height
        );
    }


    /**
     * Applies damage to the object and triggers hit behavior.
     */
    hit() {
        if (this.isHurt()) {
            return;
        }

        this.lastHit = new Date().getTime();
        this.health -= 10;
        this.playHitSound();

        if (this.health < 0) {
            this.health = 0;
        }
    }


    /**
     * Checks whether the object has no remaining health.
     *
     * Subclasses can additionally define their own `dead` state.
     *
     * @returns {boolean}
     */
    isDead() {
        return this.health === 0 || this.dead;
    }


    /**
     * Checks whether the object recently received damage.
     *
     * @returns {boolean}
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;

        return timepassed < 0.5;
    }


    /**
     * Placeholder method for playing a hit sound.
     *
     * Can be overwritten by subclasses.
     */
    playHitSound() {}
}