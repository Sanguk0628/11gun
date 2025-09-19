```
import { useEffect } from 'react';
import Layout from '../../components/layout/Layout';

export default function LikedGymsPage() {
  /* ------------------------------------------------------------------
   * SEO 설정 (robots meta 로 검색엔진 제외)
   * ------------------------------------------------------------------ */
  useEffect(() => {
    document.title = '찜한 헬스장 - 헬스장 찾기';

    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow';
    document.head.appendChild(robotsMeta);

    return () => {
      document.head.removeChild(robotsMeta);
    };
  }, []);

  /* ------------------------------------------------------------------
   * 목업 데이터 (실제 서비스에서는 API 로부터 받아와야 함)
   * ------------------------------------------------------------------ */
  const likedGyms = [
    {
      id: '1',
      name: '스트롱 바디 센터',
      location: '서울 강남구 논현동',
      rating: 4.7,
      dayPassPrice: '12000',
      features: ['파워랙 8개', '스미스랙 4개', '무료주차'],
      image:
        'https://readdy.ai/api/search-image?query=strength%20training%20gym%20with%20barbells%20and%20weight%20plates%2C%20industrial%20style%20interior%2C%20dark%20lighting%20with%20professional%20equipment%20setup&width=300&height=200&seq=9&orientation=landscape',
    },
    {
      id: '2',
      name: '맥스웰 헬스',
      location: '서울 강남구 청담동',
      rating: 4.9,
      dayPassPrice: '18000',
      features: ['프리미엄 시설', '개인 트레이닝', '사우나'],
      image:
        'https://readdy.ai/api/search-image?query=luxury%20fitness%20club%20with%20high-end%20equipment%2C%20modern%20design%2C%20spacious%20workout%20area%20with%20professional%20lighting%20and%20dark%20interior%20theme&width=300&height=200&seq=10&orientation=landscape',
    },
    {
      id: '3',
      name: '아이언 피트니스',
      location: '서울 강남구 삼성동',
      rating: 4.6,
      dayPassPrice: '10000',
      features: ['덤벨 50kg', '머신 다양', '24시간'],
      image:
        'https://readdy.ai/api/search-image?query=premium%20fitness%20center%20with%20iron%20equipment%20and%20dumbbells%2C%20modern%20gym%20interior%2C%20professional%20atmosphere%2C%20dark%20colors%20with%20metallic%20accents&width=300&height=200&seq=8&orientation=landscape',
    },
    {
      id: '4',
      name: '파워존 헬스클럽',
      location: '서울 강남구 역삼동',
      rating: 4.8,
      dayPassPrice: '15000',
      features: ['파워랙 10개', '깔끔한 시설', '샤워실'],
      image:
        'https://readdy.ai/api/search-image?query=modern%20fitness%20gym%20interior%20with%20power%20racks%20and%20free%20weights%2C%20professional%20lighting%2C%20clean%20and%20spacious%20environment%2C%20dark%20theme%20with%20red%20accents&width=300&height=200&seq=7&orientation=landscape',
    },
    {
      id: '5',
      name: '피트니스 파크',
      location: '서울 강남구 대치동',
      rating: 4.4,
      dayPassPrice: '11000',
      features: ['넓은 공간', '유산소 존', '무료주차'],
      image:
        'https://readdy.ai/api/search-image?query=large%20fitness%20park%20with%20various%20exercise%20equipment%2C%20spacious%20cardio%20area%20with%20treadmills%2C%20modern%20gym%20design%20with%20dark%20colors%20and%20professional%20lighting&width=300&height=200&seq=11&orientation=landscape',
    },
    {
      id: '6',
      name: '헬스존 프리미엄',
      location: '서울 강남구 신사동',
      rating: 4.5,
      dayPassPrice: '14000',
      features: ['리뉴얼 완료', '넓은 락커룸', '편의시설'],
      image:
        'https://readdy.ai/api/search-image?query=premium%20health%20zone%20fitness%20center%20with%20renovated%20facilities%2C%20clean%20and%20modern%20interior%2C%20spacious%20locker%20rooms%2C%20dark%20theme%20with%20red%20highlights&width=300&height=200&seq=12&orientation=landscape',
    },
    {
      id: '7',
      name: '골드 짐 센터',
      location: '서울 강남구 도곡동',
      rating: 4.3,
      dayPassPrice: '13000',
      features: ['골드 등급', '전문 트레이너', '그룹 수업'],
      image:
        'https://readdy.ai/api/search-image?query=gold%20gym%20center%20with%20professional%20trainers%2C%20group%20fitness%20classes%2C%20premium%20equipment%20and%20modern%20interior%20design%20with%20dark%20theme%20and%20gold%20accents&width=300&height=200&seq=13&orientation=landscape',
    },
    {
      id: '8',
      name: '바디빌딩 클럽',
      location: '서울 강남구 개포동',
      rating: 4.2,
      dayPassPrice: '9000',
      features: ['보디빌딩 특화', '프리웨이트', '저렴한 가격'],
      image:
        'https://readdy.ai/api/search-image?query=bodybuilding%20club%20specialized%20in%20free%20weights%2C%20professional%20bodybuilding%20atmosphere%2C%20hardcore%20gym%20environment%20with%20dark%20industrial%20design&width=300&height=200&seq=14&orientation=landscape',
    },
  ];

  /* ------------------------------------------------------------------
   * 찜 해제 핸들러 (실제 서비스에서는 API 호출 필요)
   * ------------------------------------------------------------------ */
  const handleRemoveLike = (gymId: string) => {
    console.log('찜 해제:', gymId);
    // TODO: 서버에 찜 해제 요청 보내기
  };

  return (
    <Layout headerTitle="찜한 헬스장" showSearch={false} showShare={false}>
      <div className="px-4 py-6">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h2 className="text-white text-xl font-bold mb-2">찜한 헬스장</h2>
          <p className="text-gray-400 text-sm">
            총 {likedGyms.length}개의 헬스장을 찜했습니다
          </p>
        </div>

        {/* 찜한 헬스장 리스트 */}
        <div className="space-y-4">
          {likedGyms.map((gym) => (
            <div key={gym.id} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex">
                {/* 썸네일 이미지 */}
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="w-24 h-24 object-cover object-top"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/path/to/default-image.jpg';
                  }}
                />
                {/* 상세 정보 */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-medium mb-1">{gym.name}</h3>
                      <p className="text-gray-400 text-sm">{gym.location}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveLike(gym.id)}
                      className="text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                      aria-label="찜 해제"
                    >
                      <i className="ri-heart-fill text-lg"></i>
                    </button>
                  </div>

                  {/* 평점 & 일일권 가격 */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-4">
                      <i className="ri-star-fill text-yellow-400 text-sm mr-1"></i>
                      <span className="text-white text-sm">{gym.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 font-medium">
                        {parseInt(gym.dayPassPrice).toLocaleString()}원
                      </span>
                      <span className="text-gray-400 text-sm ml-1">/일일권</span>
                    </div>
                  </div>

                  {/* 특징 태그 */}
                  <div className="flex flex-wrap gap-1">
                    {gym.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* 상세보기 버튼 */}
                  <div className="flex items-center justify-end mt-3">
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
```