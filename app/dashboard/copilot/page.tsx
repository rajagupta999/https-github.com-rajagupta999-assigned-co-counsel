"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CopilotRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/research');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-navy-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Redirecting to Research Desk...</p>
        <p className="text-slate-400 text-xs mt-1">Co-Pilot has been merged into the Research Desk.</p>
      </div>
    </div>
  );
}
