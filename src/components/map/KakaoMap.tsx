'use client';

import { useEffect, useRef, useState } from 'react';
import { loadKakaoMapScript } from '@/lib/kakaoMap';

interface KakaoMapProps {
  center?: { lat: number; lng: number };
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    content?: string;
  }>;
  onMarkerClick?: (marker: any) => void;
  className?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap({ 
  center = { lat: 37.5665, lng: 126.9780 }, // 서울시청 기본 위치
  markers = [],
  onMarkerClick,
  className = "w-full h-64"
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);

  useEffect(() => {
    const initMap = async () => {
      try {
        // API 키가 설정되지 않은 경우 지도 로드 스킵
        const mapApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
        if (!mapApiKey || 
            mapApiKey === 'your_kakao_map_api_key_here' ||
            mapApiKey === '') {
          console.log('카카오맵 API 키가 설정되지 않아 지도를 로드하지 않습니다.');
          console.log('API 키 상태:', {
            exists: !!mapApiKey,
            length: mapApiKey?.length || 0,
            isDefault: mapApiKey === 'your_kakao_map_api_key_here'
          });
          return;
        }
        
        console.log('카카오맵 API 키 확인됨, 지도 로드 시작');

        await loadKakaoMapScript();
        
        if (mapRef.current && window.kakao) {
          const mapOption = {
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            level: 3
          };

          const kakaoMap = new window.kakao.maps.Map(mapRef.current, mapOption);
          setMap(kakaoMap);

          // 마커 생성
          if (markers.length > 0) {
            const newMarkers = markers.map(marker => {
              const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);
              const kakaoMarker = new window.kakao.maps.Marker({
                position: position,
                title: marker.title
              });

              // 마커 클릭 이벤트
              if (onMarkerClick) {
                window.kakao.maps.event.addListener(kakaoMarker, 'click', () => {
                  onMarkerClick(marker);
                });
              }

              // 인포윈도우 생성
              if (marker.content) {
                const infowindow = new window.kakao.maps.InfoWindow({
                  content: marker.content
                });

                window.kakao.maps.event.addListener(kakaoMarker, 'click', () => {
                  infowindow.open(kakaoMap, kakaoMarker);
                });
              }

              kakaoMarker.setMap(kakaoMap);
              return kakaoMarker;
            });

            setMapMarkers(newMarkers);

            // 마커들이 모두 보이도록 지도 범위 조정
            const bounds = new window.kakao.maps.LatLngBounds();
            markers.forEach(marker => {
              bounds.extend(new window.kakao.maps.LatLng(marker.lat, marker.lng));
            });
            kakaoMap.setBounds(bounds);
          }
        }
      } catch (error) {
        console.error('카카오맵 초기화 오류:', error);
      }
    };

    initMap();
  }, [center, markers, onMarkerClick]);

  return (
    <div className={className} style={{ minHeight: '200px' }}>
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '200px' }}
      />
      {(!process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || 
        process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY === 'your_kakao_map_api_key_here' ||
        process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY === '') && (
        <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <i className="ri-map-pin-line text-4xl text-gray-600 mb-3"></i>
            <p className="text-gray-400 text-sm">카카오맵 API 키를 설정하면</p>
            <p className="text-gray-400 text-sm">지도가 표시됩니다</p>
          </div>
        </div>
      )}
    </div>
  );
}
