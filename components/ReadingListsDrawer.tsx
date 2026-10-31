'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, BookMarked, ArrowUpLeft, PenLine } from 'lucide-react';
import { ReadingList, SavedBookmarkItem, toPersianDigits } from '@/lib/ganjoor';

interface ReadingListsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lists: ReadingList[];
  activeListId: string;
  onSelectList: (listId: string) => void;
  onCreateList: (name: string, subtitle: string, description: string) => void;
  onRemoveItem: (listId: string, itemId: string) => void;
  onUpdateNote: (listId: string, itemId: string, note: string) => void;
  onOpenPoemByUrl: (fullUrl: string, fallbackId?: number) => void;
}

export default function ReadingListsDrawer({
  isOpen,
  onClose,
  lists,
  activeListId,
  onSelectList,
  onCreateList,
  onRemoveItem,
  onUpdateNote,
  onOpenPoemByUrl,
}: ReadingListsDrawerProps) {
  const [newListName, setNewListName] = useState('');
  const [newListSubtitle, setNewListSubtitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [formError, setFormError] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');

  if (!isOpen) return null;

  const activeList = lists.find((l) => l.id === activeListId) || lists[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newListName.trim();
    if (!trimmed) {
      setFormError('لطفاً عنوانی برای دفتر شعر جدید خود وارد کنید.');
      return;
    }
    setFormError('');
    onCreateList(
      trimmed,
      newListSubtitle.trim() || 'دفتر شعر شخصی',
      newListDesc.trim() || 'مجموعه اشعار و تک‌بیت‌های برگزیده از گنجور.'
    );
    setNewListName('');
    setNewListSubtitle('');
    setNewListDesc('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reading-lists-title"
      className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-xs transition-opacity"
    >
      <div className="relative w-full max-w-2xl bg-[#FBF9F5] dark:bg-[#11151E] text-stone-900 dark:text-[#EAE5DC] h-full overflow-y-auto shadow-2xl border-l border-stone-200 dark:border-stone-800 p-6 lg:p-8 flex flex-col justify-between">
        <div>
          {/* Drawer Header */}
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                سفینه و گلچین شخصی اشعار · ذخیره‌شده در مرورگر شما
              </p>
              <h2
                id="reading-lists-title"
                className="font-editorial text-3xl font-bold text-stone-900 dark:text-[#EAE5DC] mt-1"
              >
                دفترهای شعر و ابیات برگزیده من
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن پنجره دفترهای شعر"
              className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white rounded-md border border-stone-200 dark:border-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Reading List Selector Tabs */}
          <div className="mt-6">
            <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2.5">
              انتخاب دفتر شعر فعال:
            </label>
            <div className="flex flex-wrap gap-2">
              {lists.map((list) => {
                const isSelected = list.id === activeList?.id;
                return (
                  <button
                    key={list.id}
                    type="button"
                    onClick={() => onSelectList(list.id)}
                    aria-pressed={isSelected}
                    className={`px-3.5 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#9A3412] text-white border-[#9A3412] dark:bg-amber-700 dark:border-amber-600'
                        : 'bg-[#F3EFE6] dark:bg-[#181D2A] text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <span>{list.name}</span>
                    <span className="mx-1.5 opacity-60">·</span>
                    <span className="font-mono-tabular">{toPersianDigits(list.items.length)} اثر</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active List Metadata & Saved Items */}
          {activeList && (
            <div className="mt-6">
              <div className="flex items-baseline justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-[#EAE5DC]">
                    {activeList.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {activeList.description}
                  </p>
                </div>
                <span className="text-xs text-[#9A3412] dark:text-amber-400">
                  {activeList.subtitle}
                </span>
              </div>

              {activeList.items.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-lg mt-4 px-4">
                  <BookMarked className="w-6 h-6 mx-auto text-stone-400 mb-2" aria-hidden="true" />
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    این دفتر شعر هنوز خالی است.
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    در خوانشگاه شعر، روی دکمه «ذخیره بیت» یا «ذخیره کل شعر در دفتر» کلیک کنید تا اشعار دلخواهتان در اینجا نگهداری شوند.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-stone-200 dark:divide-stone-800/80 mt-2">
                  {activeList.items.map((item: SavedBookmarkItem) => (
                    <article key={item.id} className="py-5">
                      <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {item.poetName}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{item.poemTitle}</span>
                          {item.coupletIndex && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono-tabular">
                                بیت {toPersianDigits(item.coupletIndex)}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onOpenPoemByUrl(item.poemFullUrl, item.poemId);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#9A3412] dark:text-amber-400 hover:underline cursor-pointer"
                          >
                            <span>مشاهده کامل شعر</span>
                            <ArrowUpLeft className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(activeList.id, item.id)}
                            aria-label={`حذف ${item.poemTitle} از دفتر`}
                            className="p-1 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Persian Couplet Preview */}
                      <div className="font-persian-ui bg-[#F4F0E8] dark:bg-[#171C28] p-4 rounded-md border border-stone-200/80 dark:border-stone-800 text-base leading-loose text-stone-900 dark:text-[#EAE5DC]">
                        <p>{item.hemistich1}</p>
                        {item.hemistich2 && (
                          <p className="text-stone-700 dark:text-stone-300">{item.hemistich2}</p>
                        )}
                      </div>

                      {/* Margin Note Editor */}
                      <div className="mt-2.5 flex items-center justify-between gap-3">
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
                                onUpdateNote(activeList.id, item.id, draftNote);
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
                              <PenLine className="w-3 h-3" aria-hidden="true" />
                              <span>ویرایش یادداشت</span>
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create New Reading List Form */}
        <form
          onSubmit={handleCreateSubmit}
          className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800"
        >
          <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-3">
            ساخت دفتر شعر جدید
          </h4>
          {formError && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400 mb-2">
              {formError}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="new-list-name" className="block text-xs text-stone-500 mb-1">
                نام دفتر شعر (الزامی)
              </label>
              <input
                id="new-list-name"
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="مثلاً: غزل‌های سحرگاهی"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label htmlFor="new-list-persian" className="block text-xs text-stone-500 mb-1">
                زیرعنوان (اختیاری)
              </label>
              <input
                id="new-list-persian"
                type="text"
                value={newListSubtitle}
                onChange={(e) => setNewListSubtitle(e.target.value)}
                placeholder="اشعار امیدبخش و بهاری"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              aria-label="توضیحات دفتر شعر"
              value={newListDesc}
              onChange={(e) => setNewListDesc(e.target.value)}
              placeholder="توضیح کوتاه درباره موضوع این دفتر..."
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#0D1017] border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 dark:bg-amber-700 dark:hover:bg-amber-600 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>افزودن دفتر</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
