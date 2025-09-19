'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';

export default function ReviewBasicPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dailyPrice, setDailyPrice] = useState('20000');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const days = ['월', '화', '수', '목', '금', '토', '일', '없음'];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleDayToggle = (day: string) => {
    if (day === '없음') {
      setSelectedDays(['없음']);
    } else {
      setSelectedDays(prev => {
        const filtered = prev.filter(d => d !== '없음');
        if (filtered.includes(day)) {
          return filtered.filter(d => d !== day);
        } else {
          return [...filtered, day];
        }
      });
    }
  };

  const handlePrevious = () => {
    router.push('/review');
  };

  const handleNext = () => {
    router.push('/review/detailed');
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
            <div className="w-8 h-0.5 bg-red-600"></div>
            
            {/* 2단계 - 기본 정보 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <span className="text-red-500 text-xs font-medium">기본 정보</span>
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

        {/* 메인 질문 */}
        <div className="text-center mb-8">
          <h2 className="text-white text-xl font-semibold">
            기본 정보를 입력해주세요
          </h2>
        </div>

        {/* 헬스장 사진 */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            헬스장 사진 *
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <i className="ri-camera-line text-gray-400 text-4xl mb-3"></i>
            <p className="text-gray-400 text-sm mb-4">사진을 선택해주세요</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-block px-4 py-2 bg-gray-800 text-white rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition-colors"
            >
              사진 선택
            </label>
            {selectedImage && (
              <p className="text-green-400 text-sm mt-2">
                {selectedImage.name} 선택됨
              </p>
            )}
          </div>
        </div>

        {/* 일일권 가격 */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            일일권 가격 *
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={dailyPrice}
              onChange={(e) => setDailyPrice(e.target.value)}
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="가격을 입력해주세요"
            />
            <span className="ml-3 text-white text-sm">원</span>
          </div>
        </div>

        {/* 정규 휴무일 */}
        <div className="mb-8">
          <label className="block text-white text-sm font-medium mb-3">
            정규 휴무일 *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`py-3 px-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDays.includes(day)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex space-x-4">
          <button
            onClick={handlePrevious}
            className="flex-1 bg-gray-800 text-white py-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            이전
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-red-600 text-white py-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    </Layout>
  );
}



