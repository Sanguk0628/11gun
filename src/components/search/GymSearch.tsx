'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchGyms, getCurrentLocation, KakaoPlace } from '@/lib/kakaoMap';
import KakaoMap from '@/components/map/KakaoMap';

interface GymSearchProps {
  onGymSelect: (gym: KakaoPlace) => void;
  selectedLocation?: string;
}

export default function GymSearch({ onGymSelect, selectedLocation = '서울시 광진구' }: GymSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [gyms, setGyms] = useState<KakaoPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ x: string; y: string } | null>(null);

  // 현재 위치 가져오기
  useEffect(() => {
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

  // 헬스장 검색
  const searchGymsByLocation = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      const results = await searchGyms(
        location,
        userLocation?.x,
        userLocation?.y
      );
      setGyms(results);
    } catch (error) {
      setError('헬스장 검색 중 오류가 발생했습니다.');
      console.error('검색 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  // 초기 로드 시 헬스장 검색
  useEffect(() => {
    searchGymsByLocation(selectedLocation);
  }, [selectedLocation, searchGymsByLocation]);

  // 검색어로 헬스장 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const results = await searchGyms(
        searchQuery,
        userLocation?.x,
        userLocation?.y
      );
      setGyms(results);
    } catch (error) {
      setError('검색 중 오류가 발생했습니다.');
      console.error('검색 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 지도 마커 데이터 생성
  const mapMarkers = gyms.map(gym => ({
    lat: parseFloat(gym.y),
    lng: parseFloat(gym.x),
    title: gym.place_name,
    content: `
      <div style="padding: 10px; min-width: 200px;">
        <h3 style="margin: 0 0 5px 0; font-weight: bold;">${gym.place_name}</h3>
        <p style="margin: 0; color: #666; font-size: 12px;">${gym.address_name}</p>
        ${gym.phone ? `<p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">${gym.phone}</p>` : ''}
        <button onclick="selectGym('${gym.id}')" style="margin-top: 8px; padding: 5px 10px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
          선택하기
        </button>
      </div>
    `
  }));

  return (
    <div className="space-y-4">
      {/* 검색 입력 */}
      <div className="relative">
        <input
          type="text"
          placeholder="헬스장 이름 또는 지역을 검색해보세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        >
          검색
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <p className="text-gray-400 text-sm mt-2">헬스장을 검색하고 있습니다...</p>
        </div>
      )}

      {/* 지도 - API 키가 있을 때만 표시 */}
      {gyms.length > 0 && process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY && 
       process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY !== 'your_kakao_map_api_key_here' && 
       process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY !== '' && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">검색된 헬스장 위치</h3>
          <KakaoMap
            center={{
              lat: parseFloat(gyms[0]?.y || '37.5665'),
              lng: parseFloat(gyms[0]?.x || '126.9780')
            }}
            markers={mapMarkers}
            onMarkerClick={(marker) => {
              const gym = gyms.find(g => 
                parseFloat(g.y) === marker.lat && parseFloat(g.x) === marker.lng
              );
              if (gym) onGymSelect(gym);
            }}
            className="w-full h-64 rounded-lg"
          />
        </div>
      )}

      {/* 헬스장 목록 */}
      <div className="space-y-3">
        {gyms.map((gym) => (
          <div
            key={gym.id}
            onClick={() => onGymSelect(gym)}
            className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <i className="ri-map-pin-line text-red-500 text-lg mt-1"></i>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">
                  {gym.place_name}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {gym.road_address_name || gym.address_name}
                </p>
                {gym.phone && (
                  <p className="text-gray-500 text-xs mb-2">
                    📞 {gym.phone}
                  </p>
                )}
                {gym.distance && (
                  <p className="text-red-400 text-xs">
                    📍 {gym.distance}m
                  </p>
                )}
              </div>
              <i className="ri-arrow-right-s-line text-gray-400 text-lg"></i>
            </div>
          </div>
        ))}
      </div>

      {/* 검색 결과 없음 */}
      {!loading && gyms.length === 0 && !error && (
        <div className="text-center py-8">
          <i className="ri-search-line text-4xl text-gray-600 mb-3"></i>
          <p className="text-gray-400">검색된 헬스장이 없습니다.</p>
          <p className="text-gray-500 text-sm mt-1">다른 검색어로 시도해보세요.</p>
        </div>
      )}
    </div>
  );
}
