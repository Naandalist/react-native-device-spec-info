import type { DeviceSpec } from './types';

export type PlatformOS = 'ios' | 'android' | string;

export type ScoreWeights = {
  ram: number;
  display: number;
  os: number;
};

export type ScoreThresholds = {
  high: number;
  mid: number;
};

export const DEFAULT_WEIGHTS: ScoreWeights = {
  ram: 50,
  display: 30,
  os: 20,
};

export const DEFAULT_THRESHOLDS: ScoreThresholds = {
  high: 70,
  mid: 40,
};

/** Fraction of the RAM weight earned for a given GB amount. */
export const ramRatio = (totalMemoryGB: number): number => {
  if (totalMemoryGB >= 12) return 1;
  if (totalMemoryGB >= 8) return 30 / 35;
  if (totalMemoryGB >= 6) return 23 / 35;
  if (totalMemoryGB >= 4) return 16 / 35;
  if (totalMemoryGB >= 3) return 4 / 35;
  if (totalMemoryGB >= 2) return 2 / 35;
  return 0;
};

/** Density portion of the display weight (max 13 of a 25-point display split). */
export const densityRatio = (pixelDensity: number): number => {
  if (pixelDensity >= 3) return 13 / 25;
  if (pixelDensity >= 2) return 8 / 25;
  return 4 / 25;
};

/**
 * Diagonal inches are a weak performance signal on phones.
 * Only tablets get the large-screen bump.
 */
export const sizeRatio = (_screenSize: number, isTablet: boolean): number => {
  if (isTablet) return 12 / 25;
  return 4 / 25;
};

export const osRatio = (osVersion: string, platform: PlatformOS): number => {
  if (platform === 'android') {
    const version = parseInt(osVersion, 10);
    if (Number.isNaN(version)) return 0;
    if (version >= 16) return 1;
    if (version >= 15) return 13 / 15;
    if (version >= 14) return 11 / 15;
    if (version >= 13) return 9 / 15;
    if (version >= 12) return 7 / 15;
    if (version >= 10) return 4 / 15;
    return 0;
  }

  if (platform === 'ios') {
    const version = parseFloat(osVersion);
    if (Number.isNaN(version)) return 0;
    if (version >= 18) return 1;
    if (version >= 17) return 12 / 15;
    if (version >= 16) return 9 / 15;
    if (version >= 15) return 6 / 15;
    if (version >= 13) return 3 / 15;
    return 0;
  }

  return 0;
};

export const estimateScreenSizeInches = (
  width: number,
  height: number,
  platform: PlatformOS
): number => {
  const ppiBase = platform === 'ios' ? 163 : 160;
  return Math.sqrt((width / ppiBase) ** 2 + (height / ppiBase) ** 2);
};

export const calculateScore = (
  totalMemoryGB: number,
  screenSize: number,
  pixelDensity: number,
  osVersion: string,
  isTablet: boolean,
  platform: PlatformOS,
  weights: ScoreWeights = DEFAULT_WEIGHTS
): number => {
  const score =
    weights.ram * ramRatio(totalMemoryGB) +
    weights.display * (densityRatio(pixelDensity) + sizeRatio(screenSize, isTablet)) +
    weights.os * osRatio(osVersion, platform);

  return Math.round(score * 10) / 10;
};

export const getSpecFromScore = (
  score: number,
  thresholds: ScoreThresholds = DEFAULT_THRESHOLDS
): DeviceSpec => {
  if (score >= thresholds.high) return 'high';
  if (score >= thresholds.mid) return 'mid';
  return 'low';
};
