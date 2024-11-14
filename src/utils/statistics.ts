export function calculateDescriptiveStats(data: number[]) {
  if (!data || data.length === 0) return null;

  const n = data.length;
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  
  // 标准差
  const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (n - 1);
  const stdDev = Math.sqrt(variance);

  // 中位数
  const sorted = [...data].sort((a, b) => a - b);
  const median = n % 2 === 0 
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2
    : sorted[Math.floor(n/2)];

  // 最大值和最小值
  const max = Math.max(...data);
  const min = Math.min(...data);

  return {
    n,
    mean,
    median,
    stdDev,
    min,
    max,
    variance
  };
}

export function shapiroWilkTest(data: number[]) {
  // 简化版的Shapiro-Wilk检验
  if (!data || data.length < 3) return null;

  const n = data.length;
  const sorted = [...data].sort((a, b) => a - b);
  const mean = data.reduce((a, b) => a + b, 0) / n;
  
  // 计算W统计量
  const s2 = data.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0);
  const a = Array(Math.floor(n/2)).fill(0).map((_, i) => {
    return sorted[n-1-i] - sorted[i];
  });
  
  const b = a.reduce((acc, x) => acc + Math.pow(x, 2), 0);
  const W = Math.pow(b, 2) / s2;

  // 简化的p值计算
  const pValue = W < 0.9 ? 0.01 : W < 0.95 ? 0.05 : 0.1;

  return {
    statistic: W,
    pValue
  };
}

export function dAgostinoTest(data: number[]) {
  if (!data || data.length < 8) return null;

  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);

  // 计算偏度
  const skewness = data.reduce((a, b) => a + Math.pow((b - mean) / stdDev, 3), 0) / n;
  
  // 计算峰度
  const kurtosis = data.reduce((a, b) => a + Math.pow((b - mean) / stdDev, 4), 0) / n - 3;

  // 简化的统计量计算
  const Z = Math.sqrt(skewness * skewness + kurtosis * kurtosis);
  const pValue = Math.exp(-Z/2);

  return {
    statistic: Z,
    pValue,
    skewness,
    kurtosis
  };
}

export function calculateCorrelations(x: number[], y: number[]) {
  if (!x || !y || x.length !== y.length || x.length < 3) return null;

  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  // Pearson相关系数
  const numerator = x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0);
  const denomX = Math.sqrt(x.reduce((acc, xi) => acc + Math.pow(xi - meanX, 2), 0));
  const denomY = Math.sqrt(y.reduce((acc, yi) => acc + Math.pow(yi - meanY, 2), 0));
  const pearson = numerator / (denomX * denomY);

  // Spearman等级相关
  const xRanks = getRanks(x);
  const yRanks = getRanks(y);
  const dSquared = xRanks.reduce((acc, rank, i) => acc + Math.pow(rank - yRanks[i], 2), 0);
  const spearman = 1 - (6 * dSquared) / (n * (n * n - 1));

  return {
    pearson,
    spearman,
    n
  };
}

function getRanks(arr: number[]): number[] {
  const sorted = arr.map((v, i) => ({ value: v, index: i }))
    .sort((a, b) => a.value - b.value);
  
  const ranks = new Array(arr.length);
  for (let i = 0; i < sorted.length; i++) {
    ranks[sorted[i].index] = i + 1;
  }
  
  return ranks;
}

export function linearRegression(x: number[], y: number[]) {
  if (!x || !y || x.length !== y.length || x.length < 3) return null;

  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  // 计算斜率和截距
  const numerator = x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0);
  const denominator = x.reduce((acc, xi) => acc + Math.pow(xi - meanX, 2), 0);
  
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  // 计算R²
  const yPred = x.map(xi => slope * xi + intercept);
  const ssRes = y.reduce((acc, yi, i) => acc + Math.pow(yi - yPred[i], 2), 0);
  const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - meanY, 2), 0);
  const rSquared = 1 - ssRes / ssTot;

  // 计算标准误差
  const standardError = Math.sqrt(ssRes / (n - 2));

  // 计算t值和p值
  const tValue = slope / (standardError / Math.sqrt(denominator));
  const degreesOfFreedom = n - 2;
  const pValue = 2 * (1 - tCDF(Math.abs(tValue), degreesOfFreedom));

  // 计算95%置信区间
  const tCritical = 1.96; // 近似值
  const confidenceInterval = {
    lower: slope - tCritical * standardError,
    upper: slope + tCritical * standardError
  };

  return {
    slope,
    intercept,
    rSquared,
    standardError,
    tValue,
    pValue,
    confidenceInterval
  };
}

function tCDF(t: number, df: number): number {
  // 简化的t分布累积分布函数
  const x = df / (df + t * t);
  return 1 - 0.5 * Math.pow(x, df/2);
}

export function calculateBlandAltman(x: number[], y: number[]) {
  if (!x || !y || x.length !== y.length || x.length < 3) return null;

  const differences = x.map((xi, i) => xi - y[i]);
  const means = x.map((xi, i) => (xi + y[i]) / 2);
  
  const meanDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
  const sdDiff = Math.sqrt(
    differences.reduce((acc, diff) => acc + Math.pow(diff - meanDiff, 2), 0) / 
    (differences.length - 1)
  );

  const limits = {
    upper: meanDiff + 1.96 * sdDiff,
    lower: meanDiff - 1.96 * sdDiff
  };

  return {
    differences,
    means,
    meanDiff,
    sdDiff,
    limits
  };
}