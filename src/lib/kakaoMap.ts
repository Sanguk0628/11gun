// 카카오맵 API 관련 유틸리티 함수들 (기본 상태)

// API 키 검증 함수
export const validateKakaoApiKey = (): { isValid: boolean; message: string } => {
  return {
    isValid: false,
    message: 'API 키가 설정되지 않았습니다. 배포 후 API 키를 설정해주세요.'
  };
};

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
    console.warn('카카오맵 API가 설정되지 않았습니다. 목업 데이터를 사용합니다.');
    resolve();
  });
};

// 장소 검색 API 호출 (목업 데이터 사용)
export const searchPlaces = async (
  query: string,
  category: string = 'CT1',
  x?: string,
  y?: string,
  radius?: number
): Promise<KakaoSearchResult> => {
  console.log('🔍 목업 데이터로 헬스장 검색:', query);
  
  return {
    documents: getMockGyms(query),
    meta: {
      total_count: getMockGyms(query).length,
      pageable_count: getMockGyms(query).length,
      is_end: true
    }
  };
};

// 카테고리별 장소 검색 (헬스장) - 목업 데이터 사용
export const searchGyms = async (
  location: string = '서울시 광진구',
  x?: string,
  y?: string
): Promise<KakaoPlace[]> => {
  console.log('🏋️ 목업 데이터로 헬스장 검색:', location);
  return getMockGyms(location);
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
      address_name: '서울 강남구',
      road_address_name: '서울 강남구',
      x: '127.0276',
      y: '37.4979',
      place_url: '',
      distance: '150'
    },
    {
      id: '2',
      place_name: '아이언 피트니스',
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: '02-2345-6789',
      address_name: '서울 강남구',
      road_address_name: '서울 강남구',
      x: '127.0324',
      y: '37.4947',
      place_url: '',
      distance: '200'
    },
    {
      id: '3',
      place_name: '스트롱 바디 센터',
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: '02-3456-7890',
      address_name: '서울 강남구',
      road_address_name: '서울 강남구',
      x: '127.0285',
      y: '37.5003',
      place_url: '',
      distance: '300'
    },
    {
      id: '4',
      place_name: '브라운짐',
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: '02-6368-5665',
      address_name: '서울시 성동구 아차산로7길 3',
      road_address_name: '서울시 성동구 아차산로7길 3',
      x: '127.0546',
      y: '37.5443',
      place_url: '',
      distance: '179'
    },
    {
      id: '5',
      place_name: '지방부수리 천안점',
      category_name: '헬스장',
      category_group_code: 'CT1',
      phone: '041-123-4567',
      address_name: '충청남도 천안시 동남구 신부동 123-45',
      road_address_name: '충청남도 천안시 동남구 신부동 123-45',
      x: '127.1546',
      y: '36.8143',
      place_url: '',
      distance: '500'
    }
  ];

  // 검색어에 따라 필터링
  if (location && location !== '서울시 광진구') {
    const searchTerm = location.toLowerCase();
    const filtered = mockGyms.filter(gym => {
      const nameMatch = gym.place_name.toLowerCase().includes(searchTerm);
      const addressMatch = gym.address_name.toLowerCase().includes(searchTerm) || 
                          gym.road_address_name.toLowerCase().includes(searchTerm);
      
      return nameMatch || addressMatch;
    });
    
    return filtered.length > 0 ? filtered : mockGyms.slice(0, 3);
  }

  return mockGyms.slice(0, 3);
};

// 좌표를 주소로 변환 (목업)
export const getAddressFromCoords = async (x: string, y: string): Promise<string> => {
  console.log('목업 주소 변환:', x, y);
  return '서울시 강남구';
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
        // 위치 서비스 실패 시 기본 위치 반환
        resolve({
          x: '127.0276',
          y: '37.4979'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
};

// 헬스장 폐업 여부 확인 (목업)
export const checkGymStatus = async (placeId: string): Promise<{
  isOpen: boolean;
  lastUpdated?: string;
  businessHours?: string;
}> => {
  return {
    isOpen: true,
    lastUpdated: new Date().toISOString(),
    businessHours: '24시간'
  };
};

// 전역 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}