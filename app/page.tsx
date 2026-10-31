'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import heroManuscript from '@/public/images/persian_manuscript_hero.jpg';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search,
  BookOpen,
  Sparkles,
  ArrowUpLeft,
  Users,
  FolderHeart,
  Compass,
} from 'lucide-react';
import { CURATED_POEMS, FALLBACK_POETS, toPersianDigits } from '@/lib/ganjoor';
import { useGanjoor } from '@/components/GanjoorContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const router = useRouter();
  const {
    allPoets,
    activePoem,
    settings,
    totalSavedItems,
    isLoadingPoem,
    drawRandomPoem,
    loadPoemByUrl,
  } = useGanjoor();

  const [quickQuery, setQuickQuery] = useState('');
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.gsap-reveal-section').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              once: true,
            },
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quickQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/search');
    }
  };

  const featuredPoets = FALLBACK_POETS.slice(0, 8);

  return (
    <div ref={pageRef}>
      {/* Hero Section */}
      <section className="border-b border-stone-200 dark:border-stone-800/80">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Right Column: Editorial Lead & Quick Search */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  گنجینه هزارساله شعر و ادب پارسی · متصل به وب‌سرویس رسمی گنجور (api.ganjoor.net)
                </p>
                <h1
                  style={{ textWrap: 'balance' }}
                  className="font-editorial text-4xl sm:text-5xl lg:text-[3.35rem] font-bold leading-[1.2] text-stone-900 dark:text-[#F2EDE4] mt-3"
                >
                  خوانشگاه دیوان شاعران پارسی‌گوی با خوشنویسی و تایپوگرافی اصیل
                </h1>
                <p className="text-lg sm:text-xl text-[#9A3412] dark:text-amber-400 mt-4 leading-relaxed font-medium">
                  «چو بشنوی سخنِ اهلِ دل، مگو که خطاست» — دسترسی مستقیم به آثار {toPersianDigits(allPoets.length)} شاعر گنجور
                </p>
                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed mt-4 max-w-2xl">
                  در ساختار چندصفحه‌ای دیوان گنجور، شاعران و کتاب‌هایشان را در صفحه اختصاصی مرور کنید، اشعار را در محیط آرام خوانشگاه با ۵ قلم اصیل فارسی و حالت مطالعه شبانه بخوانید، و گلچین اشعار خود را در دفترهای شخصی ذخیره نمایید.
                </p>

                {/* Quick Search Form */}
                <form
                  onSubmit={handleQuickSearch}
                  className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-2xl"
                >
                  <div className="relative flex-1">
                    <Search
                      className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={quickQuery}
                      onChange={(e) => setQuickQuery(e.target.value)}
                      placeholder="جستجوی سریع واژه یا مصرع در کل گنجور (مثلاً: ارغوان، نیستان، سخن اهل دل)..."
                      aria-label="جستجوی سریع در گنجور"
                      className="w-full pr-10 pl-4 py-2.5 text-xs bg-[#F4F0E8] dark:bg-[#141822] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-medium bg-[#9A3412] text-white hover:bg-[#7C2D12] dark:bg-amber-700 dark:hover:bg-amber-600 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>جستجو در اشعار</span>
                  </button>
                </form>
              </div>

              {/* Primary Navigation Cards / CTAs */}
              <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-3">
                <Link
                  href="/poets"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-stone-900 text-[#FBF9F5] hover:bg-stone-800 dark:bg-[#EAE5DC] dark:text-stone-950 dark:hover:bg-white rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>مرور همه شاعران و کتاب‌ها ({toPersianDigits(allPoets.length)} شاعر)</span>
                </Link>

                <Link
                  href="/read"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>ورود به خوانشگاه شعر</span>
                </Link>

                <button
                  type="button"
                  onClick={() => drawRandomPoem(2, true)}
                  disabled={isLoadingPoem}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#9A3412] dark:text-amber-400" aria-hidden="true" />
                  <span>فال حافظ شیرازی</span>
                </button>

                <Link
                  href="/lists"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  <FolderHeart className="w-3.5 h-3.5 text-[#9A3412] dark:text-amber-400" aria-hidden="true" />
                  <span>دفترهای شعر من ({toPersianDigits(totalSavedItems)})</span>
                </Link>
              </div>
            </div>

            {/* Left Column: Illuminated Manuscript Archival Plate */}
            <div className="lg:col-span-5 flex flex-col">
              <figure className="relative flex-1 min-h-[300px] lg:min-h-[380px] rounded-lg overflow-hidden border border-stone-300/80 dark:border-stone-800 bg-stone-900">
                <Image
                  src={heroManuscript}
                  alt="نسخه خطی تذهیب‌شده دیوان اشعار فارسی روی رحل سنگی"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <figcaption className="absolute bottom-0 inset-x-0 p-5 text-xs text-stone-200 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-bold text-white">
                      نسخه خطی مذهب دیوان با جدول‌بندی سنتی مصرع‌ها
                    </p>
                    <p className="text-stone-300 mt-1">
                      صفحه‌آرایی دو ستونی ابیات همراه با شرح، وزن عروضی و دکلمه صوتی در صفحه خوانشگاه
                    </p>
                  </div>
                  <span className="text-amber-300 text-xs shrink-0">میراث مکتوب</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* Operational Utility Ribbon */}
        <div className="bg-[#F3EFE6] dark:bg-[#131722] border-t border-stone-200 dark:border-stone-800/80 px-6 lg:px-12 py-3">
          <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex flex-wrap items-center gap-2">
              <span>پایگاه داده: api.ganjoor.net</span>
              <span aria-hidden="true">·</span>
              <span>{toPersianDigits(allPoets.length)} شاعر پارسی‌گوی</span>
              <span aria-hidden="true">·</span>
              <span>۵ قلم خوشنویسی و نسخ فارسی</span>
              <span aria-hidden="true">·</span>
              <span>آخرین شعر بازشده: {activePoem.fullTitle}</span>
            </div>
            <div>
              تنظیمات فعلی مطالعه: قلم {toPersianDigits(settings.fontSize)} پیکسل ·{' '}
              {settings.nightMode ? 'حالت مطالعه شبانه' : 'کاغذ کاهی روز'}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Featured Classical Poets Directory Preview */}
      <section
        aria-labelledby="featured-poets-heading"
        className="gsap-reveal-section py-14 lg:py-18 px-6 lg:px-12 max-w-[1360px] mx-auto"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              ۰۱ / ستون‌های ادب پارسی · دسترسی مستقیم به دیوان و کتاب‌های هر شاعر
            </p>
            <h2
              id="featured-poets-heading"
              className="font-editorial text-3xl lg:text-4xl font-bold text-stone-900 dark:text-[#EAE5DC] mt-1"
            >
              شاعران برجسته گنجور
            </h2>
          </div>

          <Link
            href="/poets"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A3412] dark:text-amber-400 hover:underline whitespace-nowrap shrink-0"
          >
            <span>مشاهده فهرست کامل همه {toPersianDigits(allPoets.length)} شاعر</span>
            <ArrowUpLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredPoets.map((poet) => (
            <article
              key={poet.id}
              className="p-5 rounded-lg bg-[#F4F0E8] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 flex flex-col justify-between hover:border-[#9A3412] dark:hover:border-amber-500/70 transition-colors"
            >
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#EAE5DC]">
                    {poet.nickname || poet.name}
                  </h3>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {poet.birthPlace}
                  </span>
                </div>
                <p className="text-xs text-[#9A3412] dark:text-amber-400 mt-1">
                  سدهٔ {toPersianDigits(Math.ceil(poet.birthYearInLHijri / 100))} هجری
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mt-3 line-clamp-3">
                  {poet.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-2 text-xs">
                <Link
                  href={`/poets?url=${encodeURIComponent(poet.fullUrl)}`}
                  className="inline-flex items-center gap-1 font-bold text-stone-900 dark:text-[#EAE5DC] hover:text-[#9A3412] dark:hover:text-amber-400"
                >
                  <span>مشاهده کتاب‌ها و اشعار</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>

                <button
                  type="button"
                  onClick={() => drawRandomPoem(poet.id, true)}
                  className="text-stone-500 hover:text-[#9A3412] dark:hover:text-amber-400 cursor-pointer"
                >
                  شعر تصادفی
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 3: Curated Masterpieces to Open in the Reading Sanctuary */}
      <section
        aria-labelledby="masterpieces-heading"
        className="gsap-reveal-section border-t border-stone-200 dark:border-stone-800 py-14 lg:py-18 px-6 lg:px-12 bg-[#F4F0E8]/60 dark:bg-[#10141D]"
      >
        <div className="max-w-[1360px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                ۰۲ / شاهکارهای جاودان ادب فارسی · آماده خوانش با شرح ابیات و وزن عروضی
              </p>
              <h2
                id="masterpieces-heading"
                className="font-editorial text-3xl lg:text-4xl font-bold text-stone-900 dark:text-[#EAE5DC] mt-1"
              >
                اشعار برگزیده برای شروع مطالعه
              </h2>
            </div>

            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A3412] dark:text-amber-400 hover:underline whitespace-nowrap shrink-0"
            >
              <span>جستجوی پیشرفته و فیلتر موضوعی اشعار</span>
              <ArrowUpLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURATED_POEMS.map((poem) => {
              const openingCouplet = poem.couplets[0];
              return (
                <article
                  key={poem.id}
                  className="flex flex-col justify-between p-6 rounded-lg bg-[#FBF9F5] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 hover:border-[#9A3412] dark:hover:border-amber-500/70 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
                      <span>
                        {poem.poetName} · {poem.persianForm}
                      </span>
                      <span>{poem.categoryTitle}</span>
                    </div>

                    <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-[#EAE5DC] mt-2">
                      {poem.title}
                    </h3>
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
                      <span>مطالعه در خوانشگاه</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
