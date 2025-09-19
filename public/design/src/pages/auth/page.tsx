
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

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

  const handleOAuthLogin = (provider: string) => {
    console.log(`${provider} ${isLogin ? '로그인' : '회원가입'} 완료`);
    // OAuth 로그인/회원가입 성공 후 홈으로 이동
    navigate('/');
  };

  return (
    <Layout headerTitle={isLogin ? '로그인' : '회원가입'} showSearch={false} showShare={false} showLogin={false}>
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* 로고 및 타이틀 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-dumbbell-line text-white text-3xl"></i>
            </div>
            <h1 className="text-white text-2xl font-bold mb-2">원정단</h1>
            <p className="text-gray-400 text-sm">원정헬스 다모여</p>
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
                onClick={() => handleOAuthLogin('네이버')}
                className="w-full bg-green-500 text-white py-4 rounded-lg font-medium hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center text-lg"
              >
                <i className="ri-user-line mr-3 text-xl"></i>
                네이버로 {isLogin ? '로그인' : '회원가입'}
              </button>
              
              <button 
                onClick={() => handleOAuthLogin('카카오')}
                className="w-full bg-yellow-400 text-black py-4 rounded-lg font-medium hover:bg-yellow-500 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center text-lg"
              >
                <i className="ri-kakao-talk-fill mr-3 text-xl"></i>
                카카오로 {isLogin ? '로그인' : '회원가입'}
              </button>
              
              <button 
                onClick={() => handleOAuthLogin('구글')}
                className="w-full bg-white text-black py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center text-lg"
              >
                <i className="ri-google-fill mr-3 text-xl"></i>
                구글로 {isLogin ? '로그인' : '회원가입'}
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
