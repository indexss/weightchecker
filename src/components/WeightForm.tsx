import { useState, useEffect } from 'react';
import { getToday } from '@/utils/dateUtils';
import { saveWeightRecord, getLatestWeightRecord } from '@/utils/storage';

interface WeightFormProps {
  onWeightSaved: () => void;
}

export default function WeightForm({ onWeightSaved }: WeightFormProps) {
  const [date, setDate] = useState(getToday());
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 加载最近的体重记录作为默认值
  useEffect(() => {
    const loadLatestRecord = async () => {
      const latestRecord = await getLatestWeightRecord();
      if (latestRecord) {
        setWeight(latestRecord.weight.toString());
      }
    };
    
    loadLatestRecord();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      setError('请输入有效的体重数值');
      return;
    }
    
    setIsSaving(true);
    
    // 保存记录
    const success = await saveWeightRecord({
      date,
      weight: Number(weight)
    });
    
    setIsSaving(false);
    
    if (success) {
      // 通知父组件
      onWeightSaved();
      
      // 重置表单
      setDate(getToday());
      setError('');
    } else {
      setError('保存失败，请重试');
    }
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-lg shadow mb-4 md:mb-6">
      <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">记录体重</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3 md:mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            日期
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm md:text-base"
            max={getToday()}
          />
        </div>
        
        <div className="mb-3 md:mb-4">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            体重 (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setError('');
            }}
            step="0.1"
            min="0"
            placeholder="输入体重 (kg)"
            className="w-full p-2 border border-gray-300 rounded text-sm md:text-base"
          />
          {error && <p className="text-red-500 text-xs md:text-sm mt-1">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 text-sm md:text-base"
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  );
} 