import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function downloadExcelTemplate() {
  const template = [
    ['序号', '考核盲号', '对比盲号', '考核试剂', '对比试剂'],
    ['1', 'A37', 'B27', '3.87', '3.65'],
    ['2', 'A405', 'B40', '3.66', '3.73']
  ];

  const ws = XLSX.utils.aoa_to_sheet(template);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // 序号
    { wch: 12 }, // 考核盲号
    { wch: 12 }, // 对比盲号
    { wch: 12 }, // 考核试剂
    { wch: 12 }  // 对比试剂
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  // Generate buffer
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(blob, '数据导入模板.xlsx');
}