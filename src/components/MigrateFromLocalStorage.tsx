import { useState } from 'react';

export default function MigrateFromLocalStorage({ onComplete }: { onComplete: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleMigrate = async () => {
    try {
      setIsLoading(true);
      setMessage(null);
      
      // 从localStorage获取数据
      const storageData = localStorage.getItem('weight_records');
      
      if (!storageData) {
        setMessage({ text: '本地存储中没有找到数据', type: 'error' });
        return;
      }
      
      const records = JSON.parse(storageData);
      
      // 发送到服务器
      const response = await fetch('/api/migrate-from-localstorage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(records),
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessage({ text: result.message, type: 'success' });
        onComplete();
      } else {
        setMessage({ text: '导入失败，请重试', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: '导入过程中出错', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleMigrate}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isLoading ? '导入中...' : '从浏览器导入数据'}
      </button>
      
      {message && (
        <div className={`mt-2 p-2 text-sm rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
} 