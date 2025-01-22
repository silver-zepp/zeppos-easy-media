/**
 * @typedef {Object} GetSP_T
 * @property {() => number} volume - Get the current playback volume.
 * @property {() => number} duration - Get the total duration of the currently playing media file.
 * @property {() => string} title - Get the title of the currently playing media file.
 * @property {() => string} artist - Get the artist of the currently playing media file.
 * @property {() => Object} mediaInfo - Get the media info of the currently playing media file.
 * @property {() => number} status - Get the current status of the player.
 * @property {() => string} statusName - Get the current status name of the player.
 * @property {() => boolean} isPlaying - Check if the player is currently playing.
 * @property {() => boolean} isPaused - Check if the player is currently paused.
 * @property {() => boolean} isStopped - Check if the player is currently stopped or idle.
 */

/**
 * @typedef {Object} SetSP_T
 * @property {(vol: number) => boolean} volume - Set the playback volume.
 */

/**
 * Class representing getter methods for Sound Player.
 */
class Get {
  #player;
  #get_IsPlaying;
  #status_ids = {
    IDLE: 0,
    INITIALIZED: 1,
    PREPARING: 2,
    PREPARED: 3,
    STARTED: 5,
    PAUSED: 7,
  };

  constructor(player, get_IsPlaying) {
    this.#player = player;
    this.#get_IsPlaying = get_IsPlaying;
  }

  volume() {
    return this.#player ? this.#player.getVolume() : 0;
  }

  duration() {
    return this.#player ? this.#player.getDuration() : 0;
  }

  title() {
    return this.#player ? this.#player.getTitle() : '';
  }

  artist() {
    return this.#player ? this.#player.getArtist() : '';
  }

  mediaInfo() {
    return this.#player ? this.#player.getMediaInfo() : null;
  }

  status() {
    return this.#player ? this.#player.getStatus() : -1;
  }

  statusName() {
    const status = this.status;
    return Object.keys(this.#status_ids).find(key => this.#status_ids[key] === status) || `UNKNOWN_${status}`;
  }

  isPlaying() {
    return this.#get_IsPlaying();
  }

  isPaused() {
    return this.status === this.#status_ids.PAUSED;
  }

  isStopped() {
    return this.status === this.#status_ids.IDLE;
  }
}

/**
 * Class representing setter methods for Sound Player.
 */
class Set {
  #player;

  constructor(player) {
    this.#player = player;
  }

  volume(vol) {
    return this.#player.setVolume(vol);
  }
}

export const __SPExtra = {
  Get,
  Set
};