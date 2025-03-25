import { WeightRecord, ViewMode } from '@/types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, parseISO, isWithinInterval } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 获取今天的日期，格式为 'YYYY-MM-DD'
export const getToday = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

// 获取指定视图模式的日期范围，始终以今天为结束日期
export const getDateRange = (viewMode: ViewMode): { start: Date, end: Date } => {
  const today = new Date(); // 今天作为结束日期
  const end = today;
  let start = new Date(today);
  
  switch (viewMode) {
    case 'week':
      // 往回推7天
      start.setDate(today.getDate() - 6); // 显示7天数据，包括今天
      break;
    case 'month':
      // 往回推30天
      start.setDate(today.getDate() - 29); // 显示30天数据，包括今天
      break;
    case 'quarter':
      // 往回推90天
      start.setDate(today.getDate() - 89); // 显示90天数据，包括今天
      break;
    case 'year':
      // 往回推365天
      start.setDate(today.getDate() - 364); // 显示365天数据，包括今天
      break;
  }
  
  return { start, end };
};

// 将日期格式化为友好的显示格式
export const formatDateDisplay = (viewMode: ViewMode): string => {
  const { start, end } = getDateRange(viewMode);
  
  switch (viewMode) {
    case 'week':
      const weekStart = format(start, 'MM.dd', { locale: zhCN });
      const weekEnd = format(end, 'MM.dd', { locale: zhCN });
      return `${weekStart} - ${weekEnd}`;
    case 'month':
      // 显示30天范围
      const monthStart = format(start, 'MM.dd', { locale: zhCN });
      const monthEnd = format(end, 'MM.dd', { locale: zhCN });
      return `${monthStart} - ${monthEnd}`;
    case 'quarter':
      // 显示90天范围
      const quarterStart = format(start, 'MM.dd', { locale: zhCN });
      const quarterEnd = format(end, 'MM.dd', { locale: zhCN });
      return `${format(start, 'yyyy年', { locale: zhCN })}${quarterStart} - ${quarterEnd}`;
    case 'year':
      // 显示365天范围
      const yearStart = format(start, 'yyyy.MM.dd', { locale: zhCN });
      const yearEnd = format(end, 'yyyy.MM.dd', { locale: zhCN });
      return `${yearStart} - ${yearEnd}`;
  }
};

// 根据日期范围和记录生成完整的数据序列
export const generateDataPoints = (
  records: WeightRecord[],
  viewMode: ViewMode
): { labels: string[], data: number[] } => {
  // 获取当前视图的日期范围，始终以今天结束
  const dateRange = getDateRange(viewMode);
  
  // 生成从开始日期到今天的所有日期
  const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  
  // 按日期排序记录
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const labels: string[] = [];
  const data: number[] = [];
  
  // 保存最后一个有效的体重值
  let lastWeight: number | null = null;
  
  // 找到范围之前的最后一个记录
  const recordsBeforeRange = sortedRecords.filter(
    r => parseISO(r.date) < dateRange.start
  );
  
  if (recordsBeforeRange.length > 0) {
    lastWeight = recordsBeforeRange[recordsBeforeRange.length - 1].weight;
  }
  
  // 为每一天生成数据点
  days.forEach(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    // 格式化标签，根据视图类型调整格式
    let label;
    if (viewMode === 'week') {
      label = format(day, 'E', { locale: zhCN }); // 周视图显示星期几
    } else if (viewMode === 'year') {
      label = format(day, 'MM-dd', { locale: zhCN }); // 年视图显示月日
      // 只在每月1日和15日显示日期标签，其他日期为空，避免标签拥挤
      if (day.getDate() !== 1 && day.getDate() !== 15) {
        label = '';
      }
    } else {
      label = format(day, 'MM-dd', { locale: zhCN }); // 月和季度视图显示月日
      // 每5天显示一次标签
      if (day.getDate() % 5 !== 1 && day.getDate() !== 1) {
        label = '';
      }
    }
    
    // 查找当前日期的记录
    const record = sortedRecords.find(r => r.date === dateStr);
    
    if (record) {
      // 如果找到记录，更新最后的体重值
      lastWeight = record.weight;
    }
    
    labels.push(label);
    data.push(lastWeight || 0); // 如果没有之前的记录，使用0
  });
  
  return { labels, data };
}; 