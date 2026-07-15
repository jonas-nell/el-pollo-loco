
import { Game } from "./classes/game-manager.class.js";


/**
 * Main game instance.
 *
 * Stores the active Game object after initialization.
 *
 * @type {Game}
 */
let game;


/**
 * Initializes the game after the page has fully loaded.
 *
 * Creates the main Game instance which handles:
 * - game state management
 * - UI initialization
 * - input handling
 * - level creation
 * - audio setup
 */
window.onload = () => {
    game = new Game();
};