// Imports modules.
const fs = require('fs'),
	  path = require('path');
const AudioRecorder = require('./index.js');
// Constants.
const directoryName = 'ExampleRecordings';

// Initialize recorder and file stream.
let audioRecorder = new AudioRecorder({
	program: [ 'win32' ].indexOf(require('os').platform() > -1) ? 'sox' : 'rec',
	silence: 0
}, console);

// Create path to write recordings to.
if (!fs.existsSync(directoryName)){
	fs.mkdirSync(directoryName);
}
// Create filepath with random name.
let fileName = path.join(directoryName, Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4) + '.wav');
console.log('Writing new recording file at: ', fileName);

// Create write stream.
let fileStream = fs.createWriteStream(fileName, { encoding: 'binary' });
// Start and write to the file.
audioRecorder.start().stream().pipe(fileStream);

// Log information on the following events
audioRecorder.stream().on('close', function(code) {
	console.warn('Recording closed. Exit code: ', code);
});
audioRecorder.stream().on('end', function() {
	console.warn('Recording ended.');
});
audioRecorder.stream().on('error', function() {
	console.warn('Recording error.');
});
// Write incoming data out the console.
/*audioRecorder.stream().on('data', function(chunk) {
	console.log(chunk);
});*/

// Keep process alive.
process.stdin.resume();
console.warn('Press ctrl+c to exit.');
