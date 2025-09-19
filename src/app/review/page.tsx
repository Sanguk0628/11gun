'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { KakaoPlace, searchGyms } from '@/lib/kakaoMap';
import { Gym } from '@/lib/supabase';

interface SelectedGymData extends KakaoPlace {
  supabaseGym?: Gym;
}

export default function ReviewPage() {
  const router = useRouter();
  const [selectedGym, setSelectedGym] = useState<SelectedGymData | null>(null);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [gyms, setGyms] = useState<KakaoPlace[]>([]);
  const [loading, setLoading] = useState(false);

  // 초기 헬스장 목록 로드
  useEffect(() => {
    loadInitialGyms();
  }, []);

  const loadInitialGyms = async () => {
    setLoading(true);
    try {
      const results = await searchGyms('서울 강남구');
      setGyms(results.slice(0, 3)); // 처음 3개만 표시
    } catch (error) {
      console.error('헬스장 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 검색 기능
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInitialGyms();
      return;
    }

    setLoading(true);
    try {
      const results = await searchGyms(searchQuery);
      setGyms(results);
    } catch (error) {
      console.error('검색 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 실시간 검색 (디바운스 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        loadInitialGyms();
      }
    }, 500); // 500ms 지연

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleGymSelect = (gym: KakaoPlace) => {
    setSelectedGym(gym);
    setStep(2);
    
    // 선택된 헬스장 정보를 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedGymForReview', JSON.stringify({
        kakaoData: {
          id: gym.id,
          place_name: gym.place_name,
          category_name: gym.category_name,
          phone: gym.phone,
          address_name: gym.address_name,
          road_address_name: gym.road_address_name,
          x: gym.x,
          y: gym.y,
          place_url: gym.place_url,
          distance: gym.distance
        }
      }));
    }
  };

  const handleBackToSearch = () => {
    setSelectedGym(null);
    setStep(1);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedGymForReview');
    }
  };

  const handleNextStep = () => {
    router.push('/review/basic');
  };

  return (
    <Layout headerTitle="리뷰 작성 - 원정헬스 다모여" showSearch={false}>
      <div className="px-4 py-6">
        {/* 진행 표시줄 */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* 1단계 - 헬스장 선택 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <span className="text-red-500 text-xs font-medium">헬스장 선택</span>
            </div>
            
            {/* 연결선 - 점선 */}
            <div className="w-8 h-0.5 border-t-2 border-dashed border-gray-600"></div>
            
            {/* 2단계 - 기본 정보 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <span className="text-gray-400 text-xs">기본 정보</span>
            </div>
            
            {/* 연결선 - 점선 */}
            <div className="w-8 h-0.5 border-t-2 border-dashed border-gray-600"></div>
            
            {/* 3단계 - 상세 정보 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <span className="text-gray-400 text-xs">상세 정보</span>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <div>
            <h2 className="text-white text-xl font-bold mb-6">어느 헬스장을 다녀오셨나요?</h2>
            
            {/* 검색 바 */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="헬스장 이름을 검색해보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-700"
              />
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
            </div>

            {/* 헬스장 목록 */}
            <div className="space-y-3 mb-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                  <p className="text-gray-400 text-sm mt-2">헬스장을 검색하고 있습니다...</p>
                </div>
              ) : (
                gyms.map((gym) => (
                  <div
                    key={gym.id}
                    onClick={() => handleGymSelect(gym)}
                    className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <i className="ri-map-pin-line text-red-500 text-lg"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold mb-1">
                          {gym.place_name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {gym.road_address_name || gym.address_name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 다음 단계 버튼 */}
            <button
              onClick={handleNextStep}
              className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              다음 단계
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <button
                onClick={handleBackToSearch}
                className="flex items-center text-gray-400 hover:text-white mb-4"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                헬스장 다시 선택
              </button>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-white font-semibold">{selectedGym?.place_name}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {selectedGym?.road_address_name || selectedGym?.address_name}
                </p>
                {selectedGym?.phone && (
                  <p className="text-gray-500 text-xs mb-2">📞 {selectedGym.phone}</p>
                )}
                {selectedGym?.category_name && (
                  <p className="text-blue-400 text-xs">{selectedGym.category_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleNextStep}
                className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                다음 단계로
              </button>
              
              <p className="text-gray-500 text-xs text-center">
                선택하신 헬스장에 대한 리뷰를 작성해보세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}