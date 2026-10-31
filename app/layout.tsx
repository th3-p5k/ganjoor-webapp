import type { Metadata } from 'next';
import {
  Vazirmatn,
  Amiri,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
  Lalezar,
} from 'next/font/google';
import './globals.css';
import { GanjoorProvider } from '@/components/GanjoorContext';
import AppShell from '@/components/HeaderNav';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-vazirmatn',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  variable: '--font-naskh',
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-nastaliq',
});

const lalezar = Lalezar({
  subsets: ['arabic', 'latin'],
  weight: ['400'],
  variable: '--font-lalezar',
});

export const metadata: Metadata = {
  title: 'دیوان گنجور — خوانشگاه اشعار و ادبیات کهن فارسی',
  description:
    'خوانشگاه جامع و چندصفحه‌ای شعر و ادب فارسی متصل به پایگاه داده گنجور (api.ganjoor.net) با امکان مرور همه شاعران، بخش‌ها و کتاب‌ها، انتخاب قلم‌های اصیل فارسی، تنظیم فاصله سطرها، حالت مطالعه شبانه و دفترهای شعر شخصی.',
  openGraph: {
    title: 'دیوان گنجور — خوانشگاه اشعار و ادبیات کهن فارسی',
    description:
      'خوانشگاه جامع شعر و ادب فارسی متصل به پایگاه داده گنجور با امکان مرور همه شاعران، بخش‌ها و کتاب‌ها، انتخاب قلم‌های اصیل فارسی و حالت مطالعه شبانه.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دیوان گنجور — خوانشگاه اشعار و ادبیات کهن فارسی',
    description:
      'خوانشگاه جامع شعر و ادب فارسی متصل به پایگاه داده گنجور با امکان مرور همه شاعران، بخش‌ها و کتاب‌ها، انتخاب قلم‌های اصیل فارسی و حالت مطالعه شبانه.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${amiri.variable} ${notoNaskh.variable} ${notoNastaliq.variable} ${lalezar.variable}`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#FBF9F5] text-stone-900 dark:bg-[#0D1017] dark:text-[#EAE5DC] transition-colors duration-200 selection:bg-[#9A3412]/20 dark:selection:bg-amber-500/25"
      >
        <GanjoorProvider>
          <AppShell>{children}</AppShell>
        </GanjoorProvider>
      </body>
    </html>
  );
}
