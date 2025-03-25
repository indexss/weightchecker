import { useState } from 'react';

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // 使用浏览器的方式直接触发下载
      window.location.href = '/api/export';
      
      // 短暂延迟后重置状态
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('导出失败:', error);
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center px-2 py-1 md:px-3 md:py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors text-xs md:text-sm"
    >
      {isExporting ? (
        <>
          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 md:h-4 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          导出中...
        </>
      ) : (
        <>
          <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
          </svg>
          导出CSV
        </>
      )}
    </button>
  );
} 