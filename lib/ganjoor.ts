export type PersianFontId = 'vazirmatn' | 'amiri' | 'naskh' | 'nastaliq' | 'lalezar';

export type LineSpacingPreset = 'compact' | 'relaxed' | 'spacious';

export type PoemTheme =
  | 'all'
  | 'عرفان و اهل دل'
  | 'شوق وصال و دلدادگی'
  | 'گذر عمر و دم‌غنیمت‌شماری'
  | 'حکمت و اخلاق انسانی'
  | 'حماسه و خرد'
  | 'طبیعت و بهاریه';

export interface TypographySettings {
  fontFamily: PersianFontId;
  fontSize: number; // 16 to 36
  lineSpacing: LineSpacingPreset;
  showDiacritics: boolean;
  showCoupletMeaning: boolean;
  nightMode: boolean;
}

export interface GanjoorRawVerse {
  id: number;
  vOrder: number;
  coupletIndex: number;
  versePosition: number;
  text: string;
  coupletSummary?: string | null;
}

export interface Couplet {
  id: string;
  index: number;
  hemistich1: string;
  hemistich2: string;
  persianMeaning?: string;
  isSingleLine?: boolean;
}

export interface RecitationTrack {
  id: number;
  audioTitle: string;
  audioArtist: string;
  mp3Url: string;
}

export interface GanjoorBreadcrumb {
  title: string;
  fullUrl: string;
}

export interface AdjacentPoemLink {
  id: number;
  title: string;
  urlSlug: string;
  fullUrl: string;
  excerpt: string;
}

export interface PoemRecord {
  id: number;
  title: string;
  fullTitle: string;
  fullUrl: string;
  categoryTitle: string;
  categoryFullUrl: string;
  breadcrumbs: GanjoorBreadcrumb[];
  poetId: number;
  poetName: string;
  poetFullUrl: string;
  eraTitle: string;
  persianForm: string;
  persianTheme: Exclude<PoemTheme, 'all'>;
  meter: string;
  poemSummary: string;
  couplets: Couplet[];
  recitations: RecitationTrack[];
  nextPoem?: AdjacentPoemLink | null;
  previousPoem?: AdjacentPoemLink | null;
}

export interface GanjoorPoetSummary {
  id: number;
  name: string;
  nickname: string;
  fullUrl: string;
  rootCatId: number;
  birthYearInLHijri: number;
  deathYearInLHijri: number;
  pinOrder: number;
  birthPlace: string;
  deathPlace: string;
  description?: string;
}

export interface GanjoorCategoryChild {
  id: number;
  title: string;
  urlSlug: string;
  fullUrl: string;
}

export interface GanjoorPoemBrief {
  id: number;
  title: string;
  urlSlug: string;
  fullUrl: string;
  excerpt: string;
}

export interface GanjoorCategoryView {
  poet: GanjoorPoetSummary;
  cat: {
    id: number;
    title: string;
    fullUrl: string;
    description: string;
    ancestors: GanjoorBreadcrumb[];
    children: GanjoorCategoryChild[];
    poems: GanjoorPoemBrief[];
  };
}

export interface SavedBookmarkItem {
  id: string;
  type: 'poem' | 'couplet';
  poemId: number;
  poemFullUrl: string;
  poemTitle: string;
  poetName: string;
  coupletIndex?: number;
  hemistich1: string;
  hemistich2: string;
  personalNote: string;
  addedAt: string;
}

export interface ReadingList {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  items: SavedBookmarkItem[];
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Converts English digits in a number or string to standard Persian digits.
 */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] || d);
}

export const PERSIAN_FONT_OPTIONS: {
  id: PersianFontId;
  label: string;
  shortLabel: string;
  cssVariable: string;
  characterNote: string;
}[] = [
  {
    id: 'vazirmatn',
    label: 'وزیرمتن (نسخ معاصر)',
    shortLabel: 'وزیرمتن',
    cssVariable: 'var(--font-vazirmatn), sans-serif',
    characterNote: 'قلم نسخ هندسی و بسیار خوانا برای مطالعه طولانی‌مدت اشعار و متون',
  },
  {
    id: 'amiri',
    label: 'امیری (نسخ کلاسیک دیوانی)',
    shortLabel: 'امیری کلاسیک',
    cssVariable: 'var(--font-amiri), serif',
    characterNote: 'بازآفرینی خط نسخ سنتی چاپخانه بولاق با حس و حال نسخه‌های خطی کهن',
  },
  {
    id: 'naskh',
    label: 'نسخ پژوهشی و علمی',
    shortLabel: 'نسخ پژوهشی',
    cssVariable: 'var(--font-naskh), serif',
    characterNote: 'تفکیک دقیق حروف و اعراب‌گذاری کامل برای خوانش دقیق متون کلاسیک',
  },
  {
    id: 'nastaliq',
    label: 'نستعلیق خوشنویسی',
    shortLabel: 'نستعلیق',
    cssVariable: 'var(--font-nastaliq), serif',
    characterNote: 'خط اصیل و منحنی نستعلیق ایرانی به شیوه خوشنویسان دیوان‌های کهن',
  },
  {
    id: 'lalezar',
    label: 'لاله‌زار (کتیبه‌ای)',
    shortLabel: 'لاله‌زار',
    cssVariable: 'var(--font-lalezar), sans-serif',
    characterNote: 'قلم پررنگ و نمایشی الهام‌گرفته از چاپ سنگی و کتیبه‌های ایرانی',
  },
];

export const FALLBACK_POETS: GanjoorPoetSummary[] = [
  {
    id: 2,
    name: 'حافظ',
    nickname: 'حافظ شیرازی',
    fullUrl: '/hafez',
    rootCatId: 24,
    birthYearInLHijri: 727,
    deathYearInLHijri: 792,
    pinOrder: 1,
    birthPlace: 'شیراز',
    deathPlace: 'شیراز',
    description:
      'خواجه شمس‌الدین محمد بن بهاءالدین محمد حافظ شیرازی معروف به لسان‌الغیب، شاعر بزرگ سدهٔ هشتم هجری و خداوندگار غزل فارسی است.',
  },
  {
    id: 5,
    name: 'مولوی',
    nickname: 'مولانا جلال‌الدین بلخی',
    fullUrl: '/moulavi',
    rootCatId: 88,
    birthYearInLHijri: 604,
    deathYearInLHijri: 672,
    pinOrder: 2,
    birthPlace: 'بلخ',
    deathPlace: 'قونیه',
    description:
      'جلال‌الدین محمد بلخی معروف به مولانا و مولوی، شاعر و عارف نامدار ایرانی در سدهٔ هفتم هجری و سرایندهٔ مثنوی معنوی و غزلیات شمس است.',
  },
  {
    id: 7,
    name: 'سعدی',
    nickname: 'سعدی شیرازی',
    fullUrl: '/saadi',
    rootCatId: 112,
    birthYearInLHijri: 606,
    deathYearInLHijri: 690,
    pinOrder: 3,
    birthPlace: 'شیراز',
    deathPlace: 'شیراز',
    description:
      'ابومحمد مشرف‌الدین مصلح بن عبدالله بن مشرف متخلص به سعدی، شاعر و نویسندهٔ بزرگ سدهٔ هفتم هجری، استاد سخن و خالق بوستان، گلستان و غزلیات است.',
  },
  {
    id: 4,
    name: 'فردوسی',
    nickname: 'ابوالقاسم فردوسی',
    fullUrl: '/ferdowsi',
    rootCatId: 32,
    birthYearInLHijri: 329,
    deathYearInLHijri: 416,
    pinOrder: 4,
    birthPlace: 'توس',
    deathPlace: 'توس',
    description:
      'حکیم ابوالقاسم فردوسی توسی، حماسه‌سرای بزرگ ایران و سرایندهٔ شاهنامه است که زبان و تاریخ ایران‌زمین را زنده نگاه داشت.',
  },
  {
    id: 3,
    name: 'خیام',
    nickname: 'حکیم عمر خیام',
    fullUrl: '/khayyam',
    rootCatId: 28,
    birthYearInLHijri: 439,
    deathYearInLHijri: 526,
    pinOrder: 5,
    birthPlace: 'نیشابور',
    deathPlace: 'نیشابور',
    description:
      'غیاث‌الدین ابوالفتح عمر بن ابراهیم خیام نیشابوری، فیلسوف، ریاضی‌دان، اخترشناس و رباعی‌سرای نامدار ایرانی در دورهٔ سلجوقی است.',
  },
  {
    id: 6,
    name: 'نظامی',
    nickname: 'نظامی گنجوی',
    fullUrl: '/nezami',
    rootCatId: 100,
    birthYearInLHijri: 535,
    deathYearInLHijri: 614,
    pinOrder: 6,
    birthPlace: 'گنجه',
    deathPlace: 'گنجه',
    description:
      'جمال‌الدین ابومحمد الیاس بن یوسف بن زکی متخلص به نظامی، شاعر و داستان‌سرای بی‌همتای فارسی در سدهٔ ششم هجری و خالق پنج گنج (خمسه) است.',
  },
  {
    id: 9,
    name: 'عطار',
    nickname: 'عطار نیشابوری',
    fullUrl: '/attar',
    rootCatId: 150,
    birthYearInLHijri: 540,
    deathYearInLHijri: 618,
    pinOrder: 7,
    birthPlace: 'نیشابور',
    deathPlace: 'نیشابور',
    description:
      'فریدالدین ابوحامد محمد عطار نیشابوری، عارف و شاعر بلندآوازهٔ ایران در پایان سدهٔ ششم و آغاز سدهٔ هفتم هجری و خالق منطق‌الطیر و تذکرةالاولیا است.',
  },
  {
    id: 10,
    name: 'سنایی',
    nickname: 'سنایی غزنوی',
    fullUrl: '/sanaee',
    rootCatId: 180,
    birthYearInLHijri: 473,
    deathYearInLHijri: 545,
    pinOrder: 8,
    birthPlace: 'غزنین',
    deathPlace: 'غزنین',
    description:
      'ابوالمجد مجدود بن آدم سنایی غزنوی، شاعر بزرگ سدهٔ ششم هجری که نخستین بار مضامین عرفانی و قلندرانه را وارد غزل و قصیده و مثنوی ساخت.',
  },
  {
    id: 20,
    name: 'پروین اعتصامی',
    nickname: 'پروین اعتصامی',
    fullUrl: '/parvin',
    rootCatId: 240,
    birthYearInLHijri: 1324,
    deathYearInLHijri: 1360,
    pinOrder: 9,
    birthPlace: 'تبریز',
    deathPlace: 'تهران',
    description:
      'رخشنده اعتصامی معروف به پروین اعتصامی، شاعر نامدار معاصر ایران که به سبب مناظره‌های شاعرانه و قطعات حکمی و اخلاقی شهرت دارد.',
  },
  {
    id: 27,
    name: 'شهریار',
    nickname: 'سید محمدحسین شهریار',
    fullUrl: '/shahriar',
    rootCatId: 300,
    birthYearInLHijri: 1324,
    deathYearInLHijri: 1409,
    pinOrder: 10,
    birthPlace: 'تبریز',
    deathPlace: 'تبریز',
    description:
      'سید محمدحسین بهجت تبریزی متخلص به شهریار، شاعر نامدار معاصر ایران و سرایندهٔ منظومهٔ حیدربابایه سلام و غزل‌های پرشور فارسی است.',
  },
];

export const CURATED_POEMS: PoemRecord[] = [
  {
    id: 2151,
    title: 'غزل شمارهٔ ۲۲ — چو بشنوی سخن اهل دل مگو که خطاست',
    fullTitle: 'حافظ » غزلیات » غزل شمارهٔ ۲۲',
    fullUrl: '/hafez/ghazal/sh22',
    categoryTitle: 'غزلیات',
    categoryFullUrl: '/hafez/ghazal',
    breadcrumbs: [
      { title: 'حافظ', fullUrl: '/hafez' },
      { title: 'غزلیات', fullUrl: '/hafez/ghazal' },
    ],
    poetId: 2,
    poetName: 'حافظ شیرازی',
    poetFullUrl: '/hafez',
    eraTitle: 'سدهٔ هشتم هجری · مکتب شیراز',
    persianForm: 'غزل',
    persianTheme: 'عرفان و اهل دل',
    meter: 'مفاعلن فعلاتن مفاعلن فعلن (مجتث مثمن مخبون محذوف)',
    poemSummary:
      'شاعر در این غزل به عمق احساسات و افکار درونی خود می‌پردازد و تأکید می‌کند که کلام اهل دل را نباید خطا شمرد؛ آتشی جاودان در دل عاشق شعله‌ور است که فراتر از تعلقات دنیا و عقبی می‌سوزد.',
    nextPoem: {
      id: 2152,
      title: 'غزل شمارهٔ ۲۳',
      urlSlug: 'sh23',
      fullUrl: '/hafez/ghazal/sh23',
      excerpt: 'خیال روی تو در هر طریق همره ماست',
    },
    previousPoem: {
      id: 2150,
      title: 'غزل شمارهٔ ۲۱',
      urlSlug: 'sh21',
      fullUrl: '/hafez/ghazal/sh21',
      excerpt: 'دل و دینم شد و دلبر به ملامت برخاست',
    },
    recitations: [
      {
        id: 2861,
        audioTitle: 'غزل شمارهٔ ۲۲',
        audioArtist: 'فریدون فرح‌اندوز',
        mp3Url: 'https://i.ganjoor.net/a/2151-ff.mp3',
      },
    ],
    couplets: [
      {
        id: '2151-0',
        index: 1,
        hemistich1: 'چو بشنوی سخنِ اهلِ دل، مگو که خطاست',
        hemistich2: 'سخن‌شناس نه‌ای، جان من! خطا این جاست',
        persianMeaning:
          'وقتی کلام و اندیشهٔ عاشقان و عارفان را می‌شنوی مگو که اشتباه است؛ خطای اصلی اینجاست که تو هنوز ظرافت سخن اهل دل را نشناخته‌ای.',
      },
      {
        id: '2151-1',
        index: 2,
        hemistich1: 'سرم به دنیی و عقبی فرو نمی‌آید',
        hemistich2: 'تبارک‌الله از این فتنه‌ها که در سر ماست',
        persianMeaning:
          'سرِ من نه در برابر سودای این جهان خم می‌شود و نه به طمع جهان دیگر؛ آفرین بر خدا از این شور و غوغای بلندی که در سر ماست.',
      },
      {
        id: '2151-2',
        index: 3,
        hemistich1: 'در اندرونِ منِ خسته‌دل ندانم کیست',
        hemistich2: 'که من خموشم و او در فغان و در غوغاست',
        persianMeaning:
          'نمی‌دانم در درونِ دلِ رنجور من چه کسی خانه دارد که من در ظاهر خاموشم اما او پیوسته در فریاد و خروش است.',
      },
      {
        id: '2151-3',
        index: 4,
        hemistich1: 'دلم ز پرده برون شد، کجایی ای مطرب؟',
        hemistich2: 'بنال هان! که از این پرده کار ما به نواست',
        persianMeaning:
          'راز دلم آشکار و بی‌قرار شد، ای خنیاگر کجایی؟ نغمه‌ای ساز کن که از این نغمهٔ عاشقانه کار ما سامان می‌گیرد.',
      },
      {
        id: '2151-4',
        index: 5,
        hemistich1: 'مرا به کارِ جهان هرگز التفات نبود',
        hemistich2: 'رخِ تو در نظرِ من چنین خوشش آراست',
        persianMeaning:
          'من هرگز اعتنایی به کار و بار دنیا نداشتم؛ این زیباییِ رخسار تو بود که جهان را در چشم من چنین آراسته و دلپذیر جلوه داد.',
      },
      {
        id: '2151-5',
        index: 6,
        hemistich1: 'از آن به دیرِ مغانم عزیز می‌دارند',
        hemistich2: 'که آتشی که نمیرد همیشه در دلِ ماست',
        persianMeaning:
          'به این سبب در خرابات و محفل پیران فرزانه مرا گرامی می‌دارند که آتشِ جاودانِ عشق همواره در سینهٔ ما فروزان است.',
      },
      {
        id: '2151-6',
        index: 7,
        hemistich1: 'طبیبِ عشق منم، باده ده که این معجون',
        hemistich2: 'فراغت آرد و اندیشه‌ی خطا ببرد',
        persianMeaning:
          'پزشکِ دردِ عشق منم؛ جام معرفت و شوق را بده که این اکسیر، آرامش می‌آورد و وسوسه‌ها و اندیشه‌های نادرست را می‌زداید.',
      },
    ],
  },
  {
    id: 2130,
    title: 'غزل شمارهٔ ۱ — الا یا ایها الساقی ادر کأسا و ناولها',
    fullTitle: 'حافظ » غزلیات » غزل شمارهٔ ۱',
    fullUrl: '/hafez/ghazal/sh1',
    categoryTitle: 'غزلیات',
    categoryFullUrl: '/hafez/ghazal',
    breadcrumbs: [
      { title: 'حافظ', fullUrl: '/hafez' },
      { title: 'غزلیات', fullUrl: '/hafez/ghazal' },
    ],
    poetId: 2,
    poetName: 'حافظ شیرازی',
    poetFullUrl: '/hafez',
    eraTitle: 'سدهٔ هشتم هجری · سرآغاز دیوان حافظ',
    persianForm: 'غزل',
    persianTheme: 'شوق وصال و دلدادگی',
    meter: 'مفاعیلن مفاعیلن مفاعیلن مفاعیلن (هزج مثمن سالم)',
    poemSummary:
      'غزل آغازین دیوان حافظ که از دشواری‌های غیرمنتظره در مسیر عشق، بی‌پناهی سالک در برابر اسرار غیب و توصیه به رهایی از تعلقات برای رسیدن به حضور سخن می‌گوید.',
    nextPoem: {
      id: 2131,
      title: 'غزل شمارهٔ ۲',
      urlSlug: 'sh2',
      fullUrl: '/hafez/ghazal/sh2',
      excerpt: 'صلاح کار کجا و من خراب کجا',
    },
    previousPoem: null,
    recitations: [
      {
        id: 2801,
        audioTitle: 'غزل شمارهٔ ۱',
        audioArtist: 'فریدون فرح‌اندوز',
        mp3Url: 'https://i.ganjoor.net/a/2130-ff.mp3',
      },
    ],
    couplets: [
      {
        id: '2130-0',
        index: 1,
        hemistich1: 'الا یا ایها الساقی ادر کأساً و ناولها',
        hemistich2: 'که عشق آسان نمود اول ولی افتاد مشکل‌ها',
        persianMeaning:
          'ای ساقی جام باده را به گردش درآور و به من برسان؛ چرا که راه عشق در آغاز آسان به نظر می‌رسید اما به تدریج دشواری‌هایش آشکار شد.',
      },
      {
        id: '2130-1',
        index: 2,
        hemistich1: 'به بویِ نافه‌ای کآخر صبا زان طره بگشاید',
        hemistich2: 'ز تابِ جعدِ مشکینش چه خون افتاد در دل‌ها',
        persianMeaning:
          'به امید عطر خوشی که سرانجام باد صبا از زلف یار می‌پراکند، از پیچ و تاب زلف مشکین او چه خون‌ها که در دل عاشقان نیافتاد.',
      },
      {
        id: '2130-2',
        index: 3,
        hemistich1: 'مرا در منزلِ جانان چه امنِ عیش، چون هر دم',
        hemistich2: 'جرس فریاد می‌دارد که بربندید محمل‌ها',
        persianMeaning:
          'در توقفگاه معشوق چگونه می‌توانم آسوده و ایمن باشم، وقتی هر لحظه زنگ کاروان فریاد می‌زند که بار سفر را ببندید.',
      },
      {
        id: '2130-3',
        index: 4,
        hemistich1: 'شبِ تاریک و بیمِ موج و گردابی چنین هایل',
        hemistich2: 'کجا دانند حالِ ما سبکبارانِ ساحل‌ها',
        persianMeaning:
          'در میان شب تاریک و هراسِ موج و گرداب سهمگین عشق، آسوده‌خاطرانِ نشسته بر ساحل عافیت چگونه می‌توانند حال طوفانی ما را درک کنند؟',
      },
      {
        id: '2130-4',
        index: 5,
        hemistich1: 'حضوری گر همی‌خواهی از او غایب مشو حافظ',
        hemistich2: 'متی ما تلق من تهوی دع الدنیا و اهملها',
        persianMeaning:
          'ای حافظ اگر حضور و آرامش حقیقی می‌طلبی یک لحظه از یاد او غافل مشو؛ هرگاه به دیدار کسی که دوستش داری رسیدی، دنیا را رها کن و نادیده بگیر.',
      },
    ],
  },
  {
    id: 5001,
    title: 'بخش ۱ — نی‌نامه (سرآغاز دفتر اول مثنوی معنوی)',
    fullTitle: 'مولوی » مثنوی معنوی » دفتر اول » بخش ۱ - نی‌نامه',
    fullUrl: '/moulavi/masnavi/daftar1/sh1',
    categoryTitle: 'دفتر اول مثنوی',
    categoryFullUrl: '/moulavi/masnavi/daftar1',
    breadcrumbs: [
      { title: 'مولوی', fullUrl: '/moulavi' },
      { title: 'مثنوی معنوی', fullUrl: '/moulavi/masnavi' },
      { title: 'دفتر اول', fullUrl: '/moulavi/masnavi/daftar1' },
    ],
    poetId: 5,
    poetName: 'مولانا جلال‌الدین بلخی',
    poetFullUrl: '/moulavi',
    eraTitle: 'سدهٔ هفتم هجری · مثنوی معنوی',
    persianForm: 'مثنوی',
    persianTheme: 'عرفان و اهل دل',
    meter: 'فاعلاتن فاعلاتن فاعلن (رمل مسدس محذوف)',
    poemSummary:
      'سرآغاز جاودانهٔ مثنوی معنوی که در آن «نی» نماد انسان آگاه و روح جدا مانده از اصل الهی است؛ نالهٔ نی حکایت فراق و اشتیاق بازگشت به نیستان نخستین است.',
    nextPoem: {
      id: 5002,
      title: 'بخش ۲ — داستان پادشاه و کنیزک',
      urlSlug: 'sh2',
      fullUrl: '/moulavi/masnavi/daftar1/sh2',
      excerpt: 'بود شاهی در زمانی پیش از این',
    },
    previousPoem: null,
    recitations: [],
    couplets: [
      {
        id: '5001-0',
        index: 1,
        hemistich1: 'بشنو از نی چون حکایت می‌کند',
        hemistich2: 'از جدایی‌ها شکایت می‌کند',
        persianMeaning:
          'به نغمهٔ نی گوش بسپار که چگونه سرگذشت خویش را بازمی‌گوید و از درد دوری و جدایی از اصل خود شکوه می‌کند.',
      },
      {
        id: '5001-1',
        index: 2,
        hemistich1: 'کز نیستان تا مرا ببریده‌اند',
        hemistich2: 'در نفیرم مرد و زن نالیده‌اند',
        persianMeaning:
          'از آن هنگام که مرا از نیستانِ وجود بریده‌اند، مرد و زن با نغمه و فریاد سوزناک من هم‌نوا شده و گریسته‌اند.',
      },
      {
        id: '5001-2',
        index: 3,
        hemistich1: 'سینه خواهم شرحه‌شرحه از فراق',
        hemistich2: 'تا بگویم شرحِ دردِ اشتیاق',
        persianMeaning:
          'دلی می‌خواهم که از رنج دوری پاره‌پاره و سوخته باشد تا بتوانم حقیقتِ دردِ شوق و دلدادگی را برایش بازگو کنم.',
      },
      {
        id: '5001-3',
        index: 4,
        hemistich1: 'هر کسی کو دور ماند از اصلِ خویش',
        hemistich2: 'باز جوید روزگارِ وصلِ خویش',
        persianMeaning:
          'هر آن کس که از ریشه و گوهر نخستین خود دور بیفتد، بی‌گمان دوباره در پیِ روزگار وصال و پیوند خویش برمی‌آید.',
      },
      {
        id: '5001-4',
        index: 5,
        hemistich1: 'آتش است این بانگِ نای و نیست باد',
        hemistich2: 'هر که این آتش ندارد نیست باد',
        persianMeaning:
          'این نغمهٔ نی، دمیدنِ بادِ ساده نیست بلکه آتشِ عشق است؛ هر کس که از این آتشِ الهی بی‌بهره است، وجودش بی‌حاصل است.',
      },
    ],
  },
  {
    id: 3012,
    title: 'رباعی شمارهٔ ۴۲ — این قافلهٔ عمر عجب می‌گذرد',
    fullTitle: 'خیام » رباعیات » رباعی شمارهٔ ۴۲',
    fullUrl: '/khayyam/robaee/sh42',
    categoryTitle: 'رباعیات خیام',
    categoryFullUrl: '/khayyam/robaee',
    breadcrumbs: [
      { title: 'خیام', fullUrl: '/khayyam' },
      { title: 'رباعیات', fullUrl: '/khayyam/robaee' },
    ],
    poetId: 3,
    poetName: 'حکیم عمر خیام',
    poetFullUrl: '/khayyam',
    eraTitle: 'سدهٔ پنجم و ششم هجری · نیشابور',
    persianForm: 'رباعی',
    persianTheme: 'گذر عمر و دم‌غنیمت‌شماری',
    meter: 'لا حول و لا قوة الا بالله (وزن رباعی)',
    poemSummary:
      'خیام در این رباعی درخشان، شتاب شگفت‌انگیز کاروان عمر را یادآور می‌شود و انسان را فرامی‌خواند که به جای اندوهِ فردای نیامده، لحظهٔ اکنون را با شادی و آگاهی دریابد.',
    nextPoem: {
      id: 3013,
      title: 'رباعی شمارهٔ ۴۳',
      urlSlug: 'sh43',
      fullUrl: '/khayyam/robaee/sh43',
      excerpt: 'افسوس که نامه جوانی طی شد',
    },
    previousPoem: {
      id: 3011,
      title: 'رباعی شمارهٔ ۴۱',
      urlSlug: 'sh41',
      fullUrl: '/khayyam/robaee/sh41',
      excerpt: 'اسرار ازل را نه تو دانی و نه من',
    },
    recitations: [],
    couplets: [
      {
        id: '3012-0',
        index: 1,
        hemistich1: 'این قافلهٔ عمر عجب می‌گذرد',
        hemistich2: 'دریاب دمی که با طرب می‌گذرد',
        persianMeaning:
          'این کاروانِ زندگی با شتابی شگفت‌انگیز در حال گذر است؛ لحظه‌ای را که با شادی و حضور دل می‌گذرد غنیمت شمار.',
      },
      {
        id: '3012-1',
        index: 2,
        hemistich1: 'ساقی غمِ فردایِ حریفان چه خوری؟',
        hemistich2: 'پیش آر پیاله را که شب می‌گذرد',
        persianMeaning:
          'ای ساقی، چرا اندوهِ فردای نیامدهٔ یاران را می‌خوری؟ جام را پیش آور که این شبِ کوتاه نیز در حال گذشتن است.',
      },
    ],
  },
  {
    id: 19584,
    title: 'حکایت شمارهٔ ۱۰ — بنی‌آدم اعضای یک پیکرند',
    fullTitle: 'سعدی » گلستان » باب اول در سیرت پادشاهان » حکایت شمارهٔ ۱۰',
    fullUrl: '/saadi/golestan/bab1/sh10',
    categoryTitle: 'باب اول گلستان',
    categoryFullUrl: '/saadi/golestan/bab1',
    breadcrumbs: [
      { title: 'سعدی', fullUrl: '/saadi' },
      { title: 'گلستان', fullUrl: '/saadi/golestan' },
      { title: 'باب اول', fullUrl: '/saadi/golestan/bab1' },
    ],
    poetId: 7,
    poetName: 'سعدی شیرازی',
    poetFullUrl: '/saadi',
    eraTitle: 'سدهٔ هفتم هجری · گلستان سعدی',
    persianForm: 'قطعه و مثنوی',
    persianTheme: 'حکمت و اخلاق انسانی',
    meter: 'فعولن فعولن فعولن فعل (متقارب مثمن محذوف)',
    poemSummary:
      'قطعهٔ جهانی سعدی که انسان‌ها را اعضای یک کالبد واحد می‌داند که از یک گوهر آفریده شده‌اند؛ رنج هر عضو، آرامش دیگر اعضا را سلب می‌کند و شرط انسانیت، همدردی با دیگران است.',
    nextPoem: {
      id: 19585,
      title: 'حکایت شمارهٔ ۱۱',
      urlSlug: 'sh11',
      fullUrl: '/saadi/golestan/bab1/sh11',
      excerpt: 'درویشی مستجاب‌الدعوه در بغداد پدید آمد',
    },
    previousPoem: {
      id: 19583,
      title: 'حکایت شمارهٔ ۹',
      urlSlug: 'sh9',
      fullUrl: '/saadi/golestan/bab1/sh9',
      excerpt: 'ملک‌زاده‌ای را شنیدم که کوتاه بود و حقیر',
    },
    recitations: [],
    couplets: [
      {
        id: '19584-0',
        index: 1,
        hemistich1: 'بنی‌آدم اعضایِ یک پیکرند',
        hemistich2: 'که در آفرینش ز یک گوهرند',
        persianMeaning:
          'فرزندان آدم همگی همچون اندام‌های یک کالبد واحد هستند، زیرا در سرشت و آفرینش از یک گوهرِ یگانه پدید آمده‌اند.',
      },
      {
        id: '19584-1',
        index: 2,
        hemistich1: 'چو عضوی به درد آورد روزگار',
        hemistich2: 'دگر عضوها را نماند قرار',
        persianMeaning:
          'هرگاه گردش روزگار یکی از این اندام‌ها را به درد و رنج مبتلا سازد، دیگر اندام‌ها نیز آرام و قرار خود را از دست می‌دهند.',
      },
      {
        id: '19584-2',
        index: 3,
        hemistich1: 'تو کز محنتِ دیگران بی‌غمی',
        hemistich2: 'نشاید که نامت نهند آدمی',
        persianMeaning:
          'تو که از رنج و اندوه دیگر انسان‌ها بی‌اعتنا و فارغی، شایسته نیست که نام «انسان» بر تو بگذارند.',
      },
    ],
  },
  {
    id: 4001,
    title: 'آغاز کتاب — گفتار اندر ستایش خرد (شاهنامه)',
    fullTitle: 'فردوسی » شاهنامه » آغاز کتاب',
    fullUrl: '/ferdowsi/shahname/aghaz/sh1',
    categoryTitle: 'آغاز کتاب شاهنامه',
    categoryFullUrl: '/ferdowsi/shahname/aghaz',
    breadcrumbs: [
      { title: 'فردوسی', fullUrl: '/ferdowsi' },
      { title: 'شاهنامه', fullUrl: '/ferdowsi/shahname' },
      { title: 'آغاز کتاب', fullUrl: '/ferdowsi/shahname/aghaz' },
    ],
    poetId: 4,
    poetName: 'ابوالقاسم فردوسی',
    poetFullUrl: '/ferdowsi',
    eraTitle: 'سدهٔ چهارم و پنجم هجری · توس',
    persianForm: 'مثنوی حماسی',
    persianTheme: 'حماسه و خرد',
    meter: 'فعولن فعولن فعولن فعل (متقارب مثمن محذوف)',
    poemSummary:
      'سرآغاز شکوهمند شاهنامه فردوسی که با ستایش خداوندِ بخشندهٔ جان و خرد آغاز می‌شود و «خرد» را برترین موهبت الهی و راهنمای انسان در دو جهان می‌شمارد.',
    nextPoem: {
      id: 4002,
      title: 'گفتار اندر آفرینش عالم',
      urlSlug: 'sh2',
      fullUrl: '/ferdowsi/shahname/aghaz/sh2',
      excerpt: 'ز آغاز باید که دانی درست',
    },
    previousPoem: null,
    recitations: [],
    couplets: [
      {
        id: '4001-0',
        index: 1,
        hemistich1: 'به نامِ خداوندِ جان و خرد',
        hemistich2: 'کز این برتر اندیشه برنگذرد',
        persianMeaning:
          'به نام خداوندی که آفرینندهٔ جان و خرد است؛ مقامی که هیچ اندیشه‌ای یارای فراتر رفتن از آن را ندارد.',
      },
      {
        id: '4001-1',
        index: 2,
        hemistich1: 'خداوندِ نام و خداوندِ جای',
        hemistich2: 'خداوندِ روزی‌دهِ رهنمای',
        persianMeaning:
          'پروردگارِ دارندهٔ نام‌های بلند و جایگاه ارجمند، خداوندی که روزی‌بخش و هدایتگر آفریدگان است.',
      },
      {
        id: '4001-2',
        index: 3,
        hemistich1: 'توانا بود هر که دانا بود',
        hemistich2: 'ز دانش دلِ پیر برنا بود',
        persianMeaning:
          'هر کس که به زیور دانایی آراسته باشد توانمند است؛ چرا که دانش، دلِ سالخورده را نیز جوان و سرزنده می‌دارد.',
      },
      {
        id: '4001-3',
        index: 4,
        hemistich1: 'کنون ای خردمند ارجِ خرد',
        hemistich2: 'بدین جایگه گفتن اندرخورد',
        persianMeaning:
          'اکنون ای انسان خردمند، شایسته است که در این مقام از ارزش و والاییِ خرد سخن بگوییم.',
      },
    ],
  },
  {
    id: 6001,
    title: 'غزل شمارهٔ ۱۶۴ — نفس باد صبا مشک‌فشان خواهد شد',
    fullTitle: 'حافظ » غزلیات » غزل شمارهٔ ۱۶۴',
    fullUrl: '/hafez/ghazal/sh164',
    categoryTitle: 'غزلیات',
    categoryFullUrl: '/hafez/ghazal',
    breadcrumbs: [
      { title: 'حافظ', fullUrl: '/hafez' },
      { title: 'غزلیات', fullUrl: '/hafez/ghazal' },
    ],
    poetId: 2,
    poetName: 'حافظ شیرازی',
    poetFullUrl: '/hafez',
    eraTitle: 'سدهٔ هشتم هجری · غزل بهاریه',
    persianForm: 'غزل',
    persianTheme: 'طبیعت و بهاریه',
    meter: 'فعلاتن فعلاتن فعلاتن فعلن (رمل مثمن مخبون محذوف)',
    poemSummary:
      'یکی از لطیف‌ترین غزل‌های بهاری زبان فارسی که نوید پایان زمستان، شکفتن ارغوان و نرگس، و تبدیل شدن اندوه به شادی را در نسیم صبحگاهی می‌دهد.',
    nextPoem: {
      id: 6002,
      title: 'غزل شمارهٔ ۱۶۵',
      urlSlug: 'sh165',
      fullUrl: '/hafez/ghazal/sh165',
      excerpt: 'مژده ای دل که دگر باد صبا بازآمد',
    },
    previousPoem: null,
    recitations: [],
    couplets: [
      {
        id: '6001-0',
        index: 1,
        hemistich1: 'نفسِ بادِ صبا مشک‌فشان خواهد شد',
        hemistich2: 'عالمِ پیر دگرباره جوان خواهد شد',
        persianMeaning:
          'دمِ جانبخشِ بادِ صبا به زودی عطرآگین خواهد شد و این جهانِ کهنسال بار دیگر جوانی و طراوت خود را بازخواهد یافت.',
      },
      {
        id: '6001-1',
        index: 2,
        hemistich1: 'ارغوان جامِ عقیقی به سمن خواهد داد',
        hemistich2: 'چشمِ نرگس به شقایق نگران خواهد شد',
        persianMeaning:
          'درخت ارغوان شکوفه‌های سرخِ عقیق‌گون خود را به یاسمن هدیه می‌دهد و گل نرگس با شوق به لاله‌های شقایق خواهد نگریست.',
      },
      {
        id: '6001-2',
        index: 3,
        hemistich1: 'ای دل ار سیلِ فنا بنیادِ هستی برکند',
        hemistich2: 'چون تو را نوح است کشتیبان ز طوفان غم مخور',
        persianMeaning:
          'ای دل، حتی اگر سیلِ نیستی بنیانِ جهان را بلرزاند، تا هنگامی که راهنمایی چون نوح کشتیبان توست از هجوم طوفان هراس مدار.',
      },
    ],
  },
];

export const DEFAULT_READING_LISTS: ReadingList[] = [
  {
    id: 'list-mystic',
    name: 'خلوت شبانه و عرفان',
    subtitle: 'ابیات برگزیده برای تامل و آرامش دل',
    description: 'مجموعه‌ای از غزل‌ها و تک‌بیت‌های عرفانی حافظ و مولانا برای خوانش در سکوت شب.',
    items: [
      {
        id: 'seed-bm-1',
        type: 'couplet',
        poemId: 2151,
        poemFullUrl: '/hafez/ghazal/sh22',
        poemTitle: 'غزل شمارهٔ ۲۲ — سخن اهل دل',
        poetName: 'حافظ شیرازی',
        coupletIndex: 3,
        hemistich1: 'در اندرونِ منِ خسته‌دل ندانم کیست',
        hemistich2: 'که من خموشم و او در فغان و در غوغاست',
        personalNote: 'تضاد شگفت‌انگیز میان سکوت ظاهری و غوغای درونی سالک.',
        addedAt: '۱۴۰۵/۰۸/۰۹',
      },
      {
        id: 'seed-bm-2',
        type: 'couplet',
        poemId: 5001,
        poemFullUrl: '/moulavi/masnavi/daftar1/sh1',
        poemTitle: 'نی‌نامه — سرآغاز مثنوی معنوی',
        poetName: 'مولانا جلال‌الدین بلخی',
        coupletIndex: 4,
        hemistich1: 'هر کسی کو دور ماند از اصلِ خویش',
        hemistich2: 'باز جوید روزگارِ وصلِ خویش',
        personalNote: 'بیت کلیدی نی‌نامه درباره بازگشت انسان به خاستگاه روحانی.',
        addedAt: '۱۴۰۵/۰۸/۰۹',
      },
    ],
  },
  {
    id: 'list-khayyam',
    name: 'حکمت و دم‌غنیمت‌شماری',
    subtitle: 'رباعیات فلسفی و پندهای روزگار',
    description: 'اشعار و رباعیاتی درباره گذر شتابان عمر و ارزش لحظه اکنون.',
    items: [
      {
        id: 'seed-bm-3',
        type: 'couplet',
        poemId: 3012,
        poemFullUrl: '/khayyam/robaee/sh42',
        poemTitle: 'رباعی شمارهٔ ۴۲ — قافله عمر',
        poetName: 'حکیم عمر خیام',
        coupletIndex: 1,
        hemistich1: 'این قافلهٔ عمر عجب می‌گذرد',
        hemistich2: 'دریاب دمی که با طرب می‌گذرد',
        personalNote: 'یادآوری غنیمت شمردن دم و رهایی از اندوه فردای نیامده.',
        addedAt: '۱۴۰۵/۰۸/۰۹',
      },
    ],
  },
];

const PERSIAN_DIACRITICS_REGEX = /[\u064B-\u065F\u0670]/g;

/**
 * Strips Arabic/Persian vowel diacritics (harakat) when the user prefers clean unvocalized script.
 */
export function formatPersianVerseText(text: string, showDiacritics: boolean): string {
  if (!text) return '';
  if (showDiacritics) return text.trim();
  return text.replace(PERSIAN_DIACRITICS_REGEX, '').trim();
}

/**
 * Groups flat Ganjoor API verses into structured dual-hemistich couplets (Bayts).
 */
export function groupVersesIntoCouplets(
  verses: GanjoorRawVerse[],
  poemId: number | string = 'live'
): Couplet[] {
  if (!Array.isArray(verses) || verses.length === 0) {
    return [];
  }

  const byCoupletIndex = new Map<number, GanjoorRawVerse[]>();
  let fallbackIndex = 0;

  for (const v of verses) {
    if (v.versePosition === -1) continue;
    const cIdx =
      typeof v.coupletIndex === 'number' && v.coupletIndex >= 0 ? v.coupletIndex : fallbackIndex++;
    const existing = byCoupletIndex.get(cIdx) || [];
    existing.push(v);
    byCoupletIndex.set(cIdx, existing);
  }

  const result: Couplet[] = [];
  const sortedKeys = Array.from(byCoupletIndex.keys()).sort((a, b) => a - b);

  sortedKeys.forEach((key, idx) => {
    const group = byCoupletIndex.get(key) || [];
    group.sort((a, b) => a.vOrder - b.vOrder);

    const first = group[0]?.text?.trim() || '';
    const second = group[1]?.text?.trim() || '';
    const summary =
      group.find((g) => g.coupletSummary && g.coupletSummary.trim().length > 0)?.coupletSummary?.trim() ||
      undefined;

    if (first || second) {
      result.push({
        id: `${poemId}-${idx}`,
        index: idx + 1,
        hemistich1: first,
        hemistich2: second,
        persianMeaning: summary,
        isSingleLine: !second,
      });
    }
  });

  return result;
}

/**
 * Infers a Persian theme from poem title and verses.
 */
export function inferPersianTheme(textAndTitle: string): Exclude<PoemTheme, 'all'> {
  if (textAndTitle.includes('بهار') || textAndTitle.includes('صبا') || textAndTitle.includes('نوروز') || textAndTitle.includes('گل')) {
    return 'طبیعت و بهاریه';
  }
  if (textAndTitle.includes('شاهنامه') || textAndTitle.includes('خرد') || textAndTitle.includes('رستم') || textAndTitle.includes('سپاه')) {
    return 'حماسه و خرد';
  }
  if (textAndTitle.includes('خیام') || textAndTitle.includes('عمر') || textAndTitle.includes('کوزه') || textAndTitle.includes('پیاله')) {
    return 'گذر عمر و دم‌غنیمت‌شماری';
  }
  if (textAndTitle.includes('بنی‌آدم') || textAndTitle.includes('گلستان') || textAndTitle.includes('بوستان') || textAndTitle.includes('پند')) {
    return 'حکمت و اخلاق انسانی';
  }
  if (textAndTitle.includes('وصل') || textAndTitle.includes('فراق') || textAndTitle.includes('زلف') || textAndTitle.includes('رخ')) {
    return 'شوق وصال و دلدادگی';
  }
  return 'عرفان و اهل دل';
}

/**
 * Converts a live Ganjoor API poem payload into our normalized PoemRecord format.
 */
export function normalizeGanjoorApiPoem(raw: Record<string, any>): PoemRecord {
  const id = Number(raw.id) || 2151;
  const fullTitle = String(raw.fullTitle || raw.title || 'شعر گنجور');
  const titleParts = fullTitle.split('»').map((s) => s.trim());
  const persianPoetName = raw.category?.poet?.nickname || raw.category?.poet?.name || titleParts[0] || 'شاعر پارسی‌گوی';
  const poetFullUrl =
    raw.category?.poet?.fullUrl ||
    (raw.fullUrl ? '/' + String(raw.fullUrl).split('/').filter(Boolean)[0] : '/hafez');

  const categoryFullUrl =
    raw.category?.cat?.fullUrl ||
    (raw.fullUrl
      ? '/' + String(raw.fullUrl).split('/').filter(Boolean).slice(0, -1).join('/')
      : poetFullUrl);
  const categoryTitle =
    raw.category?.cat?.title || titleParts[titleParts.length - 2] || 'دیوان اشعار';

  const ancestors: GanjoorBreadcrumb[] = Array.isArray(raw.category?.cat?.ancestors)
    ? raw.category.cat.ancestors.map((a: any) => ({
        title: String(a.title || ''),
        fullUrl: String(a.fullUrl || ''),
      }))
    : [];
  const breadcrumbs: GanjoorBreadcrumb[] = [
    ...ancestors,
    ...(raw.category?.cat?.title
      ? [{ title: String(raw.category.cat.title), fullUrl: categoryFullUrl }]
      : []),
  ];

  const verses: GanjoorRawVerse[] = Array.isArray(raw.verses) ? raw.verses : [];
  const couplets = groupVersesIntoCouplets(verses, id);

  const rawMeter =
    raw.sections?.[0]?.ganjoorMetre?.rhythm || 'وزن عروضی کلاسیک فارسی (ثبت‌شده در گنجور)';

  const recitations: RecitationTrack[] = Array.isArray(raw.recitations)
    ? raw.recitations
        .filter((r: any) => r && r.mp3Url)
        .slice(0, 4)
        .map((r: any) => ({
          id: Number(r.id) || 1,
          audioTitle: String(r.audioTitle || raw.title || 'خوانش صوتی'),
          audioArtist: String(r.audioArtist || 'خوانشگر گنجور'),
          mp3Url: String(r.mp3Url),
        }))
    : [];

  const isRubai = fullTitle.includes('رباعی') || couplets.length === 2;
  const isMasnavi =
    fullTitle.includes('مثنوی') || fullTitle.includes('شاهنامه') || fullTitle.includes('گلستان');
  const isQasida = fullTitle.includes('قصیده') || fullTitle.includes('قصاید');
  const persianForm = isRubai ? 'رباعی' : isMasnavi ? 'مثنوی' : isQasida ? 'قصیده' : 'غزل';

  const nextPoem: AdjacentPoemLink | null = raw.next
    ? {
        id: Number(raw.next.id) || 0,
        title: String(raw.next.title || 'شعر بعدی'),
        urlSlug: String(raw.next.urlSlug || ''),
        fullUrl: raw.next.fullUrl
          ? String(raw.next.fullUrl)
          : `${categoryFullUrl}/${raw.next.urlSlug}`,
        excerpt: String(raw.next.excerpt || ''),
      }
    : null;

  const previousPoem: AdjacentPoemLink | null = raw.previous
    ? {
        id: Number(raw.previous.id) || 0,
        title: String(raw.previous.title || 'شعر قبلی'),
        urlSlug: String(raw.previous.urlSlug || ''),
        fullUrl: raw.previous.fullUrl
          ? String(raw.previous.fullUrl)
          : `${categoryFullUrl}/${raw.previous.urlSlug}`,
        excerpt: String(raw.previous.excerpt || ''),
      }
    : null;

  const firstText = couplets[0] ? `${couplets[0].hemistich1} ${couplets[0].hemistich2}` : '';
  const persianTheme = inferPersianTheme(`${fullTitle} ${firstText}`);

  return {
    id,
    title:
      couplets[0]?.hemistich1 && !String(raw.title || '').includes('—')
        ? `${raw.title || 'شعر'} — ${couplets[0].hemistich1}`
        : String(raw.title || fullTitle),
    fullTitle,
    fullUrl: String(raw.fullUrl || `${categoryFullUrl}/${raw.urlSlug || ''}`),
    categoryTitle,
    categoryFullUrl,
    breadcrumbs:
      breadcrumbs.length > 0
        ? breadcrumbs
        : [{ title: persianPoetName, fullUrl: poetFullUrl }],
    poetId: Number(raw.category?.poet?.id) || 2,
    poetName: persianPoetName,
    poetFullUrl,
    eraTitle: 'گنجینه ادب فارسی · پایگاه گنجور',
    persianForm,
    persianTheme,
    meter: String(rawMeter),
    poemSummary:
      raw.poemSummary && String(raw.poemSummary).trim().length > 0
        ? String(raw.poemSummary).replace(/^هوش مصنوعی:\s*/i, '')
        : 'این سروده به صورت مستقیم از پایگاه دادهٔ آنلاین گنجور (api.ganjoor.net) دریافت شده است.',
    couplets,
    recitations,
    nextPoem,
    previousPoem,
  };
}

/**
 * Filters poems by poet, Persian theme, and Persian search query.
 */
export function filterPoems(
  poems: PoemRecord[],
  filters: {
    poetNameOrUrl?: string | 'all';
    theme?: PoemTheme;
    query?: string;
  }
): PoemRecord[] {
  const { poetNameOrUrl = 'all', theme = 'all', query = '' } = filters;
  const cleanQuery = formatPersianVerseText(query.trim().toLowerCase(), false);

  return poems.filter((poem) => {
    if (
      poetNameOrUrl !== 'all' &&
      poem.poetFullUrl !== poetNameOrUrl &&
      !poem.poetName.includes(poetNameOrUrl)
    ) {
      return false;
    }
    if (theme !== 'all' && poem.persianTheme !== theme) {
      return false;
    }
    if (!cleanQuery) {
      return true;
    }

    const searchableFields = [
      poem.title,
      poem.fullTitle,
      poem.poetName,
      poem.persianTheme,
      poem.poemSummary,
      ...poem.couplets.flatMap((c) => [c.hemistich1, c.hemistich2, c.persianMeaning || '']),
    ]
      .map((field) => formatPersianVerseText(field.toLowerCase(), false))
      .join(' ');

    return searchableFields.includes(cleanQuery);
  });
}

/**
 * Filters the list of all Ganjoor poets by search query and pinned/featured filter.
 */
export function filterPoetsList(
  poets: GanjoorPoetSummary[],
  query: string,
  onlyPinned: boolean
): GanjoorPoetSummary[] {
  const q = query.trim().toLowerCase();
  const filtered = poets.filter((p) => {
    if (onlyPinned && (!p.pinOrder || p.pinOrder <= 0)) {
      return false;
    }
    if (!q) return true;
    const haystack = `${p.name} ${p.nickname || ''} ${p.birthPlace || ''} ${p.deathPlace || ''}`.toLowerCase();
    return haystack.includes(q);
  });

  return filtered.sort((a, b) => {
    const aPin = a.pinOrder && a.pinOrder > 0 ? a.pinOrder : 9999;
    const bPin = b.pinOrder && b.pinOrder > 0 ? b.pinOrder : 9999;
    if (aPin !== bPin) return aPin - bPin;
    return a.name.localeCompare(b.name, 'fa');
  });
}

/**
 * Computes CSS typographic geometry for the reading canvas from user comfort settings.
 */
export function computeTypographyStyles(settings: TypographySettings): {
  fontFamilyCss: string;
  fontSizePx: number;
  lineHeight: number;
  coupletGapRem: number;
} {
  const clampedSize = Math.min(36, Math.max(16, Math.round(settings.fontSize)));
  const fontOption =
    PERSIAN_FONT_OPTIONS.find((f) => f.id === settings.fontFamily) || PERSIAN_FONT_OPTIONS[0];

  const isNastaliq = settings.fontFamily === 'nastaliq';

  let lineHeight = 1.95;
  let coupletGapRem = 1.5;

  if (settings.lineSpacing === 'compact') {
    lineHeight = isNastaliq ? 2.15 : 1.7;
    coupletGapRem = 1.1;
  } else if (settings.lineSpacing === 'relaxed') {
    lineHeight = isNastaliq ? 2.5 : 2.0;
    coupletGapRem = 1.65;
  } else if (settings.lineSpacing === 'spacious') {
    lineHeight = isNastaliq ? 2.9 : 2.4;
    coupletGapRem = 2.25;
  }

  return {
    fontFamilyCss: fontOption.cssVariable,
    fontSizePx: clampedSize,
    lineHeight,
    coupletGapRem,
  };
}

/**
 * Adds or toggles a bookmark item inside a named ReadingList immutably.
 */
export function toggleItemInReadingList(
  lists: ReadingList[],
  listId: string,
  item: SavedBookmarkItem
): { lists: ReadingList[]; action: 'added' | 'removed' } {
  let action: 'added' | 'removed' = 'added';

  const updated = lists.map((list) => {
    if (list.id !== listId) return list;
    const exists = list.items.some(
      (existing) =>
        existing.poemId === item.poemId &&
        existing.type === item.type &&
        existing.coupletIndex === item.coupletIndex
    );

    if (exists) {
      action = 'removed';
      return {
        ...list,
        items: list.items.filter(
          (existing) =>
            !(
              existing.poemId === item.poemId &&
              existing.type === item.type &&
              existing.coupletIndex === item.coupletIndex
            )
        ),
      };
    }

    action = 'added';
    return {
      ...list,
      items: [item, ...list.items],
    };
  });

  return { lists: updated, action };
}
