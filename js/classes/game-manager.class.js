import { level1 } from "../levels/level1.js";
import { level2 } from "../levels/level2.js";
import { level3 } from "../levels/level3.js";
import { Character } from "./character.class.js";
import { IntervalHub } from "./interal-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { World } from "./world.class.js";

const GAME_STATES = {
    MENU: "MENU",
    PLAYING: "PLAYING",
    GAME_OVER: "GAME_OVER",
    VICTORY: "VICTORY"
};

export class Game{
    character;
    world;
    keyboard;
    state = GAME_STATES.MENU;

    levels = [
        level1,
        level2,
        level3
    ];
    currentLevelIndex = 0;

    constructor(){
        this.keyboard = new Keyboard();
        this.initStartScreen();
    }

    initStartScreen(){
        const startDialog = document.getElementById("startDialog");
        const playButton = document.getElementById("playButton");

        setTimeout(() => {
            startDialog.showModal();
            startDialog.classList.add("visible")
        }, 3000);

        playButton.addEventListener("click", () => {
            this.start();
        });
    }

    start(){
        
        this.state = GAME_STATES.PLAYING;
        document.getElementById("startDialog").close();
        this.hideStartScreen();
        this.showCanvas();
        const canvas = document.getElementById("canvas");
        this.character = new Character();
        this.world = new World(canvas, this.keyboard, this, this.levels[this.currentLevelIndex], this.character);
    }
    
    hideStartScreen(){
        document.getElementById("startScreen").classList.add("d-none");
    }

    showCanvas(){
        document.getElementById("canvas").classList.remove("d-none");
    }

    hideCanvas(){
        document.getElementById("canvas").classList.add("d-none");
    }

    nextLevel(){
        if (this.currentLevelIndex >= this.levels.length - 1){
            this.winGame();
            return;
        }

        this.world.stop();
        this.currentLevelIndex++;

        this.character.x = this.levels[this.currentLevelIndex].spawnX;
        this.character.y = this.levels[this.currentLevelIndex].spawnY;

        this.world = new World(
            document.getElementById("canvas"),
            this.keyboard,
            this,
            this.levels[this.currentLevelIndex],
            this.character
        );
    }

    winGame(){
        const victoryDialog = document.getElementById("victoryDialog");

        this.state = GAME_STATES.VICTORY;
        this.world.stop();
        IntervalHub.stopAllIntervals();
        this.hideCanvas();
        victoryDialog.showModal();
    }

    gameOver(){
        const gameOverDialog = document.getElementById("gameOverDialog");
        this.state = GAME_STATES.GAME_OVER;
        this.world.stop();
        IntervalHub.stopAllIntervals();
        this.hideCanvas();
        gameOverDialog.showModal();
    }
}