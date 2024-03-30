// Module.
const AudioRecorder = require('../library');

// Initialize recorder.
new AudioRecorder({
  program: process.platform === 'win32' ? 'sox' : 'rec',
}, console);
