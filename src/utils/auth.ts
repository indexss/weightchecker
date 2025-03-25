// 密码验证工具

// 在客户端存储验证状态的键名
const AUTH_KEY = 'weight_tracker_auth';

// 使用密码的哈希值进行比较
const CORRECT_PASSWORD_HASH = '3e015764d879b3704656ed1b66cc24009aa438de264866bd6bcd43a068a400ca';

// 使用浏览器的Web Crypto API计算SHA-256哈希
async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined') {
    // 服务器端运行时返回空字符串
    return '';
  }
  
  // 将字符串转换为Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // 使用Web Crypto API计算哈希
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // 将哈希转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

// 检查是否已通过验证
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'true';
}

// 验证密码
export async function verifyPassword(password: string): Promise<boolean> {
  // 计算输入密码的哈希值并与存储的哈希值比较
  const hashedInput = await hashPassword(password);
  // console.log(hashedInput);
  const isValid = hashedInput === CORRECT_PASSWORD_HASH;
  
  if (isValid && typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, 'true');
  }
  
  return isValid;
}

// 登出
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
} 