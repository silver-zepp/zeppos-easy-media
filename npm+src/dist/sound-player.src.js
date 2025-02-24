/** @about Easy Media 1.1.4 @min_zeppos 3.0 @author: Silver, Zepp Health. @license: MIT */
import { create, id } from "@zos/media";
import { openSync, writeSync, closeSync, statSync, O_RDWR, O_CREAT, O_TRUNC } from "@zos/fs";
import { debugLog, QuickJS, setDebugLevel, TimeIt } from "./required/helpers";
import { __SPExtra } from "./required/player-extra";
import { MINI_MP3 } from "./required/mini-mp3";


/** @typedef {import('./required/player-extra').GetSP_T} GetSP_T */
/** @typedef {import('./required/player-extra').SetSP_T} SetSP_T */

/**
 * @typedef {Object} PlaybackInfo
 * @property {string} name - The filename of the played audio.
 * @property {string} path - Path to the file.
 * @property {string} full_path - Full path to the file including filename.
 * @property {number} duration - The actual duration of the playback in milliseconds.
 */

const ERR = {
  ONLY_ONE_INST: "Only 1 instance is supported. Returning existing instance.",
}

/**
 * Class representing a sound player.
 */
export class SoundPlayer {
  #instance = null;

  #player;
  #file_info = { full_path: "", path: "", name: "" };
  #is_playing;
  #play_start_time;
  #auto_destroy;
  
  #get;
  #set;
  
  #cb_prepare = null;
  #cb_complete = null;
  #cb_on_complete = null;
  #cb_on_fail = null;

  #play_timeout = null;
  #play_timeout_duration = 3000;

  #use_queue;
  #queue_arr = [];

  /**
   * Getters for the Sound Player.
   * @returns {GetSP_T}
   */
  get get() { return this.#get };

  /**
   * Setters for the Sound Player.
   * @returns {SetSP_T}
   */
  get set() { return this.#set };

  /**
   * Create a sound player.
   * @param {Object} options - Configuration options.
   * @param {string} [options.path] - The full path including a filename of the file to play.
   * @param {boolean} [options.stop_on_change] - Whether to stop current playback when changing files.
   * @param {boolean} [options.use_queue] - Whether to use the internal queue system.
   * @param {(info: PlaybackInfo) => void} [options.onComplete] - Callback function when playback completes.
   */
  constructor(options = {}) {
    if (this.#instance) {
      debugLog(1, ERR.ONLY_ONE_INST);
      return this.#instance;
    }

    TimeIt(3, () => {

      const { path, stop_on_change, use_queue, onComplete } = options;
      this.#player = create(id.PLAYER);
      this.#auto_destroy = stop_on_change ?? false;
      this.#is_playing = false;
      this.#cb_on_complete = onComplete ?? null;
      this.#use_queue = use_queue ?? true; // queue is enabled by default

      this.#get = new __SPExtra.Get(this.#player, () => this.#is_playing);
      this.#set = new __SPExtra.Set(this.#player, this);

      this.#setupEventListeners();

      if (path) {
        this.#updateFileInfo(path);
        this.#player.setSource(this.#player.source.FILE, { file: path });
      }

      this.#instance = this;

    });
  }

  /**
   * Set the onComplete callback.
   * @param {(info: PlaybackInfo) => void} callback - The callback function to be called when playback completes.
   */
  onComplete(callback) {
    this.#cb_on_complete = callback;
  }

  /**
   * Set the onFail callback.
   * @param {(info: PlaybackInfo) => void} callback - The callback function to be called when playback fails.
   */
  onFail(callback) {
    this.#cb_on_fail = callback;
  }

  /**
   * Set a custom timeout for onFail event.
   * @param {Number} ms - The timeout in milliseconds. `default` = 3000ms.
   */
  setFailTimeout(ms) {
    if (ms < 0) {
      debugLog(1, "Timeout can't be a negative number.");
      return;
    }
    this.#play_timeout_duration = ms;
  }

  /**
   * Play the sound.
   * If a path is provided, it changes the file and plays it.
   * If the sound is already playing and use_queue is true, it adds the sound to the queue.
   * @param {string} [path] - Optional path to the sound file to play.
   */
  play(path) {
    TimeIt(3, () => {

      this.#resetPlaybackMonitor();

      if (path) {
        this.changeFile(path);
      }

      const fp = this.#file_info.full_path;

      if (!fp) {
        debugLog(1, "No file set. Can't play.");
        return;
      }

      if (this.#is_playing && this.#use_queue) {
        this.#queue_arr.push(path || fp);
        debugLog(4, `Added to queue: ${path || fp}`);
        return;
      }

      if (this.#is_playing && this.#auto_destroy) {
        this.stop();
      }

      this.#is_playing = true;
      this.#play_start_time = QuickJS.now();

      this.#player.setSource(this.#player.source.FILE, { file: fp });
      this.#player.prepare();

    })
  }

  /**
   * Pause the sound.
   * If the sound is playing, it pauses the sound.
   */
  pause() {
    debugLog(3);
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
    debugLog(3);
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
    TimeIt(3, () => {

      if (this.#is_playing) {
        this.#player.stop();
        this.#player.release();
      }
      
      this.#is_playing = false;

    });
  }

  /**
   * Change the sound file.
   * @param {string} path - Full path including a filename of the new file to play.
   */
  changeFile(path) {
    TimeIt(3, `New file: ${path}`, () => {

      this.#resetPlaybackMonitor();

      if (this.#is_playing && this.#auto_destroy) {
        this.stop();
      }
      this.#updateFileInfo(path);

    });
  }

  /**
   * Destroy the player.
   * If the sound is playing, it stops the sound and removes event listeners.
   */
  destroy() {
    TimeIt(3, () => {

      if (this.#is_playing) {
        this.stop();
      }

      if (this.#player) {
        // evl workaround
        this.#player.addEventListener(this.#player.event.PREPARE, QuickJS.noop());
        this.#player.addEventListener(this.#player.event.COMPLETE, QuickJS.noop());
        this.#cb_prepare = null;
        this.#cb_complete = null;

        this.#resetPlaybackMonitor();

        this.#player = null;
      }

    });
  }

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
  isSpeakerAvailable(callback) {
    TimeIt(3, () => {

      const fp = "data://em_speaker_test.mp3";
    
      try {
        const stat = statSync({
          path: fp
        });
        
        if (stat && stat.size === MINI_MP3.length) {
          this.#playTestFile(callback, fp);
          return;
        }
    
        let fd = openSync({
          path: fp,
          flag: O_RDWR | O_CREAT | O_TRUNC, // create or overwrite
        });
    
        writeSync({
          fd,
          buffer: MINI_MP3.buffer,
        });
    
        closeSync(fd);
    
        this.#playTestFile(callback, fp);
      } catch (error) {
        debugLog(1, "Error in isSpeakerAvailable:", error);
        callback(false);
      }

    });
  }

  #setupEventListeners() {
    this.#cb_prepare = (result) => {
      debugLog(3, `(event) PREPARE. Result: ${result}`);
      if (result) {
        this.#player.start();
        // playback timeout monitor
        this.#setupFailMonitor();
      } else {
        debugLog(1, "(event) PREPARE. ERR: Releasing resources!");
        this.#player.release();

        this.#resetPlaybackMonitor();
        if (this.#cb_on_fail) {
          const info = this.#getPlaybackInfo();
          this.#cb_on_fail(info);
        }
      }
    };

    this.#cb_complete = () => {
      debugLog(3, "(event) COMPLETE");

      this.#resetPlaybackMonitor();

      /** @type {PlaybackInfo} */
      const info = this.#getPlaybackInfo(true);
      
      this.stop();

      if (this.#cb_on_complete) this.#cb_on_complete(info);
      if (this.#use_queue) this.#queuePlayNext();
    };

    this.#player.addEventListener(this.#player.event.PREPARE, this.#cb_prepare);
    this.#player.addEventListener(this.#player.event.COMPLETE, this.#cb_complete);
  }

  #setupFailMonitor() {
    if (this.#cb_on_fail) {
      const duration = this.get.duration();
      const dur = (duration * 1000) + this.#play_timeout_duration;
      
      this.#play_timeout = setTimeout(() => {
        if (this.#is_playing) {
          const info = this.#getPlaybackInfo();
          this.#cb_on_fail(info);
        } 
      }, dur);
    }
  }

  #playTestFile(cb, fp) {
    const _cb_on_complete = this.#cb_on_complete;
    const _cb_on_fail = this.#cb_on_fail;
  
    this.onComplete(() => {
      this.#cb_on_complete = _cb_on_complete;
      this.#cb_on_fail = _cb_on_fail;
      cb(true);
    });
  
    this.onFail(() => {
      this.#cb_on_complete = _cb_on_complete;
      this.#cb_on_fail = _cb_on_fail;
      cb(false);
    });
  
    this.play(fp);
  }

  #queuePlayNext() {
    if (this.#queue_arr.length > 0) {
      const next = this.#queue_arr.shift();
      this.play(next);
      debugLog(3, `Playing from queue: ${next}`);
    }
  }

  #updateFileInfo(full_path) {
    const last = full_path.lastIndexOf('/');
    this.#file_info.full_path = full_path;
    this.#file_info.path = last === -1 ? '' : full_path.slice(0, last + 1);
    this.#file_info.name = last === -1 ? full_path : full_path.slice(last + 1);
  }

  #getPlaybackInfo(precise = false) {
    const info = {
      full_path: this.#file_info.full_path,
      path: this.#file_info.path,
      name: this.#file_info.name,
    };

    if (precise && this.#play_start_time) {
      info.duration = QuickJS.now() - this.#play_start_time;
    } else {
      info.duration = this.get.duration() * 1000; // in ms for consistency
    }

    return info;
  }

  #resetPlaybackMonitor() {
    debugLog(3);
    if (this.#play_timeout) {
      clearTimeout(this.#play_timeout);
      this.#play_timeout = null;
    }
  }

  /**
   * Set the log level for debugging.
   * @param {number} level - The log level (0-5, where 5 is most verbose).
   */
  static SetLogLevel(level) {
    setDebugLevel(level);
    debugLog(1, `Log level set to ${level}`);
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
 * 1.0.4
 * - @fix sound wasn't playing after the first play
 * 1.0.5
 * - @add play(path), optional param to directly play a file
 * 1.1.0
 * - @add queue to sequentially play multiple files - SoundPlayer({ use_queue: true })
 * - @fix destroy() method callbacks (workaround)
 * - @upd player.get.property changed from "properties" to "getters()" to avoid confusion
 * - @add detailed library logging
 * - @add setter SoundPlayer.SetLogLevel(3) // see most logs
 * - @upd all params to SoundPlayer are now optional. ie SoundPlayer({ path: my_file })
 * - @add player.get.statusName() -> IDLE, INITIALIZED, PREPARING, PREPARED, STARTED, PAUSED
 * - @add more getters in the Get subclass: .isPlaying(), .isPaused(), .isStopped()
 * 1.1.1
 * - @add player.onFail((info) => { ... }) callback that is used when failback fails for whichever reason
 * 1.1.2
 * - @add player.setFailTimeout(int), by default the onFail has a 3000 timeout, you can modify it with this method
 * 1.1.4
 * - @add isSpeakerAvailable((is_available)=> {...}) an event type checker to see if the device has a speaker
 * - @fix onFail() event for files with a longer duration than the fail timeout
 */