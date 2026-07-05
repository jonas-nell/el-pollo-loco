import { Character } from "./classes/character.class.js";
import { ImageHelper } from "./classes/imgHelper.class.js";
import { Keyboard } from "./classes/keyboard.class.js";
import { MovableObject } from "./classes/movableObject.class.js";
import { World } from "./classes/world.class.js";

let world;
let keyboard = new Keyboard();

function init() {
    const canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);

    console.log("my character is", world.character);
}

window.onload = init;
