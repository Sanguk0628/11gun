'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';

export default function MyPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = async () => {
      try {
        const { getCurrentUser } = await import('@/lib/supabase');
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const { signOut } = await import('@/lib/supabase');
      await signOut();
      setIsLoggedIn(false);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogin = () => {
    router.push('/auth');
  };

  if (!isLoggedIn) {
    return (
      <Layout headerTitle="마이페이지" showSearch={false}>
        <div className="px-4 py-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👤</span>
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">로그인이 필요합니다</h3>
            <p className="text-gray-400 text-sm mb-6">
              로그인하여 개인화된 서비스를 이용해보세요
            </p>
            <button 
              onClick={handleLogin}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              로그인하기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="마이페이지" showSearch={false}>
      <div className="px-4 py-6">
        {/* 사용자 프로필 카드 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            {/* 프로필 아이콘 */}
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">👤</span>
            </div>
            
            {/* 사용자 정보 */}
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-1">
                헬창원정대
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                원정 15개월차 💪
              </p>
              
              {/* 활동 통계 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-white text-2xl font-bold mb-1">12</div>
                  <div className="text-white text-sm">작성한 리뷰 내역</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-2xl font-bold mb-1">8</div>
                  <div className="text-white text-sm">찜한 헬스장 보기</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          {/* 피드백 버튼 */}
          <button className="w-full bg-red-600 text-white py-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center">
            <span className="mr-2 text-xl">+</span>
            <span>기능 추가 요청 및 피드백 남기기</span>
          </button>
          
          {/* 로그아웃 버튼 */}
          <button 
            onClick={handleLogout}
            className="w-full bg-gray-800 text-white py-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <span className="mr-2 text-xl">🚪</span>
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}