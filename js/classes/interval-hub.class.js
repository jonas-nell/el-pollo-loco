/**
 * Utility class for managing all active intervals in the game.
 *
 * Stores references to created intervals so they can be stopped individually
 * or all at once. This prevents intervals from continuing to run after
 * restarting or ending the game.
 *
 * 
 */
export class IntervalHub {
    /**
     * Stores all currently active interval IDs.
     *
     * @type {number[]}
     */
    static allIntervals = [];


    /**
     * Creates a new interval and stores its reference.
     *
     * @param {Function} func - Function executed repeatedly by the interval.
     * @param {number} timer - Delay between executions in milliseconds.
     * @returns {number} The created interval ID.
     */
    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.allIntervals.push(newInterval);
        return newInterval;
    }


    /**
     * Stops a specific interval and removes it from the interval registry.
     *
     * @param {number} interval - Interval ID returned by startInterval().
     */
    static stopInterval(interval) {
        clearInterval(interval);
        IntervalHub.allIntervals = IntervalHub.allIntervals.filter(
            (id) => id !== interval,
        );
    }


    /**
     * Stops and removes all currently active intervals.
     *
     * Used when restarting or ending the game to prevent old game logic
     * from continuing in the background.
     */
    static stopAllIntervals() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}