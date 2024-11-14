import React, { useRef } from 'react';
import { generateWordReport } from '../../utils/wordExport';
import Plot from 'react-plotly.js';
import { DescriptiveStats } from './analysis/DescriptiveStats';
import { NormalityTests } from './analysis/NormalityTests';
import { CorrelationAnalysis } from './analysis/CorrelationAnalysis';
import { RegressionAnalysis } from './analysis/RegressionAnalysis';
import { BlandAltmanAnalysis } from './analysis/BlandAltmanAnalysis';
import * as stats from '../../utils/statistics';

interface DataAnalysisProps {
  records: Array<{
    data: {
      evaluationReagentResult: number;
      comparisonReagentResult: number;
    };
  }>;
}

export function DataAnalysis({ records }: DataAnalysisProps) {
  const plotRef = useRef(null);

  const evalResults = records.map(r => Number(r.data.evaluationReagentResult));
  const compResults = records.map(r => Number(r.data.comparisonReagentResult));
  const differences = evalResults.map((v, i) => v - compResults[i]);

  const evalStats = stats.calculateDescriptiveStats(evalResults);
  const compStats = stats.calculateDescriptiveStats(compResults);
  const diffStats = stats.calculateDescriptiveStats(differences);

  // 正态性检验
  const evalNormality = {
    shapiroWilk: stats.shapiroWilkTest(evalResults),
    dAgostino: stats.dAgostinoTest(evalResults)
  };
  const compNormality = {
    shapiroWilk: stats.shapiroWilkTest(compResults),
    dAgostino: stats.dAgostinoTest(compResults)
  };
  const diffNormality = {
    shapiroWilk: stats.shapiroWilkTest(differences),
    dAgostino: stats.dAgostinoTest(differences)
  };
  
  const correlations = stats.calculateCorrelations(evalResults, compResults);
  const regression = stats.linearRegression(evalResults, compResults);
  const blandAltman = stats.calculateBlandAltman(evalResults, compResults);

  const handleExportWord = async () => {
    const data = {
      descriptiveStats: {
        eval: evalStats,
        comp: compStats,
        diff: diffStats
      },
      normalityTests: {
        eval: {
          shapiroWilk: evalNormality.shapiroWilk,
          dAgostino: evalNormality.dAgostino
        },
        comp: {
          shapiroWilk: compNormality.shapiroWilk,
          dAgostino: compNormality.dAgostino
        },
        diff: {
          shapiroWilk: diffNormality.shapiroWilk,
          dAgostino: diffNormality.dAgostino
        }
      },
      correlations: {
        pearson: correlations?.pearson,
        spearman: correlations?.spearman,
        pearsonP: 0.001, // 这里需要实际计算
        spearmanP: 0.001 // 这里需要实际计算
      },
      regression: {
        slope: regression?.slope,
        intercept: regression?.intercept,
        rSquared: regression?.rSquared,
        slopeSE: regression?.standardError,
        interceptSE: regression?.standardError,
        slopeT: regression?.tValue,
        interceptT: regression?.tValue,
        slopeP: regression?.pValue,
        interceptP: regression?.pValue
      },
      blandAltman: blandAltman
    };

    try {
      await generateWordReport(data, plotRef.current?.el);
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">描述性统计分析</h3>
        <DescriptiveStats evalStats={evalStats} compStats={compStats} diffStats={diffStats} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">正态性检验</h3>
        <NormalityTests 
          evalNormality={evalNormality}
          compNormality={compNormality}
          diffNormality={diffNormality}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">相关性分析</h3>
        <CorrelationAnalysis correlations={correlations} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">回归分析</h3>
        <RegressionAnalysis regression={regression} />
      </div>

      {blandAltman && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Bland-Altman分析</h3>
          <BlandAltmanAnalysis 
            evaluationResults={evalResults}
            comparisonResults={compResults}
            plotRef={plotRef}
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleExportWord}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          导出到Word
        </button>
      </div>
    </div>
  );
}