import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Bus, Store, Gavel, Newspaper, MessagesSquare, Map, Ticket, Briefcase, Compass, CalendarDays,
  CloudSun, Building2, BellRing, Cross, HeartHandshake, ChevronDown, Menu, X, ArrowRight, Mail,
  MapPin, ShieldCheck, Smartphone, UserRound, Sparkles, Check, Code,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, type ReactNode } from 'react';
import { OG_IMAGE, Seo, SITE_URL } from '../components/Seo';

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim';
const APP_STORE_URL = 'https://apps.apple.com/tr/app/seydi-rehber/id6762803524';
const CONTACT_EMAIL = 'seydirehber@gmail.com';

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

const NAV = [
  { href: '#hizmetler', label: 'Hizmetler' },
  { href: '#kesfet', label: 'Keşfet' },
  { href: '#isletmeler', label: 'İşletmeler' },
  { href: '#sss', label: 'S.S.S.' },
];

// Uygulamadaki gerçek hizmetler (Ana Sayfa ve Hizmetler ızgarası)
const SERVICES: { icon: ReactNode; title: string; desc: string; tint: string; badge?: string }[] = [
  { icon: <Cross />, title: 'Nöbetçi Eczane', desc: 'Seydişehir’de bugün nöbetçi olan eczaneler, telefon ve harita konumuyla.', tint: 'bg-red-50 text-red-600' },
  { icon: <Bus />, title: 'Otobüs Saatleri', desc: 'Seydişehir otobüs güzergahlarının sefer saatleri ve sıradaki otobüs.', tint: 'bg-teal-50 text-teal-600' },
  { icon: <Store />, title: 'Halk Pazarları', desc: 'Seydişehir halk pazarları hangi gün, nerede kuruluyor.', tint: 'bg-amber-50 text-amber-600' },
  { icon: <Gavel />, title: 'Noterler', desc: 'Seydişehir noterlerinin adres ve telefon bilgileri.', tint: 'bg-slate-100 text-slate-700' },
  { icon: <HeartHandshake />, title: 'Vefat İlanları', desc: 'Seydişehir Belediyesi vefat ilanları, isterseniz bildirimle.', tint: 'bg-slate-100 text-slate-600' },
  { icon: <Map />, title: 'Seydi Harita', desc: 'Firmalar, gezilecek yerler ve etkinlikler tek haritada.', tint: 'bg-emerald-50 text-emerald-600' },
  { icon: <Newspaper />, title: 'Yerel Haberler', desc: 'Seydişehir haberleri tek akışta.', tint: 'bg-green-50 text-green-700' },
  { icon: <MessagesSquare />, title: 'Forum', desc: 'Soru sorun, öneri paylaşın, şehirle konuşun.', tint: 'bg-violet-50 text-violet-600' },
  { icon: <Ticket />, title: 'Fırsat Kuponları', desc: 'Yerel esnaftan uygulamaya özel indirimler.', tint: 'bg-pink-50 text-pink-600' },
  { icon: <Briefcase />, title: 'İş İlanları', desc: 'Seydişehir’deki işverenlerden güncel ilanlar.', tint: 'bg-orange-50 text-orange-700', badge: 'Yeni' },
  { icon: <Building2 />, title: 'Firma Rehberi', desc: 'İşletmelerin iletişim bilgileri, yorumlar ve puanlar.', tint: 'bg-blue-50 text-blue-600' },
  { icon: <CalendarDays />, title: 'Etkinlikler', desc: 'Konser, festival ve şehirdeki diğer etkinlikler.', tint: 'bg-rose-50 text-rose-600' },
  { icon: <Compass />, title: 'Gezilecek Yerler', desc: 'Kuğulu Park’tan Tınaztepe Mağarası’na rehber.', tint: 'bg-cyan-50 text-cyan-700' },
  { icon: <CloudSun />, title: 'Hava Durumu', desc: 'Seydişehir için güncel hava durumu.', tint: 'bg-sky-50 text-sky-600' },
];

const FAQS = [
  {
    q: 'Seydi Rehber ücretli mi?',
    a: 'Hayır. Uygulama tamamen ücretsizdir; tüm hizmetlere ücret ödemeden ulaşabilirsiniz.',
  },
  {
    q: 'Kullanmak için üye olmam gerekiyor mu?',
    a: 'Gerekmiyor. Misafir olarak devam edip tüm bilgilere ulaşabilirsiniz. Foruma yazmak, yorum yapmak veya kupon kullanmak için Google ya da Apple hesabınızla giriş yapmanız yeterli.',
  },
  {
    q: 'Bildirimleri nasıl yönetirim?',
    a: 'Ayarlar ekranından genel duyuruları, günlük hatırlatmaları ve vefat ilanı bildirimlerini ayrı ayrı açıp kapatabilirsiniz.',
  },
  {
    q: 'İşletmemi uygulamaya nasıl ekletebilirim?',
    a: `Bize ${CONTACT_EMAIL} adresinden ulaşın. İşletmenizi rehbere ekleyelim; isterseniz kupon kampanyaları ve iş ilanları için de birlikte çalışalım.`,
  },
  {
    q: 'Kişisel verilerim nasıl kullanılıyor?',
    a: 'Verilerin nasıl işlendiğini Gizlilik ve KVKK metinlerimizde açıkça anlattık. Hesabınızı istediğiniz an uygulama içinden silebilirsiniz.',
  },
];

// --- SEO ---------------------------------------------------------------------------------
const PAGE_TITLE = 'Seydi Rehber — Seydişehir Nöbetçi Eczane, Otobüs Saatleri, Pazarlar ve Haberler';
const PAGE_DESCRIPTION =
  'Seydişehir’in şehir rehberi uygulaması: bugün nöbetçi eczane, otobüs saatleri, halk pazarı günleri, vefat ilanları, yerel haberler, iş ilanları ve esnaf kuponları. iOS ve Android’de ücretsiz.';

const SEYDISEHIR = {
  '@type': 'City',
  name: 'Seydişehir',
  geo: { '@type': 'GeoCoordinates', latitude: 37.418, longitude: 31.846 },
  containedInPlace: { '@type': 'AdministrativeArea', name: 'Konya', containedInPlace: { '@type': 'Country', name: 'Türkiye' } },
};

const STRUCTURED_DATA: object[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Seydi Rehber',
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    email: CONTACT_EMAIL,
    areaServed: SEYDISEHIR,
    sameAs: [APP_STORE_URL, PLAY_URL],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Seydi Rehber',
    alternateName: ['Seydişehir Rehberi', 'SeydiRehber'],
    url: `${SITE_URL}/`,
    inLanguage: 'tr-TR',
    publisher: { '@id': `${SITE_URL}/#organization` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Seydi Rehber',
    description: PAGE_DESCRIPTION,
    operatingSystem: 'iOS, Android',
    applicationCategory: 'TravelApplication',
    inLanguage: 'tr',
    image: OG_IMAGE,
    screenshot: [`${SITE_URL}/screens/home-services.jpg`, `${SITE_URL}/screens/home-places.jpg`],
    installUrl: [APP_STORE_URL, PLAY_URL],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
    areaServed: SEYDISEHIR,
    publisher: { '@id': `${SITE_URL}/#organization` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  },
];

function StoreButtons({ dark = false }: { dark?: boolean }) {
  const base =
    'flex items-center gap-3 rounded-2xl px-5 py-3 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500';
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${dark ? 'bg-white text-slate-900 hover:shadow-xl' : 'bg-slate-900 text-white hover:shadow-xl hover:shadow-slate-900/20'}`}>
        <svg viewBox="0 0 384 512" className="w-6 h-6 fill-current" aria-hidden>
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
        <span className="text-left leading-tight">
          <span className="block text-[11px] opacity-70">İndirin</span>
          <span className="block font-semibold">App Store</span>
        </span>
      </a>
      <a
        href={PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${dark ? 'bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20' : 'bg-white text-slate-900 ring-1 ring-slate-200 hover:ring-slate-300 hover:shadow-lg'}`}>
        <svg viewBox="0 0 512 512" className="w-6 h-6 fill-current" aria-hidden>
          <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-10.3 18-28.5-1.2-36.3zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
        </svg>
        <span className="text-left leading-tight">
          <span className="block text-[11px] opacity-70">Alın</span>
          <span className="block font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  );
}

/** Telefon çerçevesi. Konum/döndürme `className` ile dış kutuya verilir; çerçeve içeride kendi konumunu tutar. */
function Phone({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={className}>
      <div className="relative w-[250px] sm:w-[280px] aspect-[9/19] rounded-[2.6rem] bg-slate-900 p-2.5 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/10">
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-slate-900 z-10" />
        <div className="w-full h-full rounded-[2.1rem] overflow-hidden bg-[#F5F9F6]">
          <img src={src} alt={alt} className="w-full h-full object-cover object-top pt-7" loading="lazy" />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, desc, center = false }: { eyebrow: string; title: ReactNode; desc?: string; center?: boolean }) {
  return (
    <div className={center ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'}>
      <p className="text-sm font-semibold text-emerald-600 tracking-wide uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">{title}</h2>
      {desc && <p className="mt-4 text-lg text-slate-600 leading-relaxed">{desc}</p>}
    </div>
  );
}

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased overflow-x-hidden" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
      <Seo title={PAGE_TITLE} description={PAGE_DESCRIPTION} path="/" jsonLd={STRUCTURED_DATA} />
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Üst menü */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.06)]' : 'bg-transparent'}`}>
        <nav className="max-w-6xl mx-auto px-5 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5" aria-label="Seydi Rehber ana sayfa">
            <img src="/icon.png" alt="" className="w-9 h-9 rounded-xl shadow-sm" />
            <span className="text-lg font-bold text-slate-900">
              Seydi <span className="text-emerald-600">Rehber</span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-emerald-600 transition-colors">
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#indir"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
              Uygulamayı İndir
            </a>
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="md:hidden mx-4 mb-3 rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 p-3">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                  {item.label}
                </a>
              ))}
              <a
                href="#indir"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-xl bg-emerald-600 px-4 py-3 text-center font-semibold text-white">
                Uygulamayı İndir
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="top">
        {/* Giriş */}
        <section className="relative pt-28 sm:pt-36 pb-20 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(76,175,80,0.14),transparent_70%),radial-gradient(40%_40%_at_10%_80%,rgba(33,150,243,0.07),transparent_70%)]" />
          <div className="absolute inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

          <div className="max-w-6xl mx-auto px-5 sm:px-6 [display:grid] lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-8 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p
                variants={reveal}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100 shadow-sm">
                <MapPin className="w-4 h-4" /> Seydişehir, Konya
              </motion.p>
              <motion.h1
                variants={reveal}
                className="mt-6 text-[2.6rem] leading-[1.1] sm:text-6xl font-bold tracking-tight text-slate-900">
                Seydişehir
                <br />
                <span className="text-emerald-600">cebinizde.</span>
              </motion.h1>
              <motion.p variants={reveal} className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
                Nöbetçi eczane, otobüs saatleri, halk pazarları, vefat ilanları, yerel haberler ve esnaf
                fırsatları. Şehrin günlük ihtiyaçları tek bir uygulamada.
              </motion.p>
              <motion.div variants={reveal} className="mt-9">
                <StoreButtons />
              </motion.div>
              <motion.ul variants={reveal} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                {['Tamamen ücretsiz', 'Üye olmadan kullanılabilir', 'iOS ve Android'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-[300px] sm:max-w-[480px] h-[560px] sm:h-[620px]">
              {/* Arkadaki telefon sadece geniş ekranda; öndeki sağda */}
              <Phone src="/screens/home-places.jpg" alt="" className="hidden sm:block absolute left-0 top-16 scale-[0.88] -rotate-6" />
              <Phone
                src="/screens/home-services.jpg"
                alt="Seydi Rehber uygulamasında Hizmetler ekranı"
                className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 top-0 rotate-2"
              />

              <div className="absolute -left-3 sm:left-2 bottom-10 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-xl ring-1 ring-slate-100 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600">
                  <Cross className="w-5 h-5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-slate-900">Nöbetçi eczane</span>
                  <span className="block text-xs text-slate-500">Her gün güncel</span>
                </span>
              </div>
              <div className="absolute -right-3 sm:-right-6 top-24 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-xl ring-1 ring-slate-100 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600">
                  <BellRing className="w-5 h-5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-slate-900">Anında bildirim</span>
                  <span className="block text-xs text-slate-500">Duyuru ve vefat ilanları</span>
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Hizmetler */}
        <section id="hizmetler" className="py-20 lg:py-28 bg-[#F5F9F6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <SectionHeading
              center
              eyebrow="Hizmetler"
              title="Şehirde lazım olan her şey, tek yerde"
              desc="Eczaneden otobüse, pazardan iş ilanına kadar Seydişehir’e özel bilgiler; düzenli olarak güncellenir."
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="mt-14 [display:grid] grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {SERVICES.map((s) => (
                <motion.div
                  key={s.title}
                  variants={reveal}
                  className="group relative rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_30px_-12px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 ${s.tint}`}>{s.icon}</div>
                  <h3 className="mt-3 sm:mt-4 text-[15px] sm:text-base font-semibold text-slate-900 flex flex-wrap items-center gap-x-2 gap-y-1">
                    {s.title}
                    {s.badge && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        {s.badge}
                      </span>
                    )}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Keşfet */}
        <section id="kesfet" className="py-20 lg:py-28 scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 [display:grid] lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 lg:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-50" />
                <Phone src="/screens/home-places.jpg" alt="Gezilecek yerler: Kuğulu Park ve Tınaztepe Mağarası" />
              </div>
            </motion.div>
            <div className="order-1 lg:order-2">
              <SectionHeading
                eyebrow="Keşfet"
                title={
                  <>
                    Seydişehir’i
                    <br /> yeniden keşfedin
                  </>
                }
                desc="Kuğulu Park’tan Tınaztepe Mağarası’na gezilecek yerler, şehirdeki etkinlikler ve yerel işletmeler; hepsi fotoğraflı, adresli ve haritada."
              />
              <ul className="mt-8 space-y-4">
                {[
                  { icon: <Map className="w-5 h-5" />, title: 'Seydi Harita', text: 'Firmalar, yerler, noterler ve pazarlar tek haritada; yakınınızdakileri görün.' },
                  { icon: <Building2 className="w-5 h-5" />, title: 'Firma rehberi', text: 'İletişim bilgileri, yorumlar ve puanlarla doğru işletmeyi seçin.' },
                  { icon: <Sparkles className="w-5 h-5" />, title: 'Favoriler', text: 'Sevdiğiniz yerleri kaydedin, tek dokunuşla geri dönün.' },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <span className="flex items-center justify-center shrink-0 w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600">{item.icon}</span>
                    <span>
                      <span className="block font-semibold text-slate-900">{item.title}</span>
                      <span className="block text-slate-600 leading-relaxed">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Haberdar kalın */}
        <section className="py-20 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_0%,rgba(76,175,80,0.25),transparent_70%)]" />
          <div className="relative max-w-6xl mx-auto px-5 sm:px-6 [display:grid] lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-emerald-400 tracking-wide uppercase">Bildirimler</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">Önemli olan hiçbir şeyi kaçırmayın</h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                Şehir duyuruları ve vefat ilanları telefonunuza bildirim olarak gelir. Hangi bildirimleri almak
                istediğinize siz karar verirsiniz.
              </p>
            </div>
            <div className="space-y-3 max-w-md lg:ml-auto w-full">
              {[
                { icon: <BellRing className="w-5 h-5" />, title: 'Duyurular', text: 'Şehirle ilgili önemli gelişmeler ve uygulama duyuruları.' },
                { icon: <HeartHandshake className="w-5 h-5" />, title: 'Vefat ilanları', text: 'Belediyenin yayımladığı yeni vefat ilanları.' },
                { icon: <CalendarDays className="w-5 h-5" />, title: 'Haftalık hatırlatmalar', text: 'Haftada birkaç kez pazar yerleri, kuponlar ve popüler mekanlar için kısa öneriler.' },
              ].map((n) => (
                <div key={n.title} className="flex gap-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 backdrop-blur">
                  <span className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400">{n.icon}</span>
                  <span>
                    <span className="block font-semibold">{n.title}</span>
                    <span className="block text-sm text-slate-300">{n.text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* İşletmeler */}
        <section id="isletmeler" className="py-20 lg:py-28 scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-emerald-50 to-[#F5F9F6] ring-1 ring-emerald-100 p-8 sm:p-12 [display:grid] lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
              <div>
                <SectionHeading
                  eyebrow="İşletmeler için"
                  title="İşletmenizi Seydişehir’in cebine taşıyın"
                  desc="Seydi Rehber’de yer alın; müşterileriniz sizi haritada bulsun, iletişim bilgilerinize tek dokunuşla ulaşsın."
                />
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('İşletmemi Seydi Rehber’e eklemek istiyorum')}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors">
                    <Mail className="w-5 h-5" /> Bize Ulaşın
                  </a>
                  <Link
                    to="/esnaf"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-800 ring-1 ring-slate-200 hover:ring-slate-300 transition-colors">
                    Esnaf Girişi <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <ul className="[display:grid] gap-3">
                {[
                  { icon: <Building2 className="w-5 h-5" />, title: 'Firma profili', text: 'Fotoğraflar, adres, telefon, web sitesi ve Instagram.' },
                  { icon: <Ticket className="w-5 h-5" />, title: 'Kupon kampanyaları', text: 'Uygulamaya özel indirimler; kodlar esnaf panelinden doğrulanır.' },
                  { icon: <Briefcase className="w-5 h-5" />, title: 'İş ilanları', text: 'Eleman ihtiyacınızı şehrin dört bir yanına duyurun.' },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                    <span className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600">{item.icon}</span>
                    <span>
                      <span className="block font-semibold text-slate-900">{item.title}</span>
                      <span className="block text-sm text-slate-600">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* S.S.S. */}
        <section id="sss" className="py-20 lg:py-28 bg-[#F5F9F6] scroll-mt-16">
          <div className="max-w-3xl mx-auto px-5 sm:px-6">
            <SectionHeading center eyebrow="S.S.S." title="Sıkça sorulan sorular" />
            <div className="mt-12 space-y-3">
              {FAQS.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div key={faq.q} className={`rounded-2xl bg-white ring-1 transition-colors ${open ? 'ring-emerald-200' : 'ring-slate-100'}`}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                      <span className={`font-semibold ${open ? 'text-emerald-700' : 'text-slate-900'}`}>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180 text-emerald-600' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden">
                          <p className="px-6 pb-5 text-slate-600 leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* İndir */}
        <section id="indir" className="py-20 lg:py-28 scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#43A047] to-[#2E7D32] px-8 py-14 sm:px-14 sm:py-16 text-white">
              <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -left-16 -bottom-24 w-72 h-72 rounded-full bg-black/10 blur-2xl" />
              <div className="relative [display:grid] lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
                <div>
                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">Seydi Rehber’i hemen indirin</h2>
                  <p className="mt-4 text-lg text-emerald-50/90 max-w-lg">
                    Ücretsiz, hızlı ve Seydişehir’e özel. Telefonunuza kurun, şehir her an yanınızda olsun.
                  </p>
                  <div className="mt-8">
                    <StoreButtons dark />
                  </div>
                </div>
                <div className="hidden lg:flex justify-end gap-6 text-emerald-50">
                  {[
                    { icon: <Smartphone className="w-6 h-6" />, label: 'iOS ve Android' },
                    { icon: <UserRound className="w-6 h-6" />, label: 'Üyelik şart değil' },
                    { icon: <ShieldCheck className="w-6 h-6" />, label: 'Tamamen ücretsiz' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-3 text-center">
                      <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 ring-1 ring-white/20">{item.icon}</span>
                      <span className="text-sm font-medium w-24">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Alt bilgi */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14 [display:grid] gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/icon.png" alt="" className="w-9 h-9 rounded-xl" />
              <span className="text-lg font-bold">
                Seydi <span className="text-emerald-600">Rehber</span>
              </span>
            </div>
            <p className="mt-4 text-slate-600 max-w-sm leading-relaxed">Seydişehir için hazırlanmış ücretsiz şehir rehberi uygulaması.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Sayfalar</h3>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li><Link to="/about" className="hover:text-emerald-600">Hakkımızda</Link></li>
              <li><Link to="/politikalar" className="hover:text-emerald-600">Politikalar</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-600">Gizlilik Politikası</Link></li>
              <li><Link to="/kvkk" className="hover:text-emerald-600">KVKK Aydınlatma Metni</Link></li>
              <li><Link to="/esnaf" className="hover:text-emerald-600">Esnaf Girişi</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">İletişim</h3>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 hover:text-emerald-600">
                  <Mail className="w-4 h-4" /> {CONTACT_EMAIL}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Seydişehir, Konya
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Seydi Rehber. Tüm hakları saklıdır.</p>
            <p className="inline-flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-600" /> Geliştirici: <span className="font-semibold text-slate-700">MGVERSE Studio</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
