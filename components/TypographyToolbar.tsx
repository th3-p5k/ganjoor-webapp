'use client';

import React from 'react';
import {
  Type,
  Minus,
  Plus,
  AlignJustify,
  Moon,
  Sun,
  BookOpen,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  PERSIAN_FONT_OPTIONS,
  PersianFontId,
  LineSpacingPreset,
  TypographySettings,
  toPersianDigits,
} from '@/lib/ganjoor';

interface TypographyToolbarProps {
  settings: TypographySettings;
  onUpdate: (partial: Partial<TypographySettings>) => void;
  onReset: () => void;
}

const LINE_SPACING_LABELS: { id: LineSpacingPreset; label: string }[] = [
  { id: 'compact', label: 'فشرده' },
  { id: 'relaxed', label: 'متعادل' },
  { id: 'spacious', label: 'گشاده' },
];

export default function TypographyToolbar({
  settings,
  onUpdate,
  onReset,
}: TypographyToolbarProps) {
  const currentFont =
    PERSIAN_FONT_OPTIONS.find((f) => f.id === settings.fontFamily) || PERSIAN_FONT_OPTIONS[0];

  return (
    <section
      aria-label="تنظیمات خط، اندازه و راحتی مطالعه"
      className="bg-[#F4F0E8] dark:bg-[#141822] border border-stone-200/90 dark:border-stone-800 rounded-lg p-4 lg:p-5 transition-colors"
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        {/* Persian Font Family Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 shrink-0">
            <Type className="w-3.5 h-3.5 text-[#9A3412] dark:text-amber-500" aria-hidden="true" />
            <span>قلم خوشنویسی شعر:</span>
          </div>
          <div
            role="group"
            aria-label="انتخاب قلم فارسی"
            className="flex flex-wrap items-center gap-1 p-1 bg-[#EAE4D8] dark:bg-[#0D1017] rounded-md"
          >
            {PERSIAN_FONT_OPTIONS.map((font) => {
              const active = settings.fontFamily === font.id;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onUpdate({ fontFamily: font.id as PersianFontId })}
                  aria-pressed={active}
                  style={{ fontFamily: font.cssVariable }}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#FBF9F5] dark:bg-[#1E2433] text-stone-900 dark:text-[#EAE5DC] shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {font.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Night Mode & Comfort Reset */}
        <div className="flex items-center gap-2 self-start xl:self-auto">
          <button
            type="button"
            onClick={() => onUpdate({ nightMode: !settings.nightMode })}
            aria-pressed={settings.nightMode}
            aria-label={settings.nightMode ? 'تغییر به حالت روز (کاغذ کاهی)' : 'تغییر به حالت مطالعه شبانه'}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              settings.nightMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-[#FBF9F5] border-stone-300 text-stone-800 hover:bg-stone-100'
            }`}
          >
            {settings.nightMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>حالت کاغذ روز</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#1E3A8A]" aria-hidden="true" />
                <span>حالت مطالعه شبانه</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            aria-label="بازنشانی تنظیمات مطالعه به حالت پیش‌فرض"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>بازنشانی</span>
          </button>
        </div>
      </div>

      {/* Row 2: Text Size, Line Spacing, and Scholarly Overlays */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <div className="flex flex-wrap items-center gap-6">
          {/* Font Size Controls */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400 whitespace-nowrap">
              اندازه متن شعر:
            </span>
            <div className="inline-flex items-center bg-[#EAE4D8] dark:bg-[#0D1017] rounded-md p-0.5">
              <button
                type="button"
                onClick={() => onUpdate({ fontSize: Math.max(16, settings.fontSize - 2) })}
                disabled={settings.fontSize <= 16}
                aria-label="کاهش اندازه قلم شعر"
                className="p-1.5 text-stone-700 dark:text-stone-300 hover:bg-[#FBF9F5] dark:hover:bg-[#1E2433] rounded disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <span
                data-testid="font-size-value"
                className="px-2.5 text-xs font-mono-tabular font-medium text-stone-900 dark:text-[#EAE5DC]"
              >
                {toPersianDigits(settings.fontSize)} پیکسل
              </span>
              <button
                type="button"
                onClick={() => onUpdate({ fontSize: Math.min(36, settings.fontSize + 2) })}
                disabled={settings.fontSize >= 36}
                aria-label="افزایش اندازه قلم شعر"
                className="p-1.5 text-stone-700 dark:text-stone-300 hover:bg-[#FBF9F5] dark:hover:bg-[#1E2433] rounded disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Line Spacing Presets */}
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 whitespace-nowrap">
              <AlignJustify className="w-3.5 h-3.5" aria-hidden="true" />
              <span>فاصله سطرها:</span>
            </span>
            <div
              role="group"
              aria-label="فاصله سطرها"
              className="inline-flex items-center gap-1 p-1 bg-[#EAE4D8] dark:bg-[#0D1017] rounded-md"
            >
              {LINE_SPACING_LABELS.map((preset) => {
                const active = settings.lineSpacing === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onUpdate({ lineSpacing: preset.id })}
                    aria-pressed={active}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#FBF9F5] dark:bg-[#1E2433] text-stone-900 dark:text-[#EAE5DC] shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reading Layer Toggles (Diacritics, Persian Commentary) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onUpdate({ showDiacritics: !settings.showDiacritics })}
            aria-pressed={settings.showDiacritics}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              settings.showDiacritics
                ? 'bg-[#9A3412]/10 border-[#9A3412]/30 text-[#9A3412] dark:bg-amber-500/15 dark:border-amber-500/40 dark:text-amber-300'
                : 'bg-transparent border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>نمایش اِعراب و حرکات</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ showCoupletMeaning: !settings.showCoupletMeaning })}
            aria-pressed={settings.showCoupletMeaning}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              settings.showCoupletMeaning
                ? 'bg-[#9A3412]/10 border-[#9A3412]/30 text-[#9A3412] dark:bg-amber-500/15 dark:border-amber-500/40 dark:text-amber-300'
                : 'bg-transparent border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>معنی و شرح ابیات</span>
          </button>
        </div>
      </div>

      {/* Subtle Active Font Note */}
      <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>
          قلم فعال: <strong className="text-stone-700 dark:text-stone-300">{currentFont.label}</strong> —{' '}
          {currentFont.characterNote}
        </span>
      </div>
    </section>
  );
}
