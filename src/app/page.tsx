'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import LocationSelector from '@/components/location/LocationSelector';
import GymCard from '@/components/gym/GymCard';
import GymSearch from '@/components/search/GymSearch';
import { searchGyms, KakaoPlace } from '@/lib/kakaoMap';
import { searchGymsByLocation, Gym } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string>('서울시 광진구');
  const [filterType, setFilterType] = useState('all');
  const [showMachineSelector, setShowMachineSelector] = useState(false);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [gyms, setGyms] = useState<KakaoPlace[]>([]);
  const [supabaseGyms, setSupabaseGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  // SEO 설정
  useEffect(() => {
    document.title = '헬스장 찾기 - 내 주변 최고의 헬스장을 찾아보세요';
    
    // Schema.org JSON-LD 추가
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": ["WebApplication", "LocalBusiness"],
      "name": "헬스장 찾기",
      "description": "내 주변 헬스장을 쉽게 찾고 비교해보세요",
      "url": process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
      "serviceType": "Fitness Center Directory",
      "areaServed": "South Korea",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All",
    });
    
    document.head.appendChild(schemaScript);
    
    return () => {
      document.head.removeChild(schemaScript);
    };
  }, []);

  // 헬스장 데이터 로드
  useEffect(() => {
    loadGyms();
  }, [selectedLocation]);

  const loadGyms = async () => {
    setLoading(true);
    try {
      // 카카오맵 API에서 실시간 검색
      const kakaoResults = await searchGyms(selectedLocation);
      setGyms(kakaoResults);
      
      // Supabase에서 등록된 헬스장 검색
      const supabaseResults = await searchGymsByLocation(selectedLocation);
      setSupabaseGyms(supabaseResults);
      
      console.log('헬스장 로드 완료:', {
        kakao: kakaoResults.length,
        supabase: supabaseResults.length
      });
    } catch (error) {
      console.error('헬스장 로드 오류:', error);
      setGyms([]);
      setSupabaseGyms([]);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: '전체', icon: 'ri-group-line', emoji: '👥' },
    { id: 'nearby', label: '내 주변', icon: 'ri-map-pin-line', emoji: '📍' },
    { id: 'powerrack', label: '파워랙 많은', icon: 'ri-barbell-line', emoji: '🏋️' }
  ];

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

  const handleMachineToggle = (machine: string) => {
    const updated = selectedMachines.includes(machine)
      ? selectedMachines.filter(m => m !== machine)
      : [...selectedMachines, machine];
    setSelectedMachines(updated);
  };

  const handleMachineSelectorClose = () => {
    setShowMachineSelector(false);
  };

  const handleGymClick = (gymId: string) => {
    router.push(`/gym/${gymId}`);
  };

  const handleGymSelect = (gym: KakaoPlace & { supabaseGym?: Gym }) => {
    // Supabase에 등록된 헬스장인 경우 해당 ID로 이동
    if (gym.supabaseGym?.id) {
      router.push(`/gym/${gym.supabaseGym.id}`);
    } else {
      // 카카오맵에서만 검색된 헬스장인 경우 카카오 ID로 이동
      router.push(`/gym/${gym.id}`);
    }
  };

  // 필터링 로직
  const filteredGyms = gyms.filter((gym) => {
    // 지역 필터 적용
    if (selectedLocation !== 'all' && !gym.address_name.includes(selectedLocation)) {
      return false;
    }
    return true;
  });

  const filteredSupabaseGyms = supabaseGyms.filter((gym) => {
    // 지역 필터 적용
    if (selectedLocation !== 'all' && !gym.location.includes(selectedLocation)) {
      return false;
    }
    return true;
  });

  // 전체 헬스장 수 계산
  const totalGyms = filteredGyms.length + filteredSupabaseGyms.length;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">로딩 중...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6">
        {/* 검색 및 필터 섹션 */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4 space-x-2">
            <LocationSelector 
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
            />
            
            <button 
              onClick={() => setShowMachineSelector(true)}
              className="flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg"
            >
              <i className="ri-tools-line mr-2"></i>
              <span className="text-sm">어떤 브랜드를 찾고 계신가요?</span>
              <i className="ri-arrow-down-s-line ml-2"></i>
            </button>
            
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg"
            >
              <i className="ri-map-pin-line mr-2"></i>
              <span className="text-sm">{showSearch ? '목록 보기' : '지도 보기'}</span>
            </button>
          </div>

          {/* 필터 버튼들 */}
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterType === filter.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white'
                }`}
              >
                <i className={`${filter.icon} mr-2`}></i>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* 검색/지도 뷰 */}
        {showSearch ? (
          <GymSearch 
            onGymSelect={handleGymSelect}
            selectedLocation={selectedLocation}
          />
        ) : (
          <>
            {/* 헤더 */}
            <div className="mb-6">
              <h2 className="text-white text-xl font-bold mb-2">
                {selectedLocation}의 헬스장
              </h2>
              <p className="text-gray-400 text-sm">
                {loading ? '검색 중...' : `${totalGyms}개의 헬스장을 찾았습니다`}
                {!loading && filteredSupabaseGyms.length > 0 && (
                  <span className="text-green-400 text-xs ml-2">
                    (등록된 헬스장 {filteredSupabaseGyms.length}개 포함)
                  </span>
                )}
              </p>
            </div>

            {/* 로딩 상태 */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <p className="text-gray-400 text-sm mt-2">헬스장을 검색하고 있습니다...</p>
              </div>
            ) : (
              /* 헬스장 목록 */
              <div className="grid grid-cols-2 gap-4">
                {/* 등록된 헬스장 우선 표시 */}
                {filteredSupabaseGyms.map((gym) => (
                  <div
                    key={`supabase-${gym.id}`}
                    onClick={() => handleGymClick(gym.id)}
                    className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-green-500/20"
                  >
                    <div className="aspect-video bg-gray-700 rounded-lg mb-3 flex items-center justify-center relative">
                      <i className="ri-building-line text-3xl text-gray-500"></i>
                      <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        등록됨
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                      {gym.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                      {gym.location}
                    </p>
                    <div className="flex items-center justify-between">
                      {gym.distance && (
                        <p className="text-red-400 text-xs">
                          📍 {gym.distance}
                        </p>
                      )}
                      {gym.rating > 0 && (
                        <div className="flex items-center text-yellow-400 text-xs">
                          <i className="ri-star-fill mr-1"></i>
                          <span>{gym.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* 카카오맵 실시간 검색 결과 */}
                {filteredGyms.map((gym) => (
                  <div
                    key={`kakao-${gym.id}`}
                    onClick={() => handleGymClick(gym.id)}
                    className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    <div className="aspect-video bg-gray-700 rounded-lg mb-3 flex items-center justify-center relative">
                      <i className="ri-building-line text-3xl text-gray-500"></i>
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        실시간
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                      {gym.place_name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                      {gym.road_address_name || gym.address_name}
                    </p>
                    {gym.distance && (
                      <p className="text-red-400 text-xs">
                        📍 {gym.distance}m
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 검색 결과 없음 */}
            {!loading && totalGyms === 0 && (
              <div className="text-center py-12">
                <i className="ri-building-line text-4xl text-gray-600 mb-3"></i>
                <p className="text-gray-400">해당 지역에 헬스장이 없습니다.</p>
                <p className="text-gray-500 text-sm mt-1">다른 지역을 선택해보세요.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 머신 선택 모달 */}
      {showMachineSelector && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-gray-800 rounded-t-xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">찾는 머신 브랜드</h3>
              <button
                onClick={handleMachineSelectorClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-2">
                {machineBrands.map((machine) => (
                  <button
                    key={machine}
                    onClick={() => handleMachineToggle(machine)}
                    className={`py-3 px-4 rounded text-sm text-left transition-colors ${
                      selectedMachines.includes(machine)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {machine}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedMachines([])}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  초기화
                </button>
                <button
                  onClick={handleMachineSelectorClose}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  적용 ({selectedMachines.length})
                </button>
              </div>
            </div>
          </div>
    </div>
      )}
    </Layout>
  );
}