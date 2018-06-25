// Imports modules.
const fs = require('fs');
const AudioRecorder = require('../index.js');

// Initialize recorder and file stream.
let audioRecorder = new AudioRecorder(null, console);
let file = fs.createWriteStream('recording.wav', { encoding: 'binary' });

// Start and write to the file.
audioRecorder.start().stream().pipe(file);
