import React from 'react';
import Plot from 'react-plotly.js';
import { blandAltmanAnalysis } from '../../../utils/statistics';

interface BlandAltmanPlotProps {
  evaluationResults: number[];
  comparisonResults: number[];
}

export function BlandAltmanPlot({ evaluationResults, comparisonResults }: BlandAltmanPlotProps) {
  const analysis = blandAltmanAnalysis(evaluationResults, comparisonResults);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Bland-Altman分析</h3>
      <div className="space-y-4">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody>
            <tr>
              <td className="px-4 py-2 bg-gray-50 font-medium">差值均值</td>
              <td className="px-4 py-2">{analysis.meanDiff.toFixed(4)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 bg-gray-50 font-medium">差值标准差</td>
              <td className="px-4 py-2">{analysis.stdDevDiff.toFixed(4)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 bg-gray-50 font-medium">95%界值</td>
              <td className="px-4 py-2">
                {analysis.limits.lower.toFixed(4)} ~ {analysis.limits.upper.toFixed(4)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 bg-gray-50 font-medium">异常点数(比率)</td>
              <td className="px-4 py-2">
                {analysis.outliers.filter(o => o.isOutlier).length} 
                ({((analysis.outliers.filter(o => o.isOutlier).length / analysis.outliers.length) * 100).toFixed(1)}%)
              </td>
            </tr>
          </tbody>
        </table>
        
        <Plot
          data={[
            {
              x: analysis.means,
              y: analysis.differences,
              mode: 'markers',
              type: 'scatter',
              name: '差值'
            },
            {
              x: [Math.min(...analysis.means), Math.max(...analysis.means)],
              y: [analysis.meanDiff, analysis.meanDiff],
              mode: 'lines',
              name: '均值',
              line: { dash: 'solid', color: 'blue' }
            },
            {
              x: [Math.min(...analysis.means), Math.max(...analysis.means)],
              y: [analysis.limits.upper, analysis.limits.upper],
              mode: 'lines',
              name: '+1.96SD',
              line: { dash: 'dash', color: 'red' }
            },
            {
              x: [Math.min(...analysis.means), Math.max(...analysis.means)],
              y: [analysis.limits.lower, analysis.limits.lower],
              mode: 'lines',
              name: '-1.96SD',
              line: { dash: 'dash', color: 'red' }
            }
          ]}
          layout={{
            title: 'Bland-Altman图',
            xaxis: { title: '均值 ((考核+对照)/2)' },
            yaxis: { title: '差值 (考核-对照)' },
            width: 600,
            height: 400,
            showlegend: true
          }}
        />
      </div>
    </div>
  );
}