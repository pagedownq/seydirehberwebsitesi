import { motion } from 'framer-motion';
import { 
  Smartphone, ShieldCheck, MapPin, Search, Calendar, Bell, 
  ArrowRight, Download, Code, CloudSun, Ticket, Scale, 
  ShoppingBag, Bus, Newspaper, Map, Camera, Building2, Briefcase,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import mockImg from '../assets/mock.png';
import { useState } from 'react';

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { 
      question: "SeydiRehber uygulamasını kullanmak ücretli mi?", 
      answer: "SeydiRehber, kullanıcılar için tamamen ücretsizdir. Tüm özelliklere hiçbir ücret ödemeden erişebilirsiniz." 
    },
    { 
      question: "İşletme sahibiyim, firmamı rehbere nasıl ekleyebilirim?", 
      answer: "SeydiRehber yöneticileri ile @seydirehber Instagram hesabı veya seydirehber@gmail.com adresi üzerinden iletişime geçerek firmanızı kolayca rehbere ekletebilirsiniz." 
    },
    { 
      question: "Uygulamadaki bilgiler ne kadar güncel?", 
      answer: "Nöbetçi eczaneler, hava durumu ve otobüs saatleri gibi tüm dinamik bilgiler her gün otomatik olarak güncellenmektedir." 
    },
    { 
      question: "Uygulama üzerinden reklam vermek mümkün mü?", 
      answer: "Evet, uygulama içerisindeki özel reklam alanları üzerinden işletmenizin tanıtımını yapabilirsiniz. Detaylar için bizimle iletişime geçebilirsiniz." 
    },
    { 
      question: "Kişisel verilerim uygulama içerisinde güvende mi?", 
      answer: "Kesinlikle. Verileriniz güvenle saklanır ve hiçbir şekilde 3. taraf kişi veya kurumlarla paylaşılması söz konusu değildir." 
    }
  ];

  const features = [
    { icon: <ShieldCheck className="w-7 h-7"/>, title: "Nöbetçi Eczaneler", desc: "Güncel nöbetçi eczane listesi ve konumu." },
    { icon: <Building2 className="w-7 h-7"/>, title: "Firmalar & Esnaflar", desc: "Şehirdeki tüm işletmelerin rehberi." },
    { icon: <Bus className="w-7 h-7"/>, title: "Otobüs Saatleri", desc: "Şehir içi tüm dolmuş hatları ve çalışma saatleri." },
    { icon: <Newspaper className="w-7 h-7"/>, title: "Yerel Haberler", desc: "Seydişehir'den en sıcak haber akışı." },
    { icon: <Briefcase className="w-7 h-7"/>, title: "İş İlanları", desc: "Şehirdeki en güncel iş fırsatları ve eleman arayanlar.", badge: "Yakında" },
    { icon: <CloudSun className="w-7 h-7"/>, title: "Hava Durumu", desc: "Anlık hava durumu ve tahminler." },
    { icon: <Calendar className="w-7 h-7"/>, title: "Etkinlikler", desc: "Şehirdeki tüm kültürel ve sosyal etkinlikler." },
    { icon: <Ticket className="w-7 h-7"/>, title: "Fırsat Kuponları", desc: "Esnaflardan size özel indirim kuponları." },
    { icon: <Scale className="w-7 h-7"/>, title: "Noterler", desc: "Nöbetçi ve aktif noter bilgileri." },
    { icon: <ShoppingBag className="w-7 h-7"/>, title: "Halk Pazarları", desc: "Pazar günleri ve kuruldukları yerler." },
    { icon: <Map className="w-7 h-7"/>, title: "Seydi Harita", desc: "Şehri dijital harita üzerinden keşfedin." },
    { icon: <Camera className="w-7 h-7"/>, title: "Gezilecek Yerler", desc: "Seydişehir'in tarihi ve turistik yerleri." },
    { icon: <Search className="w-7 h-7"/>, title: "Akıllı Arama", desc: "Aradığınız her şeyi saniyeler içinde bulun." }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-emerald-100 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter text-emerald-900 uppercase">SEYDİREHBER</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#features" className="hover:text-emerald-600 transition-colors">İçerikler</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">S.S.S.</a>
            <Link to="/about" className="hover:text-emerald-600 transition-colors">Hakkımızda</Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Nav button removed */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
            <Bell className="w-4 h-4" /> Yenilikleri Keşfet
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-6">
            Seydişehir'in <br />
            <span className="text-emerald-600 underline decoration-emerald-100 underline-offset-8">Dijital Rehberi.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md mb-8">
            Nöbetçi eczanelerden otobüs saatlerine, yerel haberlerden özel indirimlere kadar her şey tek bir uygulamada. Seydişehir cebinizde.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all active:scale-95 group"
            >
              <Smartphone className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="text-[0.65rem] uppercase font-black tracking-widest opacity-60 leading-none mb-1 text-white">Android İçin</p>
                <p className="text-lg leading-none">Google Play</p>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-emerald-500" />
            </a>

            <div className="flex items-center gap-3 bg-slate-100 text-slate-400 px-8 py-5 rounded-2xl font-bold cursor-not-allowed border border-slate-200/50">
              <svg viewBox="0 0 384 512" className="w-6 h-6 fill-current">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-83.6-20.8-42.6 0-81.9 24.4-103.7 62.1-44.6 77-11.4 191.8 32.3 254.5 21.3 30.8 46.5 65.1 79.5 63.9 31.9-1.3 44-20.6 82.6-20.6 38.6 0 49.3 20.6 82.6 20.6 33.5 0 55.4-30.8 76.7-61.9 11.2-16.1 16.7-32.1 17-33 1.1-.3 65.6-25.2 65.6-101.4zM255.4 113.8c16.5-20.2 27.6-48.2 24.6-76.3-24.1 1-53.1 16.1-70.3 36.3-15.5 18.1-28.8 46.6-25.1 74.3 26.5 2 54.1-14.2 70.8-34.3z"/>
              </svg>
              <div>
                <p className="text-[0.65rem] uppercase font-black tracking-widest opacity-60 leading-none mb-1">iOS Yakında</p>
                <p className="text-lg leading-none">App Store</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative lg:translate-x-32"
        >
          <img 
            src={mockImg} 
            alt="SeydiRehber App Mockup" 
            className="w-full max-w-lg lg:ml-auto lg:mr-0 mx-auto drop-shadow-[0_35px_35px_rgba(16,185,129,0.15)] rounded-[2.5rem]"
          />
          <div className="absolute bottom-4 -left-4 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 hidden xl:block">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400">Etkinlikler</p>
                <p className="text-base font-bold text-slate-900 leading-tight">Yarınki Halk Pazarı</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-600 mb-4 text-center">Uygulama İçeriği</h2>
            <p className="text-4xl font-black tracking-tight text-slate-900 leading-tight text-center">Seydişehir'de Aradığınız Her Şey Bu Uygulamada</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5, backgroundColor: '#fff' }}
                className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all text-center md:text-left h-full group"
              >
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 relative">
                  {feature.icon}
                  {feature.badge && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[0.6rem] font-black px-2 py-1 rounded-full shadow-lg shadow-amber-200">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed hidden md:block">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Destek Merkezi</h2>
            <p className="text-4xl font-black tracking-tight text-slate-900">Sıkça Sorulan Sorular</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="border border-slate-100 rounded-3xl overflow-hidden transition-all duration-300"
                style={{ backgroundColor: openFaq === i ? '#f8fafc' : 'white' }}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-lg font-bold text-slate-800">{faq.question}</span>
                  <ChevronDown 
                    className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-emerald-600' : ''}`} 
                  />
                </button>
                
                <div 
                  className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Store CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-[3rem] lg:rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden group">
          {/* Animated Background Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400 rounded-full blur-[100px] opacity-20 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] opacity-20 group-hover:scale-110 transition-transform duration-1000" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 leading-tight">
              Seydişehir'i Cebinde <br className="hidden md:block" />
              <span className="text-emerald-300">Taşımaya Başla!</span>
            </h2>
            <p className="text-lg lg:text-xl text-emerald-100/80 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Android kullanıcıları için yayında! Şehrin nabzını tutan SeydiRehber'i hemen indir, tüm ayrıcalıklardan ücretsiz faydalan.
            </p>
            
            <div className="flex justify-center flex-wrap gap-4 md:gap-6">
              <a 
                href="https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white text-emerald-900 px-8 lg:px-10 py-5 rounded-3xl font-black text-lg shadow-2xl hover:bg-emerald-50 hover:scale-105 transition-all active:scale-95 group/btn"
              >
                <div className="bg-emerald-100 p-2 rounded-xl group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-colors">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-[0.6rem] uppercase opacity-60 leading-none mb-1">Android İçin</p>
                  <p className="leading-none">Google Play</p>
                </div>
              </a>

              <div className="flex items-center gap-4 bg-emerald-800/40 backdrop-blur-sm text-emerald-300/50 border border-emerald-700/50 px-8 lg:px-10 py-5 rounded-3xl font-black text-lg cursor-not-allowed">
                <div className="opacity-30">
                  <svg viewBox="0 0 384 512" className="w-7 h-7 fill-current">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-83.6-20.8-42.6 0-81.9 24.4-103.7 62.1-44.6 77-11.4 191.8 32.3 254.5 21.3 30.8 46.5 65.1 79.5 63.9 31.9-1.3 44-20.6 82.6-20.6 38.6 0 49.3 20.6 82.6 20.6 33.5 0 55.4-30.8 76.7-61.9 11.2-16.1 16.7-32.1 17-33 1.1-.3 65.6-25.2 65.6-101.4zM255.4 113.8c16.5-20.2 27.6-48.2 24.6-76.3-24.1 1-53.1 16.1-70.3 36.3-15.5 18.1-28.8 46.6-25.1 74.3 26.5 2 54.1-14.2 70.8-34.3z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[0.6rem] uppercase opacity-40 leading-none mb-1">Yakında</p>
                  <p className="leading-none">App Store</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left group cursor-default">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 underline-offset-4 decoration-emerald-500">Designed & Developed By</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 text-emerald-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Code size={20} />
              </div>
              <p className="text-2xl font-black tracking-tight text-slate-900">MGVERSE<span className="text-emerald-600 italic">STUDIO</span></p>
            </div>
          </div>
          <p className="text-slate-400 font-bold font-mono text-xs">
            © 2026 seydirehber.com.tr • Tüm Hakları Saklıdır
          </p>
          <div className="flex gap-8 text-sm font-black text-slate-500">
            <Link to="/privacy" className="hover:text-emerald-600 transition-colors">Gizlilik</Link>
            <Link to="/kvkk" className="hover:text-emerald-600 transition-colors">KVKK</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
