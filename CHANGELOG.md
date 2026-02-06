# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-06

### Added
- Initial release of `react-native-device-spec-info`
- Device spec detection categorization (low/mid/high)
- `useDeviceSpec` hook - Returns device spec with full details, loading and error states
- `useDeviceSpecSimple` hook - Returns only the spec category
- `getDeviceSpec` async utility function
- `getDeviceSpecSimple` async utility function
- Native CPU core detection via `getCpuCoreCount` and `getCpuCoreCountSync`
- Full TypeScript support with comprehensive type definitions
- Comprehensive documentation and examples
- Example React Native 0.79 test app

### Features
- Device categorization based on RAM, CPU cores, display, and OS version
- Cross-platform support (iOS & Android)
- React hooks for easy integration
- Minimal bundle size impact
- Only requires `react-native-device-info` as peer dependency
- Zero additional configuration

### Scoring System
- RAM: 40% weight (8GB+ high, 4-8GB mid, <4GB low)
- CPU Cores: 30% weight (8+ cores high, 4-6 cores mid, <4 cores low)
- Display: 20% weight (screen size + pixel density)
- OS Version: 10% weight (latest versions score higher)

### Score Categories
- Score ≥70: High-end device
- Score 40-69: Mid-range device
- Score <40: Low-end device
