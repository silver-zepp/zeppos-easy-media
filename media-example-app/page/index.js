import VisLog from "@silver-zepp/vis-log"
import { SoundPlayer } from "../libs/easy-media";
import AutoGUI from "@silver-zepp/autogui";
const gui = new AutoGUI();

const vis = new VisLog();
const player = new SoundPlayer();

import { setPageBrightTime } from '@zos/display';
setPageBrightTime({ brightTime: 60000 });

const media_arr = [
  "track1",   // 42s
  "track2",
  "track3",
  "sfx1",
  "sfx2",
  "sfx3",     // the sequencer will play files from the bottom up 0s -> 42s
];

function playMedia(id){
  vis.log("Playing", media_arr[id]);
  const full_path = "assets://raw/media/" + media_arr[id] + ".mp3";
  
  player.play(full_path);
  
  // wait some time to make sure the file is preloaded
  setTimeout(() => {
    const dur = player.get.duration;
    const info = player.get.mediaInfo;
    const status = player.get.status;
    const vol = player.get.volume;
    const title = player.get.title;
    const artist = player.get.artist;

    vis.log("dur:", dur);
    vis.log("info:", JSON.stringify(info));
    vis.log("status:", status);
    vis.log("vol:", vol);
    vis.log("title:", title);
    vis.log("artist:", artist);
  }, 500);
}

function playSequence() {
  let cur_index = media_arr.length - 1;
  
  function playNext() {
    if (cur_index < 0) {
      vis.log("Sequence completed");
      return;
    }

    const full_path = "assets://raw/media/" + media_arr[cur_index] + ".mp3";
    vis.log("Playing", media_arr[cur_index]);
    
    player.play(full_path);

    function checkStatus() {
      const status = player.get.status;
      const prepared = 5; // prepared state ID
      if (status === prepared) {
        const dur = player.get.duration || 1; // properly handle files with < 1s duration
        vis.log("Duration:", dur);
        
        // wait for the file to finish playing
        setTimeout(() => {
          player.stop(); // stop the current playback
          cur_index--;
          playNext();
        }, dur * 1000);
      } else if (status !== prepared) {
        // if not yet prepared, check again after a short delay
        setTimeout(checkStatus, 50);
      } else {
        vis.log("Unexpected player status:", status);
        cur_index--;
        playNext();
      }
    } checkStatus();
  } 
  
  playNext();
}

Page({
  build() {
    gui.spacer();
    gui.newRow();

    gui.button("MUS1", ()=> playMedia(0) );
    gui.button("SEQ", ()=> playSequence(), { normal_color: 0x00FF00 });
    gui.button("MUS2", ()=> playMedia(1) );

    gui.newRow();

    gui.button("SFX1", ()=> playMedia(3) );
    gui.button("SFX2", ()=> playMedia(4) );
    gui.button("SFX3", ()=> playMedia(5) );

    gui.newRow();
    gui.spacer();

    gui.render();

    vis.updateSettings({ line_count: 6 });
  }
})


