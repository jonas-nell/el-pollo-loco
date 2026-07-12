import { BackgroundObject } from "./background-object.class.js";
import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { StatusBar } from "./status-bar.class.js";

export class World {
    levelCompleted = false;
    worldInterval;
    animationFrame;
    running = true;
    game;
    level;
    character;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new StatusBar(ImageHelper.STATUSBAR.health, 25, -5);
    bossHealthBar = new StatusBar(ImageHelper.STATUSBAR.boss, 460, 0);
    bottleBar = new StatusBar(ImageHelper.STATUSBAR.bottle, 25, 70);
    coinBar = new StatusBar(ImageHelper.STATUSBAR.coin, 460, 70);
    throwableObjects = [];

    constructor(canvas, keyboard, game, level, character) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.game = game;
        this.level = level;
        this.character = character;
        this.setWorld();
        this.draw();
        this.bossHealthBar.visible = false;
        this.worldInterval = IntervalHub.startInterval(this.run, 16);
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
        this.checkBottlePickup();
        this.removePickedUpBottles();
        this.checkCoinPickup();
        this.removePickedUpCoins();
        this.checkLevelCompleted();
        this.checkEndbossEscape();
        if(this.character.isFinished){
            this.game.gameOver();
        }
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

                
                if (this.character.health <= 0){
                    this.character.die();
                }
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
        if(!this.running) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        this.healthBar.setPercentage(this.character.health);
        this.addToMap(this.healthBar);
        this.addToMap(this.bossHealthBar);
        this.bossHealthBar.setPercentage(
            this.level.endboss.health / 30 * 100
        );
        this.addToMap(this.bottleBar);
        this.bottleBar.setPercentage(
            this.character.bottles / 5 * 100
        );
        this.addToMap(this.coinBar);
        this.coinBar.setPercentage(
            this.character.coins / 10 * 100
        );

        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);        
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);

        this.ctx.translate(-this.camera_x, 0);

        this.animationFrame = requestAnimationFrame(() => this.draw());
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

    checkBottlePickup(){
        this.level.bottles.forEach((bottle) => {
            if(this.character.isColliding(bottle)){
                this.character.bottles++;
                bottle.isFinished = true;
            }
        });
    }

    removePickedUpBottles(){
        this.level.bottles = this.level.bottles.filter(
            bottle => !bottle.isFinished
        );
    }

    checkCoinPickup(){
        this.level.coins.forEach((coin) => {
            if(this.character.isColliding(coin)){
                this.character.coins++;
                coin.isFinished = true;
            }
        });
    }

    removePickedUpCoins(){
        this.level.coins = this.level.coins.filter(
            coin => !coin.isFinished
        );
    }

    stop(){
        this.running = false;
        IntervalHub.stopInterval(this.worldInterval);
        cancelAnimationFrame(this.animationFrame);
    }

    checkLevelCompleted(){
        if (this.levelCompleted) return;
        const bossDefeated = this.level.endboss.isFinished;
        const allCoinsCollected = this.level.coins.length === 0;

        if(bossDefeated && allCoinsCollected){
            this.levelCompleted = true;
            this.game.nextLevel();
        }
    }

    checkEndbossEscape(){
        const endboss = this.level.endboss;
        if (!endboss) return;
        if (endboss.x < 0){
            this.game.gameOver();
        }
    }
}
