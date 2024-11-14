import React from 'react';

interface Props {
  evalNormality: {
    shapiroWilk: { statistic: number; pValue: number };
    dAgostino: { statistic: number; pValue: number };
  };
  compNormality: {
    shapiroWilk: { statistic: number; pValue: number };
    dAgostino: { statistic: number; pValue: number };
  };
  diffNormality: {
    shapiroWilk: { statistic: number; pValue: number };
    dAgostino: { statistic: number; pValue: number };
  };
}

export function NormalityTests({ evalNormality, compNormality, diffNormality }: Props) {
  const isNormal = (pValue: number) => pValue >= 0.05;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              检验方法
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
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Shapiro-Wilk检验
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              W={evalNormality.shapiroWilk.statistic.toFixed(4)}<br />
              p={evalNormality.shapiroWilk.pValue.toFixed(4)}<br />
              {isNormal(evalNormality.shapiroWilk.pValue) ? '符合正态分布' : '不符合正态分布'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              W={compNormality.shapiroWilk.statistic.toFixed(4)}<br />
              p={compNormality.shapiroWilk.pValue.toFixed(4)}<br />
              {isNormal(compNormality.shapiroWilk.pValue) ? '符合正态分布' : '不符合正态分布'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              W={diffNormality.shapiroWilk.statistic.toFixed(4)}<br />
              p={diffNormality.shapiroWilk.pValue.toFixed(4)}<br />
              {isNormal(diffNormality.shapiroWilk.pValue) ? '符合正态分布' : '不符合正态分布'}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              D'Agostino检验
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              K2={evalNormality.dAgostino.statistic.toFixed(4)}<br />
              p={evalNormality.dAgostino.pValue.toFixed(4)}<br />
              {isNormal(evalNormality.dAgostino.pValue) ? '符合正态分布' : '不符合正态分布'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              K2={compNormality.dAgostino.statistic.toFixed(4)}<br />
              p={compNormality.dAgostino.pValue.toFixed(4)}<br />
              {isNormal(compNormality.dAgostino.pValue) ? '符合正态分布' : '不符合正态分布'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              K2={diffNormality.dAgostino.statistic.toFixed(4)}<br />
              p={diffNormality.dAgostino.pValue.toFixed(4)}<br />
              {isNormal(diffNormality.dAgostino.pValue) ? '符合正态分布' : '不符合正态分布'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}