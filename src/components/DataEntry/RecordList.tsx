import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Edit2, Trash2 } from 'lucide-react';

const fieldLabels: Record<string, string> = {
  sequenceNumber: '序号',
  evaluationBlindNumber: '考核盲号',
  comparisonBlindNumber: '对比盲号',
  evaluationReagentResult: '考核试剂检测结果',
  comparisonReagentResult: '对比试剂检测结果',
  absoluteDeviation: '绝对偏差',
  absoluteDeviationValue: '绝对偏差绝对值',
  relativeDeviation: '相对偏差',
  evaluationComparisonRatio: '考核试剂/对照试剂',
};

export function RecordList() {
  const { records, deleteRecord } = useProjectStore();

  const handleEdit = (record: any) => {
    const event = new CustomEvent('editRecord', { detail: record });
    window.dispatchEvent(event);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      deleteRecord(id);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.entries(fieldLabels).map(([field, label]) => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                {Object.keys(fieldLabels).map((field) => (
                  <td
                    key={field}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {record.data[field]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEdit(record)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(record.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}