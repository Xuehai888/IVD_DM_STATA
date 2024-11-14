import React from 'react';

interface CorrelationAnalysisProps {
  correlations: {
    pearson: number;
    spearman: number;
    n: number;
  } | null;
}

export function CorrelationAnalysis({ correlations }: CorrelationAnalysisProps) {
  if (!correlations) return null;

  const interpretCorrelation = (value: number) => {
    const abs = Math.abs(value);
    if (abs >= 0.8) return '强相关';
    if (abs >= 0.5) return '中等相关';
    if (abs >= 0.3) return '弱相关';
    return '极弱相关或无相关';
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                相关系数类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                相关系数值
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                相关强度解释
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Pearson相关系数
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {correlations.pearson?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {interpretCorrelation(correlations.pearson)}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Spearman等级相关系数
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {correlations.spearman?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {interpretCorrelation(correlations.spearman)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <strong>样本量:</strong> {correlations.n}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <strong>结论:</strong>{' '}
          {Math.abs(correlations.pearson) > Math.abs(correlations.spearman)
            ? 'Pearson相关系数更强，说明数据可能存在线性关系。'
            : 'Spearman相关系数更强，说明数据可能存在非线性单调关系。'}
        </p>
      </div>
    </div>
  );
}