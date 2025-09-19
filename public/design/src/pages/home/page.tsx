
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import LocationSelector from '../../components/location/LocationSelector';
import GymCard from '../../components/gym/GymCard';
import { mockGyms } from '../../mocks/gyms';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [filterType, setFilterType] = useState('all');
  const [showMachineSelector, setShowMachineSelector] = useState(false);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

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
      "url": import.meta.env.VITE_SITE_URL || window.location.origin,
      "serviceType": "Fitness Center Directory",
      "areaServed": "South Korea",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "헬스장 목록",
        "itemListElement": mockGyms.map((gym, index) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "ExerciseGym",
            "name": gym.name,
            "address": gym.location,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": gym.rating,
              "reviewCount": gym.reviewCount
            }
          },
          "position": index + 1
        }))
      }
    });
    
    document.head.appendChild(schemaScript);
    
    return () => {
      document.head.removeChild(schemaScript);
    };
  }, []);

  const filters = [
    { id: 'all', label: '전체', icon: 'ri-apps-line' },
    { id: 'nearby', label: '내 주변', icon: 'ri-compass-line' },
    { id: 'powerrack', label: '파워랙 많은', icon: 'ri-barbell-line' }
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
    navigate(`/gym/${gymId}`);
  };

  // 필터링 로직 추가
  const filteredGyms = mockGyms.filter((gym) => {
    // 지역 필터 적용
    if (selectedLocation !== 'all' && gym.location !== selectedLocation) {
      return false;
    }

    // 머신 브랜드 필터 적용
    if (selectedMachines.length > 0) {
      const gymMachines = gym.machines.map(m => m.brand);
      return selectedMachines.every(machine => gymMachines.includes(machine));
    }

    return true;
  });

  return (
    <Layout>
      <div className="px-4 py-6">
        {/* 지역 선택 */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4 space-x-2">
            <LocationSelector 
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
            />
            <button 
              onClick={() => setShowMachineSelector(true)}
              className="flex items-center px-3 py-2 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <i className="ri-tools-line mr-1"></i>
              <span className="text-xs hidden sm:inline">어떤 브랜드를 찾고 계신가요?</span>
              <span className="text-xs sm:hidden">머신 브랜드</span>
              <i className="ri-arrow-down-s-line ml-1"></i>
            </button>
            <button className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors whitespace-nowrap">
              <i className="ri-navigation-line mr-1"></i>
              <span className="text-xs">내 주변</span>
            </button>
          </div>
        </div>

        {/* 필터 */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors ${
                  filterType === filter.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <i className={`${filter.icon} mr-2`}></i>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-white text-xl font-bold mb-2">
            {selectedLocation === 'all' ? '전체 지역' : selectedLocation}의 헬스장
          </h2>
          <p className="text-gray-400 text-sm">
            {filteredGyms.length}개의 헬스장을 찾았습니다
          </p>
        </div>

        {/* 헬스장 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6">
          {filteredGyms.map((gym) => (
            <GymCard
              key={gym.id}
              gym={gym}
              onClick={() => handleGymClick(gym.id)}
            />
          ))}
        </div>

        {/* 로딩 더보기 */}
        <div className="flex justify-center mt-8">
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors whitespace-nowrap">
            더 많은 헬스장 보기
          </button>
        </div>
      </div>

      {/* 머신 선택 모달 */}
      {showMachineSelector && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-gray-900 rounded-t-xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">찾는 머신 브랜드</h3>
              <button
                onClick={handleMachineSelectorClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
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
                    className={`py-3 px-4 rounded text-sm text-left cursor-pointer transition-colors ${
                      selectedMachines.includes(machine)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {machine}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedMachines([])}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-medium cursor-pointer hover:bg-gray-600 transition-colors whitespace-nowrap"
                >
                  초기화
                </button>
                <button
                  onClick={handleMachineSelectorClose}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium cursor-pointer hover:bg-red-700 transition-colors whitespace-nowrap"
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
