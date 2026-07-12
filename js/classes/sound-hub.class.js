export class SoundHub {
    static CHARACTER = {
        damage: new Audio(`assets/audio/character/characterDamage.mp3`),
        dead: new Audio(`assets/audio/character/characterDead.wav`),
        jump: new Audio(`assets/audio/character/characterJump.wav`),
        run: new Audio(`assets/audio/character/characterRun.mp3`),
        snoring: new Audio(`assets/audio/character/characterSnoring.mp3`)
    }
    
    static CHICKEN ={
        dead1: new Audio(`assets/audio/chicken/chickenDead.mp3`),
        dead2: new Audio(`assets/audio/chicken/chickenDead2.mp3`)
    }

    static COLLECTIBLES = {
        bottle: new Audio(`assets/audio/collectibles/bottleCollectSound.wav`),
        coin: new Audio(`assets/audio/collectibles/collectSound.wav`)
    }

    static initVolumes(){
        SoundHub.CHARACTER.damage.volume = 0.2;
        SoundHub.CHARACTER.dead.volume = 0.2;
        SoundHub.CHARACTER.jump.volume = 0.15;
        SoundHub.CHARACTER.run.volume = 0.04;
        SoundHub.CHARACTER.snoring.volume = 0.12;
    }


    static get allSounds() {
        return[
            ...Object.values(SoundHub.CHARACTER),
            ...Object.values(SoundHub.CHICKEN),
            ...Object.values(SoundHub.COLLECTIBLES),
        ];
    }

    static playOne(sound){
        sound.currentTime = 0;
        sound.play();
    }

    static pauseAll() {
        SoundHub.allSounds.forEach(sound => {
            sound.pause();
        });
    }

    static pauseOne(sound){
        sound.pause();
    }

    static playLoop(sound){
        sound.loop = true;

        if (sound.paused){
            sound.currentTime = 0;
            sound.play();
        }
    }

    static stopLoop(sound){
        sound.pause();
        sound.currentTime = 0;
    }
}