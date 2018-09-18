// Import node modules.
const processSpawn = require(`child_process`).spawn;

// Default recording values.
const defaults = {
	channels: 1,			// Amount of channels to record.
	device: null,			// Recording device to use.
	program: `rec`,			// Which program to use, either 'arecord', 'sox' and 'rec'.
	sampleRate: 16000,		// Audio sample rate in hz.
	silence: 2,				// Time of silence in seconds before it stops recording.
	threshold: 0.5,			// Silence threshold (only for 'sox' and 'rec').
	thresholdStart: null,	// Silence threshold to start recording, overrides threshold (only for 'sox' and 'rec').
	thresholdStop: null,	// Silence threshold to stop recording, overrides threshold (only for 'sox' and 'rec').
};

// Local private variables.
let process;

class AudioRecorder extends require(`events`).EventEmitter {
	/**
	 * Constructor of AudioRecord class.
	 * @param {*} options Object with optional options variables
	 * @param {*} logger Object with log, warn, and error functions
	 * @returns this
	 */
	constructor(options, logger) {
		super();
		
		this.options = Object.assign(defaults, options);
		this.logger = logger;
		
		this.command = {
			arguments: [
				// Show no error messages
				//   Use the 'close' event to listen for an exit code.
				`-V0`,
				// Show no progress
				`-q`,
				// Endian
				//   -L = little
				//   -B = big
				//   -X = swap
				`-L`,
				// Sample rate
				`-r`, this.options.sampleRate.toString(),
				// Channels
				`-c`, this.options.channels.toString()
			],
			options: {
				encoding: `binary`
			}
		};
		switch (this.options.program) {
		default:
		case `sox`:
			if (!this.options.device && [ `win32` ].indexOf(require(`os`).platform()) > -1) {
				this.command.arguments.unshift(
					// Continues recording
					`-d`,
				);
			}
		case `rec`:
			if (this.options.device) {
				this.command.arguments.push(`-d`, this.options.device);
			}
			this.command.arguments.push(
				// Sample encoding
				`-e`, `signed-integer`,
				// Precision in bits
				`-b`, `16`,
				// Audio type
				`-t`, `wav`,
				// Pipe
				`-`
			);
			if (this.options.silence > 0) {
				// End on silence
				this.command.arguments.push(
					`silence`,`1`, `0.1`, (this.options.thresholdStart || this.options.threshold).toString().concat(`%`),
					`1`, this.options.silence.toString(), (this.options.thresholdStop || this.options.threshold).toString().concat(`%`)
				);
			}
			break;
		case `arecord`:
			this.command.arguments.push(
				// Audio type
				`-t`, `wav`,
				// Sample format
				`-f`, `S16_LE`,
				// Pipe
				`-`
			);
			if (this.options.device) {
				this.command.arguments.push(`-D`, this.options.device);
			}
			break;
		}
		
		if (this.logger) {
			this.logger.log(`AudioRecorder command: ${this.options.program} ${this.command.arguments.join(` `)}`);
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
				this.logger.warn(`AudioRecorder: Process already active, killed old one started new process.`);
			}
			process.kill();
		}
		
		// Create new child process and give the recording commands.
		process = processSpawn(this.options.program, this.command.arguments, this.command.options);
		
		// Store this in 'self' so it can be accessed in the callback.
		let self = this;
		process.on(`close`, function(exitCode) {
			if (self.logger) {
				self.logger.log(`AudioRecorder: Exit code: '${exitCode}'.`);
			}
			self.emit(`close`, exitCode);
		});
		
		if (this.logger) {
			this.logger.log(`AudioRecorder: Started recording.`);
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
				this.logger.warn(`AudioRecorder: Unable to stop recording, no process active.`);
			}
			return this;
		}
		
		process.kill();
		process = null;
		
		if (this.logger) {
			this.logger.log(`AudioRecorder: Stopped recording.`);
		}
		
		return this;
	}
	/**
	 * Returns the stream of the audio recording process.
	 */
	stream() {
		if (!process) {
			if (this.logger) {
				this.logger.warn(`AudioRecorder: Unable to retrieve stream, because no process not active. Call the start or resume function first.`);
			}
			return null;
		}
		
		return process.stdout;
	}
}

module.exports = AudioRecorder;