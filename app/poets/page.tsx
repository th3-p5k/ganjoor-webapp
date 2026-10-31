'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CURATED_POEMS,
  FALLBACK_POETS,
  GanjoorCategoryView,
} from '@/lib/ganjoor';
import { fetchCategory } from '@/lib/ganjoor-api';
import { useGanjoor } from '@/components/GanjoorContext';
import PoetCategoryBrowser from '@/components/PoetCategoryBrowser';

const INITIAL_CATEGORY_VIEW: GanjoorCategoryView = {
  poet: FALLBACK_POETS[0],
  cat: {
    id: 24,
    title: 'غزلیات',
    fullUrl: '/hafez/ghazal',
    description: FALLBACK_POETS[0].description || '',
    ancestors: [{ title: 'حافظ', fullUrl: '/hafez' }],
    children: [
      { id: 24, title: 'غزلیات', urlSlug: 'ghazal', fullUrl: '/hafez/ghazal' },
      { id: 25, title: 'قطعات', urlSlug: 'ghete', fullUrl: '/hafez/ghete' },
      { id: 26, title: 'رباعیات', urlSlug: 'robaee2', fullUrl: '/hafez/robaee2' },
    ],
    poems: CURATED_POEMS.filter((p) => p.poetFullUrl === '/hafez').map((p) => ({
      id: p.id,
      title: p.title.split('—')[0].trim(),
      urlSlug: p.fullUrl.split('/').pop() || 'sh1',
      fullUrl: p.fullUrl,
      excerpt: p.couplets[0]?.hemistich1 || '',
    })),
  },
};

function PoetsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlParam = searchParams.get('url') || '/hafez/ghazal';

  const { allPoets, loadPoemByUrl, drawRandomPoem } = useGanjoor();
  const [categoryView, setCategoryView] = useState<GanjoorCategoryView>(INITIAL_CATEGORY_VIEW);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoadingCategory(true);
    fetchCategory(urlParam)
      .then((data) => {
        if (mounted && data?.categoryView) {
          setCategoryView(data.categoryView);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setIsLoadingCategory(false);
      });

    return () => {
      mounted = false;
    };
  }, [urlParam]);

  const handleSelectCategoryUrl = (fullUrl: string) => {
    router.push(`/poets?url=${encodeURIComponent(fullUrl)}`);
  };

  const handleOpenPoemByUrl = (fullUrl: string, fallbackId?: number) => {
    loadPoemByUrl(fullUrl, fallbackId, true);
  };

  return (
    <PoetCategoryBrowser
      poets={allPoets}
      categoryView={categoryView}
      isLoadingCategory={isLoadingCategory}
      onSelectCategoryUrl={handleSelectCategoryUrl}
      onOpenPoemByUrl={handleOpenPoemByUrl}
      onDrawRandomByPoet={(poetId) => drawRandomPoem(poetId, true)}
    />
  );
}

export default function PoetsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 px-6 text-center text-sm text-stone-500">
          در حال بارگذاری فهرست شاعران و کتاب‌های گنجور...
        </div>
      }
    >
      <PoetsPageContent />
    </Suspense>
  );
}
