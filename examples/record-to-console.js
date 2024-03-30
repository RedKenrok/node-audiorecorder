// Module.
const AudioRecorder = require('../library');

// Initialize recorder.
const recorder = new AudioRecorder({
  program: process.platform === 'win32' ? 'sox' : 'rec',
}, console);

// Log information on the following events.
recorder.on('error', () => {
  console.warn('Recording error.');
});
recorder.on('end', () => {
  console.warn('Recording ended.');
});

// Start and write to the console.
recorder
  .start()
  .stream()
  .on('data', console.log);

// Stop after 5 seconds.
setTimeout(() => {
  recorder.stop();
  process.stdin.pause();
}, 5000);

// Keep process alive.
process.stdin.resume();
console.warn('Press ctrl+c to exit or wait 5 seconds.');
