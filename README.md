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
  program: `rec`,     // Which program to use, either `arecord`, `rec`, or `sox`.
  device: null,       // Recording device to use.
  
  bits: 16,           // Sample size. (only for `rec` and `sox`)
  channels: 1,        // Channel count.
  encoding: `signed-integer`,  // Encoding type. (only for `rec` and `sox`)
  format: `S16_LE`,   // Encoding type. (only for `arecord`)
  rate: 16000,        // Sample rate.
  type: `wav`,        // Format type.
  
  // Following options only available when using `rec` or `sox`.
  silence: 2,         // Duration of silence in seconds before it stops recording.
  thresholdStart: 0.5,  // Silence threshold to start recording.
  thresholdStop: 0.5,   // Silence threshold to stop recording.
  keepSilence: true   // Keep the silence in the recording.
};
// Optional parameter intended for debugging.
// The object has to implement a log and warn function.
const logger = console;

// Create an instance.
let audioRecorder = new AudioRecorder(options, logger);
```

> 'arecord' might not work on all operating systems. If you can't capture any sound with 'arecord', try to change device to 'arecord -l'.

> See the [arecord documentation](https://linux.die.net/man/1/arecord) for more detail on its options.

> See the [sox documentation](http://sox.sourceforge.net/Docs/Documentation) for more detail on the rec and sox options.

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

See the [examples directory](https://github.com/RedKenrok/node-audiorecorder/tree/master/examples) for example usage.

> For another example see the [node-hotworddetector](https://github.com/RedKenrok/node-hotworddetector) module, or [Electron-VoiceInterfaceBoilerplate](https://github.com/RedKenrok/Electron-VoiceInterfaceBoilerplate)'s input.js.

## Troubleshooting

### Windows continues recording
If you have issues with continues recording on Windows 10 with SoX 14.4.2 or later, install version [14.4.1](https://sourceforge.net/projects/sox/files/sox/14.4.1/) instead.

## License

[MIT license](https://github.com/redkenrok/node-audiorecorder/blob/master/LICENSE)