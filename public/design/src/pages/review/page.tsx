
import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';

interface ReviewFormData {
  gymName: string;
  photos: File[];
  dayPassPrice: string;
  regularHolidays: string[];
  powerRackCount: string;
  smithRackCount: string;
  dumbbellMaxWeight: string;
  machineBrands: string[];
  holidayBreak: string;
  amenities: string[];
  reputation: string;
  recommendation: 'thumbs_up' | 'thumbs_down' | null;
}

export default function ReviewPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ReviewFormData>({
    gymName: '',
    photos: [],
    dayPassPrice: '',
    regularHolidays: [],
    powerRackCount: '',
    smithRackCount: '',
    dumbbellMaxWeight: '',
    machineBrands: [],
    holidayBreak: '',
    amenities: [],
    reputation: '',
    recommendation: null
  });

  // SEO 설정 (robots meta로 검색엔진 제외)
  useEffect(() => {
    document.title = '리뷰 작성 - 헬스장 찾기';
    
    // robots meta 태그 추가 (개인정보 보호를 위해 검색엔진에서 제외)
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow';
    document.head.appendChild(robotsMeta);
    
    return () => {
      document.head.removeChild(robotsMeta);
    };
  }, []);

  const machineBrands = [
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

  const amenities = [
    '무료주차', 
    '근처 저가커피', 
    '얼음(제빙기)', 
    '천국의 계단'
  ];

  const handleSubmit = () => {
    console.log('리뷰 제출:', formData);
    // 실제로는 서버에 전송
    alert('리뷰가 성공적으로 등록되었습니다!');
  };

  return (
    <Layout headerTitle="리뷰 작성" showSearch={false} showShare={false}>
      <div className="px-4 py-6">
        {/* 진행 단계 */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`h-1 w-16 mx-3 ${
                    step > num ? 'bg-red-600' : 'bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 text-xs text-gray-400 space-x-12">
            <span>헬스장 선택</span>
            <span>기본 정보</span>
            <span>상세 정보</span>
          </div>
        </div>

        {/* Step 1: 헬스장 검색 */}
        {step === 1 && (
          <div>
            <h2 className="text-white text-xl font-bold mb-6">어느 헬스장을 다녀오셨나요?</h2>
            
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="헬스장 이름을 검색해보세요"
                value={formData.gymName}
                onChange={(e) => setFormData({...formData, gymName: e.target.value})}
                className="w-full bg-gray-900 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            <div className="space-y-3 mb-8">
              {['파워존 헬스클럽', '아이언 피트니스', '스트롱 바디 센터'].map((gym) => (
                <button
                  key={gym}
                  onClick={() => setFormData({...formData, gymName: gym})}
                  className="w-full text-left p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <i className="ri-map-pin-line text-red-500 mr-3"></i>
                    <div>
                      <h3 className="text-white font-medium">{gym}</h3>
                      <p className="text-gray-400 text-sm">서울 강남구</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.gymName}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-medium disabled:bg-gray-700 disabled:text-gray-400 cursor-pointer hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              다음 단계
            </button>
          </div>
        )}

        {/* Step 2: 기본 정보 */}
        {step === 2 && (
          <div>
            <h2 className="text-white text-xl font-bold mb-6">기본 정보를 입력해주세요</h2>

            {/* 사진 업로드 */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">
                헬스장 사진 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                <i className="ri-camera-line text-4xl text-gray-500 mb-2"></i>
                <p className="text-gray-400 mb-2">사진을 선택해주세요</p>
                <input type="file" multiple accept="image/*" className="hidden" id="photos" />
                <label htmlFor="photos" className="px-4 py-2 bg-gray-800 text-white rounded cursor-pointer hover:bg-gray-700 transition-colors">
                  사진 선택
                </label>
              </div>
            </div>

            {/* 일일권 가격 */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">
                일일권 가격 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="20000"
                  value={formData.dayPassPrice}
                  onChange={(e) => setFormData({...formData, dayPassPrice: e.target.value})}
                  className="w-full bg-gray-900 text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">원</span>
              </div>
            </div>

            {/* 정규 휴무일 */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">
                정규 휴무일 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['월', '화', '수', '목', '금', '토', '일', '없음'].map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      const holidays = formData.regularHolidays.includes(day)
                        ? formData.regularHolidays.filter(d => d !== day)
                        : [...formData.regularHolidays, day];
                      setFormData({...formData, regularHolidays: holidays});
                    }}
                    className={`py-2 rounded text-sm cursor-pointer transition-colors whitespace-nowrap ${
                      formData.regularHolidays.includes(day)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-medium cursor-pointer hover:bg-gray-600 transition-colors whitespace-nowrap"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium cursor-pointer hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 상세 정보 */}
        {step === 3 && (
          <div>
            <h2 className="text-white text-xl font-bold mb-6">상세 정보를 입력해주세요</h2>

            {/* 파워랙/스미스랙 개수 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white font-medium mb-3">
                  파워랙 개수 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="6"
                  value={formData.powerRackCount}
                  onChange={(e) => setFormData({...formData, powerRackCount: e.target.value})}
                  className="w-full bg-gray-900 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-3">
                  스미스랙 개수 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="4"
                  value={formData.smithRackCount}
                  onChange={(e) => setFormData({...formData, smithRackCount: e.target.value})}
                  className="w-full bg-gray-900 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* 덤벨 MAX 무게 */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">덤벨 MAX 무게</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="50"
                  value={formData.dumbbellMaxWeight}
                  onChange={(e) => setFormData({...formData, dumbbellMaxWeight: e.target.value})}
                  className="w-full bg-gray-900 text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">kg</span>
              </div>
            </div>

            {/* 머신 오피셜 */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">머신 오피셜</label>
              <div className="grid grid-cols-2 gap-2">
                {machineBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => {
                      const brands = formData.machineBrands.includes(brand)
                        ? formData.machineBrands.filter(b => b !== brand)
                        : [...formData.machineBrands, brand];
                      setFormData({...formData, machineBrands: brands});
                    }}
                    className={`py-3 px-4 rounded text-sm text-left cursor-pointer transition-colors ${
                      formData.machineBrands.includes(brand)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* 편의시설 */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">편의시설</label>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => {
                      const selected = formData.amenities.includes(amenity)
                        ? formData.amenities.filter(a => a !== amenity)
                        : [...formData.amenities, amenity];
                      setFormData({...formData, amenities: selected});
                    }}
                    className={`py-3 px-4 rounded text-sm text-left cursor-pointer transition-colors flex items-center ${
                      formData.amenities.includes(amenity)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <i className={`${
                      formData.amenities.includes(amenity) ? 'ri-checkbox-fill' : 'ri-checkbox-blank-line'
                    } mr-2`}></i>
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* 입소문/후기 */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">입소문/후기</label>
              <textarea
                placeholder="헬스장에 대한 솔직한 후기를 남겨주세요 (최대 500자)"
                value={formData.reputation}
                onChange={(e) => setFormData({...formData, reputation: e.target.value})}
                maxLength={500}
                rows={4}
                className="w-full bg-gray-900 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <div className="text-right text-gray-400 text-sm mt-1">
                {formData.reputation.length}/500
              </div>
            </div>

            {/* 추천/비추천 */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-3">
                이 헬스장을 추천하시나요? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormData({...formData, recommendation: 'thumbs_up'})}
                  className={`flex items-center justify-center py-4 rounded-lg border-2 transition-colors cursor-pointer ${
                    formData.recommendation === 'thumbs_up'
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <i className="ri-thumb-up-line text-2xl mr-2"></i>
                  <span className="font-medium">추천해요</span>
                </button>
                <button
                  onClick={() => setFormData({...formData, recommendation: 'thumbs_down'})}
                  className={`flex items-center justify-center py-4 rounded-lg border-2 transition-colors cursor-pointer ${
                    formData.recommendation === 'thumbs_down'
                      ? 'border-red-500 bg-red-500/20 text-red-400'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <i className="ri-thumb-down-line text-2xl mr-2"></i>
                  <span className="font-medium">비추천해요</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-medium cursor-pointer hover:bg-gray-600 transition-colors whitespace-nowrap"
              >
                이전
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.recommendation}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium cursor-pointer hover:bg-red-700 transition-colors whitespace-nowrap disabled:bg-gray-700 disabled:text-gray-400"
              >
                리뷰 등록
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
