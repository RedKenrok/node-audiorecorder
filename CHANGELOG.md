# Changelog

## 1.4.1 (2019-03-13)
### Changed
+ Updated dependencies.

## 1.4.0 (2018-12-27)
### Added
+ `keepSilence` option added fo `sox` and `rec` only. The option enables or disabled the `-l` flag which controls whether the silence is part of the recording or not.

## 1.3.0-beta.0 (2018-12-12)
### Added
+ Opened up the `format` argument of the audio recorder options. (only for `arecord`)
### Changed
+ Fixed `arecord` command generation.

## 1.2.0 (2018-11-09)
### Changed
+ Added `-l` to silence effect, therefore the silence not removed from the start of the recording.
+ Default values of `thresholdStart` and `thresholdStop` are both set to `1`.
+ Fixed duration of silence effect since duration parameters need to have a decimal. For example `2.0` instead of `2`.
### Removed
+ `sampleRate` and `threshold` options removed.

## 1.1.6 (2018-11-08)
### Added
+ Example added to examples directory, and changed `example.js` to `examples/print-command.js`.
### Fixed
+ Fixed silence effect.

## 1.1.5 (2018-10-24)
### Added
+ Added `bits`, `encoding`, `rate`, and `type` properties to options, which allows greater control over output.
### Changed
+ `sampleRate` option renamed to `rate`, legacy support still available.

## 1.1.4 (2018-10-23)
### Added
+ Tests added with continues integration and code coverage.
### Changed
+ Clarified examples in `README.md`.
### Fixed
+ `example.js` fixed.
+ Default values fixed in `README.md`.

## 1.1.3 (2018-09-18)
### Added
+ `CHANGELOG.md` added.
+ `eslint` module added as dev dependency
+ `.eslintrc.json` file added.
### Changed
+ Restructured project files.