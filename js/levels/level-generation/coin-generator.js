import { Coin } from "../../classes/coin.class.js";

const COIN_TEMPLATES = [
    [
        {x: 340, y: 290},
        {x: 460, y: 290},
        {x: 613, y: 170},
        {x: 555, y: 290},
        {x: 670, y: 290}
    ],
    [
        {x: 215, y: 170},
        {x: 155, y: 290},
        {x: 275, y: 290},
        {x: 420, y: 290},
        {x: 560, y: 290}
    ],
    [
        {x: 180, y: 290},
        {x: 360, y: 170},
        {x: 300, y: 290},
        {x: 420, y: 290},
        {x: 540, y: 290}
    ],
    [
        {x: 450, y: 120},
        {x: 400, y: 180},
        {x: 500, y: 180},
        {x: 350, y: 250},
        {x: 550, y: 250}
    ]

]


export function generateCoins(segmentCount){
    const SEGMENT_WIDTH = 719;
    let coins = [];

    for (let i = 0; i < segmentCount - 1; i++){
        let template = (i === 0)
        ? COIN_TEMPLATES[0]
        : getRandomCoinTemplate();
        template.forEach((coin) => {
            coins.push(
                new Coin(i * SEGMENT_WIDTH + coin.x, coin.y)
            );
        });
    }

    return coins;

}

function getRandomCoinTemplate(){
    let randomIndex = Math.floor(
        Math.random() * COIN_TEMPLATES.length
    );

    return COIN_TEMPLATES[randomIndex];
}