import { NextResponse } from 'next/server';
import { getAllRecords } from '@/utils/db';

export async function GET() {
  try {
    const records = await getAllRecords();
    
    // CSV格式导出
    const csvHeader = '日期,体重(kg)\n';
    const csvRows = records.map(record => `${record.date},${record.weight}`).join('\n');
    const csvContent = csvHeader + csvRows;
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=weight_records.csv'
      }
    });
  } catch (error) {
    console.error('导出数据失败:', error);
    return NextResponse.json({ error: '导出数据失败' }, { status: 500 });
  }
} 