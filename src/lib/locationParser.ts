// 지역 정보 파싱 유틸리티 함수들

export interface ParsedLocation {
  city: string;      // 시/도 (예: 서울시)
  district: string;  // 구/군 (예: 광진구)
  dong: string;      // 동/읍/면 (예: 구의동)
  fullAddress: string; // 전체 주소
}

/**
 * 카카오맵 주소에서 지역 정보를 파싱합니다.
 * @param address 카카오맵에서 받은 주소 (예: "서울특별시 광진구 구의동 123-45")
 * @returns 파싱된 지역 정보
 */
export const parseLocation = (address: string): ParsedLocation => {
  if (!address) {
    return {
      city: '',
      district: '',
      dong: '',
      fullAddress: ''
    };
  }

  // 주소 정규화 (공백 제거, 특수문자 정리)
  const normalizedAddress = address.trim().replace(/\s+/g, ' ');

  // 시/도 추출
  const cityMatch = normalizedAddress.match(/^(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)/);
  const city = cityMatch ? cityMatch[1] : '';

  // 시/도 표준화 (서울특별시 -> 서울시)
  const standardizedCity = standardizeCity(city);

  // 구/군 추출
  const districtMatch = normalizedAddress.match(/([가-힣]+구|[가-힣]+시|[가-힣]+군|[가-힣]+동)/);
  const district = districtMatch ? districtMatch[1] : '';

  // 동/읍/면 추출
  const dongMatch = normalizedAddress.match(/([가-힣]+동|[가-힣]+읍|[가-힣]+면|[가-힣]+리)/);
  const dong = dongMatch ? dongMatch[1] : '';

  return {
    city: standardizedCity,
    district,
    dong,
    fullAddress: normalizedAddress
  };
};

/**
 * 시/도 이름을 표준화합니다.
 * @param city 원본 시/도 이름
 * @returns 표준화된 시/도 이름
 */
const standardizeCity = (city: string): string => {
  const cityMap: { [key: string]: string } = {
    '서울특별시': '서울시',
    '부산광역시': '부산시',
    '대구광역시': '대구시',
    '인천광역시': '인천시',
    '광주광역시': '광주시',
    '대전광역시': '대전시',
    '울산광역시': '울산시',
    '세종특별자치시': '세종시'
  };

  return cityMap[city] || city;
};

/**
 * 주소에서 검색 가능한 키워드를 생성합니다.
 * @param address 원본 주소
 * @returns 검색 키워드 배열
 */
export const generateSearchKeywords = (address: string): string[] => {
  const parsed = parseLocation(address);
  const keywords: string[] = [];

  if (parsed.city) keywords.push(parsed.city);
  if (parsed.district) keywords.push(parsed.district);
  if (parsed.dong) keywords.push(parsed.dong);
  
  // 조합된 키워드도 추가
  if (parsed.city && parsed.district) {
    keywords.push(`${parsed.city} ${parsed.district}`);
  }
  if (parsed.district && parsed.dong) {
    keywords.push(`${parsed.district} ${parsed.dong}`);
  }

  return [...new Set(keywords)]; // 중복 제거
};

/**
 * 지역 기반 검색을 위한 쿼리 조건을 생성합니다.
 * @param location 검색할 지역 (예: "서울시", "강남구", "서울시 강남구")
 * @returns Supabase 쿼리 조건
 */
export const createLocationQuery = (location: string): string => {
  if (!location) return '';

  const keywords = generateSearchKeywords(location);
  const conditions = keywords.map(keyword => 
    `location.ilike.%${keyword}%`
  ).join(',');

  return conditions;
};

/**
 * 두 주소가 같은 지역인지 확인합니다.
 * @param address1 첫 번째 주소
 * @param address2 두 번째 주소
 * @returns 같은 지역 여부
 */
export const isSameLocation = (address1: string, address2: string): boolean => {
  const parsed1 = parseLocation(address1);
  const parsed2 = parseLocation(address2);

  return parsed1.city === parsed2.city && 
         parsed1.district === parsed2.district;
};

/**
 * 주소를 사용자 친화적인 형태로 포맷팅합니다.
 * @param address 원본 주소
 * @returns 포맷팅된 주소
 */
export const formatAddress = (address: string): string => {
  const parsed = parseLocation(address);
  
  if (parsed.city && parsed.district && parsed.dong) {
    return `${parsed.city} ${parsed.district} ${parsed.dong}`;
  } else if (parsed.city && parsed.district) {
    return `${parsed.city} ${parsed.district}`;
  } else if (parsed.city) {
    return parsed.city;
  }
  
  return address;
};

/**
 * 지역별 헬스장 통계를 위한 지역 코드를 생성합니다.
 * @param address 주소
 * @returns 지역 코드 (예: "seoul_gangnam")
 */
export const generateLocationCode = (address: string): string => {
  const parsed = parseLocation(address);
  
  const cityCode = parsed.city.replace(/시|도|특별시|광역시|특별자치시|특별자치도/g, '').toLowerCase();
  const districtCode = parsed.district.replace(/구|시|군/g, '').toLowerCase();
  
  if (cityCode && districtCode) {
    return `${cityCode}_${districtCode}`;
  } else if (cityCode) {
    return cityCode;
  }
  
  return 'unknown';
};

// 주요 도시/지역 목록
export const MAJOR_CITIES = [
  '서울시', '부산시', '대구시', '인천시', '광주시', '대전시', '울산시', '세종시',
  '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주도'
];

export const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
  '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
  '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
];

/**
 * 지역 선택을 위한 옵션을 생성합니다.
 * @returns 지역 옵션 배열
 */
export const getLocationOptions = () => {
  const options: { value: string; label: string; type: 'city' | 'district' }[] = [];
  
  // 주요 도시 추가
  MAJOR_CITIES.forEach(city => {
    options.push({ value: city, label: city, type: 'city' });
  });
  
  // 서울시 구 추가
  SEOUL_DISTRICTS.forEach(district => {
    options.push({ value: `서울시 ${district}`, label: `서울시 ${district}`, type: 'district' });
  });
  
  return options;
};
