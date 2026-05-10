import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, ShieldCheck, MapPin,
  ArrowRight, Code, Ticket,
  Bus, Newspaper, Building2, Briefcase,
  ChevronDown, Menu, X, CheckCircle2, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
import ShaderBackground from '../components/ui/shader-background';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
      question: "SeydiRehber uygulamasını kullanmak ücretli mi?",
      answer: "Hayır, SeydiRehber kullanıcılar için tamamen ücretsizdir. Uygulama içerisindeki tüm özelliklere hiçbir ücret ödemeden erişebilirsiniz."
    },
    {
      question: "İşletme sahibiyim, firmamı rehbere nasıl ekleyebilirim?",
      answer: "Uygulama içerisindeki 'İşletme Ekle' bölümünden veya doğrudan bizimle iletişime geçerek firmanızı sisteme kaydedebilirsiniz. Kayıt işlemi çok kısa sürer."
    },
    {
      question: "Uygulamadaki bilgiler güncel mi?",
      answer: "Nöbetçi eczaneler, hava durumu ve otobüs saatleri gibi tüm dinamik bilgiler her gün otomatik olarak sistemlerimiz tarafından güncellenmektedir."
    },
    {
      question: "Kişisel verilerim güvende mi?",
      answer: "Kesinlikle. Modern güvenlik standartlarıyla korunan altyapımız sayesinde verileriniz güvendedir ve 3. taraflarla asla paylaşılmaz."
    }
  ];

  const features = [
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Nöbetçi Eczaneler", desc: "Acil durumlar için her gün güncellenen nöbetçi eczane listesi ve harita konumu.", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { icon: <Building2 className="w-6 h-6" />, title: "Firma Rehberi", desc: "Şehirdeki tüm işletmelerin adres, telefon ve çalışma saatleri gibi güncel bilgileri.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { icon: <Bus className="w-6 h-6" />, title: "Otobüs Saatleri", desc: "Şehir içi ve şehirlerarası tüm seferlerin en güncel hareket saatleri.", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { icon: <Newspaper className="w-6 h-6" />, title: "Yerel Haberler", desc: "Seydişehir'den en sıcak gelişmeler ve anlık haber akışı.", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { icon: <Briefcase className="w-6 h-6" />, title: "İş İlanları", desc: "Şehrin önde gelen firmalarından en güncel kariyer fırsatları.", badge: "Yeni", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { icon: <Ticket className="w-6 h-6" />, title: "Fırsat Kuponları", desc: "Yerel esnaflardan sadece uygulama kullanıcılarına özel indirimler.", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-hidden relative">
      <Helmet>
        <html lang="tr" />
        <title>Seydişehir Rehberi - Modern Şehir Asistanınız</title>
      </Helmet>

      <ShaderBackground />

      {/* Decorative Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-emerald-100/40 via-teal-50/20 to-transparent blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-blue-50/40 via-cyan-50/20 to-transparent blur-[120px] -z-10 pointer-events-none" />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`rounded-2xl flex justify-between items-center px-6 py-4 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20' : 'bg-transparent'}`}>
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="bg-emerald-500 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">SEYDİREHBER</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-slate-500">
              <a href="#features" className="hover:text-emerald-600 transition-colors">Özellikler</a>
              <a href="#stats" className="hover:text-emerald-600 transition-colors">Platform</a>
              <a href="#faq" className="hover:text-emerald-600 transition-colors">S.S.S.</a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#download"
                className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                Hemen İndir
              </a>

              <button
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-6 right-6 mt-2 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-2xl flex flex-col gap-2 text-center z-50"
            >
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="py-3 font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-xl transition-all">Özellikler</a>
              <a href="#stats" onClick={() => setIsMenuOpen(false)} className="py-3 font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-xl transition-all">Platform</a>
              <a href="#faq" onClick={() => setIsMenuOpen(false)} className="py-3 font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-xl transition-all">S.S.S.</a>
              <div className="h-px bg-slate-100 w-full my-2" />
              <a href="#download" onClick={() => setIsMenuOpen(false)} className="bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors">
                Uygulamayı İndir
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-[0_2px_10px_rgb(16,185,129,0.05)] mb-8"
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-emerald-700 tracking-wide">YENİ VERSİYON YAYINDA</span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-slate-900 leading-[1.05] max-w-4xl"
        >
          Şehrin <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Dijital</span> Kalbi.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="mt-8 text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed"
        >
          Nöbetçi eczaneler, güncel haberler, otobüs saatleri ve sana özel fırsatlar. Seydişehir'de aradığın her şey tek bir uygulamada.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#download"
            className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1 transition-all duration-300"
          >
            Hemen İndir
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm"
          >
            Özellikleri Keşfet
          </a>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="mt-20 pt-10 border-t border-slate-200/60 w-full max-w-4xl flex flex-col items-center"
        >
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">TEK UYGULAMADA İHTİYACINIZ OLAN HER ŞEY</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base text-slate-600 font-semibold">
            {["Nöbetçi Eczaneler", "Otobüs Saatleri", "Firma Rehberi", "Yerel Haberler", "Fırsat Kuponları", "İş İlanları"].map((tag, i) => (
              <span key={i} className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 hover:border-emerald-200 hover:text-emerald-700 transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 mb-6">İhtiyacınız Olan Her Şey.</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Günlük yaşantınızı kolaylaştıracak pürüzsüz deneyim. Modern arayüz ve akıllı özelliklerle şehrinizi yeniden keşfedin.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className={`group bg-white p-8 rounded-3xl border ${f.border} shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-40 transition-transform duration-500 ${f.bg} group-hover:scale-[2]`} />

                <div className={`${f.bg} ${f.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform duration-300 group-hover:scale-110`}>
                  {f.icon}
                  {f.badge && (
                    <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide shadow-md">
                      {f.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed relative z-10">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modern Stats Section */}
      <section id="stats" className="py-24 bg-emerald-50/50 relative overflow-hidden border-y border-emerald-100/50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tighter mb-6 leading-tight">
            Güvenilir Altyapı, <br />
            <span className="text-emerald-600">Kesintisiz Hizmet.</span>
          </h2>
          <p className="text-slate-600 text-lg font-medium leading-relaxed mb-12">
            Sadece bir uygulama değil, şehrin dijital ekosistemini inşa ediyoruz. Esnaflar ve kullanıcılar arasında güvenli bir bağ kuruyoruz.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {["Tamamen Ücretsiz Kullanım", "Modern ve Hızlı Arayüz", "Gelişmiş Veri Güvenliği", "7/24 Kesintisiz Erişim"].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex items-center gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <span className="text-slate-800 font-bold text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 mb-6">Her Şey Çok Basit.</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              SeydiRehber'i kullanmaya başlamak ve şehrin tüm dinamiklerine anında hakim olmak sadece saniyelerinizi alır.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-emerald-50 via-emerald-200 to-emerald-50" />

            {[
              {
                step: "01",
                title: "Uygulamayı İndirin",
                desc: "iOS veya Android cihazınıza SeydiRehber uygulamasını tamamen ücretsiz olarak indirin.",
                icon: <Smartphone className="w-8 h-8 text-emerald-600" />
              },
              {
                step: "02",
                title: "Kayıt Olmadan Başlayın",
                desc: "Üyelik veya giriş zorunluluğu olmadan otobüs saatleri ve nöbetçi eczanelere anında erişin.",
                icon: <Sparkles className="w-8 h-8 text-emerald-600" />
              },
              {
                step: "03",
                title: "Şehri Keşfedin",
                desc: "Haberleri okuyun, esnaf fırsatlarını yakalayın ve ihtiyacınız olan tüm bilgilere tek tıkla ulaşın.",
                icon: <MapPin className="w-8 h-8 text-emerald-600" />
              }
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-white border-[6px] border-emerald-50 shadow-xl shadow-emerald-100/50 flex items-center justify-center relative z-10 mb-8 group-hover:scale-110 group-hover:border-emerald-100 transition-all duration-300">
                  {item.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 mb-6">Sıkça Sorulan Sorular</h2>
            <p className="text-lg text-slate-500 font-medium">Merak ettiklerinizi sizin için derledik.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={false}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === i ? 'bg-white border-emerald-200 shadow-[0_8px_30px_rgb(16,185,129,0.08)]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex justify-between items-center text-left"
                >
                  <h3 className={`text-lg font-bold pr-8 transition-colors ${openFaq === i ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === i ? 'bg-emerald-100 text-emerald-600 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-6 text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Download Section */}
      <section id="download" className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-emerald-600 rounded-[3rem] p-10 md:p-20 overflow-hidden text-center shadow-[0_20px_50px_rgb(16,185,129,0.3)]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-8 leading-tight">
                Şehrin Ritmini <br className="hidden md:block" /> Yakalayın.
              </h2>
              <p className="text-xl text-emerald-50 font-medium mb-12 max-w-2xl mx-auto opacity-90">
                Uygulamamızı hemen indirin, Seydişehir'in dijital dünyasına adım atın.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-emerald-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                >
                  <svg viewBox="0 0 512 512" className="w-6 h-6 fill-emerald-600">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-10.3 18-28.5-1.2-36.3zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest opacity-60 leading-none mb-1">Android</div>
                    <div className="leading-none">Google Play</div>
                  </div>
                </a>

                <a
                  href="https://apps.apple.com/tr/app/seydi-rehber/id6762803524"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                >
                  <svg viewBox="0 0 384 512" className="w-6 h-6 fill-white">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest opacity-60 leading-none mb-1">iOS</div>
                    <div className="leading-none">App Store</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAFAFA] pt-20 pb-10 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-500 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">SEYDİREHBER</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm mb-8">
                Seydişehir'in dijital dönüşümüne öncülük eden, şehrin nabzını tutan yenilikçi asistanınız.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 text-slate-400 transition-all cursor-pointer shadow-sm">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 text-slate-400 transition-all cursor-pointer shadow-sm">
                  <Code className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#features" className="text-slate-500 font-medium hover:text-emerald-600 transition-colors">Özellikler</a></li>
                <li><a href="#stats" className="text-slate-500 font-medium hover:text-emerald-600 transition-colors">İstatistikler</a></li>
                <li><Link to="/about" className="text-slate-500 font-medium hover:text-emerald-600 transition-colors">Hakkımızda</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">İletişim</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li className="flex items-center gap-3 hover:text-emerald-600 transition-colors cursor-pointer">
                  <Smartphone className="w-5 h-5 text-slate-400" />
                  seydirehber@gmail.com
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  Seydişehir, Konya
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-semibold text-slate-400">
              © {new Date().getFullYear()} SeydiRehber. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="text-sm font-semibold text-slate-400">Geliştirici:</span>
              <div className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 transition-colors">
                <Code className="w-4 h-4 text-emerald-500 group-hover:rotate-12 transition-transform" />
                <span className="font-extrabold tracking-tighter text-sm">MGVERSE <span className="text-emerald-600 italic">STUDIO</span></span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

