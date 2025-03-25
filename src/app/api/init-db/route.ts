import { NextResponse } from 'next/server';
import { initDB } from '@/utils/db';

export async function GET() {
  try {
    const success = await initDB();
    if (success) {
      return NextResponse.json({ message: '数据库初始化成功' });
    } else {
      return NextResponse.json({ error: '数据库初始化失败' }, { status: 500 });
    }
  } catch (error) {
    console.error('数据库初始化错误:', error);
    return NextResponse.json({ error: '数据库初始化错误' }, { status: 500 });
  }
} 