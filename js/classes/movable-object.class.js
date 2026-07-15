import { DrawableObject } from "./drawable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

export class MovableObject extends DrawableObject {
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    groundLevel = 155;
    health = 100;
    lastHit = 0;
    isFinished = false;

    getRealFrame() {
        return {
            x: this.x + this.offset.left,
            y: this.y + this.offset.top,
            width: this.width - this.offset.left - this.offset.right,
            height: this.height - this.offset.top - this.offset.bottom,
        };
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

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

    moveRight() {
        if (this.isDead()) return;
        this.x += this.speed;
    }

    moveLeft() {
        if (this.isDead()) return;
        this.x -= this.speed;
    }

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

    isAboveGround() {
        return this.y < this.groundLevel;
    }

    jump() {
        if (this.isDead()) return;
        this.speedY = 30;
    }

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

    isDead() {
        return this.health === 0 || this.dead;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    playHitSound() {}
}
