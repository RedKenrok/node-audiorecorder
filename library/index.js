// Import node modules.
const processSpawn = require(`child_process`).spawn;

// Default recording values.
const defaults = {
	program: `rec`,			// Which program to use, either `arecord`, `rec`, and `sox`.
	device: null,			// Recording device to use.
	
	channels: 1,			// Channel count.
	bits: 16,				// Sample size. (only for `rec` and `sox`)
	encoding: `signed-integer`,	// Encoding type. (only for `rec` and `sox`)
	rate: 16000,			// Sample rate.
	type: `wav`,			// File type.
	
	// Following options only for `rec` and `sox` programs
	silence: 2,				// Time of silence in seconds before it stops recording.
	threshold: 0.5,			// Silence threshold.
	thresholdStart: null,	// Silence threshold to start recording, overrides threshold.
	thresholdStop: null,	// Silence threshold to stop recording, overrides threshold.
};

// Local private variables.
let childProcess;

class AudioRecorder extends require(`events`).EventEmitter {
	/**
	 * Constructor of AudioRecord class.
	 * @param {*} options Object with optional options variables
	 * @param {*} logger Object with log, warn, and error functions
	 * @returns this
	 */
	constructor(options = {}, logger) {
		super();
		
		// Legacy support for sample rate property.
		if (options.sampleRate) {
			options.rate = options.sampleRate;
			options.sampleRate = undefined;
		}
		
		this.options = Object.assign(defaults, options);
		this.logger = logger;
		
		this.command = {
			arguments: [
				// Show no error messages
				//   Use the `close` event to listen for an exit code.
				`-V0`,
				// Show no progress
				`-q`,
				// Endian
				//   -L = little
				//   -B = big
				//   -X = swap
				`-L`,
				// Channel count
				`-c`, this.options.channels.toString(),
				// Sample rate
				`-r`, this.options.rate.toString(),
				// File type
				`-t`, this.options.type
			],
			options: {
				encoding: `binary`
			}
		};
		switch (this.options.program) {
			default:
			case `sox`:
				if (!this.options.device && process.platform === `win32`) {
					this.command.arguments.unshift(
						// Continues recording
						`-d`,
					);
				}
			case `rec`:
				if (this.options.device) {
					this.command.arguments.push(`-d`, this.options.device);
				}
				
				// Add sample size and encoding type.
				this.command.arguments.push(
					`-b`, this.options.bits.toString(),
					`-e`, this.options.encoding
				);
				
				// End on silence
				if (this.options.silence > 0) {
					this.command.arguments.push(
						`silence`,`1`, `0.1`, (this.options.thresholdStart || this.options.threshold).toString().concat(`%`),
						`1`, this.options.silence.toString(), (this.options.thresholdStop || this.options.threshold).toString().concat(`%`)
					);
				}
				break;
			case `arecord`:
				this.command.arguments.push(
					// Sample format
					`-f`, `S16_LE`
				);
				if (this.options.device) {
					this.command.arguments.push(`-D`, this.options.device);
				}
				break;
		}
		this.command.arguments.push(
			// Pipe
			`-`
		);
		
		if (this.logger) {
			// Log command.
			this.logger.log(`AudioRecorder command: ${this.options.program} ${this.command.arguments.join(` `)}`);
		}
		
		return this;
	}
	/**
	 * Creates and starts the audio recording process.
	 * @returns this
	 */
	start() {
		if (childProcess) {
			if (this.logger) {
				this.logger.warn(`AudioRecorder: Process already active, killed old one started new process.`);
			}
			childProcess.kill();
		}
		
		// Create new child process and give the recording commands.
		childProcess = processSpawn(this.options.program, this.command.arguments, this.command.options);
		
		// Store this in `self` so it can be accessed in the callback.
		let self = this;
		childProcess.on(`close`, function(exitCode) {
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
		if (!childProcess) {
			if (this.logger) {
				this.logger.warn(`AudioRecorder: Unable to stop recording, no process active.`);
			}
			return this;
		}
		
		childProcess.kill();
		childProcess = null;
		
		if (this.logger) {
			this.logger.log(`AudioRecorder: Stopped recording.`);
		}
		
		return this;
	}
	/**
	 * Returns the stream of the audio recording process.
	 */
	stream() {
		if (!childProcess) {
			if (this.logger) {
				this.logger.warn(`AudioRecorder: Unable to retrieve stream, because no process not active. Call the start or resume function first.`);
			}
			return null;
		}
		
		return childProcess.stdout;
	}
}

module.exports = AudioRecorder;