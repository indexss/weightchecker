'use client';

import { useState, useEffect } from 'react';
import WeightForm from '@/components/WeightForm';
import WeightChart from '@/components/WeightChart';
import WeightRecordList from '@/components/WeightRecordList';
import { getWeightRecords } from '@/utils/storage';
import { WeightRecord } from '@/types';
import ExportButton from '@/components/ExportButton';
import ImportCSV from '@/components/ImportCSV';
import LoginForm from '@/components/LoginForm';
import { isAuthenticated, logout } from '@/utils/auth';

export default function Home() {
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartSize, setChartSize] = useState('large');
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 检查认证状态
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  // 加载数据
  const loadRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/weight-records');
      
      if (!response.ok) {
        throw new Error('加载数据失败');
      }
      
      const data = await response.json();
      setRecords(data);
      setError(null);
    } catch (error) {
      setError('加载数据失败，请刷新页面重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 当用户登录后加载数据
  useEffect(() => {
    if (isLoggedIn) {
      loadRecords();
    }
  }, [isLoggedIn]);

  // 当记录变化时更新状态
  const handleDataChange = () => {
    loadRecords();
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  // 如果未登录，显示登录表单
  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-3 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <h1 className="text-xl md:text-3xl font-bold mb-2 sm:mb-0">体重记录管理</h1>
          <div className="flex space-x-2 self-end sm:self-auto">
            <ExportButton />
            <button
              onClick={handleLogout}
              className="px-2 py-1 md:px-3 md:py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs md:text-sm"
            >
              退出登录
            </button>
          </div>
        </div>
        
        <div className="hidden md:flex justify-end mb-2">
          <div className="bg-white rounded-lg shadow p-2 inline-flex space-x-2">
            <span className="text-sm flex items-center mr-2">图表大小:</span>
            <button
              onClick={() => setChartSize('small')}
              className={`px-2 py-1 text-xs rounded ${
                chartSize === 'small' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              小
            </button>
            <button
              onClick={() => setChartSize('medium')}
              className={`px-2 py-1 text-xs rounded ${
                chartSize === 'medium' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              中
            </button>
            <button
              onClick={() => setChartSize('large')}
              className={`px-2 py-1 text-xs rounded ${
                chartSize === 'large' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              大
            </button>
          </div>
        </div>
        
        <div className={`grid grid-cols-1 ${
          chartSize === 'small' ? 'md:grid-cols-3' : 
          chartSize === 'medium' ? 'md:grid-cols-4' : 
          'md:grid-cols-1'
        } gap-4 md:gap-6`}>
          <div className={`${
            chartSize === 'small' ? 'md:col-span-2' : 
            chartSize === 'medium' ? 'md:col-span-3' : 
            'md:col-span-1'
          }`}>
            <WeightChart 
              records={records} 
              height={
                `${window.innerWidth < 768 ? 'h-60' : 
                chartSize === 'small' ? 'h-64' : 
                chartSize === 'medium' ? 'h-80' : 
                'h-96'}`
              } 
            />
          </div>
          
          <div>
            <WeightForm onWeightSaved={handleDataChange} />
            
            <ImportCSV onImportComplete={handleDataChange} />
            
            <div className="bg-white p-4 rounded-lg shadow">
              <details className="md:hidden">
                <summary className="text-xl font-bold mb-2 cursor-pointer">使用说明</summary>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>在表单中输入日期和体重进行记录</li>
                  <li>图表会自动连接缺失日期的数据点</li>
                  <li>可以切换各种视图查看不同时间段的趋势</li>
                  <li>数据将持久化存储在本地数据库文件中</li>
                  <li>点击日期可以查看详细信息</li>
                </ul>
              </details>
              
              <div className="hidden md:block">
                <h2 className="text-xl font-bold mb-4">使用说明</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>在右侧表单中输入日期和体重进行记录</li>
                  <li>图表会自动连接缺失日期的数据点</li>
                  <li>可以切换周/月/3个月/年视图查看不同时间段的趋势</li>
                  <li>数据将持久化存储在本地数据库文件中</li>
                  <li>点击日期可以查看详细信息</li>
                  <li>可以调整图表大小以获得更好的视觉效果</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-6">
          <WeightRecordList 
            records={records} 
            onRecordDeleted={handleDataChange} 
          />
        </div>
      </div>
    </main>
  );
}
