'use client';

import { useState, useEffect } from 'react';

interface GymCardProps {
  gym: {
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
  };
  onClick?: () => void;
}

export default function GymCard({ gym, onClick }: GymCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 찜 상태 확인
    const likedGyms = JSON.parse(localStorage.getItem('likedGyms') || '[]');
    setIsLiked(likedGyms.includes(gym.id));
  }, [gym.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    const likedGyms = JSON.parse(localStorage.getItem('likedGyms') || '[]');
    
    if (isLiked) {
      // 찜 해제
      const updatedLikedGyms = likedGyms.filter((id: string) => id !== gym.id);
      localStorage.setItem('likedGyms', JSON.stringify(updatedLikedGyms));
      setIsLiked(false);
      console.log('Unliked gym:', gym.id);
    } else {
      // 찜 추가
      const updatedLikedGyms = [...likedGyms, gym.id];
      localStorage.setItem('likedGyms', JSON.stringify(updatedLikedGyms));
      setIsLiked(true);
      console.log('Liked gym:', gym.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors"
    >
      <div className="relative">
        <img
          src={gym.image}
          alt={gym.name}
          className="w-full h-40 md:h-48 object-cover object-top"
        />
        <div className="absolute top-3 right-3">
          <button 
            onClick={handleLike}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              isLiked 
                ? 'bg-red-600 text-white' 
                : 'bg-black/50 text-white hover:bg-red-600'
            }`}
          >
            <i className={`${isLiked ? 'ri-heart-fill' : 'ri-heart-line'} text-lg`}></i>
          </button>
        </div>
      </div>
      <div className="p-3 md:p-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-semibold text-lg">{gym.name}</h3>
          {gym.thumbsUp && (
            <div className="flex items-center space-x-1">
              <i className="ri-thumb-up-line text-green-400 text-sm"></i>
              <span className="text-green-400 text-sm font-medium">{gym.thumbsUp}</span>
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-2">{gym.location}</p>
        {gym.tags && gym.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {gym.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}