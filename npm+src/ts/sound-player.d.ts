/**
 * Class representing a sound player.
 */
export class SoundPlayer {
    /**
     * Set the log level for debugging.
     * @param {number} level - The log level (0-5, where 5 is most verbose).
     */
    static SetLogLevel(level: number): void;
    /**
     * Create a sound player.
     * @param {Object} options - Configuration options.
     * @param {string} [options.path] - The full path including a filename of the file to play.
     * @param {boolean} [options.stop_on_change] - Whether to stop current playback when changing files.
     * @param {boolean} [options.use_queue] - Whether to use the internal queue system.
     * @param {(info: PlaybackInfo) => void} [options.onComplete] - Callback function when playback completes.
     */
    constructor(options?: {
        path?: string;
        stop_on_change?: boolean;
        use_queue?: boolean;
        onComplete?: (info: PlaybackInfo) => void;
    });
    /**
     * Getters for the Sound Player.
     * @returns {GetSP_T}
     */
    get get(): any;
    /**
     * Setters for the Sound Player.
     * @returns {SetSP_T}
     */
    get set(): any;
    /**
     * Set the onComplete callback.
     * @param {(info: PlaybackInfo) => void} callback - The callback function to be called when playback completes.
     */
    onComplete(callback: (info: PlaybackInfo) => void): void;
    /**
     * Set the onFail callback.
     * @param {(info: PlaybackInfo) => void} callback - The callback function to be called when playback fails.
     */
    onFail(callback: (info: PlaybackInfo) => void): void;
    /**
     * Set a custom timeout for onFail event.
     * @param {Number} ms - The timeout in milliseconds. `default` = 3000ms.
     */
    setFailTimeout(ms: number): void;
    /**
     * Play the sound.
     * If a path is provided, it changes the file and plays it.
     * If the sound is already playing and use_queue is true, it adds the sound to the queue.
     * @param {string} [path] - Optional path to the sound file to play.
     */
    play(path?: string): void;
    /**
     * Pause the sound.
     * If the sound is playing, it pauses the sound.
     */
    pause(): void;
    /**
     * Resume the sound.
     * If the sound is paused, it resumes the sound.
     */
    resume(): void;
    /**
     * Stop the sound.
     * If the sound is playing, it stops the sound and releases the player.
     */
    stop(): void;
    /**
     * Change the sound file.
     * @param {string} path - Full path including a filename of the new file to play.
     */
    changeFile(path: string): void;
    /**
     * Destroy the player.
     * If the sound is playing, it stops the sound and removes event listeners.
     */
    destroy(): void;
    /**
     * Check if the device has a speaker and is able to play files. Execute this event when you need to know if the speaker is available. No other actions required.
     * @param {{is_available: boolean}} callback - The callback to be called with the result of the availability check.
     * @example
     * ```
     * player.isSpeakerAvailable((bool)=> {
     *   console.log("isSpeakerAvailable:", bool);
     * })
     * ```
     */
    isSpeakerAvailable(callback: {
        is_available: boolean;
    }): void;
    #private;
}
export type GetSP_T = import("./required/player-extra").GetSP_T;
export type SetSP_T = import("./required/player-extra").SetSP_T;
export type PlaybackInfo = {
    /**
     * - The filename of the played audio.
     */
    name: string;
    /**
     * - Path to the file.
     */
    path: string;
    /**
     * - Full path to the file including filename.
     */
    full_path: string;
    /**
     * - The actual duration of the playback in milliseconds.
     */
    duration: number;
};
