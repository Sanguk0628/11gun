'use client';

import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  {
    path: '/',
    label: '어디 갈까',
    icon: 'ri-map-pin-line',
    activeIcon: 'ri-map-pin-fill'
  },
  {
    path: '/review',
    label: '어디 갔지',
    icon: 'ri-edit-line',
    activeIcon: 'ri-edit-fill'
  },
  {
    path: '/mypage',
    label: '마이페이지',
    icon: 'ri-user-line',
    activeIcon: 'ri-user-fill'
  }
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-lg z-50 bg-black border-t border-gray-800 w-full">
      <div className="flex">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex-1 flex flex-col items-center py-2 px-4 transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'text-red-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center mb-1">
                <i className={`${isActive ? item.activeIcon : item.icon} text-xl`}></i>
              </div>
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}