/**
 * Central audio management system for the game.
 *
 * Handles:
 * - sound effect storage
 * - background music
 * - playback control
 * - mute functionality
 * - master volume settings
 * - persistent audio preferences
 *
 * Uses static methods and properties because only one
 * global audio controller is required.
 *
 * 
 */
export class SoundHub {
    /**
     * Audio effects related to the player character.
     *
     * @type {Object}
     */
    static CHARACTER = {
        damage: new Audio(`assets/audio/character/characterDamage.mp3`),
        dead: new Audio(`assets/audio/character/characterDead.wav`),
        jump: new Audio(`assets/audio/character/characterJump.wav`),
        run: new Audio(`assets/audio/character/characterRun.mp3`),
        snoring: new Audio(`assets/audio/character/characterSnoring.mp3`),
    };

    /**
     * Audio effects related to enemies and boss events.
     *
     * @type {Object}
     */
    static CHICKEN = {
        dead1: new Audio(`assets/audio/chicken/chickenDead.mp3`),
        dead2: new Audio(`assets/audio/chicken/chickenDead2.mp3`),
        bossApproach: new Audio(`assets/audio/endboss/endbossApproach.wav`),
    };
    /**
     * Audio effects for collectibles and throwable objects.
     *
     * @type {Object}
     */
    static COLLECTIBLES = {
        bottle: new Audio(`assets/audio/collectibles/bottleCollectSound.wav`),
        coin: new Audio(`assets/audio/collectibles/collectSound.wav`),
        bottleBreak: new Audio(`assets/audio/throwable/bottleBreak.mp3`),
    };
    /**
     * Background music tracks used for different game states.
     *
     * Includes:
     * - menu music
     * - gameplay music
     * - victory music
     * - game over music
     *
     * @type {Object}
     */
    static BGM = {
        menuBgm: new Audio(`assets/audio/BGM/menu-bgm.ogg`),
        levelBgm: new Audio(`assets/audio/BGM/level-bgm.mp3`),
        gameOverBgm: new Audio(`assets/audio/BGM/game-over-bgm.ogg`),
        victoryBgm: new Audio(`assets/audio/BGM/vicotry-bgm.mp3`),
    };

    /**
     * Global volume multiplier applied to all sounds.
     *
     * Value range:
     * 0 = muted
     * 1 = full volume
     *
     * @type {number}
     */
    static masterVolume = 0.5;

    /**
     * Initializes an audio object with a base volume.
     *
     * The final volume is calculated using the base volume
     * multiplied by the current master volume.
     *
     * @param {HTMLAudioElement} sound - Audio object.
     * @param {number} baseVolume - Default volume level.
     *
     * @returns {void}
     */
    static initSound(sound, baseVolume) {
        sound.baseVolume = baseVolume;
        sound.volume = baseVolume * this.masterVolume;
    }

    /**
     * Initializes all game sounds.
     *
     * Loads saved volume preferences from localStorage,
     * assigns base volumes to every sound and updates
     * their current state.
     *
     * @returns {void}
     */
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
        this.initSound(this.BGM.gameOverBgm, 0.6);
        this.updateSounds();
    }

    /**
     * Returns all registered audio objects.
     *
     * Used for applying global operations such as:
     * - mute
     * - volume changes
     * - pausing all sounds
     *
     * @returns {HTMLAudioElement[]}
     */
    static get allSounds() {
        return [
            ...Object.values(SoundHub.CHARACTER),
            ...Object.values(SoundHub.CHICKEN),
            ...Object.values(SoundHub.COLLECTIBLES),
            ...Object.values(SoundHub.BGM),
        ];
    }

    /**
     * Plays a sound effect once.
     *
     * Restarts the audio from the beginning before playing.
     * Does not play sounds while muted.
     *
     * @param {HTMLAudioElement} sound - Sound to play.
     *
     * @returns {void}
     */
    static playOne(sound) {
        if (!this.isMuted) {
            sound.currentTime = 0;
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        }
    }

    /**
     * Pauses every registered sound.
     *
     * @returns {void}
     */
    static pauseAll() {
        SoundHub.allSounds.forEach((sound) => {
            sound.pause();
        });
    }

    /**
     * Pauses a specific sound.
     *
     * @param {HTMLAudioElement} sound - Sound to pause.
     *
     * @returns {void}
     */
    static pauseOne(sound) {
        sound.pause();
    }

    /**
     * Starts looping playback of an audio track.
     *
     * Used mainly for background music and continuous
     * character sounds.
     *
     * @param {HTMLAudioElement} sound - Sound to loop.
     *
     * @returns {void}
     */
    static playLoop(sound) {
        sound.loop = true;
        sound.muted = this.isMuted;

        if (sound.paused) {
            sound.currentTime = 0;
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        }
    }

    /**
     * Stops a looping sound and resets playback position.
     *
     * @param {HTMLAudioElement} sound - Sound to stop.
     *
     * @returns {void}
     */
    static stopLoop(sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    /**
     * Stores the current mute state.
     *
     * The value is persisted in localStorage.
     *
     * @type {boolean}
     */
    static isMuted = localStorage.getItem("soundMuted") === "true";

    /**
     * Toggles global mute state.
     *
     * Saves the preference and updates all sounds.
     *
     * @returns {void}
     */
    static toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem("soundMuted", this.isMuted);
        this.updateSounds();
    }

    /**
     * Applies the current mute state to all sounds.
     *
     * @returns {void}
     */
    static updateSounds() {
        this.allSounds.forEach((sound) => {
            sound.muted = this.isMuted;
        });
    }

    /**
     * Updates the global volume level.
     *
     * Applies the new multiplier to every registered
     * sound and stores the setting locally.
     *
     * @param {number} volume - New master volume value.
     *
     * @returns {void}
     */
    static setMasterVolume(volume) {
        this.masterVolume = volume;

        this.allSounds.forEach((sound) => {
            sound.volume = sound.baseVolume * this.masterVolume;
        });

        localStorage.setItem("masterVolume", volume);
    }
}
