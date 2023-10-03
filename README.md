# Sound Player and Recorder Library for ZeppOS
This library provides two classes, `SoundPlayer` and `SoundRecorder`, for playing and recording sounds respectively.
It wraps over the [official approach](https://docs-testing.zepp.com/docs/reference/device-app-api/newAPI/media/), is more user-friendly, and introduces an extra feature that allows for the cancellation of any ongoing sound playback.

## SoundPlayer
The `SoundPlayer` class allows you to play sound files. Here's an example of how to use it:

```js
import { SoundPlayer } from 'easy-media.js';

// create a new SoundPlayer that stops when changing files
// if "stop_on_play" flag is set to true, then immediately interrupts the currently playing sound and plays it again
const player = new SoundPlayer("my-sound.mp3", true); // stop_on_play = true
player.play();  // plays the first file

// in case later you have to change the file (.mp3, .opus)
player.changeFile('path-to-another-audio-file');  // stops the first file and prepares the second one

// stops the playing sound
player.stop();
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
