import { useState } from 'react';

interface ImportCSVProps {
  onImportComplete: () => void;
}

export default function ImportCSV({ onImportComplete }: ImportCSVProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage({ text: result.message, type: 'success' });
        setFile(null);
        onImportComplete(); // 通知父组件导入完成，刷新数据
      } else {
        setMessage({ text: `错误: ${result.error}`, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: '导入失败，请重试', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-lg shadow mb-4 md:mb-6">
      <h2 className="text-lg md:text-xl font-bold mb-3">导入CSV数据</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            选择CSV文件
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            CSV格式：第一行为标题行(日期,体重(kg))，之后每行一条记录
          </p>
        </div>
        
        <button
          type="submit"
          disabled={!file || isUploading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 text-sm md:text-base"
        >
          {isUploading ? '导入中...' : '导入数据'}
        </button>
        
        {message && (
          <div className={`mt-3 p-2 text-sm rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
} 