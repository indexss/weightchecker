import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { WeightRecord, ViewMode } from '@/types';
import { generateDataPoints, getDateRange, formatDateDisplay } from '@/utils/dateUtils';
import { format } from 'date-fns';

// 注册ChartJS组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeightChartProps {
  records: WeightRecord[];
  height?: string;
}

export default function WeightChart({ records, height = 'h-64' }: WeightChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [dataPoints, setDataPoints] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
  // 添加显示数据点的状态
  const [showDataPoints, setShowDataPoints] = useState(true);
  
  // 当记录或视图模式改变时，更新数据点
  useEffect(() => {
    // 生成数据点
    const points = generateDataPoints(records, viewMode);
    setDataPoints(points);
    
    // 当视图为季度(90天)或年(365天)时，自动关闭数据点显示
    if (viewMode === 'quarter' || viewMode === 'year') {
      setShowDataPoints(false);
    } else {
      setShowDataPoints(true);
    }
  }, [records, viewMode]);
  
  // Chart配置 - 优化移动端显示
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `体重: ${context.parsed.y} kg`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          font: {
            size: window.innerWidth < 768 ? 8 : 10
          },
          maxTicksLimit: window.innerWidth < 768 ? 7 : 12 // 移动端显示更少的标签
        }
      },
      y: {
        title: {
          display: window.innerWidth >= 768, // 移动端不显示Y轴标题
          text: '体重 (kg)'
        },
        ticks: {
          callback: function(value) {
            return window.innerWidth < 768 ? value : value + ' kg';
          },
          font: {
            size: window.innerWidth < 768 ? 9 : 11
          }
        },
        beginAtZero: false
      }
    }
  };
  
  const chartData = {
    labels: dataPoints.labels,
    datasets: [
      {
        label: '体重',
        data: dataPoints.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        pointRadius: (ctx) => {
          // 如果不显示数据点，除了最后一天(今天)外，其他都不显示
          if (!showDataPoints) {
            const index = ctx.dataIndex;
            const labels = dataPoints.labels;
            
            // 只对最后一个点(今天)显示圆圈
            if (index === labels.length - 1) {
              return 4;
            }
            return 0; // 其他点不显示
          }
          
          // 如果显示数据点，根据是否为记录日期和今天来决定大小
          const today = format(new Date(), 'yyyy-MM-dd');
          const recordDates = records.map(r => r.date);
          const index = ctx.dataIndex;
          const labels = dataPoints.labels;
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() - (labels.length - 1 - index));
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          
          // 如果是最后一个点(今天)或有记录的日期，显示大点
          if (index === labels.length - 1 || recordDates.includes(dateStr)) {
            return 4;
          }
          return 2; // 其他点更小
        },
        pointHoverRadius: 6
      }
    ]
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-lg shadow mb-4 md:mb-6">
      {/* 标题和视图切换按钮 - 在移动端调整为垂直布局 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 md:mb-4">
        <h2 className="text-lg md:text-xl font-bold mb-2 sm:mb-0">体重趋势</h2>
        
        {/* 视图切换按钮 - 移动端使用更紧凑的布局 */}
        <div className="grid grid-cols-4 gap-1 sm:flex sm:space-x-2 text-sm md:text-base">
          <button
            onClick={() => setViewMode('week')}
            className={`px-2 py-1 rounded ${
              viewMode === 'week' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            近7天
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-2 py-1 rounded ${
              viewMode === 'month' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            近30天
          </button>
          <button
            onClick={() => setViewMode('quarter')}
            className={`px-2 py-1 rounded ${
              viewMode === 'quarter' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            近90天
          </button>
          <button
            onClick={() => setViewMode('year')}
            className={`px-2 py-1 rounded ${
              viewMode === 'year' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            近365天
          </button>
        </div>
      </div>
      
      {/* 日期范围和显示数据点开关 - 移除导出按钮 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2 sm:gap-0">
        <div className="flex items-center justify-between sm:justify-start">
          <div className="text-center font-medium text-gray-600 text-sm sm:text-base">
            {formatDateDisplay(viewMode)}
          </div>
        </div>
        
        {/* 显示数据点开关 */}
        <div className="flex items-center justify-end">
          <span className="text-xs sm:text-sm text-gray-600 mr-2">显示数据点</span>
          <button 
            onClick={() => setShowDataPoints(!showDataPoints)}
            className="relative inline-flex items-center focus:outline-none"
            style={{ 
              width: '2.5rem', 
              height: '1.25rem',
              borderRadius: '9999px',
              backgroundColor: showDataPoints ? 'rgb(59, 130, 246)' : 'rgb(209, 213, 219)',
              transition: 'background-color 0.2s ease-in-out'
            }}
          >
            <span 
              style={{ 
                position: 'absolute',
                left: showDataPoints ? 'calc(100% - 1.1rem)' : '0.25rem',
                width: '0.875rem', 
                height: '0.875rem',
                borderRadius: '50%',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'left 0.2s ease-in-out'
              }}
            />
          </button>
        </div>
      </div>
      
      {/* 图表容器 */}
      <div className={height}>
        {dataPoints.data.some(weight => weight > 0) ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm sm:text-base">
            暂无体重数据可显示
          </div>
        )}
      </div>
      
      {/* 图例说明 - 在移动端使用更小的字体 */}
      <div className="mt-2 md:mt-4 text-xs md:text-sm text-gray-500 flex flex-wrap justify-center gap-2 md:gap-4">
        <div className="flex items-center">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500 mr-1"></div>
          <span>图表最右侧为今天</span>
        </div>
        {showDataPoints && (
          <div className="flex items-center">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-blue-500 bg-white mr-1"></div>
            <span>圆圈表示有记录的日期</span>
          </div>
        )}
      </div>
    </div>
  );
} 