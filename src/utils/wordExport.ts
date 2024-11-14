import { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, ImageRun, AlignmentType, WidthType, BorderStyle, TextRun, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

const tableStyle = {
  width: {
    size: 100,
    type: WidthType.PERCENTAGE,
  },
  margins: {
    top: convertInchesToTwip(0.1),
    bottom: convertInchesToTwip(0.1),
    left: convertInchesToTwip(0.1),
    right: convertInchesToTwip(0.1),
  },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
  }
};

const titleStyle = {
  heading: HeadingLevel.HEADING_1,
  alignment: AlignmentType.CENTER,
  spacing: {
    before: 400,
    after: 400
  },
  run: {
    size: 32,
    bold: true,
    font: "SimSun"
  }
};

const subtitleStyle = {
  heading: HeadingLevel.HEADING_2,
  spacing: {
    before: 300,
    after: 200
  },
  run: {
    size: 28,
    bold: true,
    font: "SimSun"
  }
};

export async function generateWordReport(data: any, plotElement: HTMLElement | null) {
  // 捕获Bland-Altman图
  let plotImage = null;
  if (plotElement) {
    try {
      const canvas = await html2canvas(plotElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      plotImage = canvas.toDataURL('image/png').split(',')[1];
    } catch (error) {
      console.error('Error capturing plot:', error);
    }
  }

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            size: 24,
            font: "SimSun"
          }
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 32,
            bold: true,
            font: "SimSun"
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 240
            }
          }
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 28,
            bold: true,
            font: "SimSun"
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120
            }
          }
        }
      ]
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },
      children: [
        new Paragraph({
          text: "数据分析报告",
          ...titleStyle
        }),

        // 1. 描述性统计
        new Paragraph({
          text: "1. 描述性统计分析",
          ...subtitleStyle
        }),
        new Table({
          ...tableStyle,
          rows: [
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "统计量", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "考核试剂", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "对比试剂", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "差值", bold: true })]
                  })]
                })
              ]
            }),
            ...['n', 'mean', 'stdDev', 'median', 'max', 'min'].map(key => 
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: {
                    'n': '样本量',
                    'mean': '均值',
                    'stdDev': '标准差',
                    'median': '中位数',
                    'max': '最大值',
                    'min': '最小值'
                  }[key] })] }),
                  new TableCell({ children: [new Paragraph({ text: data.descriptiveStats.eval[key]?.toFixed(4) || '-' })] }),
                  new TableCell({ children: [new Paragraph({ text: data.descriptiveStats.comp[key]?.toFixed(4) || '-' })] }),
                  new TableCell({ children: [new Paragraph({ text: data.descriptiveStats.diff[key]?.toFixed(4) || '-' })] })
                ]
              })
            )
          ]
        }),

        // 2. 正态性检验
        new Paragraph({
          text: "2. 正态性检验",
          ...subtitleStyle
        }),
        new Table({
          ...tableStyle,
          rows: [
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "检验方法", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "考核试剂", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "对比试剂", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "差值", bold: true })]
                  })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Shapiro-Wilk检验" })] }),
                new TableCell({ children: [
                  new Paragraph({ text: `W = ${data.normalityTests.eval.shapiroWilk.statistic.toFixed(4)}` }),
                  new Paragraph({ text: `p = ${data.normalityTests.eval.shapiroWilk.pValue.toFixed(4)}` })
                ]}),
                new TableCell({ children: [
                  new Paragraph({ text: `W = ${data.normalityTests.comp.shapiroWilk.statistic.toFixed(4)}` }),
                  new Paragraph({ text: `p = ${data.normalityTests.comp.shapiroWilk.pValue.toFixed(4)}` })
                ]}),
                new TableCell({ children: [
                  new Paragraph({ text: `W = ${data.normalityTests.diff.shapiroWilk.statistic.toFixed(4)}` }),
                  new Paragraph({ text: `p = ${data.normalityTests.diff.shapiroWilk.pValue.toFixed(4)}` })
                ]})
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "D'Agostino检验" })] }),
                new TableCell({ children: [
                  new Paragraph({ text: `K2 = ${data.normalityTests.eval.dAgostino.statistic.toFixed(4)}` }),
                  new Paragraph({ text: `p = ${data.normalityTests.eval.dAgostino.pValue.toFixed(4)}` })
                ]}),
                new TableCell({ children: [
                  new Paragraph({ text: `K2 = ${data.normalityTests.comp.dAgostino.statistic.toFixed(4)}` }),
                  new Paragraph({ text: `p = ${data.normalityTests.comp.dAgostino.pValue.toFixed(4)}` })
                ]}),
                new TableCell({ children: [
                  new Paragraph({ text: `K2 = ${data.normalityTests.diff.dAgostino.statistic.toFixed(4)}` }),
                  new Paragraph({ text: `p = ${data.normalityTests.diff.dAgostino.pValue.toFixed(4)}` })
                ]})
              ]
            })
          ]
        }),

        // 3. 相关性分析
        new Paragraph({
          text: "3. 相关性分析",
          ...subtitleStyle
        }),
        new Table({
          ...tableStyle,
          rows: [
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "相关系数类型", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "相关系数值", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "p值", bold: true })]
                  })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Pearson相关" })] }),
                new TableCell({ children: [new Paragraph({ text: data.correlations.pearson.toFixed(4) })] }),
                new TableCell({ children: [new Paragraph({ text: data.correlations.pearsonP.toFixed(4) })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Spearman等级相关" })] }),
                new TableCell({ children: [new Paragraph({ text: data.correlations.spearman.toFixed(4) })] }),
                new TableCell({ children: [new Paragraph({ text: data.correlations.spearmanP.toFixed(4) })] })
              ]
            })
          ]
        }),

        // 4. 回归分析
        new Paragraph({
          text: "4. 回归分析",
          ...subtitleStyle
        }),
        new Table({
          ...tableStyle,
          rows: [
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "参数", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "估计值", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "标准误", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "t值", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "p值", bold: true })]
                  })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "截距" })] }),
                new TableCell({ children: [new Paragraph({ text: data.regression.intercept.toFixed(4) })] }),
                new TableCell({ children: [new Paragraph({ text: data.regression.interceptSE.toFixed(4) })] }),
                new TableCell({ children: [new Paragraph({ text: data.regression.interceptT.toFixed(4) })] }),
                new TableCell({ children: [new Paragraph({ text: data.regression.interceptP.toFixed(4) })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "斜率" })] }),
                new TableCell({ children: [new Paragraph({ text: data.regression.slope.toFixed(4) })] }),
                new TableCell({ children: [new Paragraph({ text: data.regression.slopeSE.toFixed(4) })] }),
                new TableCell({ children: [new Paragraph({ text: data.regression.slopeT.toFixed(4) })] }),
                new TableCell({ children: [new Paragraph({ text: data.regression.slopeP.toFixed(4) })] })
              ]
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `R² = ${data.regression.rSquared.toFixed(4)}`, bold: true }),
            new TextRun({ text: `\n回归方程：y = ${data.regression.slope.toFixed(4)}x + ${data.regression.intercept.toFixed(4)}` })
          ]
        }),

        // 5. Bland-Altman分析
        new Paragraph({
          text: "5. Bland-Altman分析",
          ...subtitleStyle
        }),
        new Table({
          ...tableStyle,
          rows: [
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "参数", bold: true })]
                  })]
                }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "值", bold: true })]
                  })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "平均差值" })] }),
                new TableCell({ children: [new Paragraph({ text: data.blandAltman.meanDiff.toFixed(4) })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "差值标准差" })] }),
                new TableCell({ children: [new Paragraph({ text: data.blandAltman.sdDiff.toFixed(4) })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "95%一致性限值上限" })] }),
                new TableCell({ children: [new Paragraph({ text: data.blandAltman.limits.upper.toFixed(4) })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "95%一致性限值下限" })] }),
                new TableCell({ children: [new Paragraph({ text: data.blandAltman.limits.lower.toFixed(4) })] })
              ]
            })
          ]
        }),

        // Bland-Altman图
        ...(plotImage ? [
          new Paragraph({
            text: "图1. Bland-Altman分析图",
            ...subtitleStyle,
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new ImageRun({
                data: plotImage,
                transformation: {
                  width: 600,
                  height: 400
                }
              })
            ],
            alignment: AlignmentType.CENTER
          })
        ] : [])
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "数据分析报告.docx");
}