'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shuffle, Feather } from 'lucide-react';
import { toPersianDigits } from '@/lib/ganjoor';
import { useGanjoor } from '@/components/GanjoorContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { drawRandomPoem, isLoadingPoem, totalSavedItems, toastBanner } = useGanjoor();

  const navItems = [
    { href: '/', label: 'صفحه اصلی' },
    { href: '/poets', label: 'شاعران و کتاب‌ها' },
    { href: '/read', label: 'خوانشگاه شعر' },
    { href: '/search', label: 'جستجو و مضامین' },
    { href: '/lists', label: `دفترهای شعر (${toPersianDigits(totalSavedItems)})` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar (Strict 3-Zone Contract across all pages) */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 bg-[#FBF9F5]/95 dark:bg-[#0D1017]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800/80 transition-colors">
        {/* Zone 1: Single text element wordmark */}
        <Link
          href="/"
          className="font-editorial text-2xl font-bold tracking-tight text-stone-900 dark:text-[#EAE5DC] whitespace-nowrap shrink-0"
        >
          دیوان گنجور
        </Link>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav
          aria-label="ناوبری اصلی صفحات"
          className="flex items-center gap-4 sm:gap-7 text-xs sm:text-sm font-medium overflow-x-auto"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                  isActive
                    ? 'text-[#9A3412] dark:text-amber-400 font-bold underline underline-offset-8 decoration-2'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-[#EAE5DC]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => drawRandomPoem(undefined, true)}
            disabled={isLoadingPoem}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#FBF9F5] bg-[#9A3412] hover:bg-[#7C2D12] dark:bg-amber-700 dark:hover:bg-amber-600 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isLoadingPoem ? 'در حال دریافت...' : 'تفأل و شعر تصادفی'}</span>
          </button>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastBanner && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-5 z-50 px-4 py-2.5 text-xs font-medium bg-stone-900 text-[#FBF9F5] dark:bg-amber-600 dark:text-stone-950 rounded-md shadow-lg border border-stone-700"
        >
          {toastBanner}
        </div>
      )}

      {/* Main Route Content */}
      <main className="flex-1">{children}</main>

      {/* Shared Archival Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-8 px-6 lg:px-12 bg-[#F4F0E8] dark:bg-[#0B0E14] text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Feather className="w-3.5 h-3.5 text-[#9A3412] dark:text-amber-500" aria-hidden="true" />
            <span className="font-bold text-stone-800 dark:text-stone-200">
              دیوان گنجور — سامانه چندصفحه‌ای خوانش شعر و ادب فارسی
            </span>
            <span aria-hidden="true">·</span>
            <span>متصل به وب‌سرویس رسمی گنجور (api.ganjoor.net)</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:underline">
              صفحه اصلی
            </Link>
            <Link href="/poets" className="hover:underline">
              شاعران و کتاب‌ها
            </Link>
            <Link href="/read" className="hover:underline">
              خوانشگاه شعر
            </Link>
            <Link href="/search" className="hover:underline">
              جستجو و مضامین
            </Link>
            <Link href="/lists" className="hover:underline">
              دفترهای شعر من
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
