-- 사용자 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 헬스장 테이블
CREATE TABLE IF NOT EXISTS gyms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  distance TEXT,
  tags TEXT[],
  thumbs_up INTEGER DEFAULT 0,
  thumbs_down INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 머신 테이블
CREATE TABLE IF NOT EXISTS machines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  count INTEGER DEFAULT 1,
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

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gyms_location ON gyms(location);
CREATE INDEX IF NOT EXISTS idx_gyms_rating ON gyms(rating);
CREATE INDEX IF NOT EXISTS idx_machines_gym_id ON machines(gym_id);
CREATE INDEX IF NOT EXISTS idx_reviews_gym_id ON reviews(gym_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_gym_likes_gym_id ON gym_likes(gym_id);
CREATE INDEX IF NOT EXISTS idx_gym_likes_user_id ON gym_likes(user_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_likes ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 정보만 볼 수 있음
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 헬스장은 모든 사용자가 볼 수 있음
CREATE POLICY "Anyone can view gyms" ON gyms
  FOR SELECT USING (true);

-- 머신은 모든 사용자가 볼 수 있음
CREATE POLICY "Anyone can view machines" ON machines
  FOR SELECT USING (true);

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

-- 샘플 데이터 삽입
INSERT INTO gyms (name, image, rating, review_count, location, distance, tags, thumbs_up, thumbs_down) VALUES
('파워존 헬스클럽', 'https://readdy.ai/api/search-image?query=modern%20gym%20interior%20with%20power%20racks%20and%20weight%20equipment%2C%20clean%20professional%20lighting%2C%20spacious%20workout%20area%20with%20black%20and%20red%20color%20scheme&width=400&height=300&seq=gym1&orientation=landscape', 4.8, 156, '강남구 논현동', '0.3km', ARRAY['파워랙 6개', '24시간', '주차가능'], 124, 32),
('아이언 피트니스', 'https://readdy.ai/api/search-image?query=premium%20fitness%20center%20with%20modern%20equipment%2C%20iron%20weights%20and%20dumbbells%2C%20professional%20gym%20atmosphere%20with%20dark%20metallic%20tones&width=400&height=300&seq=gym2&orientation=landscape', 4.6, 89, '서초구 서초동', '0.8km', ARRAY['머신 많음', '샤워실', '락커룸'], 67, 22),
('스트롱 바디 센터', 'https://readdy.ai/api/search-image?query=strength%20training%20gym%20with%20heavy%20equipment%2C%20barbells%20and%20power%20racks%2C%20industrial%20style%20interior%20with%20concrete%20walls&width=400&height=300&seq=gym3&orientation=landscape', 4.9, 203, '강남구 역삼동', '1.2km', ARRAY['프리웨이트', '전문가', '개인트레이닝'], 189, 14);

-- 머신 데이터 삽입
INSERT INTO machines (gym_id, brand, count) 
SELECT g.id, 'Hammer Strength (해머스트렝스)', 8 FROM gyms g WHERE g.name = '파워존 헬스클럽'
UNION ALL
SELECT g.id, 'Watson (왓슨)', 4 FROM gyms g WHERE g.name = '파워존 헬스클럽'
UNION ALL
SELECT g.id, 'Prime (프라임)', 6 FROM gyms g WHERE g.name = '아이언 피트니스'
UNION ALL
SELECT g.id, 'Technogym (테크노짐)', 5 FROM gyms g WHERE g.name = '아이언 피트니스'
UNION ALL
SELECT g.id, 'Panatta (파나타)', 4 FROM gyms g WHERE g.name = '스트롱 바디 센터'
UNION ALL
SELECT g.id, 'Life Fitness (라이프 피트니스)', 7 FROM gyms g WHERE g.name = '스트롱 바디 센터';

