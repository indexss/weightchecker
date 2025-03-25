import { createClient } from '@libsql/client';
import { WeightRecord } from '@/types';

// 创建单例客户端
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

// 初始化数据库，创建表
export async function initDB() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS weight_records (
        date TEXT PRIMARY KEY,
        weight REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('数据库初始化成功');
    return true;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return false;
  }
}

// 获取所有记录
export async function getAllRecords(): Promise<WeightRecord[]> {
  const result = await client.execute('SELECT date, weight FROM weight_records ORDER BY date');
  return result.rows.map(row => ({
    date: row.date as string,
    weight: row.weight as number
  }));
}

// 保存记录
export async function saveRecord(record: WeightRecord): Promise<boolean> {
  const result = await client.execute({
    sql: 'INSERT OR REPLACE INTO weight_records (date, weight) VALUES (?, ?)',
    args: [record.date, record.weight]
  });
  return result.rowsAffected > 0;
}

// 删除记录
export async function deleteRecord(date: string): Promise<boolean> {
  const result = await client.execute({
    sql: 'DELETE FROM weight_records WHERE date = ?',
    args: [date]
  });
  return result.rowsAffected > 0;
}

// 获取最近的记录
export async function getLatestRecord(): Promise<WeightRecord | null> {
  const result = await client.execute('SELECT date, weight FROM weight_records ORDER BY date DESC LIMIT 1');
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    date: row.date as string,
    weight: row.weight as number
  };
}

// 批量导入记录
export async function importRecords(records: WeightRecord[]): Promise<number> {
  let successCount = 0;
  
  for (const record of records) {
    try {
      const result = await client.execute({
        sql: 'INSERT OR REPLACE INTO weight_records (date, weight) VALUES (?, ?)',
        args: [record.date, record.weight]
      });
      
      if (result.rowsAffected > 0) {
        successCount++;
      }
    } catch (error) {
      console.error(`导入记录失败 ${record.date}:`, error);
    }
  }
  
  return successCount;
}