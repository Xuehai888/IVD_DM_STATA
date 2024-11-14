import React from 'react';

interface DescriptiveStatsProps {
  evalStats: {
    n: number;
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    variance: number;
  } | null;
  compStats: {
    n: number;
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    variance: number;
  } | null;
  diffStats: {
    n: number;
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    variance: number;
  } | null;
}

export function DescriptiveStats({ evalStats, compStats, diffStats }: DescriptiveStatsProps) {
  if (!evalStats || !compStats || !diffStats) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              统计指标
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              考核试剂
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              对比试剂
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              两组差值
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">样本量</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evalStats.n}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{compStats.n}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{diffStats.n}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">均值</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evalStats.mean?.toFixed(4)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{compStats.mean?.toFixed(4)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{diffStats.mean?.toFixed(4)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">标准差</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evalStats.stdDev?.toFixed(4)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{compStats.stdDev?.toFixed(4)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{diffStats.stdDev?.toFixed(4)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">中位数</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evalStats.median?.toFixed(4)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{compStats.median?.toFixed(4)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{diffStats.median?.toFixed(4)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">最大值</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evalStats.max?.toFixed(4)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{compStats.max?.toFixed(4)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{diffStats.max?.toFixed(4)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">最小值</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evalStats.min?.toFixed(4)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{compStats.min?.toFixed(4)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{diffStats.min?.toFixed(4)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}