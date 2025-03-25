import { NextRequest, NextResponse } from 'next/server';
import { importRecords } from '@/utils/db';
import { WeightRecord } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
    }
    
    const text = await file.text();
    const lines = text.split('\n');
    
    // 跳过标题行
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    const records: WeightRecord[] = [];
    
    for (const line of dataLines) {
      const [date, weightStr] = line.split(',');
      const weight = parseFloat(weightStr);
      
      if (date && !isNaN(weight)) {
        records.push({ date, weight });
      }
    }
    
    if (records.length === 0) {
      return NextResponse.json({ error: '没有有效记录可导入' }, { status: 400 });
    }
    
    const importedCount = await importRecords(records);
    
    return NextResponse.json({ 
      success: true, 
      message: `成功导入 ${importedCount} 条记录，共 ${records.length} 条`
    });
  } catch (error) {
    console.error('导入数据失败:', error);
    return NextResponse.json({ error: '导入数据失败' }, { status: 500 });
  }
} 