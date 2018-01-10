'use strict';

const processSpawn = require('child_process').spawn;

// Default recording values.
const defaults = {
	channels: 1,			// Amount of channels to record.
	device: null,			// Recording device to use.
	program: 'rec',			// Which program to use, either 'arecord', 'rec'.
	sampleRate: 16000,		// Audio sample rate in hz.
	silence: 2,				// Time of silence in seconds before it stops recording.
	threshold: 0.5,			// Silence threshold (only for 'rec').
	thresholdStart: null,	// Silence threshold to start recording, overrides threshold (only for 'rec').
	thresholdEnd: null,		// Silence threshold to end recording, overrides threshold (only for 'rec').
};

// Local variables.
let options,
	logger,
	command,
	process,
	stream;

class AudioRecorder {
	/**
	 * Constructor of AudioRecord class.
	 * @param {*} _options Object with optional options variables
	 * @param {*} _logger Object with log, warn, and error functions
	 * @returns this
	 */
	constructor(_options, _logger) {
		options = Object.assign(defaults, _options);
		logger = _logger;
		
		command = {
			arguments: [
				// Show no progress
				'-q',
				// Sample rate
				'-r', options.sampleRate.toString(),
				// Channels
				'-c', options.channels.toString()
			],
			options: {
				encoding: 'binary'
			}
		};
		switch (options.program) {
			default:
			case 'rec':
				command.arguments.push(
					// Sample encoding
					'-e', 'signed-integer',
					// Precision in bits
					'-b', '16',
					// Audio type
					'-t', 'wav',
					// Pipe
					'-',
					// End on silence
					'silence','1', '0.1', (options.thresholdStart || options.threshold).toString() + '%',
					'1', options.silence.toString(), (options.thresholdEnd || options.threshold).toString() + '%'
				);
				break;
			case 'arecord':
				command.arguments.push(
					// Audio type
					'-t', 'wav',
					// Sample format
					'-f', 'S16_LE',
					// Pipe
					'-'
				);
				if (options.device) {
					command.arguments.push('-D', options.device)
				}
				break;
		}
		if (options.device) {
			command.options.env = Object.assign({}, process.env, {  AUDIODEV: options.device });
		}
		
		if (logger) {
			logger.log('AudioRecorder command: ' + options.program + ' ' + command.arguments.join(' '));
		}
		
		return this;
	}
	/**
	 * Creates and starts the audio recording process.
	 * @returns this
	 */
	start() {
		if (process) {
			if (logger) {
				logger.warn('AudioRecorder: Process already active, killed old one started new process.');
			}
			process.kill();
		}
		
		// Create new child process and give the recording commands.
		process = processSpawn(options.program, command.arguments, command.options);
		
		if (logger) {
			logger.log('AudioRecorder: Started recording.');
		}
		
		return this;
	}
	/**
	 * Stops and removes the audio recording process.
	 * @returns this
	 */
	stop() {
		if (!process) {
			if (logger) {
				logger.warn('AudioRecorder: Unable to stop recording, no process active.');
			}
			return this;
		}
		
		process.kill();
		process = null;
		
		if (logger) {
			logger.log('AudioRecorder: Stopped recording.');
		}
		
		return this;
	}
	/**
	 * Stops the audio recording process and pauses the stream.
	 * @returns this
	 */
	pause() {
		if (!process) {
			if (logger) {
				logger.warn('AudioRecorder: Unable to pause recording, no process active.');
			}
			return this;
		}
		
		process.kill('SIGSTOP');
		process.stdout.pause();
		
		if (logger) {
			logger.log('AudioRecorder: Paused recording.');
		}
		
		return this;
	}
	/**
	 * Starts the audio recording process and resumes the stream.
	 * @returns this
	 */
	resume() {
		if (!process) {
			if (logger) {
				logger.warn('AudioRecorder: Unable to resumed recording, started recording automaticly.');
			}
			return this.start();
		}
		
		process.kill('SIGCONT');
		process.stdout.resume();
		
		if (logger) {
			logger.log('AudioRecorder: Resumed recording.');
		}
		
		return this;
	}
	/**
	 * Returns the stream of the audio recording process.
	 * @returns process stdout stream
	 */
	stream() {
		if (!stream) {
			if (!process) {
				if (logger) {
					logger.warn('AudioRecorder: Unable to retrieve stream, because no process not active. Call the start or resume function first.');
				}
				return null;
			}
			
			stream = process.stdout;
		}
		
		return stream;
	}
}

module.exports = AudioRecorder;