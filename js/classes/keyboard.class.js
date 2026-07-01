export class Keyboard {
    static LEFT = false;
    static RIGHT = false;
    static UP = false;
    static DOWN = false;
    static SPACE = false;

    constructor() {
        this.registerKeyboardEvents();
    }

    registerKeyboardEvents() {
        window.addEventListener("keydown", (e) => {
            if (e.code === "ArrowRight" || e.code == "KeyD") {
                this.RIGHT = true;
            }

            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                this.LEFT = true;
            }

            if (e.code === "ArrowUp" || e.code === "KeyW") {
                this.UP = true;
            }

            if (e.code === "ArrowDown" || e.code === "KeyS") {
                this.DOWN = true;
            }

            if (e.code === " ") {
                this.SPACE = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                this.RIGHT = false;
            }

            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                this.LEFT = false;
            }

            if (e.code === "ArrowUp" || e.code === "KeyW") {
                this.UP = false;
            }

            if (e.code === "ArrowDown" || e.code === "KeyS") {
                this.DOWN = false;
            }

            if (e.code === " ") {
                this.SPACE = false;
            }
        });
    }
}
