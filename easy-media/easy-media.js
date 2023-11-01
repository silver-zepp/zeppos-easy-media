/** @about Easy Media 1.0.3 @min_zeppos 3.0 @author: Silver, Zepp Health. @license: MIT */
import { create, id, codec } from "@zos/media";

/**
 * Class representing a sound player.
 */
export class SoundPlayer {
  #player;
  #filename;
  #is_playing;
  #auto_destroy;

  /**
   * Sound Player Getters.
   */
  get;

  /**
   * Sound Player Setters.
   */
  set;

  /**
   * Create a sound player.
   * @param {string} filename - The name of the file to play.
   * @param {boolean} stop_on_change - Whether to stop playback when changing files.
   */
  constructor(filename, stop_on_change = false) {
    this.#player = create(id.PLAYER);
    this.#filename = filename;
    this.#auto_destroy = stop_on_change;
    this.#player.setSource(this.#player.source.FILE, { file: this.#filename });
    this.#is_playing = false;

    this.get = new Get(this.#player);
    this.set = new Set(this.#player);

    this.#player.addEventListener(this.#player.event.PREPARE, (result) => {
      if (result) {
        this.#player.start();
      } else {
        this.destroy();
      }
    });

    this.#player.addEventListener(this.#player.event.COMPLETE, () => {
      this.stop();
    });
  }

  /**
   * Play the sound.
   * If the sound is already playing, it stops and prepares the sound again.
   */
  play() {
    if (this.#is_playing && this.#auto_destroy) {
      this.stop();
    }
    this.#is_playing = true;
    this.#player.prepare();
  }

  /**
   * Pause the sound.
   * If the sound is playing, it pauses the sound.
   */
  pause() {
    if (this.#is_playing) {
      this.#player.pause();
      this.#is_playing = false;
    }
  }

  /**
   * Resume the sound.
   * If the sound is paused, it resumes the sound.
   */
  resume() {
    if (!this.#is_playing) {
      this.#player.resume();
      this.#is_playing = true;
    }
  }

  /**
   * Stop the sound.
   * If the sound is playing, it stops the sound and releases the player.
   */
  stop() {
    if (this.#is_playing) {
      this.#player.stop();
      this.#player.release();
      this.#is_playing = false;
    }
  }

  /**
   * Change the sound file.
   * @param {string} filename - The name of the new file to play.
   */
  changeFile(filename) {
    if (this.#is_playing && this.#auto_destroy) {
      this.stop();
    }
    this.#filename = filename;
    this.#player.setSource(this.#player.source.FILE, { file: this.#filename });
  }

  /**
   * Destroy the player.
   * If the sound is playing, it stops the sound and removes event listeners.
   */
  destroy() {
    if (this.#is_playing) {
      this.stop();
    }
    this.#player.removeEventListener(this.#player.event.PREPARE);
    this.#player.removeEventListener(this.#player.event.COMPLETE);
  }
}

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

class Get {
  #player;

  constructor(player) {
    this.#player = player;
  }

  /**
   * Get the current playback volume.
   * @returns {number} The current volume.
   */
  get volume() {
    return this.#player.getVolume();
  }

  /**
   * Get the total duration of the currently playing media file.
   * @returns {number} The total duration in seconds.
   */
  get duration() {
    return this.#player.getDuration();
  }

  /**
   * Get the title of the currently playing media file.
   * @returns {string | undefined} The title of the file.
   */
  get title() {
    return this.#player.getTitle();
  }

  /**
   * Get the artist of the currently playing media file.
   * @returns {string | undefined} The artist of the file.
   */
  get artist() {
    return this.#player.getArtist();
  }

  /**
   * Get the media info of the currently playing media file.
   * @returns {MediaInfo} The media info of the file.
   */
  get mediaInfo() {
    return this.#player.getMediaInfo();
  }

  /**
   * Get the current status of the player.
   * @returns {number} The current status.
   */
  get status() {
    return this.#player.getStatus();
  }
}

class Set {
  #player;

  constructor(player) {
    this.#player = player;
  }

  /**
   * Set the playback volume.
   * @param {number} vol - The new volume.
   * @returns {boolean} Whether the setting was successful.
   */
  set volume(vol) {
    return this.#player.setVolume(vol);
  }
}

/**
 * @changelog
 * 1.0.0
 * - initial release
 * 1.0.2
 * - @add pause and resume methods
 * 1.0.3
 * - @add setters and getters
 */