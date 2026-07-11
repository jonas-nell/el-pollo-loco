import { level1 } from "../levels/level1.js";
import { level2 } from "../levels/level2.js";
import { level3 } from "../levels/level3.js";
import { Keyboard } from "./keyboard.class.js";
import { World } from "./world.class.js";

const GAME_STATES = {
    MENU: "MENU",
    PLAYING: "PLAYING",
    GAME_OVER: "GAME_OVER",
    VICTORY: "VICTORY"
};

export class Game{
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
        this.world = new World(canvas, this.keyboard, this, this.levels[this.currentLevelIndex]);
    }
    
    hideStartScreen(){
        document.getElementById("startScreen").classList.add("d-none");
    }

    showCanvas(){
        document.getElementById("canvas").classList.remove("d-none");
    }
}