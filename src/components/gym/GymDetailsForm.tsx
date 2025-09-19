'use client';

import { useState, useEffect } from 'react';
import { updateGymDetails, addMachine, deleteMachine, Gym, Machine } from '@/lib/supabase';

interface GymDetailsFormProps {
  gym: Gym;
  onUpdate: (updatedGym: Gym) => void;
  onClose: () => void;
}

// 머신 브랜드 옵션
const MACHINE_BRANDS = [
  'Hammer Strength (해머스트렝스)',
  'Watson (왓슨)',
  'Prime (프라임)',
  'Panatta (파나타)',
  'Atlantis (아틀란티스)',
  'Arsenal Strength (아스날)',
  'Nautilus (너틸러스)',
  'Cybex (사이벡스)',
  'Gym80 (짐80)',
  'Life Fitness (라이프 피트니스)',
  'Technogym (테크노짐)',
  'Matrix (매트릭스)',
  'Hoist (호이스트)',
  '기타'
];

// 머신 상태 옵션
const MACHINE_CONDITIONS = ['좋음', '보통', '나쁨'];

export default function GymDetailsForm({ gym, onUpdate, onClose }: GymDetailsFormProps) {
  const [formData, setFormData] = useState({
    daily_price: gym.daily_price || 0,
    regular_holiday: gym.regular_holiday || '',
    power_rack_count: gym.power_rack_count || 0,
    smith_rack_count: gym.smith_rack_count || 0,
    dumbbell_min_weight: gym.dumbbell_min_weight || 0,
    dumbbell_max_weight: gym.dumbbell_max_weight || 0,
    machine_brands: gym.machine_brands || []
  });

  const [newMachine, setNewMachine] = useState({
    brand: '',
    model: '',
    count: 1,
    condition: '좋음'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMachineBrandToggle = (brand: string) => {
    setFormData(prev => ({
      ...prev,
      machine_brands: prev.machine_brands.includes(brand)
        ? prev.machine_brands.filter(b => b !== brand)
        : [...prev.machine_brands, brand]
    }));
  };

  const handleSaveDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const updatedGym = await updateGymDetails(gym.id, formData);
      if (updatedGym) {
        onUpdate(updatedGym);
        onClose();
      } else {
        setError('헬스장 정보 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('헬스장 정보 업데이트 오류:', error);
      setError('헬스장 정보 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMachine = async () => {
    if (!newMachine.brand) {
      setError('브랜드를 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const machine = await addMachine(gym.id, newMachine);
      if (machine) {
        // 머신 추가 성공 시 폼 초기화
        setNewMachine({
          brand: '',
          model: '',
          count: 1,
          condition: '좋음'
        });
        // 헬스장 정보 새로고침
        onUpdate({ ...gym, machines: [...(gym.machines || []), machine] });
      } else {
        setError('머신 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('머신 추가 오류:', error);
      setError('머신 추가 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMachine = async (machineId: string) => {
    if (!confirm('이 머신을 삭제하시겠습니까?')) return;

    setLoading(true);
    setError(null);

    try {
      const success = await deleteMachine(machineId);
      if (success) {
        // 머신 삭제 성공 시 목록에서 제거
        onUpdate({
          ...gym,
          machines: gym.machines?.filter(m => m.id !== machineId) || []
        });
      } else {
        setError('머신 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('머신 삭제 오류:', error);
      setError('머신 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-xl font-bold">헬스장 상세 정보</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* 폼 내용 */}
        <div className="p-6 space-y-6">
          {/* 헬스장 기본 정보 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">일일권 가격 (원)</label>
                <input
                  type="number"
                  value={formData.daily_price}
                  onChange={(e) => handleInputChange('daily_price', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="15000"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">정규 휴무일</label>
                <input
                  type="text"
                  value={formData.regular_holiday}
                  onChange={(e) => handleInputChange('regular_holiday', e.target.value)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="매주 일요일"
                />
              </div>
            </div>
          </div>

          {/* 장비 정보 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">장비 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">파워랙 개수</label>
                <input
                  type="number"
                  value={formData.power_rack_count}
                  onChange={(e) => handleInputChange('power_rack_count', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">스미스랙 개수</label>
                <input
                  type="number"
                  value={formData.smith_rack_count}
                  onChange={(e) => handleInputChange('smith_rack_count', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">덤벨 최소 무게 (kg)</label>
                <input
                  type="number"
                  value={formData.dumbbell_min_weight}
                  onChange={(e) => handleInputChange('dumbbell_min_weight', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">덤벨 최대 무게 (kg)</label>
                <input
                  type="number"
                  value={formData.dumbbell_max_weight}
                  onChange={(e) => handleInputChange('dumbbell_max_weight', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* 머신 브랜드 선택 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">머신 브랜드</h3>
            <div className="grid grid-cols-2 gap-2">
              {MACHINE_BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleMachineBrandToggle(brand)}
                  className={`p-2 rounded text-sm text-left transition-colors ${
                    formData.machine_brands.includes(brand)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* 머신 추가 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">머신 추가</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">브랜드</label>
                <select
                  value={newMachine.brand}
                  onChange={(e) => setNewMachine(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">브랜드 선택</option>
                  {MACHINE_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">모델명</label>
                <input
                  type="text"
                  value={newMachine.model}
                  onChange={(e) => setNewMachine(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="모델명 (선택사항)"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">개수</label>
                <input
                  type="number"
                  value={newMachine.count}
                  onChange={(e) => setNewMachine(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">상태</label>
                <select
                  value={newMachine.condition}
                  onChange={(e) => setNewMachine(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {MACHINE_CONDITIONS.map((condition) => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleAddMachine}
              disabled={loading || !newMachine.brand}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              머신 추가
            </button>
          </div>

          {/* 기존 머신 목록 */}
          {gym.machines && gym.machines.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">등록된 머신</h3>
              <div className="space-y-2">
                {gym.machines.map((machine) => (
                  <div key={machine.id} className="flex items-center justify-between bg-gray-600 rounded-lg p-3">
                    <div>
                      <span className="text-white font-medium">{machine.brand}</span>
                      {machine.model && <span className="text-gray-300 ml-2">({machine.model})</span>}
                      <span className="text-gray-400 ml-2">{machine.count}개</span>
                      <span className="text-gray-400 ml-2">- {machine.condition}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteMachine(machine.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSaveDetails}
              disabled={loading}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
