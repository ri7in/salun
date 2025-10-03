'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            ✨ Salun
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/services" className="hover:text-purple-200 transition">
              Services
            </Link>

            {status === 'loading' ? (
              <div className="h-8 w-20 bg-purple-500 rounded animate-pulse" />
            ) : session ? (
              <>
                <Link
                  href={
                    session.user.role === 'admin'
                      ? '/dashboard/admin'
                      : session.user.role === 'staff'
                      ? '/dashboard/staff'
                      : '/dashboard/client'
                  }
                  className="hover:text-purple-200 transition"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{session.user.name}</span>
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
