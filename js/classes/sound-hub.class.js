export class SoundHub {
    static CHARACTER = {
        damage: new Audio(`assets/audio/character/characterDamage.mp3`),
        dead: new Audio(`assets/audio/character/characterDead.wav`),
        jump: new Audio(`assets/audio/character/characterJump.wav`),
        run: new Audio(`assets/audio/character/characterRun.mp3`),
        snoring: new Audio(`assets/audio/character/characterSnoring.mp3`),
    };

    static CHICKEN = {
        dead1: new Audio(`assets/audio/chicken/chickenDead.mp3`),
        dead2: new Audio(`assets/audio/chicken/chickenDead2.mp3`),
        bossApproach: new Audio(`assets/audio/endboss/endbossApproach.wav`),
    };

    static COLLECTIBLES = {
        bottle: new Audio(`assets/audio/collectibles/bottleCollectSound.wav`),
        coin: new Audio(`assets/audio/collectibles/collectSound.wav`),
        bottleBreak: new Audio(`assets/audio/throwable/bottleBreak.mp3`),
    };

    static BGM = {
        menuBgm: new Audio(`assets/audio/BGM/menu-bgm.ogg`),
        levelBgm: new Audio(`assets/audio/BGM/level-bgm.mp3`),
        gameOverBgm: new Audio(`assets/audio/BGM/game-over-bgm.ogg`),
        victoryBgm: new Audio(`assets/audio/BGM/vicotry-bgm.mp3`),
    };

    static masterVolume = 0.5;

    static initSound(sound, baseVolume) {
        sound.baseVolume = baseVolume;
        sound.volume = baseVolume * this.masterVolume;
    }

    static initVolumes() {
        const savedVolume = localStorage.getItem("masterVolume");

        if (savedVolume !== null) {
            this.masterVolume = Number(savedVolume);
        }

        this.initSound(this.CHARACTER.damage, 0.2);
        this.initSound(this.CHARACTER.dead, 0.15);
        this.initSound(this.CHARACTER.jump, 0.15);
        this.initSound(this.CHARACTER.run, 0.04);
        this.initSound(this.CHARACTER.snoring, 0.12);
        this.initSound(this.CHICKEN.dead1, 0.4);
        this.initSound(this.CHICKEN.dead2, 1);
        this.initSound(this.COLLECTIBLES.bottle, 0.3);
        this.initSound(this.COLLECTIBLES.coin, 0.1);
        this.initSound(this.COLLECTIBLES.bottleBreak, 0.2);
        this.initSound(this.CHICKEN.bossApproach, 0.7);
        this.initSound(this.BGM.menuBgm, 0.1);
        this.initSound(this.BGM.levelBgm, 0.2);
        this.initSound(this.BGM.victoryBgm, 0.25);
        this.initSound(this.BGM.gameOverBgm, 0.6);+
        this.updateSounds();
    }

    static get allSounds() {
        return [
            ...Object.values(SoundHub.CHARACTER),
            ...Object.values(SoundHub.CHICKEN),
            ...Object.values(SoundHub.COLLECTIBLES),
            ...Object.values(SoundHub.BGM),
        ];
    }

    static playOne(sound) {
        if (!this.isMuted) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    static pauseAll() {
        SoundHub.allSounds.forEach((sound) => {
            sound.pause();
        });
    }

    static pauseOne(sound) {
        sound.pause();
    }

    static playLoop(sound) {
        sound.loop = true;
        sound.muted = this.isMuted;

        if (sound.paused) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    static stopLoop(sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    static isMuted = localStorage.getItem("soundMuted") === "true";

    static toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem("soundMuted", this.isMuted);
        this.updateSounds();
    }

    static updateSounds() {
        this.allSounds.forEach((sound) => {
            sound.muted = this.isMuted;
        });
    }

    static setMasterVolume(volume) {
        this.masterVolume = volume;

        this.allSounds.forEach((sound) => {
            sound.volume = sound.baseVolume * this.masterVolume;
        });

        localStorage.setItem("masterVolume", volume);
    }
}
