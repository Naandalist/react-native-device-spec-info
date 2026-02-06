# react-native-device-spec-info

> Lightweight utility to detect React Native device specifications (low/mid/high).

[![npm version](https://img.shields.io/npm/v/react-native-device-spec-info.svg)](https://www.npmjs.com/package/react-native-device-spec-info)
[![npm downloads](https://img.shields.io/npm/dm/react-native-device-spec-info.svg)](https://www.npmjs.com/package/react-native-device-spec-info)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Categorize mobile devices as **low-end**, **mid-range**, or **high-end** based on hardware specifications. Optimize React Native app's performance by adapting features, animations, and assets to device capabilities.


## 📦 Installation

```bash
npm install react-native-device-spec-info react-native-device-info
```

or

```bash
yarn add react-native-device-spec-info react-native-device-info
```

### iOS Setup

```bash
cd ios && pod install && cd ..
```

## 🚀 Quick Start

### Using the Hook (Recommended)

```typescript
import { useDeviceSpec } from 'react-native-device-spec-info';

function MyComponent() {
  const { spec, isLoading } = useDeviceSpec();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {spec === 'low' && <SimplifiedUI />}
      {spec === 'mid' && <StandardUI />}
      {spec === 'high' && <EnhancedUI />}
    </View>
  );
}
```

### Using the Utility Directly

```typescript
import { getDeviceSpec } from 'react-native-device-spec-info';

async function checkDevice() {
  const { spec, details } = await getDeviceSpec();
  
  console.log(spec); // 'low' | 'mid' | 'high'
  console.log(details.totalMemory); // e.g., 6.5 GB
}
```

## 📖 API Reference

### Hooks

#### `useDeviceSpec()`

Returns device specification with loading and error states.

```typescript
const { spec, details, isLoading, error } = useDeviceSpec();
```

**Returns:**
```typescript
{
  spec: 'low' | 'mid' | 'high' | null;
  details: {
    totalMemory: number;      // GB
    cpuCount: number;         // Number of cores
    screenSize: number;       // Inches (diagonal)
    pixelDensity: number;     // Scale factor
    osVersion: string;        // OS version
    isTablet: boolean;        // Tablet or phone
  } | null;
  isLoading: boolean;
  error: Error | null;
}
```

#### `useDeviceSpecSimple()`

Simplified hook that returns only the spec category.

```typescript
const spec = useDeviceSpecSimple(); // 'low' | 'mid' | 'high' | null
```

### Functions

#### `getDeviceSpec()`

Async function to get device specification.

```typescript
const result = await getDeviceSpec();
```

**Returns:** `Promise<DeviceSpecInfo>`

#### `getDeviceSpecSimple()`

Async function to get only the spec category.

```typescript
const spec = await getDeviceSpecSimple(); // 'low' | 'mid' | 'high'
```

## 🎯 Use Cases

### 1. Performance Optimization

```typescript
const { spec } = useDeviceSpec();

const imageQuality = spec === 'high' ? 'high' : spec === 'mid' ? 'medium' : 'low';
const enableAnimations = spec !== 'low';
const maxConcurrentDownloads = spec === 'high' ? 5 : spec === 'mid' ? 3 : 1;
```

### 2. Conditional Feature Rendering

```typescript
const { spec } = useDeviceSpec();

return (
  <View>
    {(spec === 'high' || spec === 'mid') && <AdvancedFeature />}
    {spec === 'low' && <SimplifiedFeature />}
  </View>
);
```

### 3. Adaptive UI/UX

```typescript
const { spec } = useDeviceSpec();

const animationConfig = {
  duration: spec === 'high' ? 300 : spec === 'mid' ? 200 : 150,
  useNativeDriver: spec !== 'low',
};
```

### 4. Asset Loading Strategy

```typescript
const { spec } = useDeviceSpec();

const getImageSource = (name: string) => {
  const quality = spec === 'high' ? '@3x' : spec === 'mid' ? '@2x' : '@1x';
  return { uri: `${baseUrl}/${name}${quality}.jpg` };
};
```

## 🔬 How It Works

The detector uses a scoring system based on:

| Factor | Weight | Criteria |
|--------|--------|----------|
| **RAM** | 40% | 8GB+ (high), 4-8GB (mid), <4GB (low) |
| **CPU Cores** | 30% | 8+ cores (high), 4-6 cores (mid), <4 cores (low) |
| **Display** | 20% | Screen size + pixel density |
| **OS Version** | 10% | Latest versions score higher |

**Final Categories:**
- **Score ≥70** → High Spec
- **Score 40-69** → Mid Spec  
- **Score <40** → Low Spec

## 📊 Examples

### Device Classification

| Device | RAM | CPU | Category |
|--------|-----|-----|----------|
| iPhone 15 Pro | 8GB | A17 Pro | **High** |
| Samsung Galaxy A54 | 6GB | Exynos 1380 | **Mid** |
| Redmi 10A | 3GB | Helio G25 | **Low** |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT © [Listiananda Apriliawan](https://naandalist.com/)

## 🙏 Acknowledgments

Built with [react-native-device-info](https://github.com/react-native-device-info/react-native-device-info)

---

**Note:** Device categorization is based on hardware specifications and may not reflect actual performance in all scenarios. Always test your app on real devices.
