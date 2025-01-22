import { create, id, codec } from "@zos/media";

/**
 * Class representing a sound recorder.
 */
export class SoundRecorder {
  #recorder;
  #target_file;
  /**
   * Create a sound recorder.
   * @param {string} target_file - The path to save the audio.
   */
  constructor(target_file) {
    this.#recorder = create(id.RECORDER);
    this.#target_file = target_file;
    this.#recorder.setFormat(codec.OPUS, { target_file: this.#target_file });
  }

  /**
   * Start recording.
   */
  start() {
    this.#recorder.start();
  }

  /**
   * Stop recording.
   */
  stop() {
    this.#recorder.stop();
  }

  /**
   * Change the target file.
   * @param {string} target_file - The path of the new file to record.
   */
  changeFile(target_file) {
    this.#target_file = target_file;
    this.#recorder.setFormat(codec.OPUS, { target_file: this.#target_file });
  }
}