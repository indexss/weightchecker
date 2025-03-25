import { useState } from 'react';

export default function BackupButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      setMessage(null);
      
      const response = await fetch('/api/backup', {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage({ text: `备份成功! 文件保存在: ${data.path}`, type: 'success' });
      } else {
        setMessage({ text: '备份失败，请重试', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: '备份过程中出错', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleBackup}
        disabled={isLoading}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
      >
        {isLoading ? '备份中...' : '备份数据'}
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