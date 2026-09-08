# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-09-06

### Added

- `score` on `getDeviceSpec()` / `useDeviceSpec()` so apps can tune their own cutoffs.
- `configureDeviceSpec({ weights, thresholds })` and `resetDeviceSpecConfig()`.
- Table-driven unit tests (`npm test`) and a GitHub Action on push/PR.

### Changed

- Heuristic refresh for 2026:
  - OS: Android 16+ and iOS 18+ (including year-style 26) cap the OS axis.
  - 8 CPU cores no longer max the CPU axis (too common on budget Androids).
  - Phone diagonal no longer inflates the display score; only tablets get the large-screen bump.
  - 3GB RAM scores much lower so entry phones stay `low`.
- Existing users should re-test categories. A54-shaped stays mid; iPhone 15 Pro-shaped stays high; Redmi 10A-shaped is low.

## [1.1.0] - 2026-09-06

### Fixed

- Enable autolinking for the `RNCpuInfo` native module.
- Stop returning a fake `'mid'` spec when detection fails.
- Cache detection at module scope.
- Estimate screen inches from points/dp (÷ 163 iOS / ÷ 160 Android).
- Align README with code weights and `cpuCores`.
- Fix npm packaging (`.npmignore`, broken ESM extra file).

### Added

- `clearDeviceSpecCache()`.
- Compatibility notes: not Expo Go; legacy bridge.

## [1.0.1] - 2026-02-06

### Fixed

- Patch release on npm. No separate changelog was recorded at publish time.

## [1.0.0] - 2026-02-06

### Added

- Initial release.
