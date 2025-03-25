// 体重记录类型定义
export interface WeightRecord {
  date: string; // 格式: 'YYYY-MM-DD'
  weight: number; // 单位: kg
}

// 曲线图视图类型
export type ViewMode = 'week' | 'month' | 'quarter' | 'year'; 