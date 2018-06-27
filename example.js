// Imports modules.
const fs = require('fs'),
	  path = require('path');
const AudioRecorder = require('./index.js');
// Constants.
const dirname = 'Recordings';

// Initialize recorder and file stream.
let audioRecorder = new AudioRecorder({ silence: 0 }, console);

// Create path to write recordings to.
if (!fs.existsSync(dirname)){
	fs.mkdirSync(dirname);
}
// Create filepath with random name.
let filename = path.join(dirname, Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4) + '.wav');
console.log('Writing new recording file at: ', filename);

// Create write stream.
let fileStream = fs.createWriteStream(filename, { encoding: 'binary' });
// Start and write to the file.
audioRecorder.start().stream().pipe(fileStream);

// Write incoming data out the console as well.
/*audioRecorder.stream().on('data', function(data) {
	console.log(data);
});*/

// Keep process alive.
process.stdin.resume();
console.warn('Press ctrl+c to exit.');
