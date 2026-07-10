import { Cloud } from "../../classes/cloud.class.js";

export function generateClouds(segmentCount){

    let clouds = [];

    for (let i = 0; i < segmentCount; i++){
        let cloud = new Cloud();
        cloud.x += i * 719;
        clouds.push(cloud);
    }

    return clouds;
}