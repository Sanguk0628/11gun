export interface Gym {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  distance?: string;
  tags?: string[];
  thumbsUp?: number;
  thumbsDown?: number;
}

export const mockGyms: Gym[] = [
  {
    id: '1',
    name: '파워존 헬스클럽',
    image: 'https://readdy.ai/api/search-image?query=modern%20gym%20interior%20with%20power%20racks%20and%20weight%20equipment%2C%20clean%20professional%20lighting%2C%20spacious%20workout%20area%20with%20black%20and%20red%20color%20scheme&width=400&height=300&seq=gym1&orientation=landscape',
    rating: 4.8,
    reviewCount: 156,
    location: '강남구 논현동',
    distance: '0.3km',
    tags: ['파워랙 6개', '24시간', '주차가능'],
    thumbsUp: 124,
    thumbsDown: 32
  },
  {
    id: '2', 
    name: '아이언 피트니스',
    image: 'https://readdy.ai/api/search-image?query=premium%20fitness%20center%20with%20modern%20equipment%2C%20iron%20weights%20and%20dumbbells%2C%20professional%20gym%20atmosphere%20with%20dark%20metallic%20tones&width=400&height=300&seq=gym2&orientation=landscape',
    rating: 4.6,
    reviewCount: 89,
    location: '서초구 서초동',
    distance: '0.8km',
    tags: ['머신 많음', '샤워실', '락커룸'],
    thumbsUp: 67,
    thumbsDown: 22
  },
  {
    id: '3',
    name: '스트롱 바디 센터', 
    image: 'https://readdy.ai/api/search-image?query=strength%20training%20gym%20with%20heavy%20equipment%2C%20barbells%20and%20power%20racks%2C%20industrial%20style%20interior%20with%20concrete%20walls&width=400&height=300&seq=gym3&orientation=landscape',
    rating: 4.9,
    reviewCount: 203,
    location: '강남구 역삼동',
    distance: '1.2km',
    tags: ['프리웨이트', '전문가', '개인트레이닝'],
    thumbsUp: 189,
    thumbsDown: 14
  }
];



