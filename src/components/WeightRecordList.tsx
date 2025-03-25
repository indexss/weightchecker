import { useState } from 'react';
import { WeightRecord } from '@/types';
import { deleteWeightRecord } from '@/utils/storage';

interface WeightRecordListProps {
  records: WeightRecord[];
  onRecordDeleted: () => void;
}

export default function WeightRecordList({ records, onRecordDeleted }: WeightRecordListProps) {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 按日期降序排序
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = async (date: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      setIsDeleting(date);
      const success = await deleteWeightRecord(date);
      setIsDeleting(null);
      
      if (success) {
        onRecordDeleted();
      } else {
        alert('删除失败，请重试');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (records.length === 0) {
    return (
      <div className="bg-white p-3 md:p-4 rounded-lg shadow">
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">体重记录</h2>
        <p className="text-gray-500 text-center py-4 text-sm md:text-base">暂无体重记录</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 md:p-4 rounded-lg shadow">
      <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">体重记录</h2>
      
      <div className="max-h-80 overflow-y-auto">
        <table className="w-full text-sm md:text-base">
          <thead className="border-b">
            <tr>
              <th className="text-left py-2">日期</th>
              <th className="text-right py-2">体重(kg)</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record) => (
              <tr key={record.date} className="border-b hover:bg-gray-50">
                <td 
                  className="py-2 md:py-3 cursor-pointer"
                  onClick={() => setExpandedRecord(expandedRecord === record.date ? null : record.date)}
                >
                  {record.date}
                  {expandedRecord === record.date && (
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(record.date)}
                    </div>
                  )}
                </td>
                <td className="py-2 md:py-3 text-right font-medium">{record.weight}</td>
                <td className="py-2 md:py-3 text-right">
                  <button
                    onClick={() => handleDelete(record.date)}
                    className="text-red-500 hover:text-red-700 text-sm md:text-base"
                  >
                    删除
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