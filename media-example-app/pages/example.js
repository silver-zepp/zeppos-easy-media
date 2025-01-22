/** @note if the example does not work, run `npm install` then `zeus dev` */
import "../libs/required";
import AutoGUI, { multiplyHexColor } from "@silver-zepp/autogui";
import VisLog from "@silver-zepp/vis-log";
import { SoundPlayer } from "../../npm+src/dist/sound-player.src";
// import { SoundPlayer } from "@silver-zepp/easy-media";

const gui = new AutoGUI();
const vis = new VisLog();

// queue is used by default to have more stable playback
// disable it with `SoundPlayer({ use_queue: false })`
const player = new SoundPlayer(); 

const MEDIA_PATH = "assets://raw/media/";
const sfx_arr = [ "sfx1.mp3", "sfx2.mp3", "sfx3.mp3" ];
const voice_arr = [ "1.mp3", "2.mp3", "3.mp3" ];

const COLORS = {
  BTN_BG: multiplyHexColor(0xffffff, 0.2),
  BTN_TEXT: 0x3cb371,
  GREEN: 0x00ff00,
  RED: 0xff0000
};

let btn_seq = null;
let btn_loop = null;
let loop_state = false;
let is_playing_seq = false;
let cur_sfx_index = 0;

Page({
  build() {
    // default buttons style
    AutoGUI.SetColor(COLORS.BTN_BG);
		AutoGUI.SetTextColor(COLORS.BTN_TEXT);

    gui.spacer();
    gui.newRow();
    // ---------------------------------------
    gui.button("SFX 1", () => this.playSFX(0));
    gui.button("SFX 2", () => this.playSFX(1));
    gui.button("SFX 3", () => this.playSFX(2));
    // ---------------------------------------
    gui.newRow();
    // ---------------------------------------
    btn_seq = gui.button("PLAY SEQ", ()=> this.toggleSequence(), { normal_color: COLORS.GREEN });
    btn_loop = gui.button("LOOP: OFF", ()=> this.updateLoopState());
    // ---------------------------------------
    gui.newRow();
    gui.spacer();

    gui.render();

    vis.updateSettings({ line_count: 4 });

    player.onComplete((info) => {
      vis.log(`F: ${info.name} T: ${info.duration} ms`);
      
      if (is_playing_seq) {
        this.seqPlayNext();
      }
    });
  },

  playSFX(index) {
    player.play(MEDIA_PATH + sfx_arr[index]);
  },

  playVoice(index) {
    player.play(MEDIA_PATH + voice_arr[index]);
  },

  toggleSequence() {
    if (is_playing_seq) 
      this.stopSequence();
    else 
      this.startSequence();
  },

  startSequence() {
    is_playing_seq = true;
    cur_sfx_index = 0;
    btn_seq.update({ text: "STOP SEQ", normal_color: COLORS.RED });
    this.playVoice(cur_sfx_index);
  },

  seqPlayNext() {
    if (!is_playing_seq) return;

    cur_sfx_index = (cur_sfx_index + 1) % voice_arr.length;
    
    if (cur_sfx_index === 0 && !loop_state) 
      this.stopSequence();
    else 
      this.playVoice(cur_sfx_index);
  },

  stopSequence() {
    is_playing_seq = false;
    player.stop();
    btn_seq.update({ text: "START SEQ", normal_color: COLORS.GREEN });
  },

  updateLoopState() {
    loop_state = !loop_state;
    btn_loop.update({ text: `LOOP: ${loop_state ? "ON" : "OFF"}` });
  },

  onDestroy() {
    player.destroy();
  }
});