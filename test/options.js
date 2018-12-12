// Dependency modules.
const test = require(`ava`);
// Custom module.
const AudioRecorder = require(`../library`);

// Default arecord options.
test(`arecord`, function(t) {
	const audioRecorder = new AudioRecorder({
		program: `arecord`
	});
	t.deepEqual(audioRecorder.options.program, `arecord`);
	t.deepEqual(audioRecorder.command.arguments, [
		`-q`,
		`-c`,
		`1`,
		`-r`,
		`16000`,
		`-t`,
		`wav`,
		`-f`,
		`S16_LE`
	]);
	t.deepEqual(audioRecorder.command.options, {
		encoding: `binary`
	});
});

// Default options (rec).
test(`default`, function(t) {
	const audioRecorder = new AudioRecorder();
	t.deepEqual(audioRecorder.options.program, `rec`);
	t.deepEqual(audioRecorder.command.arguments, [
		`-q`,
		`-c`,
		`1`,
		`-r`,
		`16000`,
		`-t`,
		`wav`,
		`-V0`,
		`-L`,
		`-b`,
		`16`,
		`-e`,
		`signed-integer`,
		`-`,
		`silence`,
		`-l`,
		`1`,
		`0.1`,
		`0.5%`,
		`1`,
		`2.0`,
		`0.5%`
	]);
	t.deepEqual(audioRecorder.command.options, {
		encoding: `binary`
	});
});

// Default sox options.
test(`sox`, function(t) {
	const audioRecorder = new AudioRecorder({
		program: `sox`
	});
	t.deepEqual(audioRecorder.options.program, `sox`);
	t.deepEqual(audioRecorder.command.arguments, [
		`-d`,
		`-q`,
		`-c`,
		`1`,
		`-r`,
		`16000`,
		`-t`,
		`wav`,
		`-V0`,
		`-L`,
		`-b`,
		`16`,
		`-e`,
		`signed-integer`,
		`-`,
		`silence`,
		`-l`,
		`1`,
		`0.1`,
		`0.5%`,
		`1`,
		`2.0`,
		`0.5%`
	]);
	t.deepEqual(audioRecorder.command.options, {
		encoding: `binary`
	});
});