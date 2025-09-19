'use client';

import { useState, useEffect } from 'react';
import { GymSearchFilters, getPopularMachineBrands } from '@/lib/supabase';
import { getLocationOptions } from '@/lib/locationParser';

interface AdvancedFiltersProps {
  filters: GymSearchFilters;
  onFiltersChange: (filters: GymSearchFilters) => void;
  onClose: () => void;
}

export default function AdvancedFilters({ filters, onFiltersChange, onClose }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<GymSearchFilters>(filters);
  const [popularBrands, setPopularBrands] = useState<{ brand: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);

  // 인기 브랜드 로드
  useEffect(() => {
    const loadPopularBrands = async () => {
      setLoading(true);
      try {
        const brands = await getPopularMachineBrands(10);
        setPopularBrands(brands);
      } catch (error) {
        console.error('인기 브랜드 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPopularBrands();
  }, []);

  const handleFilterChange = (key: keyof GymSearchFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMachineBrandToggle = (brand: string) => {
    const currentBrands = localFilters.machineBrands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    handleFilterChange('machineBrands', newBrands);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: GymSearchFilters = {
      sortBy: 'rating',
      sortOrder: 'desc',
      limit: 50
    };
    setLocalFilters(resetFilters);
  };

  const locationOptions = getLocationOptions();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-xl font-bold">고급 필터</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* 필터 내용 */}
        <div className="p-6 space-y-6">
          {/* 지역 필터 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">지역</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">시/도</label>
                <select
                  value={localFilters.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">전체</option>
                  {locationOptions.filter(opt => opt.type === 'city').map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">구/군</label>
                <select
                  value={localFilters.district || ''}
                  onChange={(e) => handleFilterChange('district', e.target.value || undefined)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">전체</option>
                  {locationOptions.filter(opt => opt.type === 'district').map((option) => (
                    <option key={option.value} value={option.value.split(' ')[1]}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 가격 필터 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">일일권 가격</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">최소 가격 (원)</label>
                <input
                  type="number"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">최대 가격 (원)</label>
                <input
                  type="number"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="50000"
                />
              </div>
            </div>
          </div>

          {/* 장비 필터 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">장비</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.hasPowerRack || false}
                    onChange={(e) => handleFilterChange('hasPowerRack', e.target.checked)}
                    className="w-4 h-4 text-red-600 bg-gray-600 border-gray-500 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-300">파워랙 보유</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.hasSmithRack || false}
                    onChange={(e) => handleFilterChange('hasSmithRack', e.target.checked)}
                    className="w-4 h-4 text-red-600 bg-gray-600 border-gray-500 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-300">스미스랙 보유</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">덤벨 최소 무게 (kg)</label>
                  <input
                    type="number"
                    value={localFilters.minDumbbellWeight || ''}
                    onChange={(e) => handleFilterChange('minDumbbellWeight', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">덤벨 최대 무게 (kg)</label>
                  <input
                    type="number"
                    value={localFilters.maxDumbbellWeight || ''}
                    onChange={(e) => handleFilterChange('maxDumbbellWeight', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 머신 브랜드 필터 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">머신 브랜드</h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                <p className="text-gray-400 text-sm mt-2">로딩 중...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {popularBrands.map((brandData) => (
                  <button
                    key={brandData.brand}
                    onClick={() => handleMachineBrandToggle(brandData.brand)}
                    className={`p-2 rounded text-sm text-left transition-colors ${
                      localFilters.machineBrands?.includes(brandData.brand)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    <div className="font-medium">{brandData.brand}</div>
                    <div className="text-xs opacity-75">{brandData.count}개 헬스장</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 평점 필터 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">평점</h3>
            <div>
              <label className="block text-gray-300 text-sm mb-2">최소 평점</label>
              <select
                value={localFilters.minRating || ''}
                onChange={(e) => handleFilterChange('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">전체</option>
                <option value="4.5">4.5점 이상</option>
                <option value="4.0">4.0점 이상</option>
                <option value="3.5">3.5점 이상</option>
                <option value="3.0">3.0점 이상</option>
              </select>
            </div>
          </div>

          {/* 정렬 옵션 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">정렬</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">정렬 기준</label>
                <select
                  value={localFilters.sortBy || 'rating'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="rating">평점</option>
                  <option value="price">가격</option>
                  <option value="distance">거리</option>
                  <option value="created_at">최신순</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">정렬 순서</label>
                <select
                  value={localFilters.sortOrder || 'desc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value as any)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="desc">내림차순</option>
                  <option value="asc">오름차순</option>
                </select>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-3">
            <button
              onClick={handleResetFilters}
              className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              초기화
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
