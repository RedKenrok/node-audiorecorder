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
  channels: '1',
  // Recording device to use.
  device: null,
  // Which program to use, either 'arecord', 'rec', or 'sox'.
  program: 'rec',
  // Audio sample rate in hz.
  sampleRate: 16000,
  // Time of silence in seconds before it stops recording.
  silence: '2',
  // Silence threshold (only for 'rec' and 'sox').
  threshold: 0.5,
  // Silence threshold to start recording, overrides threshold (only for 'rec' and 'sox').
  thresholdStart: null,
  // Silence threshold to end recording, overrides threshold (only for 'rec' and 'sox').
  thresholdEnd: null,
};
// Optional parameter intended for debugging.
// The object has to implement a log and warn function.
const logger = {
  log: console.log,
  warn: console.warn
};

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
// Stops the recording process and pauses the stream.
audioRecorder.Pause();
// Starts the recording process and resumes the stream.
audioRecorder.Resume();
// Returns the stream of the recording process.
audioRecorder.Stream();
```

### Example
```javascript
// Imports modules.
const fs = require('fs');
const AudioRecorder = require('node-audiorecorder');

// Initialize recorder and file stream.
let audioRecorder = new AudioRecorder(null, console);
let file = fs.createWriteStream('recording.wav', { encoding: 'binary' });

// Start and write to the file.
audioRecorder.start().stream().pipe(file);
```

> For another example see the [node-hotworddetector](https://github.com/RedKenrok/node-hotworddetector) module.