import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 创建示例CSV内容
    const csvContent = `日期,体重(kg)
2024-03-24,75.5
2024-03-25,75.2
2024-03-26,75.0
`;
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=weight_records_template.csv'
      }
    });
  } catch (error) {
    console.error('导出模板失败:', error);
    return NextResponse.json({ error: '导出模板失败' }, { status: 500 });
  }
} 