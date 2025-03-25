import { NextRequest, NextResponse } from 'next/server';
import { getAllRecords, saveRecord, deleteRecord, getLatestRecord, initDB } from '@/utils/db';
import { WeightRecord } from '@/types';

// 添加初始化标记，确保只初始化一次
let isInitialized = false;

// 获取所有记录
export async function GET(request: NextRequest) {
  try {
    // 首先确保数据库已初始化
    if (!isInitialized) {
      await initDB();
      isInitialized = true;
    }
    
    // 然后执行查询
    const { searchParams } = new URL(request.url);
    const latest = searchParams.get('latest');
    
    if (latest === 'true') {
      // 获取最新记录
      const record = await getLatestRecord();
      return NextResponse.json(record);
    } else {
      // 获取所有记录
      const records = await getAllRecords();
      return NextResponse.json(records);
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 });
  }
}

// 保存记录
export async function POST(request: NextRequest) {
  try {
    const record = await request.json() as WeightRecord;
    const success = await saveRecord(record);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: '保存失败' }, { status: 500 });
    }
  } catch (error) {
    console.error('保存数据失败:', error);
    return NextResponse.json({ error: '保存数据失败' }, { status: 500 });
  }
}

// 删除记录
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ error: '需要提供日期' }, { status: 400 });
    }
    
    const success = await deleteRecord(date);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: '删除失败' }, { status: 500 });
    }
  } catch (error) {
    console.error('删除数据失败:', error);
    return NextResponse.json({ error: '删除数据失败' }, { status: 500 });
  }
} 