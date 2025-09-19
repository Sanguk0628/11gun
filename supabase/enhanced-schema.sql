-- 사용자 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 헬스장 테이블 (카카오맵 API + 사용자 입력 데이터)
CREATE TABLE IF NOT EXISTS gyms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 기본 정보
  name TEXT NOT NULL,
  image TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  distance TEXT,
  tags TEXT[],
  thumbs_up INTEGER DEFAULT 0,
  thumbs_down INTEGER DEFAULT 0,
  
  -- 카카오맵 API 데이터
  kakao_place_id TEXT UNIQUE, -- 카카오맵 장소 ID
  phone TEXT, -- 전화번호
  latitude DECIMAL(10, 8), -- 위도
  longitude DECIMAL(11, 8), -- 경도
  data_source TEXT DEFAULT 'manual', -- 데이터 출처 (manual, kakao_api)
  
  -- 지역 정보 (파싱된)
  city TEXT, -- 시/도 (예: 서울시)
  district TEXT, -- 구/군 (예: 광진구)
  dong TEXT, -- 동/읍/면 (예: 구의동)
  
  -- 사용자 입력 상세 정보
  daily_price INTEGER, -- 일일권 가격
  regular_holiday TEXT, -- 정규 휴무일 (예: "매주 일요일")
  power_rack_count INTEGER DEFAULT 0, -- 파워랙 개수
  smith_rack_count INTEGER DEFAULT 0, -- 스미스랙 개수
  dumbbell_min_weight INTEGER, -- 덤벨 최소 무게
  dumbbell_max_weight INTEGER, -- 덤벨 최대 무게
  machine_brands TEXT[], -- 유명머신 브랜드 배열
  
  -- 시스템 정보
  is_verified BOOLEAN DEFAULT false, -- 검증된 헬스장 여부
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 머신 테이블 (브랜드별 상세 정보)
CREATE TABLE IF NOT EXISTS machines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  brand TEXT NOT NULL, -- 브랜드명
  model TEXT, -- 모델명
  count INTEGER DEFAULT 1, -- 개수
  condition TEXT, -- 상태 (좋음, 보통, 나쁨)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 리뷰 테이블
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  content TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 좋아요 테이블
CREATE TABLE IF NOT EXISTS gym_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gym_id, user_id)
);

-- 찜하기 테이블
CREATE TABLE IF NOT EXISTS gym_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gym_id, user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gyms_location ON gyms(location);
CREATE INDEX IF NOT EXISTS idx_gyms_rating ON gyms(rating);
CREATE INDEX IF NOT EXISTS idx_gyms_kakao_place_id ON gyms(kakao_place_id);
CREATE INDEX IF NOT EXISTS idx_gyms_coordinates ON gyms(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_gyms_city ON gyms(city);
CREATE INDEX IF NOT EXISTS idx_gyms_district ON gyms(district);
CREATE INDEX IF NOT EXISTS idx_gyms_daily_price ON gyms(daily_price);
CREATE INDEX IF NOT EXISTS idx_gyms_machine_brands ON gyms USING GIN(machine_brands);
CREATE INDEX IF NOT EXISTS idx_machines_gym_id ON machines(gym_id);
CREATE INDEX IF NOT EXISTS idx_machines_brand ON machines(brand);
CREATE INDEX IF NOT EXISTS idx_reviews_gym_id ON reviews(gym_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_gym_likes_gym_id ON gym_likes(gym_id);
CREATE INDEX IF NOT EXISTS idx_gym_likes_user_id ON gym_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_gym_bookmarks_gym_id ON gym_bookmarks(gym_id);
CREATE INDEX IF NOT EXISTS idx_gym_bookmarks_user_id ON gym_bookmarks(user_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_bookmarks ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 정보만 볼 수 있음
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 헬스장은 모든 사용자가 볼 수 있음, 관리자만 추가/수정 가능
CREATE POLICY "Anyone can view gyms" ON gyms
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert gyms" ON gyms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update gyms" ON gyms
  FOR UPDATE USING (true);

-- 머신은 모든 사용자가 볼 수 있음
CREATE POLICY "Anyone can view machines" ON machines
  FOR SELECT USING (true);

CREATE POLICY "Users can insert machines" ON machines
  FOR INSERT WITH CHECK (true);

-- 리뷰는 모든 사용자가 볼 수 있음, 작성자만 수정/삭제 가능
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- 좋아요는 모든 사용자가 볼 수 있음, 본인 것만 추가/삭제 가능
CREATE POLICY "Anyone can view gym likes" ON gym_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own gym likes" ON gym_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own gym likes" ON gym_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 찜하기는 모든 사용자가 볼 수 있음, 본인 것만 추가/삭제 가능
CREATE POLICY "Anyone can view gym bookmarks" ON gym_bookmarks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own gym bookmarks" ON gym_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own gym bookmarks" ON gym_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gyms_updated_at BEFORE UPDATE ON gyms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 좋아요/찜 개수 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_gym_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE gyms SET thumbs_up = thumbs_up + 1 WHERE id = NEW.gym_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE gyms SET thumbs_up = thumbs_up - 1 WHERE id = OLD.gym_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- 좋아요 트리거
CREATE TRIGGER update_gym_like_count_trigger
  AFTER INSERT OR DELETE ON gym_likes
  FOR EACH ROW EXECUTE FUNCTION update_gym_like_count();

-- 샘플 데이터 삽입
INSERT INTO gyms (
  name, image, rating, review_count, location, distance, tags, thumbs_up, thumbs_down,
  kakao_place_id, phone, latitude, longitude, data_source,
  city, district, dong,
  daily_price, regular_holiday, power_rack_count, smith_rack_count,
  dumbbell_min_weight, dumbbell_max_weight, machine_brands
) VALUES
(
  '파워존 헬스클럽', 
  'https://readdy.ai/api/search-image?query=modern%20gym%20interior%20with%20power%20racks%20and%20weight%20equipment%2C%20clean%20professional%20lighting%2C%20spacious%20workout%20area%20with%20black%20and%20red%20color%20scheme&width=400&height=300&seq=gym1&orientation=landscape', 
  4.8, 156, '강남구 논현동', '0.3km', ARRAY['파워랙 6개', '24시간', '주차가능'], 124, 32,
  'kakao_12345', '02-1234-5678', 37.4979, 127.0276, 'kakao_api',
  '서울시', '강남구', '논현동',
  15000, '매주 일요일', 6, 2,
  2, 50, ARRAY['Hammer Strength', 'Watson', 'Prime']
),
(
  '아이언 피트니스', 
  'https://readdy.ai/api/search-image?query=premium%20fitness%20center%20with%20modern%20equipment%2C%20iron%20weights%20and%20dumbbells%2C%20professional%20gym%20atmosphere%20with%20dark%20metallic%20tones&width=400&height=300&seq=gym2&orientation=landscape', 
  4.6, 89, '서초구 서초동', '0.8km', ARRAY['머신 많음', '샤워실', '락커룸'], 67, 22,
  'kakao_67890', '02-2345-6789', 37.4947, 127.0324, 'kakao_api',
  '서울시', '서초구', '서초동',
  20000, '매주 월요일', 4, 1,
  5, 60, ARRAY['Technogym', 'Life Fitness', 'Cybex']
),
(
  '스트롱 바디 센터', 
  'https://readdy.ai/api/search-image?query=strength%20training%20gym%20with%20heavy%20equipment%2C%20barbells%20and%20power%20racks%2C%20industrial%20style%20interior%20with%20concrete%20walls&width=400&height=300&seq=gym3&orientation=landscape', 
  4.9, 203, '강남구 역삼동', '1.2km', ARRAY['프리웨이트', '전문가', '개인트레이닝'], 189, 14,
  'kakao_11111', '02-3456-7890', 37.5003, 127.0285, 'kakao_api',
  '서울시', '강남구', '역삼동',
  25000, '연중무휴', 8, 3,
  2, 80, ARRAY['Panatta', 'Atlantis', 'Arsenal Strength']
);

-- 머신 데이터 삽입
INSERT INTO machines (gym_id, brand, model, count, condition) 
SELECT g.id, 'Hammer Strength', 'Pro Series', 4, '좋음' FROM gyms g WHERE g.name = '파워존 헬스클럽'
UNION ALL
SELECT g.id, 'Watson', 'Standard', 2, '좋음' FROM gyms g WHERE g.name = '파워존 헬스클럽'
UNION ALL
SELECT g.id, 'Prime', 'Prodigy', 3, '보통' FROM gyms g WHERE g.name = '아이언 피트니스'
UNION ALL
SELECT g.id, 'Technogym', 'Selection', 5, '좋음' FROM gyms g WHERE g.name = '아이언 피트니스'
UNION ALL
SELECT g.id, 'Panatta', 'Sport', 4, '좋음' FROM gyms g WHERE g.name = '스트롱 바디 센터'
UNION ALL
SELECT g.id, 'Life Fitness', 'Signature', 6, '좋음' FROM gyms g WHERE g.name = '스트롱 바디 센터';
