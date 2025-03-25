import { NextResponse } from 'next/server';
import { backupDB } from '@/utils/db';

export async function GET() {
  try {
    const result = await backupDB();
    
    if (result.success) {
      return NextResponse.json({ success: true, path: result.path });
    } else {
      return NextResponse.json({ error: '备份失败' }, { status: 500 });
    }
  } catch (error) {
    console.error('备份过程中出错:', error);
    return NextResponse.json({ error: '备份过程中出错' }, { status: 500 });
  }
} 