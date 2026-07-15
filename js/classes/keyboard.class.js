
 
/**
 * Handles keyboard input for the game.
 *
 * Stores the current state of supported keyboard controls.
 * Other game classes can read these states to react to
 * player input.
 *
 * Supported controls:
 * - Arrow keys / WASD for movement
 * - Space for jumping
 * - E for throwing bottles
 *
 * @class Keyboard
 */
export class Keyboard {


    /**
     * Indicates whether the left movement key is pressed.
     *
     * @type {boolean}
     */
    LEFT = false;


    /**
     * Indicates whether the right movement key is pressed.
     *
     * @type {boolean}
     */
    RIGHT = false;


    /**
     * Indicates whether the jump key is pressed.
     *
     * @type {boolean}
     */
    UP = false;


    /**
     * Indicates whether the down key is pressed.
     *
     * @type {boolean}
     */
    DOWN = false;


    /**
     * Indicates whether the space key is pressed.
     *
     * @type {boolean}
     */
    SPACE = false;


    /**
     * Indicates whether the throw action key is pressed.
     *
     * @type {boolean}
     */
    E = false;


    /**
     * Creates a keyboard controller.
     *
     * Registers keyboard event listeners immediately.
     */
    constructor() {
        this.registerKeyboardEvents();
    }


    /**
     * Registers keyboard press and release events.
     *
     * Updates the corresponding state properties when
     * supported keys are pressed or released.
     *
     * @returns {void}
     */
    registerKeyboardEvents() {


        window.addEventListener(
            "keydown",
            (e) => {

                if (
                    e.code === "ArrowRight" ||
                    e.code === "KeyD"
                ) {
                    this.RIGHT = true;
                }


                if (
                    e.code === "ArrowLeft" ||
                    e.code === "KeyA"
                ) {
                    this.LEFT = true;
                }


                if (
                    e.code === "ArrowUp" ||
                    e.code === "KeyW"
                ) {
                    this.UP = true;
                }


                if (
                    e.code === "ArrowDown" ||
                    e.code === "KeyS"
                ) {
                    this.DOWN = true;
                }


                if (e.code === "Space") {
                    this.SPACE = true;
                }


                if (e.code === "KeyE") {
                    this.E = true;
                }

            },
        );


        window.addEventListener(
            "keyup",
            (e) => {

                if (
                    e.code === "ArrowRight" ||
                    e.code === "KeyD"
                ) {
                    this.RIGHT = false;
                }


                if (
                    e.code === "ArrowLeft" ||
                    e.code === "KeyA"
                ) {
                    this.LEFT = false;
                }


                if (
                    e.code === "ArrowUp" ||
                    e.code === "KeyW"
                ) {
                    this.UP = false;
                }


                if (
                    e.code === "ArrowDown" ||
                    e.code === "KeyS"
                ) {
                    this.DOWN = false;
                }


                if (e.code === "Space") {
                    this.SPACE = false;
                }


                if (e.code === "KeyE") {
                    this.E = false;
                }

            },
        );
    }
}