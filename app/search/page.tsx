'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Compass, ArrowUpLeft } from 'lucide-react';
import {
  FALLBACK_POETS,
  PoemRecord,
  PoemTheme,
  filterPoems,
  toPersianDigits,
} from '@/lib/ganjoor';
import { searchPoems } from '@/lib/ganjoor-api';
import { useGanjoor } from '@/components/GanjoorContext';

const THEME_OPTIONS: { value: PoemTheme; label: string }[] = [
  { value: 'all', label: 'همه مضامین ادبی' },
  { value: 'عرفان و اهل دل', label: 'عرفان و اهل دل' },
  { value: 'شوق وصال و دلدادگی', label: 'شوق وصال و دلدادگی' },
  { value: 'گذر عمر و دم‌غنیمت‌شماری', label: 'گذر عمر و دم‌غنیمت‌شماری' },
  { value: 'حکمت و اخلاق انسانی', label: 'حکمت و اخلاق انسانی' },
  { value: 'حماسه و خرد', label: 'حماسه و خرد' },
  { value: 'طبیعت و بهاریه', label: 'طبیعت و بهاریه' },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const { allPoets, poemsPool, activePoem, addPoemsToPool, loadPoemByUrl } = useGanjoor();

  const [selectedPoetUrl, setSelectedPoetUrl] = useState<string | 'all'>('all');
  const [selectedTheme, setSelectedTheme] = useState<PoemTheme>('all');
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [isSearchingGanjoor, setIsSearchingGanjoor] = useState(false);
  const [searchStatusMsg, setSearchStatusMsg] = useState('');

  const executeGanjoorSearch = async (termToSearch: string, poetUrlFilter: string | 'all') => {
    const term = termToSearch.trim();
    if (!term) {
      setSearchStatusMsg('نمایش اشعار برگزیده در فهرست موضوعی.');
      return;
    }

    setIsSearchingGanjoor(true);
    setSearchStatusMsg('در حال جستجوی عبارت در کل پایگاه داده گنجور (api.ganjoor.net)...');
    try {
      const matchedPoet =
        poetUrlFilter !== 'all'
          ? allPoets.find((p) => p.fullUrl === poetUrlFilter)
          : undefined;
      const data = await searchPoems(term, matchedPoet?.id);
      if (Array.isArray(data?.results) && data.results.length > 0) {
        addPoemsToPool(data.results as PoemRecord[]);
        setSearchStatusMsg(
          `${toPersianDigits(data.results.length)} سروده منطبق با «${term}» از گنجور بازیابی شد.`
        );
      } else {
        setSearchStatusMsg(`نتیجه‌ای برای «${term}» یافت نشد.`);
      }
    } catch {
      setSearchStatusMsg('جستجو در فهرست محلی انجام شد.');
    } finally {
      setIsSearchingGanjoor(false);
    }
  };

  useEffect(() => {
    if (initialQ.trim()) {
      setSearchQuery(initialQ);
      executeGanjoorSearch(initialQ, 'all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeGanjoorSearch(searchQuery, selectedPoetUrl);
  };

  const filteredPoems = filterPoems(poemsPool, {
    poetNameOrUrl: selectedPoetUrl,
    theme: selectedTheme,
    query: searchQuery,
  });

  const pinnedPoets = allPoets.filter((p) => p.pinOrder && p.pinOrder > 0).slice(0, 10);

  return (
    <section
      aria-labelledby="search-page-heading"
      className="py-12 lg:py-16 px-6 lg:px-12 max-w-[1360px] mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            کاوش موضوعی و موتور جستجوی متن در کل اشعار گنجور
          </p>
          <h1
            id="search-page-heading"
            className="font-editorial text-3xl lg:text-4xl font-bold text-stone-900 dark:text-[#EAE5DC] mt-1"
          >
            جستجوی واژه و مصرع یا فیلتر بر پایه مضامین ادبی
          </h1>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          نمایش {toPersianDigits(filteredPoems.length)} سروده از {toPersianDigits(poemsPool.length)} اثر بارگذاری‌شده
        </p>
      </div>

      {/* Interactive Filter Controls & Search Bar */}
      <div className="mt-6 space-y-4 bg-[#F4F0E8] dark:bg-[#141822] p-5 lg:p-6 rounded-lg border border-stone-200/90 dark:border-stone-800">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
        >
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="واژه، مصرع یا موضوع را وارد کنید (مثلاً: سخن اهل دل، ارغوان، نیستان، بنی‌آدم)..."
              aria-label="جستجوی شعر با واژه یا مصرع"
              className="w-full pr-10 pl-4 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingGanjoor}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-medium bg-[#9A3412] text-white hover:bg-[#7C2D12] dark:bg-amber-700 dark:hover:bg-amber-600 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isSearchingGanjoor ? 'در حال جستجو در گنجور...' : 'جستجو در کل گنجور'}</span>
          </button>
        </form>

        {/* Quick Poet Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 ml-1">
            فیلتر شاعر:
          </span>
          <button
            type="button"
            onClick={() => setSelectedPoetUrl('all')}
            aria-pressed={selectedPoetUrl === 'all'}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedPoetUrl === 'all'
                ? 'bg-stone-900 text-white border-stone-900 dark:bg-[#EAE5DC] dark:text-stone-950'
                : 'bg-[#FBF9F5] dark:bg-[#0D1017] text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-800'
            }`}
          >
            همه شاعران
          </button>
          {(pinnedPoets.length > 0 ? pinnedPoets : FALLBACK_POETS.slice(0, 6)).map((poet) => {
            const active = selectedPoetUrl === poet.fullUrl;
            return (
              <button
                key={poet.id}
                type="button"
                onClick={() => setSelectedPoetUrl(poet.fullUrl)}
                aria-pressed={active}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-stone-900 text-white border-stone-900 dark:bg-[#EAE5DC] dark:text-stone-950'
                    : 'bg-[#FBF9F5] dark:bg-[#0D1017] text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                {poet.nickname || poet.name}
              </button>
            );
          })}
        </div>

        {/* Theme Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 ml-1">
            مضمون ادبی:
          </span>
          {THEME_OPTIONS.map((t) => {
            const active = selectedTheme === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setSelectedTheme(t.value)}
                aria-pressed={active}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#9A3412] text-white border-[#9A3412] dark:bg-amber-700 dark:border-amber-600'
                    : 'bg-[#FBF9F5] dark:bg-[#0D1017] text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                {t.label}
              </button>
            );
          })}

          {(selectedPoetUrl !== 'all' ||
            selectedTheme !== 'all' ||
            searchQuery.trim() !== '') && (
            <button
              type="button"
              onClick={() => {
                setSelectedPoetUrl('all');
                setSelectedTheme('all');
                setSearchQuery('');
                setSearchStatusMsg('');
              }}
              className="px-3 py-1.5 text-xs font-medium text-[#9A3412] dark:text-amber-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>

        {searchStatusMsg && (
          <p className="text-xs text-[#9A3412] dark:text-amber-400 font-medium pt-1">
            {searchStatusMsg}
          </p>
        )}
      </div>

      {/* Results Grid */}
      {filteredPoems.length === 0 ? (
        <div className="mt-8 p-12 text-center bg-[#F4F0E8] dark:bg-[#141822] border border-stone-200 dark:border-stone-800 rounded-lg">
          <p className="text-base font-medium text-stone-800 dark:text-stone-200">
            شعری با این ترکیب فیلتر در فهرست فعلی یافت نشد.
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            روی دکمه «جستجو در کل گنجور» کلیک کنید تا عبارت شما مستقیماً در تمام دیوان‌های گنجور جستجو شود.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoems.map((poem) => {
            const isCurrent = poem.id === activePoem.id;
            const openingCouplet = poem.couplets[0];
            return (
              <article
                key={poem.id}
                className={`flex flex-col justify-between p-6 rounded-lg border transition-colors ${
                  isCurrent
                    ? 'bg-[#F4F0E8] dark:bg-[#181E2C] border-[#9A3412] dark:border-amber-500/70'
                    : 'bg-[#FBF9F5] dark:bg-[#141822] border-stone-200/90 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span>
                      {poem.poetName} · {poem.persianForm}
                    </span>
                    <span>{poem.categoryTitle}</span>
                  </div>

                  <h2 className="font-editorial text-xl font-bold text-stone-900 dark:text-[#EAE5DC] mt-2">
                    {poem.title}
                  </h2>
                  <p className="text-xs text-[#9A3412] dark:text-amber-400 mt-1">
                    {poem.fullTitle}
                  </p>

                  {openingCouplet && (
                    <div className="mt-4 pt-3 border-t border-stone-200/70 dark:border-stone-800 text-sm leading-loose text-stone-800 dark:text-stone-200">
                      <p>{openingCouplet.hemistich1}</p>
                      {openingCouplet.hemistich2 && (
                        <p className="text-stone-600 dark:text-stone-400">
                          {openingCouplet.hemistich2}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-stone-200/60 dark:border-stone-800/70 flex items-center justify-between text-xs">
                  <span className="text-stone-500 dark:text-stone-400">
                    {poem.persianTheme} · {toPersianDigits(poem.couplets.length)} بیت
                  </span>

                  <button
                    type="button"
                    onClick={() => loadPoemByUrl(poem.fullUrl, poem.id, true)}
                    className="inline-flex items-center gap-1 font-bold text-[#9A3412] dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <span>خوانش در خوانشگاه</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 px-6 text-center text-sm text-stone-500">
          در حال بارگذاری صفحه جستجو و مضامین...
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
