# Device Spec Detector Example App

This is an example React Native app demonstrating the `react-native-device-spec-info` library on real devices.

## Prerequisites

- Node.js 18+
- npm or yarn
- Xcode (for iOS) or Android Studio (for Android)
- A physical device or emulator

## Installation

The example app is already configured to use the local library from the parent directory.

```bash
# From the example directory
npm install
```

## Running on iOS

```bash
# Ensure the library is built first
cd ..
npm run build
cd example

# Run on iOS
npm run ios
```

**Manual setup if needed:**
```bash
cd ios
pod install
cd ..
```

## Running on Android

```bash
# Ensure the library is built first
cd ..
npm run build
cd example

# Run on Android (ensure Android emulator is running or device connected)
npm run android
```

## What to Expect

When the app loads, it will:

1. **Detect** your device specs using the library
2. **Display** the device category (High/Mid/Low)
3. **Show** detailed hardware information:
   - Total memory (RAM)
   - CPU cores
   - Screen size
   - Pixel density
   - OS version
   - Device type (Phone/Tablet)

4. **Explain** the scoring system used for categorization

## Development

### Testing Changes

After making changes to the library code in `../src/`:

```bash
# Rebuild the library
cd ..
npm run build
cd example

# Reload the app (use R twice on the Metro bundler or Cmd+R on iOS/Android)
```

### Debugging

For Metro bundler debugging:
- Press `R` twice to reload
- Press `I` for iOS debugging
- Press `A` for Android debugging
- Press `D` to open debugging menu

## Library Integration

The example app imports from the local library:

```typescript
import { useDeviceSpec } from 'react-native-device-spec-info';
```

This uses the `file:../` reference in `package.json`, allowing you to test changes immediately without publishing to npm.
