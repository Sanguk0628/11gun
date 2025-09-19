'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';

export default function ReviewDetailedPage() {
  const router = useRouter();
  const [powerRacks, setPowerRacks] = useState('6');
  const [smithRacks, setSmithRacks] = useState('4');
  const [dumbbellMax, setDumbbellMax] = useState('50');
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [recommendation, setRecommendation] = useState<'recommend' | 'not-recommend' | null>(null);

  const machineBrands = [
    'Hammer Strength (해머스트렝스)',
    'Watson (왓슨)',
    'Prime (프라임)',
    'Panatta (파나타)',
    'Atlantis (아틀란티스)',
    'Arsenal Strength (아스날)',
    'Nautilus (너틸러스)',
    'Cybex (사이벡스)',
    'Gym80 (짐80)',
    'Life Fitness (라이프 피트니스)',
    'Technogym (테크노짐)',
    'Matrix (매트릭스)',
    'Hoist (호이스트)',
    '기타'
  ];

  const amenities = [
    '무료주차',
    '근처 저가커피',
    '얼음(제빙기)',
    '천국의 계단'
  ];

  const handleMachineToggle = (machine: string) => {
    setSelectedMachines(prev => 
      prev.includes(machine) 
        ? prev.filter(m => m !== machine)
        : [...prev, machine]
    );
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handlePrevious = () => {
    router.push('/review/basic');
  };

  const handleSubmit = () => {
    // 리뷰 제출 로직
    console.log('Review submitted:', {
      powerRacks,
      smithRacks,
      dumbbellMax,
      selectedMachines,
      selectedAmenities,
      reviewText,
      recommendation
    });
    
    // 성공 후 홈으로 이동
    router.push('/');
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
            <div className="w-8 h-0.5 bg-red-600"></div>
            
            {/* 3단계 - 상세 정보 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <span className="text-red-500 text-xs font-medium">상세 정보</span>
            </div>
          </div>
        </div>

        {/* 메인 질문 */}
        <div className="text-center mb-8">
          <h2 className="text-white text-xl font-semibold">
            상세 정보를 입력해주세요
          </h2>
        </div>

        {/* 파워랙 개수 */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            파워랙 개수 *
          </label>
          <input
            type="number"
            value={powerRacks}
            onChange={(e) => setPowerRacks(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="개수를 입력해주세요"
          />
        </div>

        {/* 스미스랙 개수 */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            스미스랙 개수 *
          </label>
          <input
            type="number"
            value={smithRacks}
            onChange={(e) => setSmithRacks(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="개수를 입력해주세요"
          />
        </div>

        {/* 덤벨 MAX 무게 */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            덤벨 MAX 무게
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={dumbbellMax}
              onChange={(e) => setDumbbellMax(e.target.value)}
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="무게를 입력해주세요"
            />
            <span className="ml-3 text-white text-sm">kg</span>
          </div>
        </div>

        {/* 머신 오피셜 */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            머신 오피셜
          </label>
          <div className="grid grid-cols-2 gap-2">
            {machineBrands.map((machine) => (
              <button
                key={machine}
                onClick={() => handleMachineToggle(machine)}
                className={`py-3 px-4 rounded-lg text-sm text-left transition-colors ${
                  selectedMachines.includes(machine)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {machine}
              </button>
            ))}
          </div>
        </div>

        {/* 편의시설 */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            편의시설
          </label>
          <div className="space-y-3">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  id={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-5 h-5 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                />
                <label htmlFor={amenity} className="ml-3 text-white text-sm">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 업소문/후기 */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            업소문/후기
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="헬스장에 대한 솔직한 수기를 남겨주세요 (최대 500자)"
            maxLength={500}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
          />
          <div className="text-right text-gray-400 text-xs mt-1">
            {reviewText.length}/500
          </div>
        </div>

        {/* 추천 여부 */}
        <div className="mb-8">
          <label className="block text-white text-sm font-medium mb-3">
            이 헬스장을 추천하시나요? *
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setRecommendation('recommend')}
              className={`flex-1 py-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                recommendation === 'recommend'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              <i className="ri-thumb-up-line mr-2 text-lg"></i>
              추천해요
            </button>
            <button
              onClick={() => setRecommendation('not-recommend')}
              className={`flex-1 py-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                recommendation === 'not-recommend'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              <i className="ri-thumb-down-line mr-2 text-lg"></i>
              비추천해요
            </button>
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
            onClick={handleSubmit}
            className="flex-1 bg-red-600 text-white py-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            리뷰 등록
          </button>
        </div>
      </div>
    </Layout>
  );
}



