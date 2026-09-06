import {
  DEFAULT_THRESHOLDS,
  DEFAULT_WEIGHTS,
  type ScoreThresholds,
  type ScoreWeights,
} from './scoring';

export type DeviceSpecConfig = {
  weights: ScoreWeights;
  thresholds: ScoreThresholds;
};

let current: DeviceSpecConfig = {
  weights: { ...DEFAULT_WEIGHTS },
  thresholds: { ...DEFAULT_THRESHOLDS },
};

export const getDeviceSpecConfig = (): DeviceSpecConfig => ({
  weights: { ...current.weights },
  thresholds: { ...current.thresholds },
});

export const configureDeviceSpec = (options: {
  weights?: Partial<ScoreWeights>;
  thresholds?: Partial<ScoreThresholds>;
}): DeviceSpecConfig => {
  if (options.weights) {
    current.weights = { ...current.weights, ...options.weights };
  }
  if (options.thresholds) {
    current.thresholds = { ...current.thresholds, ...options.thresholds };
  }
  return getDeviceSpecConfig();
};

export const resetDeviceSpecConfig = (): void => {
  current = {
    weights: { ...DEFAULT_WEIGHTS },
    thresholds: { ...DEFAULT_THRESHOLDS },
  };
};
