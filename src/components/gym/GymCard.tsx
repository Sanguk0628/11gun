'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gym } from '@/lib/supabase';
import GymActions from './GymActions';
import GymDetailsForm from './GymDetailsForm';

interface GymCardProps {
  gym: Gym;
  onClick?: () => void;
  showActions?: boolean;
}

export default function GymCard({ gym, onClick, showActions = true }: GymCardProps) {
  const router = useRouter();
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [currentGym, setCurrentGym] = useState(gym);

  const handleGymUpdate = (updatedGym: Gym) => {
    setCurrentGym(updatedGym);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/gym/${gym.id}`);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors"
      >
        <div className="relative">
          <img
            src={currentGym.image || '/placeholder-gym.jpg'}
            alt={currentGym.name}
            className="w-full h-40 md:h-48 object-cover object-top"
          />
          {currentGym.rating > 0 && (
            <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
              <i className="ri-star-fill text-yellow-400 mr-1"></i>
              {currentGym.rating} ({currentGym.review_count})
            </div>
          )}
        </div>
        <div className="p-3 md:p-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-white font-semibold text-lg">{currentGym.name}</h3>
            {currentGym.thumbs_up > 0 && (
              <div className="flex items-center space-x-1">
                <i className="ri-thumb-up-line text-green-400 text-sm"></i>
                <span className="text-green-400 text-sm font-medium">{currentGym.thumbs_up}</span>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-2">{currentGym.location}</p>
          
          {/* 가격 정보 */}
          {currentGym.daily_price && (
            <p className="text-blue-400 text-sm mb-2">
              일일권: {currentGym.daily_price.toLocaleString()}원
            </p>
          )}

          {/* 장비 정보 */}
          <div className="flex flex-wrap gap-1 mb-2">
            {(currentGym.power_rack_count || 0) > 0 && (
              <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded">
                파워랙 {currentGym.power_rack_count}개
              </span>
            )}
            {(currentGym.smith_rack_count || 0) > 0 && (
              <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded">
                스미스랙 {currentGym.smith_rack_count}개
              </span>
            )}
            {currentGym.machine_brands && currentGym.machine_brands.length > 0 && (
              <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">
                {currentGym.machine_brands[0]}
                {currentGym.machine_brands.length > 1 && ` 외 ${currentGym.machine_brands.length - 1}개`}
              </span>
            )}
          </div>

          {/* 액션 버튼 */}
          {showActions && (
            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
              <GymActions
                gym={currentGym}
                onUpdate={handleGymUpdate}
                onShowDetails={() => setShowDetailsForm(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* 상세 정보 폼 */}
      {showDetailsForm && (
        <GymDetailsForm
          gym={currentGym}
          onUpdate={handleGymUpdate}
          onClose={() => setShowDetailsForm(false)}
        />
      )}
    </>
  );
}