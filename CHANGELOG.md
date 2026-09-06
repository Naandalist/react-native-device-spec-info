# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-09-06

### Fixed

- Enable autolinking for the `RNCpuInfo` native module (`react-native.config.js`). Without this, core detection fell back to 4 cores.
- Stop returning a fake `'mid'` spec when detection fails. `getDeviceSpec()` throws; `useDeviceSpec()` sets `error` and leaves `spec` as `null`.
- Cache detection at module scope so every hook mount does not re-query native APIs.
- Estimate screen inches from points/dp (`÷ 163` on iOS, `÷ 160` on Android) instead of Android mdpi math on every platform.
- Align README and example app with the real scoring weights (RAM 35%, CPU 25%, display 25%, OS 15%) and the `cpuCores` field name.
- Fix `.npmignore` excluding `src/` (Metro entry is `src/index.ts`) and ignoring `examples/` instead of `example/`.
- Drop the broken single-file ESM build (`lib/index.esm.js` did not include sibling modules).
- Ignore `android/build/` artifacts.

### Added

- `clearDeviceSpecCache()` for tests and rare reset cases.
- Compatibility notes: not Expo Go; legacy bridge, not a Turbo Module.

### Changed

- Package version `1.1.0`.
- `files` now includes `react-native.config.js` and `CHANGELOG.md`.

## [1.0.1] - 2026-02-06

### Fixed

- Patch release on npm. No separate changelog was recorded at publish time.

## [1.0.0] - 2026-02-06

### Added

- Initial release of `react-native-device-spec-info`
- Device spec detection categorization (low/mid/high)
- `useDeviceSpec` hook — returns device spec with full details, loading and error states
- `useDeviceSpecSimple` hook — returns only the spec category
- `getDeviceSpec` / `getDeviceSpecSimple` async utilities
- Native CPU core detection via `getCpuCoreCount` and `getCpuCoreCountSync`
- TypeScript types
- Example React Native 0.79 test app

### Scoring system

- RAM: 35% weight
- CPU cores: 25% weight
- Display: 25% weight
- OS version: 15% weight
- Score ≥70 high, 40–69 mid, <40 low
