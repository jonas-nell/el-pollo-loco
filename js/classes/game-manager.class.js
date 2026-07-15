import { level1 } from "../levels/level1.js";
import { level2 } from "../levels/level2.js";
import { level3 } from "../levels/level3.js";
import { Character } from "./character.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { MobileControls } from "./mobile-controls.class.js";
import { SoundHub } from "./sound-hub.class.js";
import { World } from "./world.class.js";

/**
 * Represents the different states of the game.
 *
 * @typedef {Object} GameState
 * @property {string} MENU - Initial menu state.
 * @property {string} PLAYING - Active gameplay state.
 * @property {string} GAME_OVER - Player lost state.
 * @property {string} VICTORY - Player completed the game state.
 */
const GAME_STATES = {
    MENU: "MENU",
    PLAYING: "PLAYING",
    GAME_OVER: "GAME_OVER",
    VICTORY: "VICTORY"
};

/**
 * Controls the overall game lifecycle.
 *
 * The Game class manages:
 * - game states
 * - level progression
 * - world creation
 * - UI screens
 * - fullscreen handling
 * - sound initialization
 * - restart and menu transitions
 *
 * It acts as the main coordinator between the user interface,
 * game world, player character, and audio systems.
 *
 * 
 */
export class Game {
    /**
     * Current playable character.
     *
     * @type {Character}
     */
    character;

    /**
     * Currently active game world.
     *
     * @type {World}
     */
    world;

    /**
     * Keyboard input handler.
     *
     * @type {Keyboard}
     */
    keyboard;

    /**
     * Current game state.
     *
     * @type {string}
     */
    state = GAME_STATES.MENU;

    /**
     * Available game levels.
     *
     * Each entry is a function returning a fresh level instance.
     *
     * @type {Function[]}
     */
    levels = this.createLevels();

    /**
     * Index of the currently active level.
     *
     * @type {number}
     */
    currentLevelIndex = 0;

    /**
     * Creates a new game instance.
     *
     * Initializes input handling, UI elements, sound settings,
     * and browser audio unlocking.
     */
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

    /**
     * Initializes all user interface systems.
     *
     * Sets up menus, dialogs, fullscreen controls,
     * and sound controls.
     *
     * @returns {void}
     */
    initUI() {
        this.initStartScreen();
        this.initInstructionsDialog();
        this.initDialogButtons();
        this.initFullscreenButton();
        this.initSoundbutton();
        this.initSoundDialog();
    }

    /**
     * Initializes the start screen behavior.
     *
     * Displays the menu after a short delay and
     * starts the game when the play button is clicked.
     *
     * @returns {void}
     */
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
    /**
     * Initializes the instructions dialog and registers open/close button events.
     */
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

    /**
     * Initializes restart and menu buttons
     * on the game over and victory dialogs.
     *
     * @returns {void}
     */
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

    /**
     * Initializes the fullscreen button and registers the fullscreen toggle event.
     */
    initFullscreenButton() {
        const button = document.getElementById("fullscreenButton");

        button.addEventListener("click", () => {
            this.toggleFullscreen();
        });
    }

    /**
     * Initializes the sound toggle button and updates the displayed sound icon.
     * Registers a click event to mute or unmute all game sounds.
     */
    initSoundbutton() {
        this.soundButton = document.getElementById("soundBtn");
        this.soundIcon = this.soundButton.querySelector("img");

        this.soundButton.addEventListener("click", () => {
            SoundHub.toggleMute();
            this.updateSoundIcon();
        });
        this.updateSoundIcon();
    }

    /**
     * Starts a new game session.
     *
     * Creates the player character, starts background music,
     * updates UI visibility, and creates the first world.
     *
     * @returns {void}
     */
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
        this.showLevelAnnouncement(this.currentLevelIndex + 1);
        this.createWorld();
    }

    /**
     * Advances to the next level.
     *
     * Stops the current world, loads the next level,
     * resets player position, and creates a new world instance.
     *
     * @returns {void}
     */
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
        this.showLevelAnnouncement(this.currentLevelIndex + 1);
    }

    /**
     * Initializes the sound settings dialog.
     * Registers events for opening and closing the dialog and updates the master volume.
     */
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


/**
 * Displays a temporary level announcement overlay on the screen.
 *
 * @param {number} levelNumber - The number of the level that is being started.
 */
    showLevelAnnouncement(levelNumber) {
    const overlay = document.getElementById("level-overlay");

    overlay.textContent = `Level ${levelNumber}`;
    overlay.classList.remove("hidden");

    setTimeout(() => {
        overlay.classList.add("hidden");
    }, 2000);
}


    /**
     * Shows the victory screen after completing the game.
     *
     * @returns {void}
     */
    winGame() {
        this.showEndScreen(
            GAME_STATES.VICTORY,
            "victoryDialog",
            SoundHub.BGM.victoryBgm,
        );
    }

    /**
     * Shows the game over screen after losing.
     *
     * @returns {void}
     */
    gameOver() {
        this.showEndScreen(
            GAME_STATES.GAME_OVER,
            "gameOverDialog",
            SoundHub.BGM.gameOverBgm,
        );
    }

    /**
     * Restarts the game from the beginning.
     *
     * Stops running game processes, resets the level,
     * creates a new character, and starts a fresh world.
     *
     * @returns {void}
     */
    restartGame() {
        if (this.world) {
            this.world.stop();
        }
        IntervalHub.stopAllIntervals();
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentLevelIndex = 0;
        this.state = GAME_STATES.PLAYING;
        document.getElementById("gameOverDialog").close();
        document.getElementById("victoryDialog").close();
        SoundHub.pauseAll();
        SoundHub.playLoop(SoundHub.BGM.levelBgm);
        this.showCanvas();
        this.showFullscreenButton();
        this.showSoundButton();
        this.setMobileControlsVisibility(true);
        this.showH1();
        this.character = new Character();
        this.createWorld();
        this.showLevelAnnouncement(this.currentLevelIndex + 1);
    }

    /**
     * Returns the player to the main menu.
     *
     * Stops the current game, resets level progress,
     * restores menu UI, and starts menu music.
     *
     * @returns {void}
     */
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

    /**
     * Creates the available game level list.
     *
     * Level functions are stored instead of level objects
     * so each level can be recreated with fresh state.
     *
     * @returns {Function[]}
     */
    createLevels() {
        return [level1, level2, level3];
    }

    /**
     * Creates a new game world instance.
     *
     * Passes the current level, player character,
     * keyboard controls, and game reference to the world.
     *
     * @returns {void}
     */
    createWorld() {
        this.world = new World(
            this.canvas,
            this.keyboard,
            this,
            this.levels[this.currentLevelIndex](),
            this.character,
        );
    }

    /**
     * Handles transitions into victory or game over states.
     *
     * Stops gameplay, updates UI visibility,
     * changes music, and opens the corresponding dialog.
     *
     * @param {string} state - New game state.
     * @param {string} dialogId - ID of the dialog to display.
     * @param {HTMLAudioElement} bgm - Background music for the screen.
     *
     * @returns {void}
     */
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

    /**
     * Hides the start screen from view.
     *
     * @returns {void}
     */
    hideStartScreen() {
        document.getElementById("startScreen").classList.add("d-none");
    }

    /**
     * Shows the start screen.
     *
     * @returns {void}
     */
    showStartScreen() {
        document.getElementById("startScreen").classList.remove("d-none");
    }

    /**
     * Shows the game canvas.
     *
     * @returns {void}
     */
    showCanvas() {
        document.getElementById("canvas").classList.remove("d-none");
    }

    /**
     * Hides the game canvas.
     *
     * @returns {void}
     */
    hideCanvas() {
        document.getElementById("canvas").classList.add("d-none");
    }

    /**
     * Toggles fullscreen mode for the game container.
     *
     * @returns {void}
     */
    toggleFullscreen() {
        const gameContainer = document.getElementById("gameContainer");

        if (!document.fullscreenElement) {
            gameContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Shows the fullscreen button.
     *
     * @returns {void}
     */
    showFullscreenButton() {
        document.getElementById("fullscreenButton").classList.remove("d-none");
    }

    /**
     * Hides the fullscreen button.
     *
     * @returns {void}
     */
    hideFullscreenButton() {
        document.getElementById("fullscreenButton").classList.add("d-none");
    }

    /**
     * Hides the sound button.
     *
     * @returns {void}
     */
    hideSoundButton() {
        document.getElementById("soundBtn").classList.add("d-none");
    }

    /**
     * Shows the sound button.
     *
     * @returns {void}
     */
    showSoundButton() {
        document.getElementById("soundBtn").classList.remove("d-none");
    }

    /**
     * Hides the page heading.
     *
     * @returns {void}
     */
    hideH1() {
        document.getElementById("h1").classList.add("d-none");
    }

    /**
     * Shows the page heading.
     *
     * @returns {void}
     */
    showH1() {
        document.getElementById("h1").classList.remove("d-none");
    }

    /**
     * Updates the sound button icon based on mute state.
     *
     * @returns {void}
     */
    updateSoundIcon() {
        this.soundIcon.src = SoundHub.isMuted
            ? "./assets/img/mute.png"
            : "./assets/img/sound.png";
    }

    /**
     * Shows or hides mobile control buttons.
     *
     * @param {boolean} show - Whether mobile controls should be visible.
     *
     * @returns {void}
     */
    setMobileControlsVisibility(show) {
        const mobileControls = document.getElementById("mobileControls");

        if (!mobileControls) return;

        if (show) {
            mobileControls.classList.remove("hidden");
        } else {
            mobileControls.classList.add("hidden");
        }
    }

    /**
     * Unlocks browser audio playback after user interaction.
     *
     * Browsers prevent autoplay audio until the user interacts
     * with the page. This method enables menu music after the
     * first click.
     *
     * @returns {void}
     */
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
