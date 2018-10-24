// Dependency modules.
const test = require(`ava`);
// Custom module.
const AudioRecorder = require(`../library`);

// default options.
test(`default`, function(t) {
	const audioRecorder = new AudioRecorder();
	t.deepEqual(audioRecorder.options.program, `rec`);
	t.deepEqual(audioRecorder.command.arguments, [
		`-V0`,
		`-q`,
		`-L`,
		`-c`,
		`1`,
		`-r`,
		`16000`,
		`-t`,
		`wav`,
		`-b`,
		`16`,
		`-e`,
		`signed-integer`,
		`silence`,
		`1`,
		`0.1`,
		`0.5%`,
		`1`,
		`2`,
		`0.5%`,
		`-`
	]);
	t.deepEqual(audioRecorder.command.options, {
		encoding: `binary`
	});
});