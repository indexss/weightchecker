import { WeightRecord } from '@/types';

const STORAGE_KEY = 'weight_records';

// 获取所有体重记录
export const getWeightRecords = async (): Promise<WeightRecord[]> => {
  try {
    const response = await fetch('/api/weight-records', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('获取数据失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weight records:', error);
    return [];
  }
};

// 保存体重记录
export const saveWeightRecord = async (record: WeightRecord): Promise<boolean> => {
  try {
    const response = await fetch('/api/weight-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });
    
    if (!response.ok) {
      throw new Error('保存数据失败');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving weight record:', error);
    return false;
  }
};

// 删除体重记录
export const deleteWeightRecord = async (date: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/weight-records?date=${date}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('删除数据失败');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting weight record:', error);
    return false;
  }
};

// 获取最近的体重记录
export const getLatestWeightRecord = async (): Promise<WeightRecord | null> => {
  const records = await getWeightRecords();
  if (records.length === 0) return null;
  
  // 按日期降序排序
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return sortedRecords[0];
}; 