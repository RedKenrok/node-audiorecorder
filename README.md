# Audio recorder
Audio recorder for [Node.js](https://nodejs.org/), delivers a 16-bit signed-integer linear pulse modulation WAV stream. Based of [Gilles De Mey](https://github.com/gillesdemey)'s [node-record-lpcm16](https://github.com/gillesdemey/node-record-lpcm16).

## Installation
```
npm install --save node-audiorecorder
```

## Dependencies
This module requires you to install [SoX](http://sox.sourceforge.net/) and it must be available in your $PATH.

### For Linux
```
sudo apt-get install sox libsox-fmt-all
```

### For MacOS
```
brew install sox
```

### For Windows
[Download the binaries](http://sourceforge.net/projects/sox/files/latest/download)

## Usage

### Constructor
```javascript
// Import module.
const AudioRecorder = require('node-audiorecorder');

// Options is an optional parameter for the constructor call.
// If an option is not given the default value, as seen below, will be used.
const options = {
  // Amount of channels to record.
  channels: 1,
  // Recording device to use.
  device: null,
  // Which program to use, either 'arecord', 'sox', and 'rec'.
  program: 'sox',
  // Audio sample rate in hz.
  sampleRate: 16000,
  // Time of silence in seconds before it stops recording.
  silence: 2,
  // Silence threshold (only for 'sox' and 'rec').
  threshold: 0.5,
  // Silence threshold to start recording, overrides threshold (only for 'sox' and 'rec').
  thresholdStart: null,
  // Silence threshold to stop recording, overrides threshold (only for 'sox' and 'rec').
  thresholdStop: null,
};
// Optional parameter intended for debugging.
// The object has to implement a log and warn function.
const logger = console;

// Create an instance.
let audioRecorder = new AudioRecorder(options, logger);
```

> 'arecord' might not work on all operating systems. If you can't capture any sound with 'arecord', try to change device to 'arecord -l'.

### Methods
```javascript
// Creates and starts the recording process.
audioRecorder.Start();
// Stops and removes the recording process.
audioRecorder.Stop();
// Returns the stream of the recording process.
audioRecorder.Stream();
```

### Example
See or run the [example.js](https://github.com/RedKenrok/node-audiorecorder/blob/master/example/example.js) script to see or test it for yourself. If you want to use that code directly in your project DO update the ``require(./index.js)`` to ``require(node-audiorecorder)``.

> For another example see the [node-hotworddetector](https://github.com/RedKenrok/node-hotworddetector) module, or [Electron-VoiceInterfaceBoilerplate](https://github.com/RedKenrok/Electron-VoiceInterfaceBoilerplate)'s input.js.

## Troubleshooting

### Windows continues recording
If you have issues with continues recording on Windows 10 with SoX 14.4.2 or later, install version [14.4.1rc3](https://sourceforge.net/projects/sox/files/release_candidates/sox/14.4.1rc3/) instead.
