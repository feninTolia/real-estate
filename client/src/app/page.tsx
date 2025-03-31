'use client';

import Link from 'next/link';

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

export default function Home() {
  // const router = useRouter();
  // useEffect(() => {
  //   router.push('/landing');
  // }, [router]);

  return (
    <div className="text-3xl bg-red-400">
      Home
      <p>
        <Link
          href="/landing"
          className="flex items-center mb-4 hover:text-primary-500"
          scroll={false}
        >
          <span>Landing</span>
        </Link>
      </p>
    </div>
  );
}
