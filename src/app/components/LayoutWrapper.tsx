'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const isV2 = pathname.startsWith('/v2');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && !isV2 && (
        <div className="pb-8 lg:pb-20">
          <Navbar />
        </div>
      )}
      <main className="">{children}</main>
      {!isDashboard && !isV2 && <Footer />}
    </div>
  );
};

export default LayoutWrapper;

