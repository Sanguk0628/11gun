'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import GymSearch from '@/components/search/GymSearch';
import { KakaoPlace } from '@/lib/kakaoMap';
import { mockGyms, Gym } from '@/mocks/gyms';

export default function ReviewPage() {
  const router = useRouter();
  const [selectedGym, setSelectedGym] = useState<KakaoPlace | null>(null);
  const [step, setStep] = useState(1);

  const handleGymSelect = (gym: KakaoPlace) => {
    setSelectedGym(gym);
    setStep(2);
  };

  const handleNextStep = () => {
    if (selectedGym) {
      setStep(2);
    }
  };

  const handleBackToSearch = () => {
    setSelectedGym(null);
    setStep(1);
  };

  return (
    <Layout headerTitle="리뷰 작성" showSearch={false}>
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
            
            {/* 연결선 */}
            <div className="w-8 h-0.5 bg-gray-600"></div>
            
            {/* 2단계 - 기본 정보 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <span className="text-gray-400 text-xs">기본 정보</span>
            </div>
            
            {/* 연결선 */}
            <div className="w-8 h-0.5 bg-gray-600"></div>
            
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
            
            <GymSearch 
              onGymSelect={handleGymSelect}
              selectedLocation="서울시 광진구"
            />
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
                <h3 className="text-white font-semibold mb-2">{selectedGym?.place_name}</h3>
                <p className="text-gray-400 text-sm mb-2">
                  {selectedGym?.road_address_name || selectedGym?.address_name}
                </p>
                {selectedGym?.phone && (
                  <p className="text-gray-500 text-xs">📞 {selectedGym.phone}</p>
                )}
              </div>
            </div>

            <h2 className="text-white text-xl font-bold mb-6">리뷰를 작성해주세요</h2>
            
            {/* 리뷰 작성 폼 */}
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">전체 평점</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-2xl text-gray-600 hover:text-yellow-400"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">리뷰 내용</label>
                <textarea
                  placeholder="헬스장에 대한 솔직한 리뷰를 작성해주세요..."
                  className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                onClick={() => router.push('/review/detailed')}
                className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                상세 리뷰 작성하기
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}