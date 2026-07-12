import { level1 } from "../levels/level1.js";
import { level2 } from "../levels/level2.js";
import { level3 } from "../levels/level3.js";
import { Character } from "./character.class.js";
import { IntervalHub } from "./interval-hub.class.js";
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

    levels = this.createLevels();
    currentLevelIndex = 0;

    constructor(){
        this.keyboard = new Keyboard();
        this.initStartScreen();
        this.initInstructionsDialog();
        this.initDialogButtons();
        this.initFullscreenButton();
    }

    initStartScreen(){
        const startMenu = document.getElementById("startMenu");
        const playButton = document.getElementById("playButton");

        setTimeout(() => {
            startMenu.classList.add("visible");
        }, 3000);

        playButton.addEventListener("click", () => {
            this.start();
        });
    }

    start(){        
        this.state = GAME_STATES.PLAYING;
        document.getElementById("startMenu").classList.remove("visible");
        this.hideStartScreen();
        this.showCanvas();
        this.showFullscreenButton();
        const canvas = document.getElementById("canvas");
        this.character = new Character();
        this.world = new World(canvas, this.keyboard, this, this.levels[this.currentLevelIndex](), this.character);
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

        const nextLevel = this.levels[this.currentLevelIndex]();

        this.character.x = nextLevel.spawnX;
        this.character.y = nextLevel.spawnY;

        this.world = new World(
            document.getElementById("canvas"),
            this.keyboard,
            this,
            this.levels[this.currentLevelIndex](),
            this.character
        );
    }

    winGame(){
        const victoryDialog = document.getElementById("victoryDialog");

        this.state = GAME_STATES.VICTORY;
        this.world.stop();
        IntervalHub.stopAllIntervals();
        this.hideCanvas();
        this.hideFullscreenButton();
        victoryDialog.showModal();
    }

    gameOver(){
        const gameOverDialog = document.getElementById("gameOverDialog");
        this.state = GAME_STATES.GAME_OVER;
        this.world.stop();
        IntervalHub.stopAllIntervals();
        this.hideCanvas();
        this.hideFullscreenButton();
        gameOverDialog.showModal();
    }

    restartGame(){
        if(this.world){
            this.world.stop();
        }
        IntervalHub.stopAllIntervals();

        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.currentLevelIndex = 0;
        this.state = GAME_STATES.PLAYING;

        document.getElementById("gameOverDialog").close();
        document.getElementById("victoryDialog").close();

        this.showCanvas();
        this.showFullscreenButton();
        this.character = new Character();
        
        this.world = new World(
            canvas,
            this.keyboard,
            this,
            this.levels[this.currentLevelIndex](),
            this.character
        );
    }

    backToMenu(){
        if(this.world){
            this.world.stop();
        }
        IntervalHub.stopAllIntervals();

        this.currentLevelIndex = 0;
        this.state = GAME_STATES.MENU;

        document.getElementById("gameOverDialog").close();
        document.getElementById("victoryDialog").close();

        this.hideCanvas();
        this.hideFullscreenButton();
        this.showStartScreen();
        
        document.getElementById("startMenu").classList.add("visible");
    }

    initDialogButtons(){
        const playAgainButtons = document.querySelectorAll(
            "#victoryDialog button:first-of-type, #gameOverDialog button:first-of-type"
        );
        const menuButtons = document.querySelectorAll(
            "#victoryDialog button:last-of-type, #gameOverDialog button:last-of-type"
        );

        playAgainButtons.forEach(button => {
            button.addEventListener("click", () => {
                this.restartGame();
            });
        });

        menuButtons.forEach(button => {
            button.addEventListener("click", () => {
                this.backToMenu();
            });
        });
    }

    showStartScreen(){
        document.getElementById("startScreen").classList.remove("d-none");
    }

    createLevels(){
        return [
            level1,
            level2,
            level3,
        ];
    }

    initInstructionsDialog() {
        const dialog = document.getElementById("instructionsDialog");
        const openButton = document.getElementById("instructionsButton");
        const closeButton = document.getElementById("closeInstructions");

        openButton.addEventListener("click", () => {
            dialog.showModal();
        });

        closeButton.addEventListener("click", () => {
            dialog.close();
        });
    }

    initFullscreenButton() {
        const button = document.getElementById("fullscreenButton");

        button.addEventListener("click", () => {
            this.toggleFullscreen();
        });
    }

    toggleFullscreen() {
        const gameContainer = document.getElementById("gameContainer");

        if (!document.fullscreenElement) {
            gameContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    showFullscreenButton() {
        document.getElementById("fullscreenButton").classList.remove("d-none");
    }

    hideFullscreenButton() {
        document.getElementById("fullscreenButton").classList.add("d-none");
    }

}


// create createWorld helper