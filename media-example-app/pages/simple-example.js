/** @note if this example does not work, run `npm install` then `zeus dev` */
import "../libs/required";
import AutoGUI from "@silver-zepp/autogui";
import VisLog from "@silver-zepp/vis-log";
import { SoundPlayer } from "../../npm+src/dist/sound-player.src";
// import { SoundPlayer } from "@silver-zepp/easy-media";

const gui = new AutoGUI();
const vis = new VisLog();

// queue is used by default to have more stable playback
// disable it with `SoundPlayer({ use_queue: false })`
const player = new SoundPlayer(); 

const sfx_paths = [
  "assets://raw/media/sfx1.mp3",
  "assets://raw/media/sfx2.mp3",
  "assets://raw/media/sfx3.mp3"
];

Page({
  build() {
    gui.spacer();
    gui.newRow();
  
    gui.button("SFX 1", () => this.playSFX(0));
    gui.button("SFX 2", () => this.playSFX(1));
    gui.button("SFX 3", () => this.playSFX(2));

    gui.render();

    vis.updateSettings({ line_count: 6 });

    // execute something every time sound finishes playing
    player.onComplete((info) => {
      // ...print filename and the playback duration
      vis.log(`F: ${info.name} T: ${info.duration} ms`);

      // ...or play the next song in the array (achieving sequence)
    });
  },

  playSFX(index) {
    player.play(sfx_paths[index]);

    if (!player.get.isPlaying()) {
      // can implement custom queue here
    }
  },

  onDestroy() {
    player.destroy();
  }
});