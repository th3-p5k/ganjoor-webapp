'use client';

import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  FolderOpen,
  ChevronLeft,
  Sparkles,
  Users,
  Star,
  ArrowUpLeft,
} from 'lucide-react';
import {
  GanjoorCategoryView,
  GanjoorPoetSummary,
  filterPoetsList,
  toPersianDigits,
} from '@/lib/ganjoor';

interface PoetCategoryBrowserProps {
  poets: GanjoorPoetSummary[];
  categoryView: GanjoorCategoryView;
  isLoadingCategory: boolean;
  onSelectCategoryUrl: (fullUrl: string) => void;
  onOpenPoemByUrl: (fullUrl: string, fallbackId?: number) => void;
  onDrawRandomByPoet: (poetId: number) => void;
}

const POEMS_PER_PAGE = 24;

export default function PoetCategoryBrowser({
  poets,
  categoryView,
  isLoadingCategory,
  onSelectCategoryUrl,
  onOpenPoemByUrl,
  onDrawRandomByPoet,
}: PoetCategoryBrowserProps) {
  const [poetSearch, setPoetSearch] = useState('');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [poemFilterQuery, setPoemFilterQuery] = useState('');
  const [poemPage, setPoemPage] = useState(1);

  const filteredPoets = filterPoetsList(poets, poetSearch, onlyPinned);

  const allCategoryPoems = categoryView.cat.poems || [];
  const filteredCategoryPoems = poemFilterQuery.trim()
    ? allCategoryPoems.filter(
        (pm) =>
          pm.title.includes(poemFilterQuery.trim()) ||
          pm.excerpt.includes(poemFilterQuery.trim())
      )
    : allCategoryPoems;

  const totalPages = Math.max(1, Math.ceil(filteredCategoryPoems.length / POEMS_PER_PAGE));
  const safePage = Math.min(poemPage, totalPages);
  const visiblePoems = filteredCategoryPoems.slice(
    (safePage - 1) * POEMS_PER_PAGE,
    safePage * POEMS_PER_PAGE
  );

  const handleCategoryChange = (url: string) => {
    setPoemFilterQuery('');
    setPoemPage(1);
    onSelectCategoryUrl(url);
  };

  return (
    <section
      id="poets-browser"
      aria-labelledby="poets-browser-heading"
      className="scroll-mt-20 border-t border-stone-200 dark:border-stone-800 py-14 lg:py-20 px-6 lg:px-12 bg-[#F4F0E8]/70 dark:bg-[#10141D]"
    >
      <div className="max-w-[1360px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              ۰۲ / مرورگر جامع شاعران، کتاب‌ها و فهرست اشعار گنجور (بدون نیاز به شناسه)
            </p>
            <h2
              id="poets-browser-heading"
              className="font-editorial text-3xl lg:text-4xl font-bold text-stone-900 dark:text-[#EAE5DC] mt-1"
            >
              کاوش در دیوان همه شاعران پارسی‌گوی ({toPersianDigits(poets.length)} شاعر)
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span>شاعر انتخاب‌شده: {categoryView.poet.nickname || categoryView.poet.name}</span>
            <span aria-hidden="true">·</span>
            <span>بخش فعلی: {categoryView.cat.title}</span>
          </div>
        </div>

        {/* Two-Column Interactive Browser: Right = Poets List (4 cols), Left = Category Tree & Poems (8 cols) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Poets Directory Panel (4 cols) */}
          <div className="lg:col-span-4 bg-[#FBF9F5] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 rounded-lg p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-bold text-stone-900 dark:text-[#EAE5DC]">
                فهرست شاعران گنجور ({toPersianDigits(filteredPoets.length)})
              </h3>

              <div
                role="group"
                aria-label="فیلتر شاعران"
                className="inline-flex items-center gap-1 p-0.5 bg-[#EAE4D8] dark:bg-[#0D1017] rounded-md"
              >
                <button
                  type="button"
                  onClick={() => setOnlyPinned(false)}
                  aria-pressed={!onlyPinned}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    !onlyPinned
                      ? 'bg-[#FBF9F5] dark:bg-[#1E2433] text-stone-900 dark:text-[#EAE5DC] shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Users className="w-3 h-3" aria-hidden="true" />
                  <span>همه ({toPersianDigits(poets.length)})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOnlyPinned(true)}
                  aria-pressed={onlyPinned}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    onlyPinned
                      ? 'bg-[#FBF9F5] dark:bg-[#1E2433] text-stone-900 dark:text-[#EAE5DC] shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Star className="w-3 h-3" aria-hidden="true" />
                  <span>برگزیدگان</span>
                </button>
              </div>
            </div>

            {/* Search Poet Input */}
            <div className="relative mb-3">
              <Search
                className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={poetSearch}
                onChange={(e) => setPoetSearch(e.target.value)}
                placeholder="جستجوی نام شاعر یا زادگاه (مثلاً: حافظ، نظامی، شیراز)..."
                aria-label="جستجوی نام شاعر"
                className="w-full pr-9 pl-3 py-2 text-xs bg-[#F4F0E8] dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100"
              />
            </div>

            {/* Scrollable Poets Roster */}
            <div
              role="list"
              aria-label="فهرست شاعران"
              className="max-h-[540px] overflow-y-auto divide-y divide-stone-200/70 dark:divide-stone-800/70 pr-1"
            >
              {filteredPoets.map((poet) => {
                const isSelected = poet.fullUrl === categoryView.poet.fullUrl;
                return (
                  <button
                    key={poet.id}
                    type="button"
                    onClick={() => handleCategoryChange(poet.fullUrl)}
                    className={`w-full text-right py-3 px-3 flex items-center justify-between gap-2 rounded transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#9A3412]/10 dark:bg-amber-500/15 text-[#9A3412] dark:text-amber-300 font-bold'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-800/50 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <div>
                      <div className="text-sm">{poet.nickname || poet.name}</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {poet.birthPlace ? `زادگاه: ${poet.birthPlace}` : 'شاعر پارسی‌گوی'}
                        {poet.birthYearInLHijri > 0 &&
                          ` · سدهٔ ${toPersianDigits(Math.ceil(poet.birthYearInLHijri / 100))} هجری`}
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 opacity-50 shrink-0" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Poet Books, Subcategories & Poems Explorer (8 cols) */}
          <div
            className={`lg:col-span-8 bg-[#FBF9F5] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 rounded-lg p-6 lg:p-8 transition-opacity ${
              isLoadingCategory ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {/* Breadcrumb Path Bar */}
            <nav
              aria-label="مسیر بخش‌های شاعر"
              className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 pb-4 border-b border-stone-200 dark:border-stone-800"
            >
              <span>مسیر در گنجور:</span>
              <button
                type="button"
                onClick={() => handleCategoryChange(categoryView.poet.fullUrl)}
                className="font-medium text-stone-800 dark:text-stone-200 hover:text-[#9A3412] dark:hover:text-amber-400 hover:underline cursor-pointer"
              >
                {categoryView.poet.nickname || categoryView.poet.name}
              </button>

              {categoryView.cat.ancestors
                .filter((a) => a.fullUrl !== categoryView.poet.fullUrl)
                .map((anc) => (
                  <React.Fragment key={anc.fullUrl}>
                    <ChevronLeft className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(anc.fullUrl)}
                      className="font-medium text-stone-800 dark:text-stone-200 hover:text-[#9A3412] dark:hover:text-amber-400 hover:underline cursor-pointer"
                    >
                      {anc.title}
                    </button>
                  </React.Fragment>
                ))}

              {categoryView.cat.fullUrl !== categoryView.poet.fullUrl && (
                <>
                  <ChevronLeft className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
                  <span className="font-bold text-[#9A3412] dark:text-amber-400">
                    {categoryView.cat.title}
                  </span>
                </>
              )}
            </nav>

            {/* Selected Poet Header & Biography */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/80 dark:border-stone-800">
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#EAE5DC]">
                  {categoryView.cat.fullUrl === categoryView.poet.fullUrl ||
                  categoryView.cat.title === categoryView.poet.name
                    ? `دیوان و آثار ${categoryView.poet.nickname || categoryView.poet.name}`
                    : `${categoryView.poet.nickname || categoryView.poet.name} — ${categoryView.cat.title}`}
                </h3>
                {categoryView.poet.description && (
                  <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-300 mt-2 max-w-3xl line-clamp-3">
                    {categoryView.poet.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onDrawRandomByPoet(categoryView.poet.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#9A3412] text-white hover:bg-[#7C2D12] dark:bg-amber-700 dark:hover:bg-amber-600 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>شعر تصادفی از {categoryView.poet.name}</span>
              </button>
            </div>

            {/* Subcategories / Books List (کتاب‌ها و بخش‌ها) */}
            {categoryView.cat.children && categoryView.cat.children.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-bold text-stone-600 dark:text-stone-400 mb-3 flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-[#9A3412] dark:text-amber-400" aria-hidden="true" />
                  <span>
                    کتاب‌ها و بخش‌های زیرمجموعه ({toPersianDigits(categoryView.cat.children.length)} بخش) — برای مشاهده اشعار کلیک کنید:
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categoryView.cat.children.map((child) => (
                    <button
                      key={child.id || child.fullUrl}
                      type="button"
                      onClick={() => handleCategoryChange(child.fullUrl)}
                      className="flex items-center justify-between gap-2 p-3.5 text-right rounded-md bg-[#F4F0E8] dark:bg-[#191F2E] border border-stone-200/90 dark:border-stone-700/80 hover:border-[#9A3412] dark:hover:border-amber-500 transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-stone-900 dark:text-[#EAE5DC]">
                        {child.title}
                      </span>
                      <ChevronLeft className="w-4 h-4 text-[#9A3412] dark:text-amber-400 shrink-0" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Poems List in this Category (فهرست اشعار این بخش) */}
            {allCategoryPoems.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h4 className="text-xs font-bold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#9A3412] dark:text-amber-400" aria-hidden="true" />
                    <span>
                      فهرست اشعار بخش «{categoryView.cat.title}» (
                      {toPersianDigits(filteredCategoryPoems.length)} شعر)
                    </span>
                  </h4>

                  <div className="relative w-full sm:w-72">
                    <Search
                      className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={poemFilterQuery}
                      onChange={(e) => {
                        setPoemFilterQuery(e.target.value);
                        setPoemPage(1);
                      }}
                      placeholder="جستجو در عنوان یا مطلع اشعار این بخش..."
                      aria-label="جستجو در اشعار این بخش"
                      className="w-full pr-8 pl-3 py-1.5 text-xs bg-[#F4F0E8] dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {visiblePoems.map((pm) => (
                    <button
                      key={pm.id || pm.fullUrl}
                      type="button"
                      onClick={() => onOpenPoemByUrl(pm.fullUrl, pm.id)}
                      className="text-right p-4 rounded-md bg-[#F4F0E8]/80 dark:bg-[#0D1017]/80 border border-stone-200/80 dark:border-stone-800 hover:border-[#9A3412] dark:hover:border-amber-500/70 transition-colors flex flex-col justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="text-sm font-bold text-stone-900 dark:text-[#EAE5DC]">
                          {pm.title}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#9A3412] dark:text-amber-400 shrink-0">
                          <span>خوانش شعر</span>
                          <ArrowUpLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        </span>
                      </div>
                      {pm.excerpt && (
                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-1">
                          {pm.excerpt}
                        </p>
                      )}
                    </button>
                  ))}
                </div>

                {/* Pagination Controls for Large Books (e.g. 495 Ghazals of Hafez) */}
                {totalPages > 1 && (
                  <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setPoemPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      className="px-3.5 py-1.5 font-medium rounded border border-stone-300 dark:border-stone-700 disabled:opacity-40 cursor-pointer"
                    >
                      صفحه قبلی
                    </button>
                    <span className="text-stone-600 dark:text-stone-400">
                      صفحه {toPersianDigits(safePage)} از {toPersianDigits(totalPages)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPoemPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      className="px-3.5 py-1.5 font-medium rounded border border-stone-300 dark:border-stone-700 disabled:opacity-40 cursor-pointer"
                    >
                      صفحه بعدی
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
