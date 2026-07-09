export class Level{
    enemies;
    clouds;
    backgroundObjects;
    endboss;
    level_end_x = 2250;

    constructor(enemies, clouds, backgroundObjects, endboss, bottles, coins){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.endboss = endboss;
        this.bottles = bottles;
        this.coins = coins;
    }
}