
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockGyms } from '../../mocks/gyms';
import Layout from '../../components/layout/Layout';

export default function GymDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const gym = mockGyms.find(g => g.id === id);
  
  // SEO 설정
  useEffect(() => {
    if (gym) {
      document.title = `${gym.name} - 헬스장 상세정보 | 헬스장 찾기`;
      
      // Schema.org JSON-LD 추가
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ExerciseGym",
        "name": gym.name,
        "description": `${gym.name}의 상세 정보와 시설 안내를 확인하세요. 평점 ${gym.rating}점, ${gym.reviewCount}개의 실제 이용자 리뷰를 제공합니다.`,
        "url": `${import.meta.env.VITE_SITE_URL || window.location.origin}/gym/${gym.id}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": gym.location,
          "addressCountry": "KR"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": gym.rating,
          "reviewCount": gym.reviewCount,
          "bestRating": "5",
          "worstRating": "1"
        },
        "image": gym.image,
        "priceRange": "$$",
        "openingHours": "Mo-Su 06:00-24:00",
        "amenityFeature": [
          {
            "@type": "LocationFeatureSpecification",
            "name": "Parking",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification", 
            "name": "Shower",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Ice Machine",
            "value": true
          }
        ],
        "hasMap": `https://maps.google.com/?q=${encodeURIComponent(gym.location)}`
      });
      
      document.head.appendChild(schemaScript);
      
      return () => {
        document.head.removeChild(schemaScript);
      };
    }
  }, [gym]);
  
  if (!gym) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">헬스장을 찾을 수 없습니다.</p>
        </div>
      </Layout>
    );
  }

  const handleReviewClick = () => {
    navigate('/review');
  };

  // 헬스장별 실제 장비 정보
  const getGymEquipment = (gymId: string) => {
    const equipmentData: { [key: string]: string[] } = {
      '1': ['파워랙 6개', '스미스랙 4개', '덤벨 MAX 50kg'],
      '2': ['파워랙 4개', '스미스랙 3개', '덤벨 MAX 45kg'],
      '3': ['파워랙 8개', '스미스랙 2개', '덤벨 MAX 60kg'],
      '4': ['파워랙 3개', '스미스랙 2개', '덤벨 MAX 40kg'],
      '5': ['파워랙 10개', '스미스랙 1개', '덤벨 MAX 70kg'],
      '6': ['파워랙 5개', '스미스랙 3개', '덤벨 MAX 55kg']
    };
    return equipmentData[gymId] || ['파워랙 4개', '스미스랙 2개', '덤벨 MAX 45kg'];
  };

  // 헬스장별 이미지 여러 장
  const getGymImages = (gymId: string) => {
    const baseImages: { [key: string]: string[] } = {
      '1': [
        'https://readdy.ai/api/search-image?query=modern%20gym%20interior%20with%20power%20racks%20and%20weight%20equipment%2C%20clean%20professional%20lighting%2C%20spacious%20workout%20area%20with%20black%20and%20red%20color%20scheme&width=400&height=300&seq=gym1-1&orientation=landscape',
        'https://readdy.ai/api/search-image?query=gym%20free%20weight%20section%20with%20dumbbells%20and%20barbells%2C%20professional%20fitness%20equipment%20in%20modern%20facility&width=400&height=300&seq=gym1-2&orientation=landscape',
        'https://readdy.ai/api/search-image?query=cardio%20machine%20area%20in%20premium%20gym%2C%20treadmills%20and%20ellipticals%20with%20modern%20design&width=400&height=300&seq=gym1-3&orientation=landscape'
      ],
      '2': [
        'https://readdy.ai/api/search-image?query=premium%20fitness%20center%20with%20modern%20equipment%2C%20iron%20weights%20and%20dumbbells%2C%20professional%20gym%20atmosphere%20with%20dark%20metallic%20tones&width=400&height=300&seq=gym2-1&orientation=landscape',
        'https://readdy.ai/api/search-image?query=strength%20training%20area%20with%20smith%20racks%20and%20power%20cages%2C%20professional%20iron%20equipment&width=400&height=300&seq=gym2-2&orientation=landscape',
        'https://readdy.ai/api/search-image?query=locker%20room%20and%20shower%20facilities%20in%20premium%20fitness%20center%2C%20clean%20modern%20amenities&width=400&height=300&seq=gym2-3&orientation=landscape'
      ],
      '3': [
        'https://readdy.ai/api/search-image?query=strength%20training%20gym%20with%20heavy%20equipment%2C%20barbells%20and%20power%20racks%2C%20industrial%20style%20interior%20with%20concrete%20walls&width=400&height=300&seq=gym3-1&orientation=landscape',
        'https://readdy.ai/api/search-image?query=powerlifting%20platform%20with%20Olympic%20barbells%20and%20bumper%20plates%2C%20competition%20grade%20equipment&width=400&height=300&seq=gym3-2&orientation=landscape',
        'https://readdy.ai/api/search-image?query=personal%20training%20area%20in%20strength%20gym%2C%20specialized%20equipment%20for%20professional%20athletes&width=400&height=300&seq=gym3-3&orientation=landscape'
      ],
      '4': [
        'https://readdy.ai/api/search-image?query=contemporary%20fitness%20club%20with%20cardio%20machines%20and%20weight%20area%2C%20bright%20clean%20environment%20with%20white%20and%20blue%20accents&width=400&height=300&seq=gym4-1&orientation=landscape',
        'https://readdy.ai/api/search-image?query=yoga%20and%20pilates%20studio%20in%20fitness%20club%2C%20peaceful%20exercise%20room%20with%20mats%20and%20equipment&width=400&height=300&seq=gym4-2&orientation=landscape',
        'https://readdy.ai/api/search-image?query=group%20fitness%20class%20room%20with%20mirrors%20and%20sound%20system%2C%20modern%20exercise%20studio&width=400&height=300&seq=gym4-3&orientation=landscape'
      ],
      '5': [
        'https://readdy.ai/api/search-image?query=olympic%20style%20powerlifting%20gym%20with%20competition%20grade%20equipment%2C%20heavy%20duty%20racks%20and%20platforms%2C%20professional%20training%20atmosphere&width=400&height=300&seq=gym5-1&orientation=landscape',
        'https://readdy.ai/api/search-image?query=olympic%20weightlifting%20platform%20with%20competition%20barbells%20and%20bumper%20plates%2C%20professional%20training%20facility&width=400&height=300&seq=gym5-2&orientation=landscape',
        'https://readdy.ai/api/search-image?query=specialized%20powerlifting%20equipment%20area%20with%20deadlift%20platforms%20and%20heavy%20barbells&width=400&height=300&seq=gym5-3&orientation=landscape'
      ],
      '6': [
        'https://readdy.ai/api/search-image?query=bodybuilding%20gym%20with%20extensive%20free%20weights%2C%20posing%20mirrors%20and%20competitive%20atmosphere%2C%20dark%20dramatic%20lighting%20with%20gold%20accents&width=400&height=300&seq=gym6-1&orientation=landscape',
        'https://readdy.ai/api/search-image?query=posing%20room%20with%20mirrors%20and%20professional%20lighting%20for%20bodybuilding%20practice&width=400&height=300&seq=gym6-2&orientation=landscape',
        'https://readdy.ai/api/search-image?query=cable%20machine%20area%20in%20bodybuilding%20gym%2C%20extensive%20pulley%20systems%20and%20specialized%20equipment&width=400&height=300&seq=gym6-3&orientation=landscape'
      ]
    };
    return baseImages[gymId] || baseImages['1'];
  };

  const equipmentInfo = getGymEquipment(gym.id);
  const gymImages = getGymImages(gym.id);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gymImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gymImages.length) % gymImages.length);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 상단 이미지 슬라이더 */}
        <div className="relative">
          <img
            src={gymImages[currentImageIndex]}
            alt={gym.name}
            className="w-full h-80 object-cover object-top"
          />
          
          {/* 좌측 네비게이션 버튼 */}
          {gymImages.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
          )}
          
          {/* 우측 네비게이션 버튼 */}
          {gymImages.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <i className="ri-arrow-right-line text-xl"></i>
            </button>
          )}

          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          
          {/* 좋아요 버튼 */}
          <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
            <i className="ri-heart-line text-xl"></i>
          </button>

          {/* 이미지 인디케이터 */}
          {gymImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {gymImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 헬스장 정보 */}
        <div className="px-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-white">{gym.name}</h1>
              
              {/* 추천 수 표시 */}
              {gym.thumbsUp && (
                <div className="flex items-center space-x-1">
                  <i className="ri-thumb-up-line text-green-400 text-lg"></i>
                  <span className="text-green-400 text-lg font-medium">{gym.thumbsUp}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <i className="ri-map-pin-line text-gray-400"></i>
                <span className="text-gray-400">{gym.location}</span>
              </div>
              {gym.distance && (
                <div className="flex items-center space-x-1">
                  <i className="ri-navigation-line text-gray-400"></i>
                  <span className="text-gray-400">{gym.distance}</span>
                </div>
              )}
            </div>
          </div>

          {/* 장비 정보 태그 */}
          <div className="flex flex-wrap gap-2">
            {equipmentInfo.map((equipment, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-full"
              >
                {equipment}
              </span>
            ))}
          </div>

          {/* 시설 정보 */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-3">시설 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <i className="ri-checkbox-circle-fill text-green-400"></i>
                <span className="text-gray-300">무료주차</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-checkbox-circle-fill text-green-400"></i>
                <span className="text-gray-300">근처 저가커피</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-checkbox-circle-fill text-green-400"></i>
                <span className="text-gray-300">얼음(제빙기)</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-checkbox-circle-fill text-green-400"></i>
                <span className="text-gray-300">천국의 계단</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-3 pt-4">
            <button 
              onClick={handleReviewClick}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              리뷰 작성하기
            </button>
            <button className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              길찾기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
