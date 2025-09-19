import { useEffect } from 'react';
import Layout from '../../components/layout/Layout';

export default function MyReviewsPage() {
  // SEO 설정 (robots meta로 검색엔진 제외)
  useEffect(() => {
    document.title = '작성한 리뷰 - 헬스장 찾기';
    
    // robots meta 태그 추가 (개인정보 보호를 위해 검색엔진에서 제외)
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow';
    document.head.appendChild(robotsMeta);
    
    return () => {
      document.head.removeChild(robotsMeta);
    };
  }, []);

  const myReviews = [
    {
      id: '1',
      gymName: '파워존 헬스클럽',
      location: '서울 강남구 역삼동',
      rating: 4.8,
      date: '2024-01-15',
      review: '시설이 깔끔하고 파워랙이 많아서 좋았습니다. 대기시간이 거의 없어서 운동하기 편했어요.',
      image: 'https://readdy.ai/api/search-image?query=modern%20fitness%20gym%20interior%20with%20power%20racks%20and%20free%20weights%2C%20professional%20lighting%2C%20clean%20and%20spacious%20environment%2C%20dark%20theme%20with%20red%20accents&width=300&height=200&seq=7&orientation=landscape'
    },
    {
      id: '2',
      gymName: '아이언 피트니스',
      location: '서울 강남구 삼성동',
      rating: 4.6,
      date: '2024-01-10',
      review: '머신이 다양하고 덤벨 무게도 충분해서 만족했습니다. 다만 샤워실이 조금 좁은 것 같아요.',
      image: 'https://readdy.ai/api/search-image?query=premium%20fitness%20center%20with%20iron%20equipment%20and%20dumbbells%2C%20modern%20gym%20interior%2C%20professional%20atmosphere%2C%20dark%20colors%20with%20metallic%20accents&width=300&height=200&seq=8&orientation=landscape'
    },
    {
      id: '3',
      gymName: '스트롱 바디 센터',
      location: '서울 강남구 논현동',
      rating: 4.7,
      date: '2024-01-05',
      review: '트레이너분들이 친절하고 운동 분위기가 좋았습니다. 주차도 편리해서 재방문 의사 있어요.',
      image: 'https://readdy.ai/api/search-image?query=strength%20training%20gym%20with%20barbells%20and%20weight%20plates%2C%20industrial%20style%20interior%2C%20dark%20lighting%20with%20professional%20equipment%20setup&width=300&height=200&seq=9&orientation=landscape'
    },
    {
      id: '4',
      gymName: '맥스웰 헬스',
      location: '서울 강남구 청담동',
      rating: 4.9,
      date: '2023-12-28',
      review: '최고급 시설과 장비들이 인상적이었습니다. 가격은 비싸지만 그만한 가치가 있다고 생각해요.',
      image: 'https://readdy.ai/api/search-image?query=luxury%20fitness%20club%20with%20high-end%20equipment%2C%20modern%20design%2C%20spacious%20workout%20area%20with%20professional%20lighting%20and%20dark%20interior%20theme&width=300&height=200&seq=10&orientation=landscape'
    },
    {
      id: '5',
      gymName: '피트니스 파크',
      location: '서울 강남구 대치동',
      rating: 4.4,
      date: '2023-12-20',
      review: '넓은 공간과 다양한 운동기구가 좋았습니다. 러닝머신도 많아서 유산소 운동하기 편했어요.',
      image: 'https://readdy.ai/api/search-image?query=large%20fitness%20park%20with%20various%20exercise%20equipment%2C%20spacious%20cardio%20area%20with%20treadmills%2C%20modern%20gym%20design%20with%20dark%20colors%20and%20professional%20lighting&width=300&height=200&seq=11&orientation=landscape'
    },
    {
      id: '6',
      gymName: '헬스존 프리미엄',
      location: '서울 강남구 신사동',
      rating: 4.5,
      date: '2023-12-15',
      review: '시설이 새로 리뉴얼되어서 깔끔하고 좋았습니다. 락커룸도 넓고 편의시설이 잘 되어있어요.',
      image: 'https://readdy.ai/api/search-image?query=premium%20health%20zone%20fitness%20center%20with%20renovated%20facilities%2C%20clean%20and%20modern%20interior%2C%20spacious%20locker%20rooms%2C%20dark%20theme%20with%20red%20highlights&width=300&height=200&seq=12&orientation=landscape'
    }
  ];

  return (
    <Layout headerTitle="작성한 리뷰" showSearch={false} showShare={false}>
      <div className="px-4 py-6">
        <div className="mb-6">
          <h2 className="text-white text-xl font-bold mb-2">내가 작성한 리뷰</h2>
          <p className="text-gray-400 text-sm">총 {myReviews.length}개의 리뷰를 작성했습니다</p>
        </div>

        <div className="space-y-4">
          {myReviews.map((review) => (
            <div key={review.id} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex">
                <img
                  src={review.image}
                  alt={review.gymName}
                  className="w-24 h-24 object-cover object-top"
                  onError={(e) => {
                    e.target.src = '/path/to/default-image.jpg';
                  }}
                />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-medium mb-1">{review.gymName}</h3>
                      <p className="text-gray-400 text-sm">{review.location}</p>
                    </div>
                    <span className="text-gray-400 text-xs">{review.date}</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`ri-star-${i < Math.floor(review.rating) ? 'fill' : 'line'} text-yellow-400 text-sm mr-1`}
                        ></i>
                      ))}
                      <span className="text-white text-sm ml-1">{review.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">{review.review}</p>
                  
                  <div className="flex items-center justify-end mt-3 space-x-2">
                    <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                      <i className="ri-edit-line text-sm"></i>
                    </button>
                    <button className="text-gray-400 hover:text-red-5

                    transition-colors cursor-pointer">
                      <i className="ri-delete-bin-line text-sm"></i>
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
