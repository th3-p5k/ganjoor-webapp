import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CURATED_POEMS,
  DEFAULT_READING_LISTS,
  FALLBACK_POETS,
  computeTypographyStyles,
  filterPoems,
  filterPoetsList,
  formatPersianVerseText,
  groupVersesIntoCouplets,
  normalizeGanjoorApiPoem,
  toPersianDigits,
  toggleItemInReadingList,
} from './ganjoor';

test('toPersianDigits converts English numbers into Persian numerals', () => {
  assert.equal(toPersianDigits(243), '۲۴۳');
  assert.equal(toPersianDigits('22px'), '۲۲px');
});

test('groupVersesIntoCouplets pairs hemistichs by coupletIndex and extracts coupletSummary', () => {
  const rawVerses = [
    {
      id: 1,
      vOrder: 1,
      coupletIndex: 0,
      versePosition: 0,
      text: 'چو بشنوی سخنِ اهلِ دل، مگو که خطاست',
      coupletSummary: 'معنی بیت اول',
    },
    {
      id: 2,
      vOrder: 2,
      coupletIndex: 0,
      versePosition: 1,
      text: 'سخن‌شناس نه‌ای، جان من! خطا این جاست',
      coupletSummary: null,
    },
  ];

  const couplets = groupVersesIntoCouplets(rawVerses, 2151);
  assert.equal(couplets.length, 1);
  assert.equal(couplets[0].index, 1);
  assert.equal(couplets[0].hemistich1, 'چو بشنوی سخنِ اهلِ دل، مگو که خطاست');
  assert.equal(couplets[0].hemistich2, 'سخن‌شناس نه‌ای، جان من! خطا این جاست');
  assert.equal(couplets[0].persianMeaning, 'معنی بیت اول');
});

test('filterPoetsList sorts pinned classic poets first and filters by name or birthPlace', () => {
  const pinnedOnly = filterPoetsList(FALLBACK_POETS, '', true);
  assert.ok(pinnedOnly.length >= 6);
  assert.equal(pinnedOnly[0].name, 'حافظ');

  const shirazPoets = filterPoetsList(FALLBACK_POETS, 'شیراز', false);
  assert.ok(shirazPoets.some((p) => p.name === 'حافظ'));
  assert.ok(shirazPoets.some((p) => p.name === 'سعدی'));
});

test('filterPoems filters accurately by poetFullUrl, Persian theme, and search query', () => {
  const hafezOnly = filterPoems(CURATED_POEMS, { poetNameOrUrl: '/hafez' });
  assert.ok(hafezOnly.length >= 2);
  assert.ok(hafezOnly.every((p) => p.poetFullUrl === '/hafez'));

  const epicOnly = filterPoems(CURATED_POEMS, { theme: 'حماسه و خرد' });
  assert.equal(epicOnly.length, 1);
  assert.equal(epicOnly[0].poetFullUrl, '/ferdowsi');

  const queryMatch = filterPoems(CURATED_POEMS, { query: 'سخن اهل دل' });
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].id, 2151);
});

test('computeTypographyStyles clamps font size and scales Nastaliq line height', () => {
  const compactVazir = computeTypographyStyles({
    fontFamily: 'vazirmatn',
    fontSize: 12,
    lineSpacing: 'compact',
    showDiacritics: true,
    showCoupletMeaning: true,
    nightMode: false,
  });
  assert.equal(compactVazir.fontSizePx, 16);

  const spaciousNastaliq = computeTypographyStyles({
    fontFamily: 'nastaliq',
    fontSize: 28,
    lineSpacing: 'spacious',
    showDiacritics: true,
    showCoupletMeaning: true,
    nightMode: true,
  });
  assert.equal(spaciousNastaliq.fontSizePx, 28);
  assert.ok(spaciousNastaliq.lineHeight > 2.5);
});

test('normalizeGanjoorApiPoem extracts breadcrumbs and next/previous fullUrl without requiring IDs', () => {
  const rawPayload = {
    id: 2130,
    title: 'غزل شمارهٔ ۱',
    fullTitle: 'حافظ » غزلیات » غزل شمارهٔ ۱',
    fullUrl: '/hafez/ghazal/sh1',
    category: {
      poet: { id: 2, name: 'حافظ', nickname: 'حافظ شیرازی', fullUrl: '/hafez' },
      cat: {
        id: 24,
        title: 'غزلیات',
        fullUrl: '/hafez/ghazal',
        ancestors: [{ title: 'حافظ', fullUrl: '/hafez' }],
      },
    },
    next: {
      id: 2131,
      title: 'غزل شمارهٔ ۲',
      urlSlug: 'sh2',
      excerpt: 'صلاح کار کجا و من خراب کجا',
    },
    verses: [
      { id: 1, vOrder: 1, coupletIndex: 0, versePosition: 0, text: 'الا یا ایها الساقی' },
      { id: 2, vOrder: 2, coupletIndex: 0, versePosition: 1, text: 'ادر کاسا و ناولها' },
    ],
  };

  const record = normalizeGanjoorApiPoem(rawPayload);
  assert.equal(record.fullUrl, '/hafez/ghazal/sh1');
  assert.equal(record.categoryFullUrl, '/hafez/ghazal');
  assert.equal(record.nextPoem?.fullUrl, '/hafez/ghazal/sh2');
  assert.equal(record.breadcrumbs.length, 2);
});

test('toggleItemInReadingList adds and removes a couplet bookmark deterministically', () => {
  const item = {
    id: 'test-bm-99',
    type: 'couplet' as const,
    poemId: 4001,
    poemFullUrl: '/ferdowsi/shahname/aghaz/sh1',
    poemTitle: 'آغاز شاهنامه',
    poetName: 'ابوالقاسم فردوسی',
    coupletIndex: 1,
    hemistich1: 'به نامِ خداوندِ جان و خرد',
    hemistich2: 'کز این برتر اندیشه برنگذرد',
    personalNote: 'سرآغاز شاهنامه',
    addedAt: '۱۴۰۵/۰۸/۰۹',
  };

  const added = toggleItemInReadingList(DEFAULT_READING_LISTS, 'list-mystic', item);
  assert.equal(added.action, 'added');
  const removed = toggleItemInReadingList(added.lists, 'list-mystic', item);
  assert.equal(removed.action, 'removed');
});
