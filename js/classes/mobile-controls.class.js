
 
/**
 * Handles touch controls for mobile devices.
 *
 * Maps touch interactions from mobile control buttons
 * to the existing Keyboard input system so the game can
 * use the same control logic on desktop and mobile.
 *
 * 
 */
export class MobileControls {


    /**
     * Creates mobile control handlers.
     *
     * Finds the mobile control buttons and registers
     * touch events if all required elements exist.
     *
     * @param {Keyboard} keyboard - Keyboard state object
     * used by the game input system.
     */
    constructor(keyboard) {

        this.keyboard = keyboard;


        this.left =
            document.getElementById("leftBtn");

        this.right =
            document.getElementById("rightBtn");

        this.jump =
            document.getElementById("jumpBtn");

        this.throw =
            document.getElementById("throwBtn");


        /*
         * Mobile controls are optional.
         * If the buttons are not available, no events
         * are registered.
         */
        if (
            !this.left ||
            !this.right ||
            !this.jump ||
            !this.throw
        ) {
            return;
        }


        this.registerEvents();
    }


    /**
     * Registers touch events for all mobile buttons.
     *
     * Connects each button with the matching keyboard
     * state property.
     *
     * @returns {void}
     */
    registerEvents() {

        this.addButtonEvents(
            this.left,
            "LEFT",
        );


        this.addButtonEvents(
            this.right,
            "RIGHT",
        );


        this.addButtonEvents(
            this.jump,
            "UP",
        );


        this.addButtonEvents(
            this.throw,
            "E",
        );
    }


    /**
     * Adds touch interaction to a control button.
     *
     * Sets the corresponding keyboard state to true
     * while the button is pressed and resets it when
     * the touch ends or is cancelled.
     *
     * @param {HTMLElement} button - Control button element.
     * @param {string} key - Keyboard state property to modify.
     *
     * @returns {void}
     */
    addButtonEvents(button, key) {

        button.addEventListener(
            "touchstart",
            (e) => {
                e.preventDefault();
                this.keyboard[key] = true;
            },
        );


        button.addEventListener(
            "touchend",
            () => {
                this.keyboard[key] = false;
            },
        );


        button.addEventListener(
            "touchcancel",
            () => {
                this.keyboard[key] = false;
            },
        );


        button.addEventListener(
            "contextmenu",
            (e) => {
                e.preventDefault();
            },
        );
    }
}