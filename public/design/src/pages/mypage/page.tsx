
import Layout from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function MyPage() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // SEO 설정 (robots meta로 검색엔진 제외)
  useEffect(() => {
    document.title = '마이페이지 - 헬스장 찾기';
    
    // robots meta 태그 추가 (개인정보 보호를 위해 검색엔진에서 제외)
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow';
    document.head.appendChild(robotsMeta);
    
    return () => {
      document.head.removeChild(robotsMeta);
    };
  }, []);

  const userStats = {
    reviewCount: 12,
    likedGyms: 8
  };

  const handleLogout = () => {
    console.log('로그아웃 완료');
    navigate('/');
    setShowLogoutConfirm(false);
  };

  return (
    <Layout headerTitle="마이페이지" showSearch={false} showShare={false}>
      <div className="px-4 py-6">
        {/* 프로필 섹션 */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <i className="ri-user-fill text-white text-2xl"></i>
            </div>
            <div className="ml-4">
              <h2 className="text-white text-xl font-bold">헬창원정대</h2>
              <p className="text-gray-400 text-sm">원정 15개월차 💪</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/myreviews')}
              className="text-center cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-colors"
            >
              <div className="text-white text-2xl font-bold">{userStats.reviewCount}</div>
              <div className="text-gray-400 text-xs">작성한 리뷰 내역</div>
            </button>
            <button
              onClick={() => navigate('/likedgyms')}
              className="text-center cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-colors"
            >
              <div className="text-white text-2xl font-bold">{userStats.likedGyms}</div>
              <div className="text-gray-400 text-xs">찜한 헬스장 보기</div>
            </button>
          </div>

        </div>

        {/* 기능 추가 요청 및 피드백 남기기 버튼 */}
        <div className="mt-8 space-y-4">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-add-line mr-2"></i>
            기능 추가 요청 및 피드백 남기기
          </button>
          
          {/* 로그아웃 버튼 */}
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-gray-800 hover:bg-gray-700 text-red-400 font-medium py-4 px-6 rounded-lg transition-colors cursor-pointer whitespace-nowrap border border-gray-700"
          >
            <i className="ri-logout-box-line mr-2"></i>
            로그아웃
          </button>
        </div>

        {/* 로그아웃 확인 모달 */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-white text-lg font-bold mb-4 text-center">로그아웃</h3>
              <p className="text-gray-400 text-center mb-6">정말 로그아웃 하시겠습니까?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-7
                    text-white py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  취소
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
