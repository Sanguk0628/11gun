'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { mockGyms, Gym } from '@/mocks/gyms';

interface GymDetailPageProps {
  params: {
    id: string;
  };
}

export default function GymDetailPage({ params }: GymDetailPageProps) {
  const router = useRouter();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // URL 파라미터에서 헬스장 ID 가져오기
    const gymId = params.id;
    
    // 목업 데이터에서 해당 헬스장 찾기
    const foundGym = mockGyms.find(g => g.id === gymId);
    setGym(foundGym || null);
    
    // 로컬 스토리지에서 찜 상태 확인
    const likedGyms = JSON.parse(localStorage.getItem('likedGyms') || '[]');
    setIsLiked(likedGyms.includes(gymId));
    
    setLoading(false);
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleLike = () => {
    if (!gym) return;
    
    const gymId = gym.id;
    const likedGyms = JSON.parse(localStorage.getItem('likedGyms') || '[]');
    
    if (isLiked) {
      // 찜 해제
      const updatedLikedGyms = likedGyms.filter((id: string) => id !== gymId);
      localStorage.setItem('likedGyms', JSON.stringify(updatedLikedGyms));
      setIsLiked(false);
      console.log('Unliked gym:', gymId);
    } else {
      // 찜 추가
      const updatedLikedGyms = [...likedGyms, gymId];
      localStorage.setItem('likedGyms', JSON.stringify(updatedLikedGyms));
      setIsLiked(true);
      console.log('Liked gym:', gymId);
    }
  };

  const handleWriteReview = () => {
    router.push('/review');
  };

  const handleGetDirections = () => {
    // 길찾기 기능 (추후 구현)
    console.log('Get directions to:', gym?.location);
  };

  if (loading) {
    return (
      <Layout headerTitle="헬스장 정보" showSearch={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">로딩 중...</div>
        </div>
      </Layout>
    );
  }

  if (!gym) {
    return (
      <Layout headerTitle="헬스장 정보" showSearch={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">❌</span>
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">헬스장을 찾을 수 없습니다</h3>
            <p className="text-gray-400 text-sm mb-6">
              요청하신 헬스장 정보를 찾을 수 없습니다
            </p>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="헬스장 정보" showSearch={false}>
      <div className="relative">
        {/* 헬스장 이미지 */}
        <div className="relative">
          <img
            src={gym.image}
            alt={gym.name}
            className="w-full h-64 object-cover"
          />
          
          {/* 뒤로가기 버튼 */}
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          
          {/* 좋아요 버튼 */}
          <button
            onClick={handleLike}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isLiked 
                ? 'bg-red-600 text-white' 
                : 'bg-black/50 text-white hover:bg-red-600'
            }`}
          >
            <i className={`${isLiked ? 'ri-heart-fill' : 'ri-heart-line'} text-xl`}></i>
          </button>
        </div>

        <div className="px-4 py-6">
          {/* 헬스장 기본 정보 */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-white text-2xl font-bold">{gym.name}</h1>
              {gym.thumbsUp && (
                <div className="flex items-center space-x-1">
                  <i className="ri-thumb-up-line text-green-400 text-lg"></i>
                  <span className="text-green-400 text-lg font-bold">{gym.thumbsUp}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <i className="ri-map-pin-line text-red-500 text-lg"></i>
              <span className="text-gray-400">{gym.location}</span>
              <i className="ri-arrow-down-s-line text-gray-400 text-sm"></i>
              <span className="text-gray-400">{gym.distance}</span>
            </div>

            {/* 태그들 */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                파워랙 6개
              </span>
              <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                스미스랙 4개
              </span>
              <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                덤벨 MAX 50kg
              </span>
            </div>
          </div>

          {/* 시설 정보 */}
          <div className="mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">시설 정보</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="ri-check-line text-green-400 text-lg"></i>
                <span className="text-white">무료주차</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-check-line text-green-400 text-lg"></i>
                <span className="text-white">근처 저가커피</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-check-line text-green-400 text-lg"></i>
                <span className="text-white">얼음(제빙기)</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-check-line text-green-400 text-lg"></i>
                <span className="text-white">천국의 계단</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-4">
            <button
              onClick={handleWriteReview}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              리뷰 작성하기
            </button>
            
            <button
              onClick={handleGetDirections}
              className="w-full bg-gray-800 text-white py-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              길찾기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}