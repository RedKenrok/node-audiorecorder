// Imports modules.
const fs = require('fs'),
  path = require('path');
const AudioRecorder = require('../library');

// Constants.
const DIRECTORY = 'examples-recordings';

// Create path to write recordings to.
if (!fs.existsSync(DIRECTORY)) {
  fs.mkdirSync(DIRECTORY);
}

// Initialize recorder and file stream.
const audioRecorder = new AudioRecorder({
  program: 'sox',
  silence: 0
}, console);

// Log information on the following events.
audioRecorder.on('error', function () {
  console.warn('Recording error.');
});
audioRecorder.on('end', function () {
  console.warn('Recording ended.');
});

// Create file path with random name.
const fileName = path.join(
  DIRECTORY,
  Math.random()
    .toString(36)
    .replace(/[^0-9a-zA-Z]+/g, '')
    .concat('.wav')
);
console.log('Writing new recording file at:', fileName);

// Create write stream.
const fileStream = fs.createWriteStream(fileName, { encoding: 'binary' });

// Start and write to the file.
audioRecorder.start().stream().pipe(fileStream);

// Keep process alive.
process.stdin.resume();
console.warn('Press ctrl+c to exit.');
