'use client';

import QueryProvider from './QueryProvider';
import { Toaster } from 'sonner';
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster />
    </QueryProvider>
  );
}