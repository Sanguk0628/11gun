import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정 (기본 상태)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Gym {
  id: string;
  name: string;
  image?: string;
  rating: number;
  review_count: number;
  location: string;
  distance?: string;
  tags?: string[];
  thumbs_up: number;
  thumbs_down: number;
  
  // 카카오맵 API 데이터
  kakao_place_id?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  data_source?: string;
  
  // 지역 정보
  city?: string;
  district?: string;
  dong?: string;
  
  // 사용자 입력 상세 정보
  daily_price?: number;
  regular_holiday?: string;
  power_rack_count?: number;
  smith_rack_count?: number;
  dumbbell_min_weight?: number;
  dumbbell_max_weight?: number;
  machine_brands?: string[];
  
  // 시스템 정보
  is_verified?: boolean;
  
  created_at: string;
  updated_at: string;
  machines?: Machine[];
}

export interface Machine {
  id: string;
  gym_id: string;
  brand: string;
  model?: string;
  count: number;
  condition?: string;
  created_at: string;
}

export interface Review {
  id: string;
  gym_id: string;
  user_id: string;
  rating: number;
  content?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface GymLike {
  id: string;
  gym_id: string;
  user_id: string;
  created_at: string;
}

export interface GymBookmark {
  id: string;
  gym_id: string;
  user_id: string;
  created_at: string;
}

// 인증 관련 함수들 (기본 상태)
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    return null;
  }
};

export const signInWithProvider = async (provider: 'google' | 'kakao' | 'naver') => {
  try {
    // Supabase에서 지원하는 provider만 사용
    const supportedProvider = provider === 'naver' ? 'google' : provider;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: supportedProvider as any,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('OAuth 로그인 오류:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
};

// 헬스장 관련 함수들 (기본 상태)
export const getGyms = async (limit: number = 50): Promise<Gym[]> => {
  try {
    const { data, error } = await supabase
      .from('gyms')
      .select(`
        *,
        machines (*)
      `)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('헬스장 목록 가져오기 오류:', error);
    return [];
  }
};

export const getGymById = async (id: string): Promise<Gym | null> => {
  try {
    const { data, error } = await supabase
      .from('gyms')
      .select(`
        *,
        machines (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('헬스장 상세 정보 가져오기 오류:', error);
    return null;
  }
};

export const searchGyms = async (query: string, limit: number = 20): Promise<Gym[]> => {
  try {
    const { data, error } = await supabase
      .from('gyms')
      .select(`
        *,
        machines (*)
      `)
      .or(`name.ilike.%${query}%,location.ilike.%${query}%`)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('헬스장 검색 오류:', error);
    return [];
  }
};

// 리뷰 관련 함수들
export const getReviewsByGymId = async (gymId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (
          name,
          avatar_url
        )
      `)
      .eq('gym_id', gymId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('리뷰 목록 가져오기 오류:', error);
    return [];
  }
};

export const createReview = async (review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('리뷰 작성 오류:', error);
    return null;
  }
};

export const updateReview = async (id: string, updates: Partial<Review>): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('리뷰 수정 오류:', error);
    return null;
  }
};

export const deleteReview = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('리뷰 삭제 오류:', error);
    return false;
  }
};

// 좋아요 관련 함수들
export const toggleGymLike = async (gymId: string, userId: string): Promise<boolean> => {
  try {
    // 기존 좋아요 확인
    const { data: existingLike, error: checkError } = await supabase
      .from('gym_likes')
      .select('id')
      .eq('gym_id', gymId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingLike) {
      // 좋아요 취소
      const { error } = await supabase
        .from('gym_likes')
        .delete()
        .eq('id', existingLike.id);

      if (error) throw error;
      return false; // 좋아요 취소됨
    } else {
      // 좋아요 추가
      const { error } = await supabase
        .from('gym_likes')
        .insert([{ gym_id: gymId, user_id: userId }]);

      if (error) throw error;
      return true; // 좋아요 추가됨
    }
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    throw error;
  }
};

export const getUserLikedGyms = async (userId: string): Promise<Gym[]> => {
  try {
    const { data, error } = await supabase
      .from('gym_likes')
      .select(`
        gym_id,
        gyms (
          *,
          machines (*)
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(item => item.gyms).filter(Boolean) as unknown as Gym[] || [];
  } catch (error) {
    console.error('좋아요한 헬스장 목록 가져오기 오류:', error);
    return [];
  }
};

export const isGymLiked = async (gymId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('gym_likes')
      .select('id')
      .eq('gym_id', gymId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('좋아요 상태 확인 오류:', error);
    return false;
  }
};

// 찜하기 관련 함수들
export const toggleGymBookmark = async (gymId: string, userId: string): Promise<boolean> => {
  try {
    // 기존 찜하기 확인
    const { data: existingBookmark, error: checkError } = await supabase
      .from('gym_bookmarks')
      .select('id')
      .eq('gym_id', gymId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingBookmark) {
      // 찜하기 취소
      const { error } = await supabase
        .from('gym_bookmarks')
        .delete()
        .eq('id', existingBookmark.id);

      if (error) throw error;
      return false; // 찜하기 취소됨
    } else {
      // 찜하기 추가
      const { error } = await supabase
        .from('gym_bookmarks')
        .insert([{ gym_id: gymId, user_id: userId }]);

      if (error) throw error;
      return true; // 찜하기 추가됨
    }
  } catch (error) {
    console.error('찜하기 토글 오류:', error);
    throw error;
  }
};

export const getUserBookmarkedGyms = async (userId: string): Promise<Gym[]> => {
  try {
    const { data, error } = await supabase
      .from('gym_bookmarks')
      .select(`
        gym_id,
        gyms (
          *,
          machines (*)
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(item => item.gyms).filter(Boolean) as unknown as Gym[] || [];
  } catch (error) {
    console.error('찜한 헬스장 목록 가져오기 오류:', error);
    return [];
  }
};

export const isGymBookmarked = async (gymId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('gym_bookmarks')
      .select('id')
      .eq('gym_id', gymId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('찜하기 상태 확인 오류:', error);
    return false;
  }
};

// 사용자 관련 함수들
export const createUser = async (userData: Partial<User>): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    return null;
  }
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);
    return null;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    return null;
  }
};

// 카카오맵 API에서 검색한 헬스장을 Supabase에 저장 (목업)
export const saveKakaoGymToSupabase = async (kakaoPlace: any): Promise<Gym | null> => {
  console.log('목업: 카카오 헬스장 저장', kakaoPlace.place_name);
  return null;
};

// 지역별 헬스장 검색 (목업)
export const searchGymsByLocation = async (location: string, limit: number = 20): Promise<Gym[]> => {
  console.log('목업: 지역별 헬스장 검색', location);
  return [];
};

// 헬스장 상세 정보 업데이트 (목업)
export const updateGymDetails = async (
  gymId: string, 
  details: {
    daily_price?: number;
    regular_holiday?: string;
    power_rack_count?: number;
    smith_rack_count?: number;
    dumbbell_min_weight?: number;
    dumbbell_max_weight?: number;
    machine_brands?: string[];
  }
): Promise<Gym | null> => {
  console.log('목업: 헬스장 상세 정보 업데이트', gymId, details);
  return null;
};

// 머신 정보 추가 (목업)
export const addMachine = async (
  gymId: string,
  machine: {
    brand: string;
    model?: string;
    count: number;
    condition?: string;
  }
): Promise<Machine | null> => {
  console.log('목업: 머신 추가', gymId, machine);
  return null;
};

// 머신 정보 삭제 (목업)
export const deleteMachine = async (machineId: string): Promise<boolean> => {
  console.log('목업: 머신 삭제', machineId);
  return true;
};

// 고급 검색 필터 타입
export interface GymSearchFilters {
  location?: string;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  machineBrands?: string[];
  hasPowerRack?: boolean;
  hasSmithRack?: boolean;
  minDumbbellWeight?: number;
  maxDumbbellWeight?: number;
  minRating?: number;
  sortBy?: 'rating' | 'price' | 'distance' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

// 인기 머신 브랜드 목록 가져오기 (목업)
export const getPopularMachineBrands = async (limit: number = 20): Promise<{ brand: string; count: number }[]> => {
  console.log('목업: 인기 머신 브랜드 목록', limit);
  return [
    { brand: 'Technogym', count: 15 },
    { brand: 'Life Fitness', count: 12 },
    { brand: 'Precor', count: 10 },
    { brand: 'Matrix', count: 8 },
    { brand: 'Cybex', count: 6 }
  ];
};

// 지역별 헬스장 통계 (목업)
export const getGymStatsByLocation = async (): Promise<{ city: string; district: string; count: number }[]> => {
  console.log('목업: 지역별 헬스장 통계');
  return [
    { city: '서울시', district: '강남구', count: 25 },
    { city: '서울시', district: '서초구', count: 18 },
    { city: '서울시', district: '마포구', count: 15 },
    { city: '서울시', district: '성동구', count: 12 }
  ];
};