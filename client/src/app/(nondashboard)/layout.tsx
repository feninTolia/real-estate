'use client';
import Navbar from '@/components/Navbar';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { useGetAuthUserQuery } from '@/state/api';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole.toLowerCase();
      if (
        (userRole === 'manager' && pathname.startsWith('/search')) ||
        (userRole === 'manager' && pathname === '/')
      ) {
        router.push('/managers/properties', { scroll: false });
      } else {
        setIsLoading(false);
      }
    }
  }, [authUser, pathname, router]);

  if (authLoading || isLoading) {
    // return <Loading />;
    return <p>Loading...</p>;
  }

  if (!authUser?.userRole) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <Navbar />
      <main
        className="h-full flex w-full flex-col"
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
