import React from 'react';
import Plot from 'react-plotly.js';

interface RegressionAnalysisProps {
  regression: {
    slope: number;
    intercept: number;
    rSquared: number;
    standardError: number;
    tValue: number;
    pValue: number;
    confidenceInterval: {
      lower: number;
      upper: number;
    };
  };
}

export function RegressionAnalysis({ regression }: RegressionAnalysisProps) {
  if (!regression) return null;

  const {
    slope,
    intercept,
    rSquared,
    standardError,
    tValue,
    pValue,
    confidenceInterval
  } = regression;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                参数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                估计值
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标准误
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                t值
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                P值
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                95%置信区间
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                截距
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {intercept?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {standardError?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tValue?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pValue?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                [{confidenceInterval?.lower?.toFixed(4)}, {confidenceInterval?.upper?.toFixed(4)}]
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                斜率
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {slope?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {standardError?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tValue?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pValue?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                [{confidenceInterval?.lower?.toFixed(4)}, {confidenceInterval?.upper?.toFixed(4)}]
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <strong>决定系数 (R²):</strong> {rSquared?.toFixed(4)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>回归方程:</strong> y = {slope?.toFixed(4)}x + {intercept?.toFixed(4)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>统计显著性:</strong>{' '}
          {pValue < 0.05 ? '回归关系显著 (p < 0.05)' : '回归关系不显著 (p ≥ 0.05)'}
        </p>
      </div>
    </div>
  );
}