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

// Initialize recorders.
let recorders = [
  new AudioRecorder({
    device: null, // Add device name.
    silence: 0,
  }, console),

  new AudioRecorder({
    device: null, // Add device name.
    silence: 0,
  }, console)
]; // List available devices with 'sox -V6 -n -t coreaudio junk_device_name'
for (let i = 0; i < recorders.length; i++) {
  const recorder = recorders[i];

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

  // Log information on the following events.
  recorder.on('error', function () {
    console.warn('Recording error.');
  });
  recorder.on('end', function () {
    console.warn('Recording ended.');
  });

  // Start and write to the file.
  recorder.start().stream().pipe(fileStream);
}

// Keep process alive.
process.stdin.resume();
console.warn('Press ctrl+c to exit.');
