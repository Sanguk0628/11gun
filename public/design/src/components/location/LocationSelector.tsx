
import { useState } from 'react';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const CITIES = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', 
  '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도', 
  '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
];

const DISTRICTS: { [key: string]: string[] } = {
  '서울특별시': [
    '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
    '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
    '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
  ],
  '경기도': [
    '수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '안양시', '남양주시',
    '화성시', '평택시', '의정부시', '시흥시', '파주시', '광명시', '김포시', '군포시'
  ]
};

export default function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'city' | 'district'>('city');
  const [selectedCity, setSelectedCity] = useState('');

  const handleCitySelect = (city: string) => {
    if (DISTRICTS[city]) {
      setSelectedCity(city);
      setStep('district');
    } else {
      onLocationChange(city);
      setIsOpen(false);
      setStep('city');
    }
  };

  const handleDistrictSelect = (district: string) => {
    onLocationChange(`${selectedCity} ${district}`);
    setIsOpen(false);
    setStep('city');
    setSelectedCity('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('city');
    setSelectedCity('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-3 py-2 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap flex-shrink-0"
      >
        <i className="ri-map-pin-line text-red-500 mr-1"></i>
        <span className="text-xs">서울 강남구</span>
        <i className="ri-arrow-down-s-line ml-1"></i>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-gray-900 rounded-t-xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">
                {step === 'city' ? '지역 선택' : '상세 지역 선택'}
              </h3>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {step === 'city' ? (
                <div className="p-4">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4">
                  <button
                    onClick={() => setStep('city')}
                    className="flex items-center text-gray-400 hover:text-white mb-4 cursor-pointer"
                  >
                    <i className="ri-arrow-left-line mr-2"></i>
                    <span className="text-sm">뒤로 가기</span>
                  </button>
                  {selectedCity && DISTRICTS[selectedCity]?.map((district) => (
                    <button
                      key={district}
                      onClick={() => handleDistrictSelect(district)}
                      className="w-full text-left px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {district}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
