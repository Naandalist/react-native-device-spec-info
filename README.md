# react-native-device-spec-info

> JS-only helper to classify React Native devices as low / mid / high.

[![npm version](https://img.shields.io/npm/v/react-native-device-spec-info.svg)](https://www.npmjs.com/package/react-native-device-spec-info)
[![npm downloads](https://img.shields.io/npm/dm/react-native-device-spec-info.svg)](https://www.npmjs.com/package/react-native-device-spec-info)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Uses RAM, display, and OS version from [`react-native-device-info`](https://github.com/react-native-device-info/react-native-device-info) plus React Native `Dimensions` / `PixelRatio`. No custom native module.

This is a heuristic, not a benchmark. Always test on real devices.

**Peer dependency:** `react-native-device-info` `>= 10`.

## Compatibility

| Environment | Status |
|---|---|
| Bare React Native | Supported |
| Expo Go | Supported for *this* package (still subject to `react-native-device-info`) |
| Expo Dev Client / prebuild | Supported |
| Example app | React Native **0.79** / React 19 |
| Library peer range | `react-native >= 0.60` (not actively tested below 0.72) |
| New Architecture | Irrelevant — no native module in this package |
| Web / Windows | Not supported |

No `pod install` and no native rebuild are required for *this* package. Rebuild only if you add or update `react-native-device-info`.

## Installation

```bash
npm install react-native-device-spec-info react-native-device-info
```

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

- `spec`: `'low' | 'mid' | 'high' | null`
- `score`: number or `null` (typically 0–100 with default weights)
- `details`: `totalMemory` (GB), `screenSize` (estimated inches), `pixelDensity`, `osVersion`, `isTablet`, `model`

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
  weights: { ram: 60, display: 25, os: 15 },
});
```

Defaults: weights RAM 50 / display 30 / OS 20, thresholds high 70 / mid 40.

### `clearDeviceSpecCache()` / `resetDeviceSpecConfig()`

For tests and rare reset cases.

## How It Works

| Factor | Weight | Criteria |
|--------|--------|----------|
| **RAM** | 50% | 12GB max, 8GB high, 6GB upper-mid, 4GB mid, 3GB and under score very low |
| **Display** | 30% | Pixel density + a small phone baseline. Large-phone diagonals do not inflate the score; tablets get a bump. |
| **OS version** | 20% | Android 16+ and iOS 18+ (including year-style 26) cap this axis. |

CPU core count is **not** used. It needed a custom native module and is a weak signal on modern phones.

- **Score ≥70** → high
- **Score 40–69** → mid
- **Score <40** → low

### Fixture devices (unit-tested)

| Shape | Inputs | Score | Category |
|--------|--------|-------|----------|
| Flagship Android | 12GB, density 3, Android 16 | 90.4 | high |
| iPhone 15 Pro-shaped | 8GB, density 3, iOS 18 | 83.3 | high |
| Galaxy A54-shaped | 6GB, density 2.5, Android 13 | 59.3 | mid |
| Redmi 10A-shaped | 3GB, density 2, Android 11 | 25.4 | low |

`details.model` is informational only. It is not scored and there is no chipset table to maintain.

## Breaking changes in 2.0.0

- Removed `android/`, `ios/`, the podspec, and `getCpuCoreCount` / `getCpuCoreCountSync`
- Removed `details.cpuCores` and the `cpu` weight
- Default weights are now RAM 50 / display 30 / OS 20

## License

MIT © [Listiananda Apriliawan](https://naandalist.com/)
