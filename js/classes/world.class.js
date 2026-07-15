import { ImageHelper } from "./img-helper.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { SoundHub } from "./sound-hub.class.js";
import { StatusBar } from "./status-bar.class.js";

/**
 * Controls the active game world.
 *
 * The World class is responsible for coordinating the main gameplay systems:
 * rendering, game updates, collisions, player interactions, level progression,
 * and communication between game entities.
 *
 * It acts as the central connection point between the game manager,
 * character, enemies, collectibles, and the canvas.
 *
 * 
 */
export class World {
    /**
     * Indicates whether the current level has already been completed.
     *
     * @type {boolean}
     */
    levelCompleted = false;

    /**
     * Interval ID of the world update loop.
     *
     * @type {number}
     */
    worldInterval;

    /**
     * Animation frame ID of the rendering loop.
     *
     * @type {number}
     */
    animationFrame;

    /**
     * Controls whether the world is actively running.
     *
     * @type {boolean}
     */
    running = true;

    /**
     * Reference to the game manager.
     *
     * @type {Game}
     */
    game;

    /**
     * Current level configuration.
     *
     * @type {Level}
     */
    level;

    /**
     * Player-controlled character.
     *
     * @type {Character}
     */
    character;

    /**
     * Canvas element used for rendering.
     *
     * @type {HTMLCanvasElement}
     */
    canvas;

    /**
     * Canvas rendering context.
     *
     * @type {CanvasRenderingContext2D}
     */
    ctx;

    /**
     * Keyboard input handler.
     *
     * @type {Keyboard}
     */
    keyboard;

    /**
     * Horizontal camera offset used for side-scrolling.
     *
     * @type {number}
     */
    camera_x = 0;

    /**
     * Player health display.
     *
     * @type {StatusBar}
     */
    healthBar = new StatusBar(ImageHelper.STATUSBAR.health, 25, -5);

    /**
     * Endboss health display.
     *
     * Hidden until the endboss becomes active.
     *
     * @type {StatusBar}
     */
    bossHealthBar = new StatusBar(ImageHelper.STATUSBAR.boss, 440, 0);

    /**
     * Bottle ammunition display.
     *
     * @type {StatusBar}
     */
    bottleBar = new StatusBar(ImageHelper.STATUSBAR.bottle, 25, 70);

    /**
     * Coin collection display.
     *
     * @type {StatusBar}
     */
    coinBar = new StatusBar(ImageHelper.STATUSBAR.coin, 440, 70);

    /**
     * Currently active throwable objects.
     *
     * @type {ThrowableObject[]}
     */
    throwableObjects = [];


    /**
     * Creates a new game world instance.
     *
     * Initializes references between game objects, starts rendering,
     * and starts the world update loop.
     *
     * @param {HTMLCanvasElement} canvas - Game canvas element.
     * @param {Keyboard} keyboard - Keyboard input handler.
     * @param {GameM} game - Game manager instance.
     * @param {Object} level - Current level data.
     * @param {Character} character - Player character.
     */
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


    /**
     * Main gameplay update loop.
     *
     * Runs repeatedly and updates gameplay logic,
     * collectible interactions, and level state.
     *
     * @returns {void}
     */
    run = () => {
        this.updateGameplay();
        this.updatePickups();
        this.updateLevelState();
    };


    /**
     * Updates active gameplay systems.
     *
     * Handles combat, collisions, thrown objects,
     * and cleanup of finished entities.
     *
     * @returns {void}
     */
    updateGameplay() {
        this.checkChickenJump();
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkBottleCollisions();
        this.checkBottleGround();
        this.removeFinishedBottles();
        this.removeDeadEnemies();
    }


    /**
     * Updates collectible interactions.
     *
     * Handles collecting bottles and coins and removes
     * collected objects from the level.
     *
     * @returns {void}
     */
    updatePickups() {
        this.checkBottlePickup();
        this.removePickedUpBottles();
        this.checkCoinPickup();
        this.removePickedUpCoins();
    }


    /**
     * Updates conditions related to level progression
     * and game ending states.
     *
     * @returns {void}
     */
    updateLevelState() {
        this.checkEndbossAlert();
        this.checkLevelCompleted();
        this.checkEndbossEscape();
        if (this.character.isFinished) {
            this.game.gameOver();
        }
    }


    /**
     * Creates a bottle throw action when the player presses
     * the assigned input key.
     *
     * @returns {void}
     */
    checkThrowObjects() {
        if (this.keyboard.E) {
            this.character.throwBottle();
        }
    }


    /**
     * Checks collisions between the player and enemies.
     *
     * Applies damage to the character when an enemy collision occurs.
     *
     * @returns {void}
     */
    checkCollisions = () => {
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDying && this.character.isColliding(enemy)) {
                this.character.hit();

                if (this.character.health <= 0) {
                    this.character.die();
                }
            }
        });
    };


    /**
     * Activates the endboss when the player enters its detection range.
     *
     * @returns {void}
     */
    checkEndbossAlert() {
        const endboss = this.level.endboss;
        if (!endboss) return;

        const distance = Math.abs(this.character.x - endboss.x);

        if (distance < 500) {
            endboss.alert();
            this.bossHealthBar.visible = true;
        }
    }


    /**
     * Connects world references to entities that need access
     * to other game systems.
     *
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
        this.level.endboss.world = this;
    }


    /**
     * Main rendering loop.
     *
     * Draws the complete game world using requestAnimationFrame.
     *
     * @returns {void}
     */
    draw() {
        if (!this.running) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawHUD();
        this.drawEntities();
        this.animationFrame = requestAnimationFrame(() => this.draw());
    }


    /**
     * Draws background elements while applying camera movement.
     *
     * @returns {void}
     */
    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    }


    /**
     * Draws all user interface elements.
     *
     * Updates status values before rendering.
     *
     * @returns {void}
     */
    drawHUD() {
        this.healthBar.setPercentage(this.character.health);
        this.addToMap(this.healthBar);
        this.addToMap(this.bossHealthBar);
        this.bossHealthBar.setPercentage(
            (this.level.endboss.health / 30) * 100,
        );
        this.addToMap(this.bottleBar);
        this.bottleBar.setPercentage(
            (Math.min(this.character.bottles, 5) / 5) * 100,
        );
        this.addToMap(this.coinBar);
        this.coinBar.setPercentage(
            (this.character.coins / 10) * 100,
        );
    }


    /**
     * Draws all active game entities.
     *
     * Includes the player, enemies, throwable objects,
     * and collectibles.
     *
     * @returns {void}
     */
    drawEntities() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.ctx.translate(-this.camera_x, 0);
    }


    /**
     * Adds multiple objects to the canvas.
     *
     * Iterates through an array of drawable objects and renders each one.
     *
     * @param {DrawableObject[]} objects
     * - Objects that should be rendered.
     *
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }


    /**
     * Adds a single object to the canvas.
     *
     * Handles visibility checks and sprite flipping before drawing.
     *
     * @param {DrawableObject} mo
     * - Object that should be rendered.
     *
     * @returns {void}
     */
    addToMap(mo) {
        if (mo.visible === false) return;
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }


    /**
     * Flips a sprite horizontally.
     *
     * Used for characters and enemies that need to face the opposite direction.
     *
     * @param {DrawableObject} mo
     * - Object that should be flipped.
     *
     * @returns {void}
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }


    /**
     * Restores the canvas state after a sprite flip.
     *
     * @param {DrawableObject} mo
     * - Object that was previously flipped.
     *
     * @returns {void}
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }


    /**
     * Checks whether thrown bottles hit enemies.
     *
     * Breaks bottles on impact and applies damage to enemies.
     *
     * @returns {void}
     */
    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (!bottle.isBroken && bottle.isColliding(enemy)) {
                    bottle.break();
                    enemy.hit();
                }
            });
        });
    }


    /**
     * Checks whether thrown bottles reached the ground.
     *
     * Bottles are destroyed once they hit the ground.
     *
     * @returns {void}
     */
    checkBottleGround() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.y >= bottle.groundLevel) {
                bottle.break();
            }
        });
    }


    /**
     * Removes throwable objects whose animation has finished.
     *
     * @returns {void}
     */
    removeFinishedBottles() {
        this.throwableObjects = this.throwableObjects.filter(
            (bottle) => !bottle.isFinished,
        );
    }


    /**
     * Removes defeated enemies after their death animation finished.
     *
     * @returns {void}
     */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(
            (enemy) => !enemy.isFinished,
        );
    }


    /**
     * Checks whether the player jumped on an enemy from above.
     *
     * Defeats smaller enemies and resets the player's jump.
     *
     * @returns {void}
     */
    checkChickenJump() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.speedY <= 0 && this.character.isColliding(enemy)) {
                const characterBottom =
                    this.character.getRealFrame().y +
                    this.character.getRealFrame().height;

                const enemyTop = enemy.getRealFrame().y;

                if (characterBottom - enemyTop <= 25) {
                    enemy.hit();
                    this.character.jump();
                    SoundHub.playOne(SoundHub.CHARACTER.jump);
                }
            }
        });
    }


    /**
     * Checks whether the character collects bottles.
     *
     * Adds ammunition and removes collected bottles from the level.
     *
     * @returns {void}
     */
    checkBottlePickup() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottles++;
                SoundHub.playOne(SoundHub.COLLECTIBLES.bottle);
                bottle.isFinished = true;
            }
        });
    }


    /**
     * Removes bottles that have already been collected.
     *
     * @returns {void}
     */
    removePickedUpBottles() {
        this.level.bottles = this.level.bottles.filter(
            (bottle) => !bottle.isFinished,
        );
    }


    /**
     * Checks whether the character collects coins.
     *
     * Adds coins to the player score and removes collected coins.
     *
     * @returns {void}
     */
    checkCoinPickup() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                SoundHub.playOne(SoundHub.COLLECTIBLES.coin);
                this.character.coins++;
                coin.isFinished = true;
            }
        });
    }


    /**
     * Removes coins that have already been collected.
     *
     * @returns {void}
     */
    removePickedUpCoins() {
        this.level.coins = this.level.coins.filter(
            (coin) => !coin.isFinished,
        );
    }


    /**
     * Stops the world update and rendering loops.
     *
     * Used when restarting the game, changing levels,
     * or ending the current game session.
     *
     * @returns {void}
     */
    stop() {
        this.running = false;
        IntervalHub.stopInterval(this.worldInterval);
        cancelAnimationFrame(this.animationFrame);
    }


    /**
     * Checks whether the current level has been completed.
     *
     * A level is completed when the endboss is defeated
     * and all coins have been collected.
     *
     * @returns {void}
     */
    checkLevelCompleted() {
        if (this.levelCompleted) return;

        const bossDefeated = this.level.endboss.isFinished;
        const allCoinsCollected = this.level.coins.length === 0;

        if (bossDefeated && allCoinsCollected) {
            this.levelCompleted = true;
            this.game.nextLevel();
        }
    }


    /**
     * Checks whether the endboss escaped the playable area.
     *
     * If the endboss reaches the left edge of the level,
     * the game ends.
     *
     * @returns {void}
     */
    checkEndbossEscape() {
        const endboss = this.level.endboss;
        if (!endboss) return;
        if (endboss.x < 0) {
            this.game.gameOver();
        }
    }
}