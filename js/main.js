import { ImageHelper } from "./imgHelper.class.js";

let canvas;
let character = new Image();


function init () {
    canvas = document.getElementById("canvas");
    character.src = ImageHelper.PEPE.idle[0];
}

window.onload = init();