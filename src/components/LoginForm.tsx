import { useState } from 'react';
import { verifyPassword } from '@/utils/auth';

interface LoginFormProps {
  onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('请输入访问密码');
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const isValid = await verifyPassword(password);
      
      if (isValid) {
        onLogin();
      } else {
        setError('密码不正确');
        setPassword('');
      }
    } catch (err) {
      setError('验证过程出错，请重试');
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">体重记录应用</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              访问密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="请输入访问密码"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {isVerifying ? '验证中...' : '登录'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          本应用受密码保护，请输入正确的访问密码继续。
        </div>
      </div>
    </div>
  );
} 