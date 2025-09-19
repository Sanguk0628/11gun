'use client';

import { useState, useEffect } from 'react';
import { toggleGymLike, toggleGymBookmark, isGymLiked, isGymBookmarked, Gym } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/supabase';

interface GymActionsProps {
  gym: Gym;
  onUpdate: (updatedGym: Gym) => void;
  showDetailsButton?: boolean;
  onShowDetails?: () => void;
}

export default function GymActions({ 
  gym, 
  onUpdate, 
  showDetailsButton = true,
  onShowDetails 
}: GymActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 사용자 정보 로드
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  // 좋아요/찜 상태 로드
  useEffect(() => {
    if (user) {
      const loadStates = async () => {
        try {
          const [liked, bookmarked] = await Promise.all([
            isGymLiked(gym.id, user.id),
            isGymBookmarked(gym.id, user.id)
          ]);
          setIsLiked(liked);
          setIsBookmarked(bookmarked);
        } catch (error) {
          console.error('상태 로드 오류:', error);
        }
      };
      loadStates();
    }
  }, [user, gym.id]);

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      const newLikedState = await toggleGymLike(gym.id, user.id);
      setIsLiked(newLikedState);
      
      // 헬스장 정보 업데이트
      onUpdate({
        ...gym,
        thumbs_up: newLikedState ? gym.thumbs_up + 1 : Math.max(0, gym.thumbs_up - 1)
      });
    } catch (error) {
      console.error('좋아요 토글 오류:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      const newBookmarkedState = await toggleGymBookmark(gym.id, user.id);
      setIsBookmarked(newBookmarkedState);
    } catch (error) {
      console.error('찜하기 토글 오류:', error);
      alert('찜하기 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-gray-400 text-sm">
          로그인 후 이용 가능
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* 좋아요 버튼 */}
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
          isLiked
            ? 'bg-red-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <i className={`ri-heart-${isLiked ? 'fill' : 'line'} text-sm`}></i>
        <span className="text-sm">{gym.thumbs_up}</span>
      </button>

      {/* 찜하기 버튼 */}
      <button
        onClick={handleBookmark}
        disabled={loading}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
          isBookmarked
            ? 'bg-yellow-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <i className={`ri-bookmark-${isBookmarked ? 'fill' : 'line'} text-sm`}></i>
        <span className="text-sm">찜</span>
      </button>

      {/* 상세 정보 버튼 */}
      {showDetailsButton && onShowDetails && (
        <button
          onClick={onShowDetails}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-information-line text-sm"></i>
          <span className="text-sm">정보</span>
        </button>
      )}
    </div>
  );
}
