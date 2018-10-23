<div align="center">
  
  [![npm package @latest](https://img.shields.io/npm/v/node-audiorecorder.svg?label=npm@latest&style=flat-square&maxAge=3600)](https://npmjs.com/package/node-audiorecorder)
  [![Travis-ci status](https://img.shields.io/travis-ci/com/RedKenrok/node-audiorecorder.svg?label=test%20status&branch=master&style=flat-square&maxAge=3600)](https://travis-ci.com/RedKenrok/node-audiorecorder)
  
  [![License agreement](https://img.shields.io/github/license/redkenrok/node-audiorecorder.svg?style=flat-square&maxAge=86400)](https://github.com/redkenrok/node-audiorecorder/blob/master/LICENSE)
  [![Open issues on GitHub](https://img.shields.io/github/issues/redkenrok/node-audiorecorder.svg?style=flat-square&maxAge=86400)](https://github.com/redkenrok/node-audiorecorder/issues)
  
</div>

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
  program: 'rec',
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

### Examples

The following is a shortend version of the [example script](https://github.com/RedKenrok/node-audiorecorder/blob/master/example/example.js) found in this repository.  Do note `../library` references this module.

```JavaScript
// Imports modules.
const fs = require(`fs`),
	path = require(`path`);
const AudioRecorder = require(`../library`);
// Constants.
const DIRECTORY = `RECORDINGS`;

// Initialize recorder and file stream.
const audioRecorder = new AudioRecorder({
	program: process.platform === `win32` ? `sox` : `rec`,
	silence: 0
});

// Log the generated command.
console.log(`${audioRecorder.options.program} ${audioRecorder.command.arguments.join(` `)}`);
```

> For another example see the [node-hotworddetector](https://github.com/RedKenrok/node-hotworddetector) module, or [Electron-VoiceInterfaceBoilerplate](https://github.com/RedKenrok/Electron-VoiceInterfaceBoilerplate)'s input.js.

## Troubleshooting

### Windows continues recording
If you have issues with continues recording on Windows 10 with SoX 14.4.2 or later, install version [14.4.1](https://sourceforge.net/projects/sox/files/sox/14.4.1/) instead.

## License

[ISC license](https://github.com/redkenrok/node-audiorecorder/blob/master/LICENSE)