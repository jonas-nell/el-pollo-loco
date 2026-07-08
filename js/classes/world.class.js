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
    statusBar = new StatusBar;
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        IntervalHub.startInterval(this.run, 16);
    }

    run = () => {
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkBottleCollisions();
        this.checkBottleGround();
        this.removeFinishedBottles();
        this.removeDeadEnemies();
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
                this.statusBar.setPercentage(this.character.health);                
            }
        });
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
        this.addToMap(this.statusBar);
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

}
