
import { Coin } from "../../classes/coin.class.js";


/**
 * Predefined coin placement patterns.
 *
 * Each template contains relative positions inside
 * one level segment.
 *
 * @type {Object[][]}
 */
const COIN_TEMPLATES = [
    [
        { x: 340, y: 290 },
        { x: 460, y: 290 },
        { x: 613, y: 170 },
        { x: 555, y: 290 },
        { x: 670, y: 290 },
    ],
    [
        { x: 215, y: 170 },
        { x: 155, y: 290 },
        { x: 275, y: 290 },
        { x: 420, y: 290 },
        { x: 560, y: 290 },
    ],
    [
        { x: 180, y: 290 },
        { x: 360, y: 170 },
        { x: 300, y: 290 },
        { x: 420, y: 290 },
        { x: 540, y: 290 },
    ],
    [
        { x: 450, y: 120 },
        { x: 400, y: 180 },
        { x: 500, y: 180 },
        { x: 350, y: 250 },
        { x: 550, y: 250 },
    ],
];


/**
 * Generates collectible coins for a level.
 *
 * Creates coins based on predefined placement templates.
 * The first segment always uses a fixed template, while
 * following segments receive randomly selected patterns.
 *
 * Template coordinates are converted from local segment
 * positions into global world positions.
 *
 * @param {number} segmentCount - Number of level segments.
 *
 * @returns {Coin[]} Generated coin objects.
 */
export function generateCoins(segmentCount) {
    const SEGMENT_WIDTH = 719;
    const coins = [];

    /*
     * The final segment is excluded to prevent collectibles
     * from spawning too close to the endboss area.
     */
    for (let i = 0; i < segmentCount - 1; i++) {
        const template = i === 0 ? COIN_TEMPLATES[0] : getRandomCoinTemplate();
        template.forEach((coin) => {
            coins.push(new Coin(i * SEGMENT_WIDTH + coin.x, coin.y,),
            );
        });
    }
    return coins;
}


/**
 * Selects a random coin placement template.
 *
 * @returns {Object[]} A randomly selected coin pattern.
 */
function getRandomCoinTemplate() {
    const randomIndex =
        Math.floor(Math.random() * COIN_TEMPLATES.length);
        
    return COIN_TEMPLATES[randomIndex];
}