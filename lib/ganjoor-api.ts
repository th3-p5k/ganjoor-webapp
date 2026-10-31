import {
  CURATED_POEMS,
  FALLBACK_POETS,
  GanjoorCategoryView,
  GanjoorPoetSummary,
  PoemRecord,
  filterPoems,
  normalizeGanjoorApiPoem,
} from './ganjoor';

const GANJOOR_BASE = 'https://api.ganjoor.net';

async function fetchWithTimeout(url: string, timeoutMs = 6000): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`Ganjoor HTTP ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function buildFallbackCategoryView(url: string): GanjoorCategoryView {
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const rootSlug = '/' + (cleanUrl.split('/').filter(Boolean)[0] || 'hafez');
  const poet =
    FALLBACK_POETS.find((p) => p.fullUrl === rootSlug) || FALLBACK_POETS[0];

  const matchingPoems = CURATED_POEMS.filter((p) => p.poetFullUrl === poet.fullUrl);
  const poemsList = (matchingPoems.length > 0 ? matchingPoems : CURATED_POEMS).map((p) => ({
    id: p.id,
    title: p.title.split('—')[0].trim(),
    urlSlug: p.fullUrl.split('/').pop() || 'sh1',
    fullUrl: p.fullUrl,
    excerpt: p.couplets[0]?.hemistich1 || p.title,
  }));

  return {
    poet,
    cat: {
      id: poet.rootCatId,
      title: poet.nickname || poet.name,
      fullUrl: cleanUrl,
      description: poet.description || '',
      ancestors: [],
      children: [
        {
          id: 1,
          title: 'گزیده اشعار و غزلیات',
          urlSlug: 'ghazal',
          fullUrl: `${poet.fullUrl}/ghazal`,
        },
      ],
      poems: poemsList,
    },
  };
}

export async function fetchPoets(): Promise<{
  poets: GanjoorPoetSummary[];
  source: 'live-ganjoor-api' | 'archival-cache';
}> {
  try {
    const rawPoets = await fetchWithTimeout(`${GANJOOR_BASE}/api/ganjoor/poets`);
    if (Array.isArray(rawPoets) && rawPoets.length > 0) {
      const poets: GanjoorPoetSummary[] = rawPoets.map((p: any) => ({
        id: Number(p.id),
        name: String(p.name || ''),
        nickname: String(p.nickname || p.name || ''),
        fullUrl: String(p.fullUrl || ''),
        rootCatId: Number(p.rootCatId || 0),
        birthYearInLHijri: Number(p.birthYearInLHijri || 0),
        deathYearInLHijri: Number(p.deathYearInLHijri || 0),
        pinOrder: Number(p.pinOrder || 0),
        birthPlace: String(p.birthPlace || ''),
        deathPlace: String(p.deathPlace || ''),
        description: p.description ? String(p.description) : undefined,
      }));
      return { poets, source: 'live-ganjoor-api' };
    }
  } catch {
    // Fallback to offline curated poets
  }
  return { poets: FALLBACK_POETS, source: 'archival-cache' };
}

export async function fetchCategory(urlParam: string): Promise<{
  categoryView: GanjoorCategoryView;
  source: 'live-ganjoor-api' | 'archival-cache';
}> {
  const normalizedUrl = urlParam.startsWith('/') ? urlParam : `/${urlParam}`;

  try {
    const rawData = await fetchWithTimeout(
      `${GANJOOR_BASE}/api/ganjoor/cat?url=${encodeURIComponent(normalizedUrl)}&poems=true`
    );
    if (rawData && rawData.cat) {
      const catFullUrl = String(rawData.cat.fullUrl || normalizedUrl);
      const view: GanjoorCategoryView = {
        poet: {
          id: Number(rawData.poet?.id || 2),
          name: String(rawData.poet?.name || ''),
          nickname: String(rawData.poet?.nickname || rawData.poet?.name || ''),
          fullUrl: String(rawData.poet?.fullUrl || normalizedUrl),
          rootCatId: Number(rawData.poet?.rootCatId || rawData.cat.id || 0),
          birthYearInLHijri: Number(rawData.poet?.birthYearInLHijri || 0),
          deathYearInLHijri: Number(rawData.poet?.deathYearInLHijri || 0),
          pinOrder: Number(rawData.poet?.pinOrder || 0),
          birthPlace: String(rawData.poet?.birthPlace || ''),
          deathPlace: String(rawData.poet?.deathPlace || ''),
          description: String(rawData.poet?.description || rawData.cat?.description || ''),
        },
        cat: {
          id: Number(rawData.cat.id || 0),
          title: String(rawData.cat.title || ''),
          fullUrl: catFullUrl,
          description: String(rawData.cat.description || ''),
          ancestors: Array.isArray(rawData.cat.ancestors)
            ? rawData.cat.ancestors.map((a: any) => ({
                title: String(a.title || ''),
                fullUrl: String(a.fullUrl || ''),
              }))
            : [],
          children: Array.isArray(rawData.cat.children)
            ? rawData.cat.children.map((c: any) => ({
                id: Number(c.id || 0),
                title: String(c.title || ''),
                urlSlug: String(c.urlSlug || ''),
                fullUrl: String(c.fullUrl || `${catFullUrl}/${c.urlSlug}`),
              }))
            : [],
          poems: Array.isArray(rawData.cat.poems)
            ? rawData.cat.poems.map((pm: any) => ({
                id: Number(pm.id || 0),
                title: String(pm.title || ''),
                urlSlug: String(pm.urlSlug || ''),
                fullUrl: pm.fullUrl
                  ? String(pm.fullUrl)
                  : `${catFullUrl}/${pm.urlSlug}`,
                excerpt: String(pm.excerpt || ''),
              }))
            : [],
        },
      };
      return { categoryView: view, source: 'live-ganjoor-api' };
    }
  } catch {
    // Fallback to offline curated category
  }

  return {
    categoryView: buildFallbackCategoryView(normalizedUrl),
    source: 'archival-cache',
  };
}

export async function fetchPoem(options: {
  fullUrl?: string;
  id?: number;
}): Promise<{
  poem: PoemRecord;
  source: 'live-ganjoor-api' | 'archival-cache';
}> {
  const { fullUrl, id } = options;

  try {
    const endpoint = fullUrl
      ? `${GANJOOR_BASE}/api/ganjoor/poem?url=${encodeURIComponent(
          fullUrl.startsWith('/') ? fullUrl : `/${fullUrl}`
        )}`
      : `${GANJOOR_BASE}/api/ganjoor/poem/${Number(id || 2151)}`;

    const raw = await fetchWithTimeout(endpoint);
    if (raw && Array.isArray(raw.verses) && raw.verses.length > 0) {
      const normalized = normalizeGanjoorApiPoem(raw);
      return { poem: normalized, source: 'live-ganjoor-api' };
    }
  } catch {
    // Fallback below
  }

  const fallback =
    (fullUrl ? CURATED_POEMS.find((p) => p.fullUrl === fullUrl) : null) ||
    (id ? CURATED_POEMS.find((p) => p.id === Number(id)) : null) ||
    CURATED_POEMS[0];
  return { poem: fallback, source: 'archival-cache' };
}

export async function fetchRandomPoem(poetId?: number | string): Promise<{
  poem: PoemRecord;
  source: 'live-ganjoor-api' | 'archival-cache';
}> {
  const querySuffix =
    poetId && poetId !== 'all' && Number(poetId) > 0
      ? `?poetId=${encodeURIComponent(String(poetId))}`
      : '';

  try {
    const randomBrief = await fetchWithTimeout(
      `${GANJOOR_BASE}/api/ganjoor/poem/random${querySuffix}`
    );
    if (randomBrief && (randomBrief.fullUrl || randomBrief.id)) {
      try {
        const fullEndpoint = randomBrief.fullUrl
          ? `${GANJOOR_BASE}/api/ganjoor/poem?url=${encodeURIComponent(randomBrief.fullUrl)}`
          : `${GANJOOR_BASE}/api/ganjoor/poem/${randomBrief.id}`;
        const fullPoem = await fetchWithTimeout(fullEndpoint);
        if (fullPoem && Array.isArray(fullPoem.verses) && fullPoem.verses.length > 0) {
          return {
            poem: normalizeGanjoorApiPoem(fullPoem),
            source: 'live-ganjoor-api',
          };
        }
      } catch {
        if (randomBrief.plainText) {
          const lines = String(randomBrief.plainText)
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
          const verses = lines.map((text, idx) => ({
            id: idx + 1,
            vOrder: idx + 1,
            coupletIndex: Math.floor(idx / 2),
            versePosition: idx % 2,
            text,
          }));
          return {
            poem: normalizeGanjoorApiPoem({ ...randomBrief, verses }),
            source: 'live-ganjoor-api',
          };
        }
      }
    }
  } catch {
    // Fallback below
  }

  const pool =
    poetId && poetId !== 'all'
      ? CURATED_POEMS.filter((p) => p.poetId === Number(poetId))
      : CURATED_POEMS;
  const chosen =
    (pool.length > 0 ? pool : CURATED_POEMS)[
      Math.floor(Math.random() * (pool.length > 0 ? pool.length : CURATED_POEMS.length))
    ];
  return { poem: chosen, source: 'archival-cache' };
}

export async function searchPoems(
  term: string,
  poetId?: number | string
): Promise<{
  results: PoemRecord[];
  source: 'live-ganjoor-api' | 'archival-cache';
}> {
  const cleanTerm = (term || '').trim();
  if (!cleanTerm) {
    return { results: CURATED_POEMS, source: 'archival-cache' };
  }

  try {
    const poetQuery =
      poetId && poetId !== 'all' && Number(poetId) > 0
        ? `&poetId=${encodeURIComponent(String(poetId))}`
        : '';
    const rawList = await fetchWithTimeout(
      `${GANJOOR_BASE}/api/ganjoor/poems/search?term=${encodeURIComponent(cleanTerm)}&PageNumber=1&PageSize=12${poetQuery}`
    );
    if (Array.isArray(rawList) && rawList.length > 0) {
      const mapped = rawList.map((item: any) => {
        if (Array.isArray(item.verses) && item.verses.length > 0) {
          return normalizeGanjoorApiPoem(item);
        }
        const lines = String(item.plainText || '')
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        const verses = lines.map((text, idx) => ({
          id: idx + 1,
          vOrder: idx + 1,
          coupletIndex: Math.floor(idx / 2),
          versePosition: idx % 2,
          text,
        }));
        return normalizeGanjoorApiPoem({ ...item, verses });
      });
      return { results: mapped, source: 'live-ganjoor-api' };
    }
  } catch {
    // Fallback to local search
  }

  const localMatches = filterPoems(CURATED_POEMS, { query: cleanTerm });
  return { results: localMatches, source: 'archival-cache' };
}
