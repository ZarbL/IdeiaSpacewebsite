'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Não mostrar footer na página de missions
  if (pathname?.includes('/missions')) {
    return null;
  }
  
  return <Footer />;
}
