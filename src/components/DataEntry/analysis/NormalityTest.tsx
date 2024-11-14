import React from 'react';
import { DataRecord } from '../../../types';
import { shapiroWilkTest, dAgostinoTest } from '../../../utils/statistics';

interface NormalityTestProps {
  records: DataRecord[];
}

export function NormalityTest({ records }: NormalityTestProps) {
  const evalResults = records.map(r => Number(r.data.evaluationReagentResult));
  const compResults = records.map(r => Number(r.data.comparisonReagentResult));
  const differences = evalResults.map((v, i) => v - compResults[i]);

  const shapiroEval = shapiroWilkTest(evalResults);
  const shapiroComp = shapiroWilkTest(compResults);
  const shapiroDiff = shapiroWilkTest(differences);

  const dAgostinoEval = dAgostinoTest(evalResults);
  const dAgostinoComp = dAgostinoTest(compResults);
  const dAgostinoDiff = dAgostinoTest(differences);

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">正态性检验</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">检验方法</th>
              <th className="px-4 py-2">数据组</th>
              <th className="px-4 py-2">统计量</th>
              <th className="px-4 py-2">p值</th>
              <th className="px-4 py-2">结论</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td rowSpan={3} className="px-4 py-2">Shapiro-Wilk检验</td>
              <td className="px-4 py-2">考核组</td>
              <td className="px-4 py-2">{shapiroEval.statistic.toFixed(4)}</td>
              <td className="px-4 py-2">{shapiroEval.pValue.toFixed(4)}</td>
              <td className="px-4 py-2">{shapiroEval.pValue >= 0.05 ? '服从正态分布' : '不服从正态分布'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2">对照组</td>
              <td className="px-4 py-2">{shapiroComp.statistic.toFixed(4)}</td>
              <td className="px-4 py-2">{shapiroComp.pValue.toFixed(4)}</td>
              <td className="px-4 py-2">{shapiroComp.pValue >= 0.05 ? '服从正态分布' : '不服从正态分布'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2">差值</td>
              <td className="px-4 py-2">{shapiroDiff.statistic.toFixed(4)}</td>
              <td className="px-4 py-2">{shapiroDiff.pValue.toFixed(4)}</td>
              <td className="px-4 py-2">{shapiroDiff.pValue >= 0.05 ? '服从正态分布' : '不服从正态分布'}</td>
            </tr>
            <tr>
              <td rowSpan={3} className="px-4 py-2">D'Agostino检验</td>
              <td className="px-4 py-2">考核组</td>
              <td className="px-4 py-2">{dAgostinoEval.statistic.toFixed(4)}</td>
              <td className="px-4 py-2">{dAgostinoEval.pValue.toFixed(4)}</td>
              <td className="px-4 py-2">{dAgostinoEval.pValue >= 0.05 ? '服从正态分布' : '不服从正态分布'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2">对照组</td>
              <td className="px-4 py-2">{dAgostinoComp.statistic.toFixed(4)}</td>
              <td className="px-4 py-2">{dAgostinoComp.pValue.toFixed(4)}</td>
              <td className="px-4 py-2">{dAgostinoComp.pValue >= 0.05 ? '服从正态分布' : '不服从正态分布'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2">差值</td>
              <td className="px-4 py-2">{dAgostinoDiff.statistic.toFixed(4)}</td>
              <td className="px-4 py-2">{dAgostinoDiff.pValue.toFixed(4)}</td>
              <td className="px-4 py-2">{dAgostinoDiff.pValue >= 0.05 ? '服从正态分布' : '不服从正态分布'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}