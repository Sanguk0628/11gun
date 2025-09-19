import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // 카카오 API 키 설정
    NEXT_PUBLIC_KAKAO_REST_API_KEY: '4d090f34912e80a1bb3bb0389026c843',
    NEXT_PUBLIC_KAKAO_MAP_API_KEY: '2acfd71b5fadee09474fb531f525df33',
    NEXT_PUBLIC_KAKAO_NATIVE_APP_KEY: '479238dc83c560ec128138dfdbe90b84',
    KAKAO_ADMIN_KEY: '34f167840fbbf45a9c3ccb5d9ce88e08',
  },
};

export default nextConfig;
