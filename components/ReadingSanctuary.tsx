'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Bookmark,
  Check,
  Copy,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  FolderHeart,
  FolderOpen,
} from 'lucide-react';
import {
  Couplet,
  PoemRecord,
  ReadingList,
  SavedBookmarkItem,
  TypographySettings,
  computeTypographyStyles,
  formatPersianVerseText,
  toPersianDigits,
} from '@/lib/ganjoor';
import TypographyToolbar from './TypographyToolbar';

interface ReadingSanctuaryProps {
  poem: PoemRecord;
  dataSource: 'live-ganjoor-api' | 'archival-cache';
  isLoadingPoem: boolean;
  settings: TypographySettings;
  onUpdateSettings: (partial: Partial<TypographySettings>) => void;
  onResetSettings: () => void;
  readingLists: ReadingList[];
  activeListId: string;
  onSelectListId: (id: string) => void;
  onToggleBookmark: (item: SavedBookmarkItem) => void;
  onOpenPoemByUrl: (fullUrl: string, fallbackId?: number) => void;
  onNavigateCategoryUrl: (fullUrl: string) => void;
  onDrawRandomByPoet: (poetId?: number) => void;
}

export default function ReadingSanctuary({
  poem,
  dataSource,
  isLoadingPoem,
  settings,
  onUpdateSettings,
  onResetSettings,
  readingLists,
  activeListId,
  onSelectListId,
  onToggleBookmark,
  onOpenPoemByUrl,
  onNavigateCategoryUrl,
  onDrawRandomByPoet,
}: ReadingSanctuaryProps) {
  const coupletsContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCoupletIds, setExpandedCoupletIds] = useState<Record<string, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const typoStyles = computeTypographyStyles(settings);
  const activeList = readingLists.find((l) => l.id === activeListId) || readingLists[0];

  // Animate couplets smoothly with GSAP when the poem changes
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !coupletsContainerRef.current) return;

    const items = coupletsContainerRef.current.querySelectorAll('.couplet-row');
    if (items.length === 0) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.045,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      }
    );
  }, [poem.id]);

  // Stop audio when switching poems
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
  }, [poem.id]);

  const isItemSaved = (type: 'poem' | 'couplet', coupletIndex?: number) => {
    if (!activeList) return false;
    return activeList.items.some(
      (item) =>
        item.poemId === poem.id &&
        item.type === type &&
        item.coupletIndex === coupletIndex
    );
  };

  const handleCopyCouplet = (couplet: Couplet) => {
    const text = `${couplet.hemistich1}\n${couplet.hemistich2}\n— ${poem.poetName} (${poem.fullTitle})`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(couplet.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleCoupletCommentary = (coupletId: string) => {
    setExpandedCoupletIds((prev) => ({
      ...prev,
      [coupletId]: !prev[coupletId],
    }));
  };

  const handleAudioToggle = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
    }
  };

  const firstCouplet = poem.couplets[0];
  const poemSaved = isItemSaved('poem', undefined);

  return (
    <section
      id="sanctuary"
      aria-labelledby="sanctuary-heading"
      className="scroll-mt-20 py-12 lg:py-16 px-6 lg:px-12 max-w-[1360px] mx-auto"
    >
      {/* Section Kicker & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            ۰۱ / خوانشگاه شعر و تامل ادبی · ارتباط مستقیم با پایگاه گنجور
          </p>
          <h2
            id="sanctuary-heading"
            className="font-editorial text-3xl lg:text-4xl font-bold text-stone-900 dark:text-[#EAE5DC] mt-1"
          >
            {poem.title}
          </h2>
        </div>

        {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <span>شاعر: {poem.poetName}</span>
          <span aria-hidden="true">·</span>
          <span>قالب: {poem.persianForm}</span>
          <span aria-hidden="true">·</span>
          <span>{toPersianDigits(poem.couplets.length)} بیت</span>
          <span aria-hidden="true">·</span>
          <span>
            منبع: {dataSource === 'live-ganjoor-api' ? 'وب‌سرویس زنده گنجور' : 'گنجینه برگزیده گنجور'}
          </span>
        </div>
      </div>

      {/* Typography & Comfort Toolbar */}
      <div className="mt-6">
        <TypographyToolbar
          settings={settings}
          onUpdate={onUpdateSettings}
          onReset={onResetSettings}
        />
      </div>

      {/* Asymmetric Two-Column Reading Canvas (8 cols Verse Canvas / 4 cols Archival Margin Rail) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Main Reading Column (8 cols on lg) */}
        <div className="lg:col-span-8 bg-[#F7F4EC] dark:bg-[#121620] border border-stone-200/90 dark:border-stone-800/90 rounded-lg p-6 sm:p-8 lg:p-10 transition-colors">
          {/* Illuminated Manuscript Header inside the Reading Sheet with Interactive Breadcrumbs */}
          <div className="text-center pb-8 mb-8 border-b border-stone-200 dark:border-stone-800">
            <nav
              aria-label="مسیر شعر در دیوان شاعر"
              className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-stone-500 dark:text-stone-400"
            >
              {poem.breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={`${crumb.fullUrl}-${idx}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateCategoryUrl(crumb.fullUrl);
                      const browserEl = document.getElementById('poets-browser');
                      if (browserEl) browserEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-[#9A3412] dark:hover:text-amber-400 hover:underline cursor-pointer"
                  >
                    {crumb.title}
                  </button>
                  <span aria-hidden="true">»</span>
                </React.Fragment>
              ))}
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {poem.title.split('—')[0].trim()}
              </span>
            </nav>

            <h3
              style={{ fontFamily: typoStyles.fontFamilyCss }}
              className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#EAE5DC] mt-3 leading-relaxed"
            >
              {poem.fullTitle}
            </h3>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-500 dark:text-stone-400">
              <span>شاعر: {poem.poetName}</span>
              <span aria-hidden="true">·</span>
              <span>بخش: {poem.categoryTitle}</span>
              <span aria-hidden="true">·</span>
              <span>مضمون: {poem.persianTheme}</span>
            </div>
          </div>

          {/* Couplets Canvas (Dual-Hemistich Classical Layout) */}
          <div
            ref={coupletsContainerRef}
            data-testid="poem-couplets-canvas"
            style={{
              fontFamily: typoStyles.fontFamilyCss,
              fontSize: `${typoStyles.fontSizePx}px`,
              lineHeight: typoStyles.lineHeight,
              display: 'flex',
              flexDirection: 'column',
              gap: `${typoStyles.coupletGapRem}rem`,
            }}
            className={`transition-opacity duration-200 ${isLoadingPoem ? 'opacity-50' : 'opacity-100'}`}
          >
            {poem.couplets.map((couplet) => {
              const saved = isItemSaved('couplet', couplet.index);
              const isCommentaryOpen =
                settings.showCoupletMeaning || Boolean(expandedCoupletIds[couplet.id]);
              const h1Text = formatPersianVerseText(couplet.hemistich1, settings.showDiacritics);
              const h2Text = formatPersianVerseText(couplet.hemistich2, settings.showDiacritics);

              return (
                <article
                  key={couplet.id}
                  className="couplet-row group relative rounded-md p-4 sm:p-5 bg-[#FBF9F5]/80 dark:bg-[#0D1017]/70 border border-stone-200/70 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
                >
                  {/* Top Bar of Couplet: Couplet Number & Action Affordances */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-stone-200/50 dark:border-stone-800/60 text-xs font-persian-ui">
                    <span className="text-stone-400 dark:text-stone-500">
                      بیت {toPersianDigits(couplet.index)}
                    </span>

                    <div className="flex items-center gap-2">
                      {couplet.persianMeaning && !settings.showCoupletMeaning && (
                        <button
                          type="button"
                          onClick={() => toggleCoupletCommentary(couplet.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 rounded transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" aria-hidden="true" />
                          <span>{expandedCoupletIds[couplet.id] ? 'بستن معنی' : 'معنی بیت'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopyCouplet(couplet)}
                        aria-label={`رونوشت بیت ${toPersianDigits(couplet.index)}`}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 rounded transition-colors cursor-pointer"
                      >
                        {copiedId === couplet.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            <span>کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" aria-hidden="true" />
                            <span>رونوشت</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onToggleBookmark({
                            id: `bm-${poem.id}-${couplet.index}`,
                            type: 'couplet',
                            poemId: poem.id,
                            poemFullUrl: poem.fullUrl,
                            poemTitle: poem.title,
                            poetName: poem.poetName,
                            coupletIndex: couplet.index,
                            hemistich1: couplet.hemistich1,
                            hemistich2: couplet.hemistich2,
                            personalNote: couplet.persianMeaning || '',
                            addedAt: '۱۴۰۵/۰۸/۰۹',
                          })
                        }
                        aria-pressed={saved}
                        aria-label={`${saved ? 'حذف' : 'ذخیره'} بیت ${toPersianDigits(couplet.index)} در دفتر شعر`}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                          saved
                            ? 'bg-[#9A3412] text-white dark:bg-amber-600'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/70 dark:hover:bg-stone-800'
                        }`}
                      >
                        <Bookmark className="w-3 h-3" aria-hidden="true" />
                        <span>{saved ? 'ذخیره‌شده' : 'ذخیره بیت'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Dual-Hemistich RTL Grid (مصرع اول و مصرع دوم) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 md:gap-x-5 items-baseline text-stone-900 dark:text-[#F2EDE4]">
                    <p className="text-right font-medium">{h1Text}</p>
                    {h2Text && (
                      <p className="text-right md:text-left text-stone-800 dark:text-[#E2DDD2]">
                        {h2Text}
                      </p>
                    )}
                  </div>

                  {/* Optional Persian Couplet Meaning (شرح و معنی بیت) */}
                  {isCommentaryOpen && couplet.persianMeaning && (
                    <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/70 font-persian-ui text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                      <span className="font-semibold text-[#9A3412] dark:text-amber-400 ml-1.5">
                        شرح و معنی بیت:
                      </span>
                      {couplet.persianMeaning}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Sequential Divan Footer Navigation (Next / Previous Poem by URL without ID) */}
          <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {poem.previousPoem && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenPoemByUrl(poem.previousPoem!.fullUrl, poem.previousPoem!.id)
                  }
                  disabled={isLoadingPoem}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#FBF9F5] dark:bg-[#191F2E] border border-stone-300 dark:border-stone-700 rounded-md text-stone-800 dark:text-stone-200 hover:border-stone-400 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>شعر قبلی: {poem.previousPoem.title}</span>
                </button>
              )}

              {poem.nextPoem && (
                <button
                  type="button"
                  onClick={() => onOpenPoemByUrl(poem.nextPoem!.fullUrl, poem.nextPoem!.id)}
                  disabled={isLoadingPoem}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#FBF9F5] dark:bg-[#191F2E] border border-stone-300 dark:border-stone-700 rounded-md text-stone-800 dark:text-stone-200 hover:border-stone-400 transition-colors cursor-pointer"
                >
                  <span>شعر بعدی: {poem.nextPoem.title}</span>
                  <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDrawRandomByPoet(poem.poetId)}
              disabled={isLoadingPoem}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#9A3412] dark:text-amber-400 border border-[#9A3412]/30 dark:border-amber-500/40 rounded-md hover:bg-[#9A3412]/5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>شعر تصادفی دیگر از {poem.poetName}</span>
            </button>
          </div>
        </div>

        {/* 30% Archival Margin Rail (4 cols on lg) */}
        <aside
          aria-label="شناسنامه اثر، وزن عروضی و خوانش صوتی"
          className="lg:col-span-4 space-y-6"
        >
          {/* Card 1: Save Entire Poem & Active Reading List Target */}
          <div className="bg-[#F4F0E8] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 rounded-lg p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                دفتر شعر و گلچین شخصی
              </span>
              <FolderHeart className="w-4 h-4 text-[#9A3412] dark:text-amber-400" aria-hidden="true" />
            </div>

            <label
              htmlFor="active-list-select"
              className="block text-xs text-stone-600 dark:text-stone-400 mb-1.5"
            >
              ذخیره اشعار و تک‌بیت‌ها در دفتر:
            </label>
            <select
              id="active-list-select"
              value={activeListId}
              onChange={(e) => onSelectListId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-[#FBF9F5] dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100 mb-3"
            >
              {readingLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name} ({toPersianDigits(list.items.length)} مورد)
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() =>
                onToggleBookmark({
                  id: `bm-poem-${poem.id}`,
                  type: 'poem',
                  poemId: poem.id,
                  poemFullUrl: poem.fullUrl,
                  poemTitle: poem.title,
                  poetName: poem.poetName,
                  hemistich1: firstCouplet?.hemistich1 || poem.title,
                  hemistich2: firstCouplet?.hemistich2 || '',
                  personalNote: `${poem.persianForm} کامل (${toPersianDigits(poem.couplets.length)} بیت)`,
                  addedAt: '۱۴۰۵/۰۸/۰۹',
                })
              }
              aria-pressed={poemSaved}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                poemSaved
                  ? 'bg-emerald-800 text-white dark:bg-emerald-700'
                  : 'bg-stone-900 text-white hover:bg-stone-800 dark:bg-amber-700 dark:hover:bg-amber-600'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {poemSaved
                  ? `ثبت‌شده در «${activeList?.name}»`
                  : `ذخیره کل شعر در «${activeList?.name}»`}
              </span>
            </button>
          </div>

          {/* Card 2: Museum Accession Metadata Grid */}
          <div className="bg-[#F4F0E8] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 rounded-lg p-5">
            <h3 className="text-xs font-bold text-stone-600 dark:text-stone-400 pb-3 border-b border-stone-200 dark:border-stone-800">
              شناسنامه ادبی و وزن عروضی اثر
            </h3>

            <dl className="divide-y divide-stone-200/80 dark:divide-stone-800/80 text-xs">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-stone-500 dark:text-stone-400">شاعر</dt>
                <dd className="font-bold text-stone-900 dark:text-stone-200">{poem.poetName}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-stone-500 dark:text-stone-400">کتاب / بخش</dt>
                <dd className="text-stone-800 dark:text-stone-300">{poem.categoryTitle}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-stone-500 dark:text-stone-400">قالب و تعداد ابیات</dt>
                <dd className="text-stone-800 dark:text-stone-300">
                  {poem.persianForm} · {toPersianDigits(poem.couplets.length)} بیت
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-stone-500 dark:text-stone-400 mb-1.5">وزن عروضی شعر</dt>
                <dd className="text-sm font-medium text-[#9A3412] dark:text-amber-400 bg-[#FBF9F5] dark:bg-[#0D1017] px-3 py-2 rounded border border-stone-200/80 dark:border-stone-800">
                  {poem.meter}
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-stone-500 dark:text-stone-400 mb-1">خلاصه و مفهوم کلی اثر</dt>
                <dd className="text-xs leading-relaxed text-stone-700 dark:text-stone-300 mt-1">
                  {poem.poemSummary}
                </dd>
              </div>
            </dl>

            {/* Quick Button to View All Poems in This Book */}
            <button
              type="button"
              onClick={() => {
                onNavigateCategoryUrl(poem.categoryFullUrl);
                const browserEl = document.getElementById('poets-browser');
                if (browserEl) browserEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#FBF9F5] dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded hover:border-[#9A3412] dark:hover:border-amber-500 transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#9A3412] dark:text-amber-400" aria-hidden="true" />
              <span>مشاهده فهرست کامل اشعار «{poem.categoryTitle}»</span>
            </button>
          </div>

          {/* Card 3: Ganjoor Audio Recitation */}
          <div className="bg-[#F4F0E8] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 rounded-lg p-5">
            <h3 className="text-xs font-bold text-stone-600 dark:text-stone-400 mb-2">
              خوانش صوتی اثر در گنجور
            </h3>
            {poem.recitations.length > 0 ? (
              <div className="bg-[#FBF9F5] dark:bg-[#0D1017] p-3.5 rounded-md border border-stone-200 dark:border-stone-800">
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  خوانشگر: {poem.recitations[0].audioArtist}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">{poem.recitations[0].audioTitle}</p>
                <audio
                  ref={audioRef}
                  src={poem.recitations[0].mp3Url}
                  onEnded={() => setIsPlayingAudio(false)}
                  preload="none"
                />
                <button
                  type="button"
                  onClick={handleAudioToggle}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-[#9A3412] text-white dark:bg-amber-700 rounded hover:opacity-95 transition-opacity cursor-pointer"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>توقف پخش صوتی</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>پخش دکلمه و خوانش صوتی</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                برای این سروده در حال حاضر فایل صوتی در گنجور ثبت نشده است (اکثر غزلیات حافظ و سعدی دارای خوانش صوتی هستند).
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
