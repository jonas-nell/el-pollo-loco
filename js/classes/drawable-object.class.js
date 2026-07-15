/**
 * Base class for all drawable game objects.
 *
 * Provides common functionality for loading images, storing image animations,
 * and rendering objects onto the canvas.
 *
 * @class DrawableObject
 */
export class DrawableObject {
    /**
     * Currently displayed image of the object.
     * @type {HTMLImageElement}
     */
    img;

    /**
     * Stores loaded images to avoid creating new image objects repeatedly.
     * Used for animation image sequences.
     * @type {Object.<string, HTMLImageElement>}
     */
    imageCache = {};

    /**
     * Index of the currently displayed image in an animation sequence.
     * @type {number}
     */
    currentImage = 0;

    /**
     * Index of the currently displayed image in a one-time animation sequence.
     * Reset after the animation finishes.
     * @type {number}
     */
    currentImageOnce = 0;

    /**
     * Horizontal position of the object on the canvas.
     * @type {number}
     */
    x = 120;

    /**
     * Vertical position of the object on the canvas.
     * @type {number}
     */
    y = 280;

    /**
     * Height of the object in pixels.
     * @type {number}
     */
    height = 150;

    /**
     * Width of the object in pixels.
     * @type {number}
     */
    width = 100;


    /**
     * Loads a single image and assigns it as the object's current image.
     *
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    /**
     * Draws the object on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    /**
     * Loads multiple images into the image cache.
     *
     * Cached images can later be accessed by their file path
     * to efficiently display animations.
     *
     * @param {string[]} arr - Array of image paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}