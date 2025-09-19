'use client';

import { useState } from 'react';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const provinces = [
  { id: 'seoul', name: '서울특별시' },
  { id: 'busan', name: '부산광역시' },
  { id: 'daegu', name: '대구광역시' },
  { id: 'incheon', name: '인천광역시' },
  { id: 'gwangju', name: '광주광역시' },
  { id: 'daejeon', name: '대전광역시' },
  { id: 'ulsan', name: '울산광역시' },
  { id: 'gyeonggi', name: '경기도' },
  { id: 'gangwon', name: '강원도' },
  { id: 'chungbuk', name: '충청북도' },
  { id: 'chungnam', name: '충청남도' },
  { id: 'jeonbuk', name: '전라북도' },
  { id: 'jeonnam', name: '전라남도' },
  { id: 'gyeongbuk', name: '경상북도' },
  { id: 'gyeongnam', name: '경상남도' },
  { id: 'jeju', name: '제주특별자치도' }
];

const districts = {
  seoul: [
    { id: 'gangnam', name: '강남구' },
    { id: 'gangdong', name: '강동구' },
    { id: 'gangbuk', name: '강북구' },
    { id: 'gangseo', name: '강서구' },
    { id: 'gwanak', name: '관악구' },
    { id: 'gwangjin', name: '광진구' },
    { id: 'guro', name: '구로구' },
    { id: 'geumcheon', name: '금천구' },
    { id: 'nowon', name: '노원구' },
    { id: 'dobong', name: '도봉구' },
    { id: 'dongdaemun', name: '동대문구' },
    { id: 'dongjak', name: '동작구' },
    { id: 'mapo', name: '마포구' },
    { id: 'seodaemun', name: '서대문구' },
    { id: 'seocho', name: '서초구' },
    { id: 'seongdong', name: '성동구' },
    { id: 'seongbuk', name: '성북구' },
    { id: 'songpa', name: '송파구' },
    { id: 'yangcheon', name: '양천구' },
    { id: 'yeongdeungpo', name: '영등포구' },
    { id: 'yongsan', name: '용산구' },
    { id: 'eunpyeong', name: '은평구' },
    { id: 'jongno', name: '종로구' },
    { id: 'jung', name: '중구' },
    { id: 'jungnang', name: '중랑구' }
  ],
  busan: [
    { id: 'gangseo', name: '강서구' },
    { id: 'geumjeong', name: '금정구' },
    { id: 'nam', name: '남구' },
    { id: 'dong', name: '동구' },
    { id: 'dongnae', name: '동래구' },
    { id: 'busanjin', name: '부산진구' },
    { id: 'buk', name: '북구' },
    { id: 'sasang', name: '사상구' },
    { id: 'saha', name: '사하구' },
    { id: 'seo', name: '서구' },
    { id: 'suyeong', name: '수영구' },
    { id: 'yeonje', name: '연제구' },
    { id: 'yeongdo', name: '영도구' },
    { id: 'jung', name: '중구' },
    { id: 'haeundae', name: '해운대구' },
    { id: 'giyang', name: '기장군' }
  ]
};

export default function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProvinces, setShowProvinces] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const getDisplayText = () => {
    if (selectedLocation === 'all') return '전체 지역';
    
    // "서울특별시 강남구" 형태로 파싱
    const parts = selectedLocation.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1]}`;
    }
    
    return selectedLocation;
  };

  const handleProvinceSelect = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setShowProvinces(false);
  };

  const handleDistrictSelect = (districtId: string) => {
    const provinceName = provinces.find(p => p.id === selectedProvince)?.name || '';
    const districtName = districts[selectedProvince as keyof typeof districts]?.find(d => d.id === districtId)?.name || '';
    const fullLocation = `${provinceName} ${districtName}`;
    
    onLocationChange(fullLocation);
    setIsOpen(false);
    setShowProvinces(true);
    setSelectedProvince('');
  };

  const handleBack = () => {
    if (!showProvinces) {
      setShowProvinces(true);
      setSelectedProvince('');
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors whitespace-nowrap"
      >
        <i className="ri-map-pin-line mr-1 text-red-500"></i>
        <span className="text-sm">{getDisplayText()}</span>
        <i className="ri-arrow-down-s-line ml-1"></i>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-gray-800 rounded-t-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center">
                {!showProvinces && (
                  <button
                    onClick={handleBack}
                    className="mr-3 text-white hover:text-gray-300"
                  >
                    <i className="ri-arrow-left-line text-xl"></i>
                  </button>
                )}
                <h3 className="text-white font-semibold">
                  {showProvinces ? '시도 선택' : '군구 선택'}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {showProvinces ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onLocationChange('all');
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${
                      selectedLocation === 'all'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    전체 지역
                  </button>
                  {provinces.map((province) => (
                    <button
                      key={province.id}
                      onClick={() => handleProvinceSelect(province.id)}
                      className="w-full px-4 py-3 text-left bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      {province.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {districts[selectedProvince as keyof typeof districts]?.map((district) => (
                    <button
                      key={district.id}
                      onClick={() => handleDistrictSelect(district.id)}
                      className="w-full px-4 py-3 text-left bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      {district.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}