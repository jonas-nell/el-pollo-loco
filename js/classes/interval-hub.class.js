export class IntervalHub {
    static allIntervals = [];

    static startInterval(func, timer){
        const newInterval = setInterval(func, timer);
        IntervalHub.allIntervals.push(newInterval);
        return newInterval;
    }

    static stopInterval(interval){
        clearInterval(interval);
        IntervalHub.allIntervals = IntervalHub.allIntervals.filter(id => id !== interval);
    }

    static stopAllIntervals(){
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}