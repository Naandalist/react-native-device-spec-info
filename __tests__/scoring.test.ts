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

describe('calculateScore / getSpecFromScore (default 2026 heuristic)', () => {
  afterEach(() => {
    resetDeviceSpecConfig();
  });

  const specOf = (
    ram: number,
    cores: number,
    size: number,
    density: number,
    os: string,
    tablet: boolean,
    platform: 'ios' | 'android'
  ) => {
    const score = calculateScore(ram, cores, size, density, os, tablet, platform);
    return { score, spec: getSpecFromScore(score) };
  };

  it('labels a high-end Android (12GB, 8 cores, latest OS) as high', () => {
    const { score, spec } = specOf(12, 8, 6.7, 3, '16', false, 'android');
    expect(score).toBe(82);
    expect(spec).toBe('high');
  });

  it('labels a Galaxy A54-shaped device as mid', () => {
    const { score, spec } = specOf(6, 8, 6.4, 2.5, '13', false, 'android');
    expect(score).toBe(59);
    expect(spec).toBe('mid');
  });

  it('labels a Redmi 10A-shaped device as low (3GB, 4 cores)', () => {
    const { score, spec } = specOf(3, 4, 6.5, 2, '11', false, 'android');
    expect(score).toBe(28);
    expect(spec).toBe('low');
  });

  it('still labels a 3GB / 8-core budget phone as low', () => {
    const { spec } = specOf(3, 8, 6.5, 2, '11', false, 'android');
    expect(spec).toBe('low');
  });

  it('labels an iPhone 15 Pro-shaped device on iOS 18 as high', () => {
    const { score, spec } = specOf(8, 6, 6.1, 3, '18', false, 'ios');
    expect(score).toBe(74);
    expect(spec).toBe('high');
  });

  it('does not punish 6-core iPhones relative to cheap 8-core Androids', () => {
    const iphone = specOf(8, 6, 6.1, 3, '18', false, 'ios');
    const budgetEightCore = specOf(3, 8, 6.5, 2, '11', false, 'android');
    expect(iphone.score).toBeGreaterThan(budgetEightCore.score);
    expect(iphone.spec).toBe('high');
    expect(budgetEightCore.spec).toBe('low');
  });

  it('treats iOS 26 year-style versions as latest', () => {
    const v18 = calculateScore(8, 6, 6.1, 3, '18', false, 'ios');
    const v26 = calculateScore(8, 6, 6.1, 3, '26', false, 'ios');
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
    configureDeviceSpec({ weights: { ram: 50 } });
    expect(getDeviceSpecConfig().weights.ram).toBe(50);
    expect(getDeviceSpecConfig().weights.cpu).toBe(25);
  });

  it('reset restores defaults', () => {
    configureDeviceSpec({ thresholds: { high: 90 } });
    resetDeviceSpecConfig();
    expect(getDeviceSpecConfig().thresholds.high).toBe(70);
  });
});
