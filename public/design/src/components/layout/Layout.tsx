
import { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  headerTitle?: string;
  showSearch?: boolean;
  showShare?: boolean;
  showLogin?: boolean;
}

export default function Layout({ 
  children, 
  headerTitle, 
  showSearch = true, 
  showShare = true, 
  showLogin = true 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-lg mx-auto min-h-screen bg-white shadow-xl">
        <Header 
          title={headerTitle}
          showSearch={showSearch}
          showShare={showShare}
          showLogin={showLogin}
        />
        
        <main className="pt-16 pb-16 min-h-screen bg-black text-white">
          {children}
        </main>
        
        <BottomNav />
      </div>
    </div>
  );
}
