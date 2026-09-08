import {
  calculateScore,
  getSpecFromScore,
  estimateScreenSizeInches,
  DEFAULT_THRESHOLDS,
} from '../src/scoring';
import {
  configureDeviceSpec,
  resetDeviceSpecConfig,
  getDeviceSpecConfig,
} from '../src/config';

describe('estimateScreenSizeInches', () => {
  it('uses 163 ppi-base on iOS points', () => {
    const inches = estimateScreenSizeInches(393, 852, 'ios');
    expect(inches).toBeGreaterThan(5.5);
    expect(inches).toBeLessThan(6.3);
  });

  it('uses 160 ppi-base on Android dp', () => {
    const inches = estimateScreenSizeInches(360, 800, 'android');
    expect(inches).toBeGreaterThan(5);
    expect(inches).toBeLessThan(6);
  });
});

describe('calculateScore / getSpecFromScore (JS-only 2.0 heuristic)', () => {
  afterEach(() => {
    resetDeviceSpecConfig();
  });

  const specOf = (
    ram: number,
    size: number,
    density: number,
    os: string,
    tablet: boolean,
    platform: 'ios' | 'android'
  ) => {
    const score = calculateScore(ram, size, density, os, tablet, platform);
    return { score, spec: getSpecFromScore(score) };
  };

  it('labels a high-end Android (12GB, latest OS) as high', () => {
    const { score, spec } = specOf(12, 6.7, 3, '16', false, 'android');
    expect(score).toBe(90.4);
    expect(spec).toBe('high');
  });

  it('labels a Galaxy A54-shaped device as mid', () => {
    const { score, spec } = specOf(6, 6.4, 2.5, '13', false, 'android');
    expect(score).toBe(59.3);
    expect(spec).toBe('mid');
  });

  it('labels a Redmi 10A-shaped device as low (3GB)', () => {
    const { score, spec } = specOf(3, 6.5, 2, '11', false, 'android');
    expect(score).toBe(25.4);
    expect(spec).toBe('low');
  });

  it('labels an iPhone 15 Pro-shaped device on iOS 18 as high', () => {
    const { score, spec } = specOf(8, 6.1, 3, '18', false, 'ios');
    expect(score).toBe(83.3);
    expect(spec).toBe('high');
  });

  it('does not let a budget 3GB phone outscore a flagship iPhone', () => {
    const iphone = specOf(8, 6.1, 3, '18', false, 'ios');
    const budget = specOf(3, 6.5, 2, '11', false, 'android');
    expect(iphone.score).toBeGreaterThan(budget.score);
    expect(iphone.spec).toBe('high');
    expect(budget.spec).toBe('low');
  });

  it('treats iOS 26 year-style versions as latest', () => {
    const v18 = calculateScore(8, 6.1, 3, '18', false, 'ios');
    const v26 = calculateScore(8, 6.1, 3, '26', false, 'ios');
    expect(v26).toBe(v18);
  });

  it('uses custom thresholds', () => {
    expect(getSpecFromScore(65, { high: 60, mid: 30 })).toBe('high');
    expect(getSpecFromScore(65, DEFAULT_THRESHOLDS)).toBe('mid');
  });
});

describe('configureDeviceSpec', () => {
  afterEach(() => {
    resetDeviceSpecConfig();
  });

  it('merges partial weight overrides', () => {
    configureDeviceSpec({ weights: { ram: 60 } });
    expect(getDeviceSpecConfig().weights.ram).toBe(60);
    expect(getDeviceSpecConfig().weights.display).toBe(30);
    expect(getDeviceSpecConfig().weights.os).toBe(20);
  });

  it('reset restores defaults', () => {
    configureDeviceSpec({ thresholds: { high: 90 } });
    resetDeviceSpecConfig();
    expect(getDeviceSpecConfig().thresholds.high).toBe(70);
  });
});
