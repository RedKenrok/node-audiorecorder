// Dependency modules.
const test = require('ava');
// Custom module.
const AudioRecorder = require('../library');

// Core functions.
test('core', function (t) {
  t.is(typeof (AudioRecorder), 'function');

  // Instance.
  const audioRecorder = new AudioRecorder();

  try {
    audioRecorder.start();
  } catch (error) {
    t.fail();
  }

  try {
    audioRecorder.stream();
  } catch (error) {
    t.fail();
  }

  try {
    audioRecorder.stop();
  } catch (error) {
    t.fail();
  }
});

test('debug-success', function (t) {
  t.is(typeof (AudioRecorder), 'function');

  // Instance.
  const audioRecorder = new AudioRecorder({}, console);
  t.is(audioRecorder._logger, console);

  try {
    audioRecorder.start();
  } catch (error) {
    t.fail();
  }

  try {
    audioRecorder.stream();
  } catch (error) {
    t.fail();
  }

  try {
    audioRecorder.stop();
  } catch (error) {
    t.fail();
  }
});

test('debug-fallback', function (t) {
  t.is(typeof (AudioRecorder), 'function');

  // Instance.
  const audioRecorder = new AudioRecorder({}, console);
  t.is(audioRecorder._logger, console);

  try {
    audioRecorder.stream();
  } catch (error) {
    t.fail();
  }

  try {
    audioRecorder.start();
  } catch (error) {
    t.fail();
  }
  try {
    audioRecorder.start();
  } catch (error) {
    t.fail();
  }

  try {
    audioRecorder.stop();
  } catch (error) {
    t.fail();
  }
  try {
    audioRecorder.stop();
  } catch (error) {
    t.fail();
  }
});
