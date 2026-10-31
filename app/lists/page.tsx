'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  BookMarked,
  ArrowUpLeft,
  PenLine,
  BookOpen,
} from 'lucide-react';
import { SavedBookmarkItem, toPersianDigits } from '@/lib/ganjoor';
import { useGanjoor } from '@/components/GanjoorContext';

export default function ListsPage() {
  const {
    readingLists,
    activeListId,
    setActiveListId,
    createReadingList,
    removeBookmarkItem,
    updateBookmarkNote,
    loadPoemByUrl,
  } = useGanjoor();

  const [newListName, setNewListName] = useState('');
  const [newListSubtitle, setNewListSubtitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [formError, setFormError] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');

  const activeList = readingLists.find((l) => l.id === activeListId) || readingLists[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newListName.trim();
    if (!trimmed) {
      setFormError('لطفاً عنوانی برای دفتر شعر جدید خود وارد کنید.');
      return;
    }
    setFormError('');
    createReadingList(
      trimmed,
      newListSubtitle.trim() || 'دفتر شعر شخصی',
      newListDesc.trim() || 'مجموعه اشعار و تک‌بیت‌های برگزیده از گنجور.'
    );
    setNewListName('');
    setNewListSubtitle('');
    setNewListDesc('');
  };

  return (
    <section
      aria-labelledby="lists-page-heading"
      className="py-12 lg:py-16 px-6 lg:px-12 max-w-[1360px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            سفینه و گلچین شخصی اشعار · ذخیره‌شده در مرورگر شما
          </p>
          <h1
            id="lists-page-heading"
            className="font-editorial text-3xl lg:text-4xl font-bold text-stone-900 dark:text-[#EAE5DC] mt-1"
          >
            دفترهای شعر و ابیات برگزیده من
          </h1>
        </div>

        <Link
          href="/read"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-stone-900 text-white dark:bg-[#EAE5DC] dark:text-stone-950 rounded-md whitespace-nowrap shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>بازگشت به خوانشگاه شعر</span>
        </Link>
      </div>

      {/* Two-Column Layout: Left = Active List Items (8 cols), Right = List Selector & Create Form (4 cols) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Right Column: List Selector & Create New List Form (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Select Active Anthology */}
          <div className="bg-[#F4F0E8] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 rounded-lg p-5">
            <h2 className="text-sm font-bold text-stone-900 dark:text-[#EAE5DC] mb-3">
              دفترهای شعر شما ({toPersianDigits(readingLists.length)} دفتر)
            </h2>
            <div className="space-y-2">
              {readingLists.map((list) => {
                const isSelected = list.id === activeList?.id;
                return (
                  <button
                    key={list.id}
                    type="button"
                    onClick={() => setActiveListId(list.id)}
                    aria-pressed={isSelected}
                    className={`w-full text-right p-3.5 rounded-md border transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#9A3412] text-white border-[#9A3412] dark:bg-amber-700 dark:border-amber-600'
                        : 'bg-[#FBF9F5] dark:bg-[#0D1017] text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{list.name}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          isSelected
                            ? 'text-stone-100'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {list.subtitle}
                      </div>
                    </div>
                    <span className="text-xs font-mono-tabular shrink-0">
                      {toPersianDigits(list.items.length)} اثر
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create New List Form */}
          <form
            onSubmit={handleCreateSubmit}
            className="bg-[#F4F0E8] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 rounded-lg p-5"
          >
            <h3 className="text-sm font-bold text-stone-900 dark:text-[#EAE5DC] mb-3">
              ساخت دفتر شعر جدید
            </h3>
            {formError && (
              <p role="alert" className="text-xs text-red-600 dark:text-red-400 mb-3">
                {formError}
              </p>
            )}
            <div className="space-y-3">
              <div>
                <label htmlFor="new-list-name" className="block text-xs text-stone-600 dark:text-stone-400 mb-1">
                  نام دفتر شعر (الزامی)
                </label>
                <input
                  id="new-list-name"
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="مثلاً: غزل‌های سحرگاهی"
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label htmlFor="new-list-subtitle" className="block text-xs text-stone-600 dark:text-stone-400 mb-1">
                  زیرعنوان (اختیاری)
                </label>
                <input
                  id="new-list-subtitle"
                  type="text"
                  value={newListSubtitle}
                  onChange={(e) => setNewListSubtitle(e.target.value)}
                  placeholder="اشعار امیدبخش و بهاری"
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label htmlFor="new-list-desc" className="block text-xs text-stone-600 dark:text-stone-400 mb-1">
                  توضیحات کوتاه
                </label>
                <input
                  id="new-list-desc"
                  type="text"
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="توضیح کوتاه درباره موضوع این دفتر..."
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 dark:bg-amber-700 dark:hover:bg-amber-600 rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>افزودن دفتر شعر</span>
              </button>
            </div>
          </form>
        </div>

        {/* Left Column: Active List Saved Couplets & Poems (8 cols) */}
        <div className="lg:col-span-8 bg-[#FBF9F5] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 rounded-lg p-6 lg:p-8">
          {activeList && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#EAE5DC]">
                    {activeList.name}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {activeList.description}
                  </p>
                </div>
                <span className="text-xs font-medium text-[#9A3412] dark:text-amber-400">
                  {activeList.subtitle} · {toPersianDigits(activeList.items.length)} مورد ذخیره‌شده
                </span>
              </div>

              {activeList.items.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-lg mt-6 px-4">
                  <BookMarked className="w-7 h-7 mx-auto text-stone-400 mb-2.5" aria-hidden="true" />
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    این دفتر شعر هنوز خالی است.
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    در صفحه «خوانشگاه شعر»، روی دکمه «ذخیره بیت» یا «ذخیره کل شعر» کلیک کنید تا اشعار دلخواهتان در اینجا نگهداری شوند.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-stone-200 dark:divide-stone-800/80 mt-2">
                  {activeList.items.map((item: SavedBookmarkItem) => (
                    <article key={item.id} className="py-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {item.poetName}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{item.poemTitle}</span>
                          {item.coupletIndex && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>بیت {toPersianDigits(item.coupletIndex)}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => loadPoemByUrl(item.poemFullUrl, item.poemId, true)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#9A3412] dark:text-amber-400 hover:underline cursor-pointer"
                          >
                            <span>مشاهده کامل شعر در خوانشگاه</span>
                            <ArrowUpLeft className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBookmarkItem(activeList.id, item.id)}
                            aria-label={`حذف ${item.poemTitle} از دفتر`}
                            className="p-1 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Persian Couplet Box */}
                      <div className="bg-[#F4F0E8] dark:bg-[#0D1017] p-5 rounded-md border border-stone-200/80 dark:border-stone-800 text-lg leading-loose text-stone-900 dark:text-[#EAE5DC] grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p className="font-medium">{item.hemistich1}</p>
                        {item.hemistich2 && (
                          <p className="text-stone-700 dark:text-stone-300 md:text-left">
                            {item.hemistich2}
                          </p>
                        )}
                      </div>

                      {/* Margin Note Editor */}
                      <div className="mt-3 flex items-center justify-between gap-3">
                        {editingItemId === item.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={draftNote}
                              onChange={(e) => setDraftNote(e.target.value)}
                              placeholder="یادداشت یا حاشیه‌نویسی شخصی خود را بنویسید..."
                              aria-label="یادداشت شخصی"
                              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                updateBookmarkNote(activeList.id, item.id, draftNote);
                                setEditingItemId(null);
                              }}
                              className="px-3 py-1.5 text-xs font-medium bg-stone-900 text-white dark:bg-amber-600 rounded cursor-pointer"
                            >
                              ثبت یادداشت
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs text-stone-600 dark:text-stone-400">
                              <strong className="text-stone-700 dark:text-stone-300 ml-1">
                                یادداشت حاشیه:
                              </strong>
                              {item.personalNote || 'بدون یادداشت حاشیه‌ای.'}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItemId(item.id);
                                setDraftNote(item.personalNote || '');
                              }}
                              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 shrink-0 cursor-pointer"
                            >
                              <PenLine className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>ویرایش یادداشت</span>
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
