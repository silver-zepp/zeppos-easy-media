/**
 * Class representing a sound recorder.
 */
export class SoundRecorder {
    /**
     * Create a sound recorder.
     * @param {string} target_file - The path to save the audio.
     */
    constructor(target_file: string);
    /**
     * Start recording.
     */
    start(): void;
    /**
     * Stop recording.
     */
    stop(): void;
    /**
     * Change the target file.
     * @param {string} target_file - The path of the new file to record.
     */
    changeFile(target_file: string): void;
    #private;
}
