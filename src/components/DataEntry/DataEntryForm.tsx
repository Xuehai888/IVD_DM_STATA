import React, { useState, useRef } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Save, Upload, BarChart, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DataAnalysis } from './DataAnalysis';
import { downloadExcelTemplate } from '../../utils/excelTemplate';

const fieldLabels: Record<string, string> = {
  sequenceNumber: '序号',
  evaluationBlindNumber: '考核盲号',
  comparisonBlindNumber: '对比盲号',
  evaluationReagentResult: '考核试剂检测结果',
  comparisonReagentResult: '对比试剂检测结果',
};

const excelFieldMapping: Record<string, string> = {
  '序号': 'sequenceNumber',
  '考核盲号': 'evaluationBlindNumber',
  '对比盲号': 'comparisonBlindNumber',
  '考核试剂': 'evaluationReagentResult',
  '对比试剂': 'comparisonReagentResult',
};

export function DataEntryForm() {
  const { addRecord, addRecords, updateRecord, records } = useProjectStore();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateRecord(editingId, formData);
      setEditingId(null);
    } else {
      addRecord(formData);
    }
    setFormData({});
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        // Get headers from first row
        const headers = rawData[0] as string[];
        
        // Convert Excel data to our format
        const formattedData = rawData.slice(1).map((row: any) => {
          const record: Record<string, any> = {};
          headers.forEach((header, index) => {
            const fieldName = excelFieldMapping[header];
            if (fieldName) {
              record[fieldName] = row[index];
            }
          });
          return record;
        });

        addRecords(formattedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleTemplateDownload = () => {
    downloadExcelTemplate();
  };

  const handleEditRecord = (record: any) => {
    setFormData(record.data);
    setEditingId(record.id);
  };

  React.useEffect(() => {
    const handleEditEvent = (event: CustomEvent) => {
      handleEditRecord(event.detail);
    };
    window.addEventListener('editRecord', handleEditEvent as EventListener);
    return () => {
      window.removeEventListener('editRecord', handleEditEvent as EventListener);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">数据录入</h2>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx,.xls"
              className="hidden"
            />
            <button
              onClick={handleTemplateDownload}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              下载导入模板
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              批量导入
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(fieldLabels).map(([field, label]) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              <input
                type={field.includes('Result') ? 'number' : 'text'}
                id={field}
                required={true}
                value={formData[field] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
          <div className="lg:col-span-3 flex justify-end mt-4">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingId ? '更新记录' : '添加记录'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">数据分析</h3>
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <BarChart className="h-4 w-4 mr-2" />
            {showAnalysis ? '隐藏分析' : '显示分析'}
          </button>
        </div>
        
        {showAnalysis && records.length > 0 && (
          <DataAnalysis records={records} />
        )}
      </div>
    </div>
  );
}