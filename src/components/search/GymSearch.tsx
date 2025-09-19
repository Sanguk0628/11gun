'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchGyms, getCurrentLocation, KakaoPlace, validateKakaoApiKey } from '@/lib/kakaoMap';
import { saveKakaoGymToSupabase, searchGymsByLocation, Gym } from '@/lib/supabase';
import KakaoMap from '@/components/map/KakaoMap';

interface GymSearchProps {
  onGymSelect: (gym: KakaoPlace & { supabaseGym?: Gym }) => void;
  selectedLocation?: string;
  showSaveToDatabase?: boolean;
}

export default function GymSearch({ 
  onGymSelect, 
  selectedLocation = '서울시 광진구',
  showSaveToDatabase = true 
}: GymSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [gyms, setGyms] = useState<KakaoPlace[]>([]);
  const [supabaseGyms, setSupabaseGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ x: string; y: string } | null>(null);
  const [searchMode, setSearchMode] = useState<'kakao' | 'database' | 'both'>('both');
  const [apiKeyStatus, setApiKeyStatus] = useState<{ isValid: boolean; message: string } | null>(null);

  // API 키 검증 및 현재 위치 가져오기
  useEffect(() => {
    // API 키 검증
    const apiValidation = validateKakaoApiKey();
    setApiKeyStatus(apiValidation);
    console.log('🔑 API 키 상태:', apiValidation);

    // 현재 위치 가져오기
    const getLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
      } catch (error) {
        console.log('위치 정보를 가져올 수 없습니다:', error);
      }
    };

    getLocation();
  }, []);

  // 카카오맵 API에서 헬스장 검색
  const searchKakaoGyms = useCallback(async (location: string) => {
    try {
      console.log('🔍 카카오맵 API 헬스장 검색:', location);
      console.log('📍 사용자 위치:', userLocation);
      
      const results = await searchGyms(
        location,
        userLocation?.x,
        userLocation?.y
      );
      
      console.log('✅ 카카오맵 검색 결과:', results.length, '개');
      if (results.length > 0) {
        console.log('📋 검색된 헬스장:', results.map(gym => gym.place_name));
      }
      
      return results;
    } catch (error) {
      console.error('❌ 카카오맵 검색 오류:', error);
      return [];
    }
  }, [userLocation]);

  // Supabase에서 헬스장 검색
  const searchSupabaseGyms = useCallback(async (location: string) => {
    try {
      console.log('Supabase 헬스장 검색:', location);
      const results = await searchGymsByLocation(location);
      console.log('Supabase 검색 결과:', results.length, '개');
      return results;
    } catch (error) {
      console.error('Supabase 검색 오류:', error);
      return [];
    }
  }, []);

  // 통합 헬스장 검색
  const searchAllGyms = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 통합 헬스장 검색 시작:', location);
      console.log('🔧 검색 모드:', searchMode);
      
      let kakaoResults: KakaoPlace[] = [];
      let supabaseResults: Gym[] = [];

      // 검색 모드에 따라 검색 실행
      if (searchMode === 'kakao' || searchMode === 'both') {
        console.log('📍 카카오맵 검색 실행...');
        kakaoResults = await searchKakaoGyms(location);
      }

      if (searchMode === 'database' || searchMode === 'both') {
        console.log('🗄️ Supabase 검색 실행...');
        supabaseResults = await searchSupabaseGyms(location);
      }

      // 카카오맵 결과를 Supabase에 저장 (옵션)
      if (showSaveToDatabase && kakaoResults.length > 0) {
        console.log('💾 카카오맵 검색 결과를 Supabase에 저장 중...');
        for (const kakaoGym of kakaoResults) {
          try {
            await saveKakaoGymToSupabase(kakaoGym);
            console.log(`✅ 저장 완료: ${kakaoGym.place_name}`);
          } catch (error) {
            console.warn(`⚠️ 헬스장 저장 실패: ${kakaoGym.place_name}`, error);
          }
        }
        // 저장 후 Supabase에서 다시 검색하여 최신 데이터 반영
        const updatedSupabaseResults = await searchSupabaseGyms(location);
        setSupabaseGyms(updatedSupabaseResults);
        console.log('🔄 Supabase 데이터 업데이트 완료');
      } else {
        setSupabaseGyms(supabaseResults);
      }

      setGyms(kakaoResults);
      console.log('🎉 통합 검색 완료:', {
        kakao: kakaoResults.length,
        supabase: supabaseResults.length,
        total: kakaoResults.length + supabaseResults.length
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '헬스장 검색 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('❌ 통합 검색 오류:', error);
      setGyms([]);
      setSupabaseGyms([]);
    } finally {
      setLoading(false);
    }
  }, [searchMode, showSaveToDatabase, searchKakaoGyms, searchSupabaseGyms]);

  // 초기 로드 시 헬스장 검색
  useEffect(() => {
    searchAllGyms(selectedLocation);
  }, [selectedLocation, searchAllGyms]);

  // 검색어로 헬스장 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      searchAllGyms(selectedLocation);
      return;
    }
    
    await searchAllGyms(searchQuery);
  };

  // 실시간 검색 (디바운스 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 500); // 500ms 지연

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // 헬스장 선택 핸들러
  const handleGymSelect = async (gym: KakaoPlace) => {
    try {
      // 카카오맵 데이터를 Supabase에 저장하고 연결
      let supabaseGym: Gym | null = null;
      
      if (showSaveToDatabase) {
        supabaseGym = await saveKakaoGymToSupabase(gym);
      }

      // 선택된 헬스장 정보와 함께 콜백 호출
      onGymSelect({
        ...gym,
        supabaseGym: supabaseGym || undefined
      });
    } catch (error) {
      console.error('헬스장 선택 처리 오류:', error);
      // 오류가 발생해도 기본 선택은 진행
      onGymSelect(gym);
    }
  };

  // Supabase 헬스장을 KakaoPlace 형태로 변환하여 선택
  const handleSupabaseGymSelect = (gym: Gym) => {
    const kakaoPlace: KakaoPlace = {
      id: gym.kakao_place_id || gym.id,
      place_name: gym.name,
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: gym.phone || '',
      address_name: gym.location,
      road_address_name: gym.location,
      x: gym.longitude?.toString() || '127.0',
      y: gym.latitude?.toString() || '37.5',
      place_url: '',
      distance: gym.distance || '0'
    };

    onGymSelect({
      ...kakaoPlace,
      supabaseGym: gym
    });
  };

  // 중복 제거된 전체 헬스장 목록
  const allGyms = [...gyms];
  const totalResults = allGyms.length + supabaseGyms.length;

  return (
    <div className="space-y-4">
      {/* API 키 상태 표시 */}
      {apiKeyStatus && !apiKeyStatus.isValid && (
        <div className="bg-yellow-900/20 border border-yellow-500/50 text-yellow-400 px-4 py-3 rounded-lg text-sm">
          <div className="font-semibold mb-2">⚠️ API 설정 필요</div>
          <div className="mb-2">{apiKeyStatus.message}</div>
          <div className="text-xs text-yellow-300">
            💡 현재는 샘플 데이터로 동작 중입니다. 실제 헬스장 검색을 위해 API 키를 설정해주세요.
          </div>
        </div>
      )}

      {/* 검색 모드 선택 */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setSearchMode('both')}
          className={`px-3 py-2 text-xs rounded-lg transition-colors ${
            searchMode === 'both' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          전체 검색
        </button>
        <button
          onClick={() => setSearchMode('kakao')}
          className={`px-3 py-2 text-xs rounded-lg transition-colors ${
            searchMode === 'kakao' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          실시간 검색
        </button>
        <button
          onClick={() => setSearchMode('database')}
          className={`px-3 py-2 text-xs rounded-lg transition-colors ${
            searchMode === 'database' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          등록된 헬스장
        </button>
      </div>

      {/* 검색 입력 */}
      <div className="relative">
        <input
          type="text"
          placeholder="헬스장 이름 또는 지역을 검색해보세요 (예: 강남 헬스장, F45레이닝 성수)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-12 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-700"
        />
        <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          검색
        </button>
      </div>

      {/* 검색 힌트 */}
      {!searchQuery && (
        <div className="text-xs text-gray-500 space-y-1">
          <div>💡 검색 팁:</div>
          <div>• "강남 헬스장", "F45레이닝", "24시간" 등으로 검색</div>
          <div>• 지역명 + "헬스장" 조합으로 검색</div>
          <div>• 헬스장 이름으로 직접 검색</div>
          <div>• 전국 모든 헬스장 검색 가능</div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          <div className="font-semibold mb-2">⚠️ 검색 오류</div>
          <div className="mb-2">{error}</div>
          {(error.includes('API 키') || error.includes('403') || error.includes('NotAuthorizedError')) && (
            <div className="mt-3 p-3 bg-gray-800 rounded text-xs text-gray-300">
              <div className="font-semibold mb-2">🔧 카카오 API 설정 방법:</div>
              <div className="space-y-1">
                <div>1. <a href="https://developers.kakao.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">카카오 개발자 사이트</a>에서 앱 등록</div>
                <div>2. REST API 키 발급받기</div>
                <div>3. <strong>중요:</strong> &quot;제품 설정 &gt; 카카오맵&quot;에서 서비스 활성화</div>
                <div>4. 프로젝트 루트에 <code className="bg-gray-700 px-1 rounded">.env.local</code> 파일 생성</div>
                <div>5. <code className="bg-gray-700 px-1 rounded">NEXT_PUBLIC_KAKAO_REST_API_KEY=실제_API_키</code> 추가</div>
                <div>6. 개발 서버 재시작</div>
              </div>
              <div className="mt-2 text-yellow-400">
                💡 현재는 샘플 데이터로 동작 중입니다. API 설정 완료 후 실제 헬스장 검색이 가능합니다.
              </div>
              <div className="mt-2 text-blue-400">
                🔗 <a href="https://developers.kakao.com/docs/latest/ko/local/dev-guide" target="_blank" rel="noopener noreferrer" className="hover:underline">카카오 로컬 API 가이드</a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <p className="text-gray-400 text-sm mt-2">헬스장을 검색하고 있습니다...</p>
        </div>
      )}


      {/* 검색 결과 헤더 */}
      {totalResults > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            총 <span className="text-red-400 font-semibold">{totalResults}개</span>의 헬스장을 찾았습니다
            {showSaveToDatabase && gyms.length > 0 && (
              <span className="text-green-400 text-xs ml-2">
                (실시간 데이터 자동 저장됨)
              </span>
            )}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                searchAllGyms(selectedLocation);
              }}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              전체 보기
            </button>
          )}
        </div>
      )}

      {/* 헬스장 목록 */}
      <div className="space-y-3">
        {/* Supabase 등록된 헬스장 (우선 표시) */}
        {(searchMode === 'database' || searchMode === 'both') && supabaseGyms.map((gym) => (
          <div
            key={`supabase-${gym.id}`}
            onClick={() => handleSupabaseGymSelect(gym)}
            className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-green-500/50"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <i className="ri-store-3-line text-green-500 text-lg"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-white font-semibold truncate">
                    {gym.name}
                  </h3>
                  <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                    등록됨
                  </span>
                  {gym.rating > 0 && (
                    <div className="flex items-center text-yellow-400 text-xs">
                      <i className="ri-star-fill mr-1"></i>
                      <span>{gym.rating} ({gym.review_count})</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                  {gym.location}
                </p>
                <div className="flex items-center space-x-4 text-xs">
                  {gym.phone && (
                    <span className="text-gray-500 flex items-center">
                      📞 {gym.phone}
                    </span>
                  )}
                  {gym.distance && (
                    <span className="text-red-400 flex items-center">
                      📍 {gym.distance}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <i className="ri-arrow-right-s-line text-gray-400 text-lg"></i>
              </div>
            </div>
          </div>
        ))}

        {/* 카카오맵 실시간 검색 결과 */}
        {(searchMode === 'kakao' || searchMode === 'both') && gyms.map((gym) => (
          <div
            key={`kakao-${gym.id}`}
            onClick={() => handleGymSelect(gym)}
            className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-red-500/50"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <i className="ri-map-pin-line text-red-500 text-lg"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-white font-semibold truncate">
                    {gym.place_name}
                  </h3>
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                    실시간
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                  {gym.road_address_name || gym.address_name}
                </p>
                <div className="flex items-center space-x-4 text-xs">
                  {gym.phone && (
                    <span className="text-gray-500 flex items-center">
                      📞 {gym.phone}
                    </span>
                  )}
                  {gym.distance && (
                    <span className="text-red-400 flex items-center">
                      📍 {gym.distance}m
                    </span>
                  )}
                  {gym.category_name && (
                    <span className="text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                      {gym.category_name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <i className="ri-arrow-right-s-line text-gray-400 text-lg"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 검색 결과 없음 */}
      {!loading && totalResults === 0 && !error && (
        <div className="text-center py-8">
          <i className="ri-search-line text-4xl text-gray-600 mb-3"></i>
          <p className="text-gray-400 mb-2">검색된 헬스장이 없습니다.</p>
          <p className="text-gray-500 text-sm mb-4">다른 검색어로 시도해보세요.</p>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>🔍 추천 검색어:</div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {['강남 헬스장', 'F45레이닝', '24시간', '피트니스', '스포츠센터'].map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setSearchQuery(keyword)}
                  className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
