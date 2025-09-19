'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showShare?: boolean;
  showLogin?: boolean;
}

export default function Header({
  title = '원정단',
  showSearch = true,
  showShare = true,
  showLogin = true
}: HeaderProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const router = useRouter();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setShowLogoutMenu(!showLogoutMenu);
    } else {
      router.push('/auth');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogoutMenu(false);
    console.log('로그아웃 완료');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-1/2 transform -translate-x-1/2 max-w-lg z-50 bg-black border-b border-gray-800 w-full">
      <div className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-end gap-1.5">
          <div className="flex items-center gap-1">
            <span
              onClick={handleLogoClick}
              className="text-lg md:text-2xl cursor-pointer hover:opacity-80 transition-opacity"
            >
              💪
            </span>
            <h1 className="text-white text-lg md:text-2xl font-black font-pacifico">
              {title}
            </h1>
          </div>
          <span className="text-gray-400 text-xs md:text-sm pb-0.5">
            - 원정헬스 다모여
          </span>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3 relative">
          {showSearch && (
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-white hover:text-gray-300 transition-colors cursor-pointer"
            >
              <i className="ri-search-line text-lg"></i>
            </button>
          )}

          {showShare && (
            <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-white hover:text-gray-300 transition-colors cursor-pointer">
              <i className="ri-share-line text-lg"></i>
            </button>
          )}

          {showLogin && (
            <div className="relative">
              <button
                onClick={handleAuthClick}
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-white hover:text-gray-300 transition-colors cursor-pointer"
              >
                <i className={`${isLoggedIn ? 'ri-user-fill' : 'ri-lock-unlock-line'} text-lg`}></i>
              </button>

              {isLoggedIn && showLogoutMenu && (
                <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg min-w-[120px] z-10">
                  <button
                    onClick={() => router.push('/mypage')}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 rounded-t-lg cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-user-line mr-2"></i>
                    마이페이지
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 rounded-b-lg cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-logout-box-line mr-2"></i>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showSearchInput && (
        <div className="px-3 md:px-4 pb-2">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="헬스장을 검색해보세요"
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-3 py-1.5 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <i className="ri-search-line absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
        </div>
      )}
    </header>
  );
}