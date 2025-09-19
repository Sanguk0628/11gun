'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // SEO 설정 (robots meta로 검색엔진 제외)
  useEffect(() => {
    document.title = isLogin ? '로그인 - 헬스장 찾기' : '회원가입 - 헬스장 찾기';
    
    // robots meta 태그 추가 (개인정보 보호를 위해 검색엔진에서 제외)
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow';
    document.head.appendChild(robotsMeta);
    
    return () => {
      document.head.removeChild(robotsMeta);
    };
  }, [isLogin]);

  const handleOAuthLogin = async (provider: 'google' | 'kakao' | 'naver') => {
    try {
      console.log(`${provider} ${isLogin ? '로그인' : '회원가입'} 시작`);
      const { signInWithProvider } = await import('@/lib/supabase');
      await signInWithProvider(provider);
      // OAuth 로그인은 리다이렉트되므로 여기서는 처리하지 않음
    } catch (error) {
      console.error('OAuth 로그인 에러:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Layout headerTitle={isLogin ? '로그인' : '회원가입'} showSearch={false} showShare={false} showLogin={false}>
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* 로고 및 타이틀 */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-4xl">💪</span>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">원정단</h1>
            <p className="text-gray-400 text-sm">💪 원정헬스 다모여 💪</p>
          </div>

          {/* 로그인/회원가입 폼 */}
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="flex mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 text-center rounded-l-lg transition-colors cursor-pointer whitespace-nowrap font-medium ${
                  isLogin 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                로그인
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 text-center rounded-r-lg transition-colors cursor-pointer whitespace-nowrap font-medium ${
                  !isLogin 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                회원가입
              </button>
            </div>

            {/* 소셜 로그인 버튼들 */}
            <div className="space-y-4">
              <button 
                onClick={() => handleOAuthLogin('naver')}
                className="w-full bg-green-500 text-white py-4 rounded-lg font-medium hover:bg-green-600 transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center text-lg shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                  </svg>
                </div>
                <span>네이버로 {isLogin ? '로그인' : '회원가입'}</span>
              </button>
              
              <button 
                onClick={() => handleOAuthLogin('kakao')}
                className="w-full bg-yellow-400 text-black py-4 rounded-lg font-medium hover:bg-yellow-500 transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center text-lg shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black">
                    <path d="M12 3C6.486 3 2 6.262 2 10.2c0 2.4 1.6 4.5 4 5.8V21l3.5-2c.5.1 1 .1 1.5.1 5.514 0 10-3.262 10-7.2S17.514 3 12 3z"/>
                  </svg>
                </div>
                <span>카카오로 {isLogin ? '로그인' : '회원가입'}</span>
              </button>
              
              <button 
                onClick={() => handleOAuthLogin('google')}
                className="w-full bg-white text-black py-4 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center text-lg shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span>구글로 {isLogin ? '로그인' : '회원가입'}</span>
              </button>
            </div>
          </div>

          {/* 약관 동의 (회원가입 시에만) */}
          {!isLogin && (
            <div className="mt-6 text-center text-xs text-gray-400">
              회원가입 시{' '}
              <button className="text-red-500 hover:text-red-400 cursor-pointer">서비스 이용약관</button>
              {' '}및{' '}
              <button className="text-red-500 hover:text-red-400 cursor-pointer">개인정보처리방침</button>
              에 동의하게 됩니다.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}