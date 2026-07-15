/**
 * Represents a game level configuration.
 *
 * Stores all objects required to build and run a level,
 * including enemies, environment objects, collectibles,
 * the endboss, and player spawn information.
 *
 * The Level class acts as a data container and does not
 * contain gameplay logic.
 *
 * 
 */
export class Level {


    /**
     * Enemies contained in this level.
     *
     * @type {MovableObject[]}
     */
    enemies;


    /**
     * Cloud objects displayed in the background.
     *
     * @type {Cloud[]}
     */
    clouds;


    /**
     * Background image segments.
     *
     * @type {BackgroundObject[]}
     */
    backgroundObjects;


    /**
     * Endboss instance of this level.
     *
     * @type {Endboss}
     */
    endboss;


    /**
     * Collectible bottles available in the level.
     *
     * @type {Bottle[]}
     */
    bottles;


    /**
     * Collectible coins available in the level.
     *
     * @type {Coin[]}
     */
    coins;


    /**
     * Maximum horizontal level position.
     *
     * Determines where the playable area ends.
     *
     * @type {number}
     */
    level_end_x;


    /**
     * Character starting horizontal position.
     *
     * @type {number}
     */
    spawnX;


    /**
     * Character starting vertical position.
     *
     * @type {number}
     */
    spawnY;


    /**
     * Creates a new level configuration.
     *
     * @param {MovableObject[]} enemies - Enemies inside the level.
     * @param {Cloud[]} clouds - Background cloud objects.
     * @param {BackgroundObject[]} backgroundObjects - Background segments.
     * @param {Endboss} endboss - Boss enemy of the level.
     * @param {Bottle[]} bottles - Collectible bottle objects.
     * @param {Coin[]} coins - Collectible coin objects.
     * @param {number} level_end_x - Maximum horizontal level position.
     * @param {number} spawnX - Player starting X position.
     * @param {number} spawnY - Player starting Y position.
     */
    constructor(
        enemies,
        clouds,
        backgroundObjects,
        endboss,
        bottles,
        coins,
        level_end_x,
        spawnX,
        spawnY,
    ) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.endboss = endboss;
        this.bottles = bottles;
        this.coins = coins;
        this.level_end_x = level_end_x;
        this.spawnX = spawnX;
        this.spawnY = spawnY;
    }
}