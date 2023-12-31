# Sound Player and Recorder Library for ZeppOS
This library provides two classes, `SoundPlayer` and `SoundRecorder`, for playing and recording sounds respectively.
It wraps over the [official approach](https://docs.zepp.com/docs/reference/device-app-api/newAPI/media/), is more user-friendly, and introduces an extra feature that allows for the cancellation of any ongoing sound playback.

## SoundPlayer
The `SoundPlayer` class allows you to play sound files. Here's an example of how to use it:

```js
import { SoundPlayer } from 'easy-media.js';

// create a new SoundPlayer that stops when changing files
const player = new SoundPlayer("my-sound.mp3", true); // stop_on_play = true
// if "stop_on_play" flag is set to true, then immediately
// interrupts the currently playing sound and plays it again
player.play();  // plays the first file

// in case later you have to change the file (.mp3, .opus)
player.changeFile('path-to-another-audio-file');  // stops the first file and prepares the second one

// pause the playing sound
player.pause()

// resume playback
player.resume()

// stops the playing sound
player.stop();

// NEW (!) setters/getters
player.get.volume();    // get the current playback volume
player.get.duration();  // get the total duration of the currently playing media file
player.get.title();     // get the title of the currently playing media file
player.get.artist();    // get the artist of the currently playing media file
player.get.mediaInfo(); // get the media info of the currently playing media file
player.get.status();    // get the current status of the player

player.set.volume(50);  // set the playback volume to 50%
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
import { SoundRecorder } from 'easy-media.js';

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
