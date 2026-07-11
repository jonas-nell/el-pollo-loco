import { Character } from "./classes/character.class.js";
import { ImageHelper } from "./classes/imgHelper.class.js";
import { Keyboard } from "./classes/keyboard.class.js";
import { MovableObject } from "./classes/movableObject.class.js";
import { World } from "./classes/world.class.js";

let world;
let keyboard = new Keyboard();

function init() {
    const playButton = document.getElementById("playButton");
    playButton.addEventListener("click", startGame);
}

function startGame(){
    document.getElementById("startScreen").classList.add("d-none");
    document.getElementById("canvas").classList.remove("d-none");

    const canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

window.onload = init;

