import { DrawableObject } from "./drawable-object.class.js";
import { IntervalHub } from "./interal-hub.class.js";

export class MovableObject extends DrawableObject {

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    groundLevel = 155;
    health = 100;
    lastHit = 0;
    isFinished = false;

    border = false;

    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = "blue";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    playAnimationOnce(images){
        let i = this.currentImageOnce;
        if(i < images.length){
            this.img = this.imageCache[images[i]];
            this.currentImageOnce++;
        }
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    applyGravity() {
        IntervalHub.startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < this.groundLevel;
    }

    jump() {
        this.speedY = 30;
    }

    isColliding(mo) {
        return (
            this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height
        );
    }

    hit(){
        if (this.isHurt()){
            return;
        }
        this.lastHit = new Date().getTime();
        this.health -= 10;
        if(this.health < 0){
            this.health = 0;
        } 
    }

    isDead(){
        return this.health == 0;
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }
}