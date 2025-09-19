'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import { Review } from '@/lib/supabase';

interface ReviewWithGym extends Review {
  gyms: {
    name: string;
    location: string;
    image: string;
  };
}

export default function MyReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewWithGym[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndReviews = async () => {
      try {
        // 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // 사용자가 작성한 리뷰 가져오기
          const { data, error } = await supabase
            .from('reviews')
            .select(`
              *,
              gyms (
                name,
                location,
                image
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching reviews:', error);
          } else {
            setReviews(data || []);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndReviews();
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Error deleting review:', error);
      } else {
        setReviews(prev => prev.filter(review => review.id !== reviewId));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-400'}>
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <Layout headerTitle="내 리뷰" showSearch={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">로딩 중...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout headerTitle="내 리뷰" showSearch={false}>
        <div className="px-4 py-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">로그인이 필요합니다</h2>
            <p className="text-gray-400 text-sm mb-6">
              내 리뷰를 보려면 로그인해주세요
            </p>
            <button 
              onClick={() => router.push('/auth')}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              로그인하기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="⭐ 내 리뷰" showSearch={false}>
      <div className="px-4 py-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">아직 작성한 리뷰가 없어요</h2>
            <p className="text-gray-400 text-sm mb-6">
              헬스장에 대한 솔직한 리뷰를 작성해보세요!
            </p>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              헬스장 둘러보기
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-white text-lg font-semibold mb-2">
                📝 총 {reviews.length}개의 리뷰를 작성했어요
              </h2>
              <p className="text-gray-400 text-sm">
                리뷰를 클릭해서 수정하거나 삭제할 수 있어요
              </p>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {review.gyms.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        📍 {review.gyms.location}
                      </p>
                      <div className="flex items-center space-x-1 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-gray-400 text-sm ml-2">
                          ({review.rating}/5)
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                  
                  {review.content && (
                    <p className="text-gray-300 text-sm mb-3">
                      {review.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>📅 {new Date(review.created_at).toLocaleDateString('ko-KR')}</span>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      수정하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
