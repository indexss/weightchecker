import { NextRequest, NextResponse } from 'next/server';
import { saveRecord } from '@/utils/db';
import { WeightRecord } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const records = await request.json() as WeightRecord[];
    
    if (!Array.isArray(records)) {
      return NextResponse.json({ error: '无效的数据格式' }, { status: 400 });
    }
    
    let successCount = 0;
    
    for (const record of records) {
      if (record.date && record.weight) {
        const success = saveRecord(record);
        if (success) successCount++;
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `成功导入 ${successCount} 条记录，共 ${records.length} 条` 
    });
  } catch (error) {
    console.error('导入数据失败:', error);
    return NextResponse.json({ error: '导入数据失败' }, { status: 500 });
  }
} 