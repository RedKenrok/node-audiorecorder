// Dependency modules.
const test = require('ava');
// Custom module.
const AudioRecorder = require('../library');

// Core functions.
test('core', function(t) {
  t.is(typeof(AudioRecorder), 'function');

  // Instance.
  const audioRecorder = new AudioRecorder();

  t.is(typeof(audioRecorder.start), 'function');
  t.is(typeof(audioRecorder.stream), 'function');
  t.is(typeof(audioRecorder.stop), 'function');
});
