# react-native-device-spec-info

> Lightweight utility to detect React Native device specifications (low/mid/high).

[![npm version](https://img.shields.io/npm/v/react-native-device-spec-info.svg)](https://www.npmjs.com/package/react-native-device-spec-info)
[![npm downloads](https://img.shields.io/npm/dm/react-native-device-spec-info.svg)](https://www.npmjs.com/package/react-native-device-spec-info)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Categorize mobile devices as **low-end**, **mid-range**, or **high-end** based on hardware specifications.

This is a heuristic, not a benchmark. Always test on real devices.

**Peer dependency:** [`react-native-device-info`](https://github.com/react-native-device-info/react-native-device-info) `>= 10`.

## Compatibility

| Environment | Status |
|---|---|
| Bare React Native (autolinking) | Supported |
| Example app | React Native **0.79** / React 19 |
| Library peer range | `react-native >= 0.60` (not actively tested below 0.72) |
| iOS | 11.0+ (podspec) |
| Android | minSdk 21 |
| Expo Dev Client / prebuild | Supported after a native rebuild |
| Expo Go | **Not supported** (custom native CPU module) |
| New Architecture | Legacy bridge module only (`RCT_EXPORT_MODULE` / `ReactContextBaseJavaModule`). Not a Turbo Module. |
| Web / Windows | Not supported |

After install, rebuild the native app. `pod install` is required on iOS.

## Installation

```bash
npm install react-native-device-spec-info react-native-device-info
```

```bash
cd ios && pod install && cd ..
```

Then rebuild (`npx react-native run-ios` / `run-android`).

## Quick Start

```typescript
import { useDeviceSpec } from 'react-native-device-spec-info';

function MyComponent() {
  const { spec, score, isLoading, error } = useDeviceSpec();

  if (isLoading) return <ActivityIndicator />;
  if (error || !spec) return <FallbackUI />;

  return (
    <View>
      <Text>{spec} ({score})</Text>
      {spec === 'low' && <SimplifiedUI />}
      {spec === 'mid' && <StandardUI />}
      {spec === 'high' && <EnhancedUI />}
    </View>
  );
}
```

```typescript
import { getDeviceSpec } from 'react-native-device-spec-info';

const { spec, score, details } = await getDeviceSpec();
```

`getDeviceSpec()` caches the result for the process lifetime. It **throws** if hardware info cannot be read.

## API Reference

### `useDeviceSpec()`

```typescript
const { spec, score, details, isLoading, error } = useDeviceSpec();
```

- `spec`: `'low' \| 'mid' \| 'high' \| null`
- `score`: number or `null` (typically 0–100 with default weights)
- `details.cpuCores`, `totalMemory` (GB), `screenSize` (estimated inches), `pixelDensity`, `osVersion`, `isTablet`

### `useDeviceSpecSimple()`

```typescript
const spec = useDeviceSpecSimple(); // 'low' | 'mid' | 'high' | null
```

### `getDeviceSpec()` / `getDeviceSpecSimple()`

Async versions of the above. `getDeviceSpec()` returns `{ spec, score, details }`.

### `configureDeviceSpec()`

Override weights or thresholds. Clears the in-memory cache.

```typescript
import { configureDeviceSpec } from 'react-native-device-spec-info';

configureDeviceSpec({
  thresholds: { high: 75, mid: 45 },
  weights: { ram: 50, cpu: 20, display: 20, os: 10 },
});
```

Defaults: weights RAM 35 / CPU 25 / display 25 / OS 15, thresholds high 70 / mid 40.

### `clearDeviceSpecCache()` / `resetDeviceSpecConfig()`

For tests and rare reset cases.

## How It Works

| Factor | Weight | 2026 criteria |
|--------|--------|----------------|
| **RAM** | 35% | 12GB max, 8GB high, 6GB upper-mid, 4GB mid, 3GB and under score very low |
| **CPU cores** | 25% | 8 cores no longer max this axis (common on cheap Androids). 6-core flagships are not treated as low. |
| **Display** | 25% | Pixel density + a small phone baseline. Large-phone diagonals do not inflate the score; tablets get a bump. |
| **OS version** | 15% | Android 16+ and iOS 18+ (including year-style 26) cap this axis. |

- **Score ≥70** → high
- **Score 40–69** → mid
- **Score <40** → low

### Fixture devices (unit-tested)

| Shape | Inputs | Score | Category |
|--------|--------|-------|----------|
| Flagship Android | 12GB, 8 cores, Android 16 | 82 | high |
| iPhone 15 Pro-shaped | 8GB, 6 cores, iOS 18 | 74 | high |
| Galaxy A54-shaped | 6GB, 8 cores, Android 13 | 59 | mid |
| Redmi 10A-shaped | 3GB, 4 cores, Android 11 | 28 | low |

## License

MIT © [Listiananda Apriliawan](https://naandalist.com/)
