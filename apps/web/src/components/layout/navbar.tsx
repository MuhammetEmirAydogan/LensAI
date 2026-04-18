"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useAuth } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { Sparkles, Video } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 glass-panel">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="rounded-lg bg-primary/20 p-2">
            <Video className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-electric-gradient">
            LensAI
          </span>
        </Link>

        {/* Navigation Links */}
        {isSignedIn && (
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                pathname === '/dashboard' ? "text-white glow-green bg-white/5 px-3 py-1.5 rounded-full" : "text-white/60"
              )}
            >
              Panel
            </Link>
            <Link 
              href="/dashboard/generate"
              className={cn(
                "text-sm font-medium transition-colors hover:text-white flex items-center gap-1",
                pathname?.includes('/generate') ? "text-white glow-purple bg-white/5 px-3 py-1.5 rounded-full" : "text-white/60"
              )}
            >
              <Sparkles className="h-4 w-4" />
              Video Üret
            </Link>
          </div>
        )}

        {/* Profile / Auth */}
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-white/70 hover:text-white">
                Giriş Yap
              </Link>
              <Link 
                href="/sign-up" 
                className="text-sm font-medium bg-primary text-black px-4 py-2 rounded-full glow-green hover:bg-primary/90 transition-all"
              >
                Hemen Başla
              </Link>
            </>
          ) : (
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: "w-9 h-9 border border-white/20"
              }
            }} />
          )}
        </div>
      </div>
    </nav>
  );
};
