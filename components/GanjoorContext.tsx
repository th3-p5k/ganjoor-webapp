'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CURATED_POEMS,
  DEFAULT_READING_LISTS,
  FALLBACK_POETS,
  GanjoorPoetSummary,
  PoemRecord,
  ReadingList,
  SavedBookmarkItem,
  TypographySettings,
  toggleItemInReadingList,
} from '@/lib/ganjoor';
import { fetchPoem, fetchPoets, fetchRandomPoem } from '@/lib/ganjoor-api';

const DEFAULT_TYPOGRAPHY: TypographySettings = {
  fontFamily: 'vazirmatn',
  fontSize: 22,
  lineSpacing: 'relaxed',
  showDiacritics: true,
  showCoupletMeaning: true,
  nightMode: false,
};

interface GanjoorContextValue {
  allPoets: GanjoorPoetSummary[];
  poemsPool: PoemRecord[];
  activePoem: PoemRecord;
  dataSource: 'live-ganjoor-api' | 'archival-cache';
  isLoadingPoem: boolean;
  settings: TypographySettings;
  readingLists: ReadingList[];
  activeListId: string;
  toastBanner: string | null;
  totalSavedItems: number;
  updateSettings: (partial: Partial<TypographySettings>) => void;
  resetSettings: () => void;
  setActiveListId: (id: string) => void;
  toggleBookmark: (item: SavedBookmarkItem) => void;
  createReadingList: (name: string, subtitle: string, description: string) => void;
  removeBookmarkItem: (listId: string, itemId: string) => void;
  updateBookmarkNote: (listId: string, itemId: string, note: string) => void;
  loadPoemByUrl: (fullUrl: string, fallbackId?: number, navigateToRead?: boolean) => Promise<void>;
  drawRandomPoem: (poetId?: number, navigateToRead?: boolean) => Promise<void>;
  addPoemsToPool: (poems: PoemRecord[]) => void;
  showToast: (msg: string) => void;
}

const GanjoorContext = createContext<GanjoorContextValue | null>(null);

export function GanjoorProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allPoets, setAllPoets] = useState<GanjoorPoetSummary[]>(FALLBACK_POETS);
  const [poemsPool, setPoemsPool] = useState<PoemRecord[]>(CURATED_POEMS);
  const [activePoem, setActivePoem] = useState<PoemRecord>(CURATED_POEMS[0]);
  const [dataSource, setDataSource] = useState<'live-ganjoor-api' | 'archival-cache'>(
    'live-ganjoor-api'
  );
  const [isLoadingPoem, setIsLoadingPoem] = useState(false);

  const [settings, setSettings] = useState<TypographySettings>(DEFAULT_TYPOGRAPHY);
  const [readingLists, setReadingLists] = useState<ReadingList[]>(DEFAULT_READING_LISTS);
  const [activeListId, setActiveListId] = useState<string>(DEFAULT_READING_LISTS[0].id);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 3200);
  }, []);

  // Load all 243 poets from Ganjoor API on mount
  useEffect(() => {
    let mounted = true;
    fetchPoets()
      .then((res) => {
        if (mounted && Array.isArray(res?.poets) && res.poets.length > 0) {
          setAllPoets(res.poets);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Hydrate settings & reading lists from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('ganjoor_divan_settings_fa_v2');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
      const savedLists = localStorage.getItem('ganjoor_divan_lists_fa_v2');
      if (savedLists) {
        const parsedLists = JSON.parse(savedLists);
        if (Array.isArray(parsedLists) && parsedLists.length > 0) {
          setReadingLists(parsedLists);
          setActiveListId(parsedLists[0].id);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Sync Night Mode with <html class="dark">
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (settings.nightMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    try {
      localStorage.setItem('ganjoor_divan_settings_fa_v2', JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  }, [settings]);

  // Persist reading lists
  useEffect(() => {
    try {
      localStorage.setItem('ganjoor_divan_lists_fa_v2', JSON.stringify(readingLists));
    } catch {
      // Ignore storage errors
    }
  }, [readingLists]);

  const updateSettings = useCallback((partial: Partial<TypographySettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_TYPOGRAPHY);
    showToast('تنظیمات قلم و راحتی مطالعه به حالت پیش‌فرض بازگردانده شد.');
  }, [showToast]);

  const addPoemsToPool = useCallback((newPoems: PoemRecord[]) => {
    setPoemsPool((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const fresh = newPoems.filter((r) => !existingIds.has(r.id));
      return [...fresh, ...prev];
    });
  }, []);

  const loadPoemByUrl = useCallback(
    async (fullUrl: string, fallbackId?: number, navigateToRead = false) => {
      setIsLoadingPoem(true);
      try {
        const data = await fetchPoem({ fullUrl, id: fallbackId });
        if (data?.poem) {
          setActivePoem(data.poem);
          setDataSource(data.source || 'live-ganjoor-api');
          addPoemsToPool([data.poem]);
          if (navigateToRead) {
            router.push(`/read?url=${encodeURIComponent(data.poem.fullUrl)}`);
          }
        }
      } catch {
        const local =
          CURATED_POEMS.find((p) => p.fullUrl === fullUrl) ||
          CURATED_POEMS.find((p) => p.id === fallbackId);
        if (local) {
          setActivePoem(local);
          if (navigateToRead) {
            router.push(`/read?url=${encodeURIComponent(local.fullUrl)}`);
          }
        }
      } finally {
        setIsLoadingPoem(false);
      }
    },
    [addPoemsToPool, router]
  );

  const drawRandomPoem = useCallback(
    async (poetId?: number, navigateToRead = true) => {
      setIsLoadingPoem(true);
      try {
        const data = await fetchRandomPoem(poetId);
        if (data?.poem) {
          setActivePoem(data.poem);
          setDataSource(data.source || 'live-ganjoor-api');
          addPoemsToPool([data.poem]);
          showToast(`تفأل از گنجور: «${data.poem.fullTitle}»`);
          if (navigateToRead) {
            router.push(`/read?url=${encodeURIComponent(data.poem.fullUrl)}`);
          }
        }
      } catch {
        const fallback = CURATED_POEMS[Math.floor(Math.random() * CURATED_POEMS.length)];
        setActivePoem(fallback);
        if (navigateToRead) {
          router.push(`/read?url=${encodeURIComponent(fallback.fullUrl)}`);
        }
      } finally {
        setIsLoadingPoem(false);
      }
    },
    [addPoemsToPool, router, showToast]
  );

  const toggleBookmark = useCallback(
    (item: SavedBookmarkItem) => {
      setReadingLists((prevLists) => {
        const result = toggleItemInReadingList(prevLists, activeListId, item);
        const listName =
          prevLists.find((l) => l.id === activeListId)?.name || 'دفتر شعر';
        showToast(
          result.action === 'added'
            ? `به دفتر «${listName}» افزوده شد.`
            : `از دفتر «${listName}» حذف شد.`
        );
        return result.lists;
      });
    },
    [activeListId, showToast]
  );

  const createReadingList = useCallback(
    (name: string, subtitle: string, description: string) => {
      const newList: ReadingList = {
        id: `list-${Date.now()}`,
        name,
        subtitle,
        description,
        items: [],
      };
      setReadingLists((prev) => [...prev, newList]);
      setActiveListId(newList.id);
      showToast(`دفتر شعر جدید «${name}» ساخته شد.`);
    },
    [showToast]
  );

  const removeBookmarkItem = useCallback((listId: string, itemId: string) => {
    setReadingLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((i) => i.id !== itemId) }
          : list
      )
    );
  }, []);

  const updateBookmarkNote = useCallback(
    (listId: string, itemId: string, note: string) => {
      setReadingLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === itemId ? { ...item, personalNote: note } : item
                ),
              }
            : list
        )
      );
      showToast('یادداشت شخصی شما ثبت شد.');
    },
    [showToast]
  );

  const totalSavedItems = readingLists.reduce((acc, list) => acc + list.items.length, 0);

  return (
    <GanjoorContext.Provider
      value={{
        allPoets,
        poemsPool,
        activePoem,
        dataSource,
        isLoadingPoem,
        settings,
        readingLists,
        activeListId,
        toastBanner,
        totalSavedItems,
        updateSettings,
        resetSettings,
        setActiveListId,
        toggleBookmark,
        createReadingList,
        removeBookmarkItem,
        updateBookmarkNote,
        loadPoemByUrl,
        drawRandomPoem,
        addPoemsToPool,
        showToast,
      }}
    >
      {children}
    </GanjoorContext.Provider>
  );
}

export function useGanjoor() {
  const ctx = useContext(GanjoorContext);
  if (!ctx) {
    throw new Error('useGanjoor must be used inside GanjoorProvider');
  }
  return ctx;
}
