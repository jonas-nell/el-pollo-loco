import { level1 } from "../levels/level1.js";
import { level2 } from "../levels/level2.js";
import { level3 } from "../levels/level3.js";
import { Character } from "./character.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { MobileControls } from "./mobile-controls.class.js";
import { SoundHub } from "./sound-hub.class.js";
import { World } from "./world.class.js";

const GAME_STATES = {
    MENU: "MENU",
    PLAYING: "PLAYING",
    GAME_OVER: "GAME_OVER",
    VICTORY: "VICTORY",
};

export class Game {
    character;
    world;
    keyboard;
    state = GAME_STATES.MENU;

    levels = this.createLevels();
    currentLevelIndex = 0;

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.keyboard = new Keyboard();
        this.mobileControls = new MobileControls(this.keyboard);
        this.setMobileControlsVisibility(false);
        this.initUI();
        SoundHub.initVolumes();
        SoundHub.updateSounds();
        this.initAudioUnlock();
    }

    //#region UI Init

    initUI() {
        this.initStartScreen();
        this.initInstructionsDialog();
        this.initDialogButtons();
        this.initFullscreenButton();
        this.initSoundbutton();
        this.initSoundDialog();
    }

    initStartScreen() {
        const startMenu = document.getElementById("startMenu");
        const playButton = document.getElementById("playButton");

        setTimeout(() => {
            startMenu.classList.add("visible");
        }, 3000);

        playButton.addEventListener("click", () => {
            this.start();
        });
    }

    initDialogButtons() {
        const playAgainButtons = document.querySelectorAll(
            "#victoryDialog button:first-of-type, #gameOverDialog button:first-of-type",
        );
        const menuButtons = document.querySelectorAll(
            "#victoryDialog button:last-of-type, #gameOverDialog button:last-of-type",
        );

        playAgainButtons.forEach((button) => {
            button.addEventListener("click", () => {
                this.restartGame();
            });
        });

        menuButtons.forEach((button) => {
            button.addEventListener("click", () => {
                this.backToMenu();
            });
        });
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

    initSoundbutton() {
        this.soundButton = document.getElementById("soundBtn");
        this.soundIcon = this.soundButton.querySelector("img");

        this.soundButton.addEventListener("click", () => {
            SoundHub.toggleMute();
            this.updateSoundIcon();
        });
        this.updateSoundIcon();
    }

    initSoundDialog() {
        const soundDialog = document.getElementById("soundDialog");
        const closeSoundDialog = document.getElementById("closeSoundDialog");
        const volumeSlider = document.getElementById("volumeSlider");
        const soundSettingsButton = document.getElementById("soundSettings");

        volumeSlider.value = SoundHub.masterVolume * 100;

        volumeSlider.addEventListener("input", (event) => {
            const volume = event.target.value / 100;

            SoundHub.setMasterVolume(volume);
        });

        soundSettingsButton.addEventListener("click", () => {
            soundDialog.showModal();
        });

        closeSoundDialog.addEventListener("click", () => {
            soundDialog.close();
        });
    }

    //#endregion

    //#region Lifecycle
    start() {
        this.state = GAME_STATES.PLAYING;
        SoundHub.stopLoop(SoundHub.BGM.menuBgm);
        SoundHub.playLoop(SoundHub.BGM.levelBgm);
        document.getElementById("startMenu").classList.remove("visible");
        this.hideStartScreen();
        this.showCanvas();
        this.showFullscreenButton();
        this.setMobileControlsVisibility(true);
        this.character = new Character();
        this.createWorld();
    }

    nextLevel() {
        if (this.currentLevelIndex >= this.levels.length - 1) {
            this.winGame();
            return;
        }

        this.world.stop();
        this.currentLevelIndex++;

        const nextLevel = this.levels[this.currentLevelIndex]();

        this.character.x = nextLevel.spawnX;
        this.character.y = nextLevel.spawnY;

        this.createWorld();
    }

    winGame() {
        this.showEndScreen(
            GAME_STATES.VICTORY,
            "victoryDialog",
            SoundHub.BGM.victoryBgm,
        );
    }

    gameOver() {
        this.showEndScreen(
            GAME_STATES.GAME_OVER,
            "gameOverDialog",
            SoundHub.BGM.gameOverBgm,
        );
    }

    restartGame() {
        if (this.world) {
            this.world.stop();
        }
        IntervalHub.stopAllIntervals();

        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.currentLevelIndex = 0;
        this.state = GAME_STATES.PLAYING;

        document.getElementById("gameOverDialog").close();
        document.getElementById("victoryDialog").close();

        SoundHub.pauseAll();
        SoundHub.playLoop(SoundHub.BGM.levelBgm);

        this.showCanvas();
        this.showFullscreenButton();
        this.setMobileControlsVisibility(true);
        this.showH1();
        this.character = new Character();
        this.createWorld();
    }

    backToMenu() {
        if (this.world) {
            this.world.stop();
        }
        IntervalHub.stopAllIntervals();

        this.currentLevelIndex = 0;
        this.state = GAME_STATES.MENU;

        document.getElementById("gameOverDialog").close();
        document.getElementById("victoryDialog").close();
        SoundHub.pauseAll();
        SoundHub.playLoop(SoundHub.BGM.menuBgm);

        this.hideCanvas();
        this.showFullscreenButton();
        this.showSoundButton();
        this.setMobileControlsVisibility(false);
        this.showStartScreen();
        this.showH1();

        document.getElementById("startMenu").classList.add("visible");
    }

    createLevels() {
        return [level1, level2, level3];
    }

    createWorld() {
        this.world = new World(
            this.canvas,
            this.keyboard,
            this,
            this.levels[this.currentLevelIndex](),
            this.character,
        );
    }

    showEndScreen(state, dialogId, bgm) {
        this.state = state;
        this.world.stop();
        IntervalHub.stopAllIntervals();
        this.hideCanvas();
        this.hideFullscreenButton();
        this.hideSoundButton();
        this.setMobileControlsVisibility(false);
        this.hideH1();
        SoundHub.pauseAll();
        SoundHub.playLoop(bgm);
        document.getElementById(dialogId).showModal();
    }

    //#endregion

    //#region UI Helpers
    hideStartScreen() {
        document.getElementById("startScreen").classList.add("d-none");
    }

    showStartScreen() {
        document.getElementById("startScreen").classList.remove("d-none");
    }

    showCanvas() {
        document.getElementById("canvas").classList.remove("d-none");
    }

    hideCanvas() {
        document.getElementById("canvas").classList.add("d-none");
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

    hideSoundButton() {
        document.getElementById("soundBtn").classList.add("d-none");
    }

    showSoundButton() {
        document.getElementById("soundBtn").classList.remove("d-none");
    }

    hideH1() {
        document.getElementById("h1").classList.add("d-none");
    }

    showH1() {
        document.getElementById("h1").classList.remove("d-none");
    }

    updateSoundIcon() {
        this.soundIcon.src = SoundHub.isMuted
            ? "./assets/img/mute.png"
            : "./assets/img/sound.png";
    }

    setMobileControlsVisibility(show) {
        const mobileControls = document.getElementById("mobileControls");

        if (!mobileControls) return;

        if (show) {
            mobileControls.classList.remove("hidden");
        } else {
            mobileControls.classList.add("hidden");
        }
    }

    //#endregion

    initAudioUnlock() {
        const unlockAudio = () => {
            if (this.state === GAME_STATES.MENU) {
                SoundHub.playLoop(SoundHub.BGM.menuBgm);
            }
            document.body.removeEventListener("click", unlockAudio);
        };
        document.body.addEventListener("click", unlockAudio);
    }
}
