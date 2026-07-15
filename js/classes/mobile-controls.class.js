export class MobileControls {
    constructor(keyboard) {
        this.keyboard = keyboard;

        this.left = document.getElementById("leftBtn");
        this.right = document.getElementById("rightBtn");
        this.jump = document.getElementById("jumpBtn");
        this.throw = document.getElementById("throwBtn");
        if (!this.left || !this.right || !this.jump || !this.throw) {
            return;
        }
        this.registerEvents();
    }

    registerEvents() {
        this.addButtonEvents(this.left, "LEFT");

        this.addButtonEvents(this.right, "RIGHT");

        this.addButtonEvents(this.jump, "UP");

        this.addButtonEvents(this.throw, "E");
    }

    addButtonEvents(button, key) {
        button.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.keyboard[key] = true;
        });

        button.addEventListener("touchend", () => {
            this.keyboard[key] = false;
        });

        button.addEventListener("touchcancel", () => {
            this.keyboard[key] = false;
        });

        button.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    }
}
