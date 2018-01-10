'use strict';

const processSpawn = require('child_process').spawn;

// Default recording values.
const defaults = {
	channels: 1,			// Amount of channels to record.
	device: null,			// Recording device to use.
	program: 'sox',			// Which program to use, either 'arecord', 'rec', or 'sox'.
	sampleRate: 16000,		// Audio sample rate in hz.
	silence: 2,				// Time of silence in seconds before it stops recording.
	threshold: 0.5,			// Silence threshold (only for 'rec' and 'sox').
	thresholdStart: null,	// Silence threshold to start recording, overrides threshold (only for 'rec' and 'sox').
	thresholdEnd: null,		// Silence threshold to end recording, overrides threshold (only for 'rec' and 'sox').
};

let process,
	stream;

class AudioRecorder {
	/**
	 * Constructor of AudioRecord class.
	 * @param {*} options Object with optional options variables
	 * @param {*} logger Object with log, warn, and error functions
	 * @returns this
	 */
	constructor(options, logger) {
		this.options = Object.assign(defaults, options);
		this.logger = logger;
		
		this.command = {
			arguments: [
				// Show no progress
				'-q',
				// Sample rate
				'-r', this.options.sampleRate.toString(),
				// Channels
				'-c', this.options.channels.toString()
			],
			options: {
				encoding: 'binary'
			}
		};
		switch (this.options.program) {
			default:
			case 'sox':
			case 'rec':
				this.command.arguments.push(
					// Sample encoding
					'-e', 'signed-integer',
					// Precision in bits
					'-b', '16',
					// Audio type
					'-t', 'wav',
					// Pipe
					'-',
					// End on silence
					'silence','1', '0.1', (this.options.thresholdStart || this.options.threshold).toString() + '%',
					'1', this.options.silence.toString(), (this.options.thresholdEnd || this.options.threshold).toString() + '%'
				);
				break;
			case 'arecord':
				this.command.arguments.push(
					// Audio type
					'-t', 'wav',
					// Sample format
					'-f', 'S16_LE',
					// Pipe
					'-'
				);
				if (this.options.device) {
					this.command.arguments.push('-D', this.options.device)
				}
				break;
		}
		if (this.options.device) {
			this.command.options.env = Object.assign({}, process.env, {  AUDIODEV: this.options.device });
		}
		
		if (this.logger) {
			this.logger.log('AudioRecorder command: ' + this.options.program + ' ' + this.command.arguments.join(' '));
		}
		
		return this;
	}
	/**
	 * Creates and starts the audio recording process.
	 * @returns this
	 */
	start() {
		if (process) {
			if (this.logger) {
				this.logger.warn('AudioRecorder: Process already active, killed old one started new process.');
			}
			process.kill();
		}
		
		// Create new child process and give the recording commands.
		process = processSpawn(this.options.program, this.command.arguments, this.command.options);
		
		if (this.logger) {
			this.logger.log('AudioRecorder: Started recording.');
		}
		
		return this;
	}
	/**
	 * Stops and removes the audio recording process.
	 * @returns this
	 */
	stop() {
		if (!process) {
			if (this.logger) {
				this.logger.warn('AudioRecorder: Unable to stop recording, no process active.');
			}
			return this;
		}
		
		process.kill();
		process = null;
		
		if (this.logger) {
			this.logger.log('AudioRecorder: Stopped recording.');
		}
		
		return this;
	}
	/**
	 * Stops the audio recording process and pauses the stream.
	 * @returns this
	 */
	pause() {
		if (!process) {
			if (this.logger) {
				this.logger.warn('AudioRecorder: Unable to pause recording, no process active.');
			}
			return this;
		}
		
		process.kill('SIGSTOP');
		process.stdout.pause();
		
		if (this.logger) {
			this.logger.log('AudioRecorder: Paused recording.');
		}
		
		return this;
	}
	/**
	 * Starts the audio recording process and resumes the stream.
	 * @returns this
	 */
	resume() {
		if (!process) {
			if (this.logger) {
				this.logger.warn('AudioRecorder: Unable to resumed recording, started recording automaticly.');
			}
			return this.start();
		}
		
		process.kill('SIGCONT');
		process.stdout.resume();
		
		if (this.logger) {
			this.logger.log('AudioRecorder: Resumed recording.');
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
				if (this.logger) {
					this.logger.warn('AudioRecorder: Unable to retrieve stream, because no process not active. Call the start or resume function first.');
				}
				return null;
			}
			
			stream = process.stdout;
		}
		
		return stream;
	}
}

module.exports = AudioRecorder;