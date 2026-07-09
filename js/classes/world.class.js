import { BackgroundObject } from "./background-object.class.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { Cloud } from "./cloud.class.js";
import { ImageHelper } from "./imgHelper.class.js";
import { level1 } from "../levels/level1.js";
import { IntervalHub } from "./interal-hub.class.js";
import { StatusBar } from "./status-bar.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { Keyboard } from "./keyboard.class.js";

export class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new StatusBar(ImageHelper.STATUSBAR.health, 25, -5);
    bossHealthBar = new StatusBar(ImageHelper.STATUSBAR.boss, 460, 0);
    bottleBar = new StatusBar(ImageHelper.STATUSBAR.bottle, 25, 70);
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.bossHealthBar.visible = false;
        IntervalHub.startInterval(this.run, 16);
    }

    run = () => {
        this.checkChickenJump();
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkBottleCollisions();
        this.checkBottleGround();
        this.removeFinishedBottles();
        this.removeDeadEnemies();
        this.checkEndbossAlert();
    }

    checkThrowObjects(){
        if(this.keyboard.E){
            this.character.throwBottle();
        }
    }

    checkCollisions = () => {
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDying && this.character.isColliding(enemy)){
                this.character.hit();
                this.healthBar.setPercentage(this.character.health);                
            }
        });
    }

    checkEndbossAlert(){
        let endboss = this.level.endboss;
        if(!endboss) return;
        let distance = Math.abs(this.character.x - endboss.x);
        if(distance < 500){
            endboss.alert();
            this.bossHealthBar.visible = true;
        }
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.bossHealthBar);
        this.bossHealthBar.setPercentage(
            this.level.endboss.health / 30 * 100
        );
        this.addToMap(this.bottleBar);
        this.bottleBar.setPercentage(
            this.character.bottles / 5 * 100
        );

        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);        
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.visible === false) return;

        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        
        if (mo.border){
            mo.drawFrame(this.ctx);
        }

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo){
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    checkBottleCollisions(){
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if(!bottle.isBroken && bottle.isColliding(enemy)){
                    bottle.break();
                    enemy.hit();
                }
            });
        });
    }

    checkBottleGround(){
        this.throwableObjects.forEach((bottle) => {
            if(bottle.y >= bottle.groundLevel){
                bottle.break();
            }
        });
    }

    removeFinishedBottles(){
        this.throwableObjects = this.throwableObjects.filter(
            bottle => !bottle.isFinished
        );
    }

    removeDeadEnemies(){
        this.level.enemies = this.level.enemies.filter(
            enemy => !enemy.isFinished
        );
    }

    checkChickenJump(){
        this.level.enemies.forEach((enemy) => {
            if (
                this.character.speedY < 0 &&
                this.character.isColliding(enemy) &&
                this.character.getRealFrame().y + this.character.getRealFrame().height < enemy.getRealFrame().y + 30
            ) {
                enemy.hit();
                this.character.jump();
            }
        });
    }

}
