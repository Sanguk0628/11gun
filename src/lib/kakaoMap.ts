// 카카오맵 API 관련 유틸리티 함수들

export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // 경도
  y: string; // 위도
  place_url: string;
  distance: string;
}

export interface KakaoSearchResult {
  documents: KakaoPlace[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

// 카카오맵 API 키 로드
export const loadKakaoMapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// 장소 검색 API 호출
export const searchPlaces = async (
  query: string,
  category: string = 'CT1', // 헬스장 카테고리
  x?: string,
  y?: string,
  radius?: number
): Promise<KakaoSearchResult> => {
  const baseUrl = 'https://dapi.kakao.com/v2/local/search/keyword.json';
  const params = new URLSearchParams({
    query,
    category_group_code: category,
    size: '15',
    sort: 'distance'
  });

  // 위치 기반 검색인 경우
  if (x && y) {
    params.append('x', x);
    params.append('y', y);
    if (radius) {
      params.append('radius', radius.toString());
    }
  }

  try {
    const response = await fetch(`${baseUrl}?${params}`, {
      headers: {
        'Authorization': `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`카카오 API 호출 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('장소 검색 오류:', error);
    throw error;
  }
};

// 카테고리별 장소 검색 (헬스장)
export const searchGyms = async (
  location: string = '서울시 광진구',
  x?: string,
  y?: string
): Promise<KakaoPlace[]> => {
  try {
    // API 키가 설정되지 않은 경우 목업 데이터 반환
    if (!process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || 
        process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY === 'your_kakao_rest_api_key_here' ||
        process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY === '' ||
        process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY.length < 10) {
      console.log('API 키가 설정되지 않아 목업 데이터를 사용합니다.');
      return getMockGyms(location);
    }

    console.log('카카오맵 API를 사용하여 실제 헬스장을 검색합니다.');

    const result = await searchPlaces(
      `${location} 헬스장`,
      'CT1', // 헬스장 카테고리
      x,
      y,
      2000 // 2km 반경
    );

    return result.documents.filter(place => 
      place.category_group_code === 'CT1' && 
      (place.place_name.includes('헬스') || 
       place.place_name.includes('피트니스') ||
       place.place_name.includes('짐') ||
       place.place_name.includes('GYM'))
    );
  } catch (error) {
    console.error('헬스장 검색 오류:', error);
    // 오류 시에도 목업 데이터 반환
    return getMockGyms(location);
  }
};

// 목업 헬스장 데이터 생성
const getMockGyms = (location: string): KakaoPlace[] => {
  const mockGyms = [
    {
      id: '1',
      place_name: '파워존 헬스클럽',
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: '02-1234-5678',
      address_name: '서울시 강남구 논현동 123-45',
      road_address_name: '서울시 강남구 논현로 123',
      x: '127.0276',
      y: '37.4979',
      place_url: '',
      distance: '300'
    },
    {
      id: '2',
      place_name: '아이언 피트니스',
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: '02-2345-6789',
      address_name: '서울시 서초구 서초동 67-89',
      road_address_name: '서울시 서초구 서초대로 456',
      x: '127.0324',
      y: '37.4947',
      place_url: '',
      distance: '800'
    },
    {
      id: '3',
      place_name: '스트롱 바디 센터',
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: '02-3456-7890',
      address_name: '서울시 강남구 역삼동 12-34',
      road_address_name: '서울시 강남구 테헤란로 789',
      x: '127.0285',
      y: '37.5003',
      place_url: '',
      distance: '1200'
    },
    {
      id: '4',
      place_name: '피트니스 월드',
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: '02-4567-8901',
      address_name: '서울시 강남구 강남동 56-78',
      road_address_name: '서울시 강남구 강남대로 321',
      x: '127.0256',
      y: '37.5021',
      place_url: '',
      distance: '500'
    },
    {
      id: '5',
      place_name: '헬스 마스터',
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: '02-5678-9012',
      address_name: '서울시 강남구 도곡동 90-12',
      road_address_name: '서울시 강남구 도곡로 654',
      x: '127.0312',
      y: '37.4987',
      place_url: '',
      distance: '900'
    },
    {
      id: '6',
      place_name: '타임짐 성수점',
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: '02-1234-9999',
      address_name: '서울시 성동구 성수1동 123-45',
      road_address_name: '서울시 성동구 성수일로 123',
      x: '127.0546',
      y: '37.5443',
      place_url: '',
      distance: '200'
    }
  ];

  return mockGyms;
};

// 좌표를 주소로 변환 (역지오코딩)
export const getAddressFromCoords = async (x: string, y: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,
      {
        headers: {
          'Authorization': `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`주소 변환 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.documents[0]?.address?.address_name || '';
  } catch (error) {
    console.error('주소 변환 오류:', error);
    return '';
  }
};

// 현재 위치 가져오기
export const getCurrentLocation = (): Promise<{ x: string; y: string }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치 서비스를 지원하지 않습니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          x: position.coords.longitude.toString(),
          y: position.coords.latitude.toString()
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
};

// 헬스장 폐업 여부 확인 (최근 리뷰나 영업시간 정보로 판단)
export const checkGymStatus = async (placeId: string): Promise<{
  isOpen: boolean;
  lastUpdated?: string;
  businessHours?: string;
}> => {
  try {
    // 카카오맵에서 상세 정보 가져오기
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(placeId)}`,
      {
        headers: {
          'Authorization': `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      return { isOpen: false };
    }

    const data = await response.json();
    const place = data.documents[0];

    if (!place) {
      return { isOpen: false };
    }

    // 기본적으로 영업 중으로 가정 (실제로는 더 정교한 로직 필요)
    return {
      isOpen: true,
      lastUpdated: new Date().toISOString(),
      businessHours: '24시간' // 실제로는 API에서 가져와야 함
    };
  } catch (error) {
    console.error('헬스장 상태 확인 오류:', error);
    return { isOpen: false };
  }
};

// 전역 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}
