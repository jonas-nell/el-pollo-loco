import { Bottle } from "../../classes/bottle.class.js";

export function generateBottles(segmentCount){
    let bottles = [];
    const SEGMENT_WIDTH = 719;

    for(let i = 0; i < segmentCount; i++){
        let segmentStart = i * SEGMENT_WIDTH;
        bottles.push(
            new Bottle(segmentStart + 250, 360),
            new Bottle(segmentStart + 650, 360)
        );
    }
    
    return bottles;
}