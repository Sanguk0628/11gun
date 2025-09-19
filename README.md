# 11gun 🏋️‍♂️

헬스장 검색 및 리뷰 앱 - 내 주변 최고의 헬스장을 찾아보세요!

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.

## 📝 현재 상태

**⚠️ API 설정 이전 단계**
- 현재는 목업 데이터를 사용하여 앱의 기본 기능을 테스트할 수 있습니다
- 카카오맵 API와 Supabase 설정은 배포 후 진행 예정입니다
- 모든 기능이 정상적으로 작동하지만 실제 데이터는 사용하지 않습니다

## 🎯 주요 기능

- 🗺️ **지도 연동**: 헬스장 검색 및 지도 표시 (목업 데이터)
- 🔍 **스마트 검색**: 지역별, 키워드별 헬스장 검색
- ⭐ **리뷰 시스템**: 헬스장 리뷰 작성 및 평점 시스템
- 👤 **사용자 인증**: 소셜 로그인 (배포 후 활성화)
- ❤️ **즐겨찾기**: 마음에 드는 헬스장 저장
- 📱 **반응형 디자인**: 모바일 친화적 UI/UX

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL) - 배포 후 설정
- **Maps**: Kakao Maps API - 배포 후 설정
- **Authentication**: Supabase Auth - 배포 후 설정
- **Icons**: Lucide React

## 📋 배포 후 설정 예정

### 카카오맵 API
1. [카카오 개발자 콘솔](https://developers.kakao.com/)에서 앱 등록
2. JavaScript 키와 REST API 키 발급
3. 환경 변수에 키 설정

### Supabase (데이터베이스)
1. [Supabase](https://supabase.com/)에서 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. 환경 변수에 URL과 키 설정

## 🚀 배포

이 앱은 Vercel에 배포할 수 있습니다:

1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정 (API 키들)
4. 배포 완료

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.