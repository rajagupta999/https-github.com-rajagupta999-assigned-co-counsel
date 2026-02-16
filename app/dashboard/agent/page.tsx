"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/paralegal');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Redirecting to Virtual Paralegal...</p>
      </div>
    </div>
  );
}
