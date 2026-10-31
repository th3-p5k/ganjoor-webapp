'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGanjoor } from '@/components/GanjoorContext';
import ReadingSanctuary from '@/components/ReadingSanctuary';

function ReadPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlParam = searchParams.get('url');

  const {
    activePoem,
    dataSource,
    isLoadingPoem,
    settings,
    readingLists,
    activeListId,
    updateSettings,
    resetSettings,
    setActiveListId,
    toggleBookmark,
    loadPoemByUrl,
    drawRandomPoem,
  } = useGanjoor();

  useEffect(() => {
    if (urlParam && urlParam !== activePoem.fullUrl) {
      loadPoemByUrl(urlParam, undefined, false);
    }
  }, [urlParam, activePoem.fullUrl, loadPoemByUrl]);

  const handleOpenPoemByUrl = (fullUrl: string, fallbackId?: number) => {
    loadPoemByUrl(fullUrl, fallbackId, true);
  };

  const handleNavigateCategoryUrl = (fullUrl: string) => {
    router.push(`/poets?url=${encodeURIComponent(fullUrl)}`);
  };

  return (
    <ReadingSanctuary
      poem={activePoem}
      dataSource={dataSource}
      isLoadingPoem={isLoadingPoem}
      settings={settings}
      onUpdateSettings={updateSettings}
      onResetSettings={resetSettings}
      readingLists={readingLists}
      activeListId={activeListId}
      onSelectListId={setActiveListId}
      onToggleBookmark={toggleBookmark}
      onOpenPoemByUrl={handleOpenPoemByUrl}
      onNavigateCategoryUrl={handleNavigateCategoryUrl}
      onDrawRandomByPoet={(poetId) => drawRandomPoem(poetId, true)}
    />
  );
}

export default function ReadPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 px-6 text-center text-sm text-stone-500">
          در حال آماده‌سازی خوانشگاه شعر...
        </div>
      }
    >
      <ReadPageContent />
    </Suspense>
  );
}
