# EasyMedia - Sound Player and Recorder Library for ZeppOS
The EasyMedia library provides two classes, `SoundPlayer` and `SoundRecorder`, for playing and recording sounds.
The library further encapsulates our [raw approach](https://docs.zepp.com/docs/reference/device-app-api/newAPI/media/), is more user-friendly, and introduces extra features like play queue, play cancelation, and more.

## Install the library from NPM registry
`npm i @silver-zepp/easy-media`

## SoundPlayer
The `SoundPlayer` class allows you to play sound files. Here's an example of how to use it:

```js
import { SoundPlayer } from '@silver-zepp/easy-media';

// create a new SoundPlayer
const player = new SoundPlayer(); 
player.play("assets://raw/media/my-sound.mp3"); // play any file by its path
// or
const player = new SoundPlayer({ file: "my-sound.mp3" }); 
player.play();  // plays the first file

// in case later you have to change the file (.mp3, .opus)
player.changeFile('path-to-another-audio-file');  // stops the first file and prepares the second one

// pause the playing sound
player.pause()

// resume playback
player.resume()

// stops the playing sound
player.stop();

// setters/getters
// (!) NOTE the change from `player.get.volume` to `player.get.volume()`
const volume = player.get.volume();       // get the current playback volume
const duration = player.get.duration();   // get the total duration of the currently playing media file
const title = player.get.title();         // get the title of the currently playing media file
const artist = player.get.artist();       // get the artist of the currently playing media file
const media_info = player.get.mediaInfo();// get the media info of the currently playing media file
const status = player.get.status();       // get the current status of the player

player.set.volume(50);  // set the playback volume to 50%

// ======================
// NEW (!) ADD: 1/19/2025
// ======================

// more verbose logs from the library (1-3), default 1 (critical logs)
SoundPlayer.SetLogLevel(3); 

// destroy the player and its callbacks
player.destroy(); 

// on play complete callback with usefull info
player.onComplete((info) => {
  // ...print filename, path, full path and exact duration in milliseconds
  console.log(`Name: ${info.name}`);
  // can print duration below 1s which the Media library missing - ie 324ms
  console.log(`Duration: ${info.duration} ms`); 
  console.log(`Full path: ${info.full_path}`);
  console.log(`Path: ${info.path}`);  
});

// reduce the fail detection timeout (default 3000ms). Lower numbers are less stable.
player.setFailTimeout(1000);

// executes if the playback fails (in case the device lacks a speaker)
player.onFail((info) => {
  vis.log(`Failed to play ${info.name}.`);
  vis.log("Does your device have a speaker?");
  vis.log("Try using BLE Headphones!");
});

// status name getter 
// IDLE, INITIALIZED, PREPARING, PREPARED, STARTED, PAUSED
const status = player.get.statusName();

// more status getters in the Get subclass: 
const is_playing = player.get.isPlaying(); 
player.get.isPaused();
player.get.isStopped();
```

## Methods
### play(): 
Starts playing the sound. If the sound is already playing, it stops and prepares the sound again.
### stop(): 
Stops the sound. If the sound is playing, it stops the sound and releases the player.
### changeFile(filename): 
Changes the sound file to play.
### destroy(): 
Destroys the player. If the sound is playing, it stops the sound and removes event listeners.

## SoundRecorder
The SoundRecorder class allows you to record sounds. Here’s an example of how to use it:

```js
import { SoundRecorder } from '@silver-zepp/easy-media/recorder';

const recorder = new SoundRecorder('mic-recording.opus');
recorder.start();
```

## Methods
### start(): 
Starts recording.
### stop(): 
Stops recording.
### changeFile(target_file): 
Changes the target file for the recording.
```
