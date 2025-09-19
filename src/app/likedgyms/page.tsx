'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import GymCard from '@/components/gym/GymCard';
import { supabase } from '@/lib/supabase';
import { Gym } from '@/lib/supabase';

export default function LikedGymsPage() {
  const router = useRouter();
  const [likedGyms, setLikedGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndLikedGyms = async () => {
      try {
        // 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // 좋아요한 헬스장 가져오기
          const { data, error } = await supabase
            .from('gym_likes')
            .select(`
              gym_id,
              gyms (
                *,
                machines (*)
              )
            `)
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching liked gyms:', error);
          } else {
            const gyms = data?.map(item => item.gyms).filter(Boolean) as Gym[];
            setLikedGyms(gyms || []);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLikedGyms();
  }, []);

  const handleGymClick = (gymId: string) => {
    router.push(`/gym/${gymId}`);
  };

  const handleRemoveLike = async (gymId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('gym_likes')
        .delete()
        .eq('gym_id', gymId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing like:', error);
      } else {
        setLikedGyms(prev => prev.filter(gym => gym.id !== gymId));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <Layout headerTitle="좋아요한 헬스장" showSearch={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">로딩 중...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout headerTitle="좋아요한 헬스장" showSearch={false}>
        <div className="px-4 py-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">로그인이 필요합니다</h2>
            <p className="text-gray-400 text-sm mb-6">
              좋아요한 헬스장을 보려면 로그인해주세요
            </p>
            <button 
              onClick={() => router.push('/auth')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              로그인하기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="❤️ 좋아요한 헬스장" showSearch={false}>
      <div className="px-4 py-6">
        {likedGyms.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💔</span>
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">아직 좋아요한 헬스장이 없어요</h2>
            <p className="text-gray-400 text-sm mb-6">
              마음에 드는 헬스장에 하트를 눌러보세요!
            </p>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              헬스장 둘러보기
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-white text-lg font-semibold mb-2">
                💖 총 {likedGyms.length}개의 헬스장을 좋아요했어요
              </h2>
              <p className="text-gray-400 text-sm">
                하트를 다시 눌러서 좋아요를 취소할 수 있어요
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {likedGyms.map((gym) => (
                <div key={gym.id} className="relative">
                  <GymCard
                    gym={gym}
                    onClick={() => handleGymClick(gym.id)}
                  />
                  <button
                    onClick={() => handleRemoveLike(gym.id)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                  >
                    <i className="ri-heart-fill text-lg"></i>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
