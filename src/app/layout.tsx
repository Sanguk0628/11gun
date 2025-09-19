import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "원정단 - 원정헬스 다모여",
  description: "내 주변 최고의 헬스장을 찾고 비교해보세요. 파워랙, 머신 브랜드별로 검색 가능합니다.",
  keywords: "헬스장, 헬스클럽, 파워랙, 머신, 피트니스, 운동",
  openGraph: {
    title: "원정단 - 원정헬스 다모여",
    description: "내 주변 최고의 헬스장을 찾고 비교해보세요",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Remix Icons CDN */}
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
