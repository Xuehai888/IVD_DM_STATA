import React from 'react';
import Plot from 'react-plotly.js';
import { calculateBlandAltman } from '../../../utils/statistics';

interface BlandAltmanAnalysisProps {
  evaluationResults: number[];
  comparisonResults: number[];
  plotRef: React.RefObject<any>;
}

export function BlandAltmanAnalysis({ evaluationResults, comparisonResults, plotRef }: BlandAltmanAnalysisProps) {
  const blandAltman = calculateBlandAltman(evaluationResults, comparisonResults);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Bland-Altman分析</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                平均差值
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {blandAltman.meanDiff.toFixed(4)}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                差值标准差
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {blandAltman.sdDiff.toFixed(4)}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                95%一致性区间上限
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {blandAltman.limits.upper.toFixed(4)}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                95%一致性区间下限
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {blandAltman.limits.lower.toFixed(4)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Plot
          ref={plotRef}
          data={[
            {
              x: blandAltman.means,
              y: blandAltman.differences,
              mode: 'markers',
              type: 'scatter',
              name: '差值',
              marker: { color: 'blue' }
            },
            {
              x: blandAltman.means,
              y: Array(blandAltman.means.length).fill(blandAltman.meanDiff),
              mode: 'lines',
              name: '平均差值',
              line: { color: 'red', dash: 'dash' }
            },
            {
              x: blandAltman.means,
              y: Array(blandAltman.means.length).fill(blandAltman.limits.upper),
              mode: 'lines',
              name: '+1.96SD',
              line: { color: 'green', dash: 'dot' }
            },
            {
              x: blandAltman.means,
              y: Array(blandAltman.means.length).fill(blandAltman.limits.lower),
              mode: 'lines',
              name: '-1.96SD',
              line: { color: 'green', dash: 'dot' }
            }
          ]}
          layout={{
            title: 'Bland-Altman图',
            xaxis: {
              title: '均值 ((考核试剂 + 对比试剂) / 2)'
            },
            yaxis: {
              title: '差值 (考核试剂 - 对比试剂)'
            },
            showlegend: true,
            legend: {
              x: 1,
              xanchor: 'right',
              y: 1
            },
            width: 800,
            height: 600,
            font: {
              family: 'Arial',
              size: 14
            }
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            toImageButtonOptions: {
              format: 'png',
              filename: 'bland_altman_plot',
              height: 800,
              width: 1200,
              scale: 2
            }
          }}
        />
      </div>
    </div>
  );
}