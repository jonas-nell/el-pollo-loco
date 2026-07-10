export class Level{
    enemies;
    clouds;
    backgroundObjects;
    endboss;
    level_end_x;

    constructor(enemies, clouds, backgroundObjects, endboss, bottles, coins, level_end_x){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.endboss = endboss;
        this.bottles = bottles;
        this.coins = coins;
        this.level_end_x = level_end_x;
    }
}