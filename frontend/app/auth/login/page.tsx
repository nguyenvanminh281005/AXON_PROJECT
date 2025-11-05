'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Login Page - Redirect to Home with Modal
 * Following modern Next.js patterns
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirect to home with login modal parameter
    const returnUrl = searchParams.get('returnUrl') || '/';
    router.push(`${returnUrl}?auth=login`);
  }, [router, searchParams]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}