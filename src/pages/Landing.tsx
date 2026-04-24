import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Smartphone, ShieldCheck, MapPin, Search, Calendar, Bell, 
  ArrowRight, Code, CloudSun, Ticket, Scale, 
  ShoppingBag, Bus, Newspaper, Map, Camera, Building2, Briefcase,
  ChevronDown, ExternalLink, Users, Star, ArrowUpRight, Menu, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import mockImg from '../assets/mock.png';
import { useState, useRef } from 'react';

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

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
    { icon: <ShieldCheck />, title: "Nöbetçi Eczaneler", desc: "Güncel nöbetçi eczane listesi ve konumu.", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: <Building2 />, title: "Firmalar & Esnaflar", desc: "Şehirdeki tüm işletmelerin rehberi.", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: <Bus />, title: "Otobüs Saatleri", desc: "Şehir içi tüm dolmuş hatları ve çalışma saatleri.", color: "text-indigo-500", bg: "bg-indigo-50" },
    { icon: <Newspaper />, title: "Yerel Haberler", desc: "Seydişehir'den en sıcak haber akışı.", color: "text-rose-500", bg: "bg-rose-50" },
    { icon: <Briefcase />, title: "İş İlanları", desc: "Şehirdeki en güncel iş fırsatları.", badge: "Yakında", color: "text-amber-500", bg: "bg-amber-50" },
    { icon: <CloudSun />, title: "Hava Durumu", desc: "Anlık hava durumu ve tahminler.", color: "text-cyan-500", bg: "bg-cyan-50" },
    { icon: <Calendar />, title: "Etkinlikler", desc: "Şehirdeki tüm sosyal etkinlikler.", color: "text-violet-500", bg: "bg-violet-50" },
    { icon: <Ticket />, title: "Fırsat Kuponları", desc: "Esnaflardan özel indirimler.", color: "text-orange-500", bg: "bg-orange-50" },
    { icon: <Scale />, title: "Noterler", desc: "Nöbetçi ve aktif noter bilgileri.", color: "text-slate-500", bg: "bg-slate-50" },
    { icon: <ShoppingBag />, title: "Halk Pazarları", desc: "Pazar günleri ve konumları.", color: "text-pink-500", bg: "bg-pink-50" },
    { icon: <Map />, title: "Seydi Harita", desc: "Şehri harita üzerinden keşfedin.", color: "text-teal-500", bg: "bg-teal-50" },
    { icon: <Camera />, title: "Gezilecek Yerler", desc: "Tarihi ve turistik yerler rehberi.", color: "text-fuchsia-500", bg: "bg-fuchsia-50" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fafafa] text-slate-900 overflow-x-hidden selection:bg-emerald-100 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsMenuOpen(false);
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 p-2.5 rounded-2xl text-white shadow-xl group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-slate-900 leading-none">SEYDİREHBER</span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase mt-1">Dijital Şehir</span>
            </div>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <a href="#features" className="hover:text-emerald-600 transition-colors relative group">
              İçerikler
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors relative group">
              S.S.S.
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </a>
            <Link to="/about" className="hover:text-emerald-600 transition-colors relative group">
              Hakkımızda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <a 
                href="https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
              >
                Hemen İndir
              </a>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0, 
            height: isMenuOpen ? 'auto' : 0,
            display: isMenuOpen ? 'block' : 'none'
          }}
          className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
        >
          <div className="flex flex-col p-6 gap-6 text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
            <a 
              href="#features" 
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-emerald-600 transition-colors"
            >
              İçerikler
            </a>
            <a 
              href="#faq" 
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-emerald-600 transition-colors"
            >
              S.S.S.
            </a>
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-emerald-600 transition-colors"
            >
              Hakkımızda
            </Link>
            <a 
              href="https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-4 rounded-2xl font-bold text-xs"
            >
              Hemen İndir
            </a>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-20 px-6 max-w-7xl mx-auto">
        {/* Background Decorative Elements */}
        <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-[120px] opacity-30 -z-10 animate-pulse" />
        <div className="absolute top-20 -right-20 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] opacity-20 -z-10" />
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 xl:gap-48 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-8">
              Şehri <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600">Parmaklarının</span> <br />
              Ucunda Hisset.
            </h1>
            <p className="text-base lg:text-lg xl:text-xl text-slate-500 font-medium leading-relaxed max-w-lg mb-10">
              Nöbetçi eczanelerden güncel haberlere, otobüs saatlerinden size özel indirimlere kadar Seydişehir'e dair her şey tek bir akıllı platformda.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <a 
                href="https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-4 bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-bold shadow-2xl hover:shadow-emerald-500/20 transition-all active:scale-95"
              >
                <div className="p-2 bg-emerald-500 rounded-xl text-white group-hover:rotate-12 transition-transform">
                  <svg viewBox="0 0 512 512" className="w-6 h-6 fill-current">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-10.3 18-28.5-1.2-36.3zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40 leading-none mb-1">Android İçin</p>
                  <p className="text-xl leading-none">Google Play</p>
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
              </a>

              <div className="flex items-center gap-4 bg-white border border-slate-100 text-slate-300 px-8 py-5 rounded-[2rem] font-bold opacity-60 grayscale">
                <div className="p-2 bg-slate-100 rounded-xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-60 leading-none mb-1 text-slate-400">iOS Yakında</p>
                  <p className="text-xl leading-none">App Store</p>
                </div>
              </div>
            </div>


          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative z-10 w-full max-w-[280px] lg:max-w-[320px]">
              <img 
                src={mockImg} 
                alt="App Interface" 
                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section Header */}
      <section id="features" className="pt-20 pb-10 px-6">
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">Uygulama Ekosistemi</h2>
            <h3 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-6">İhtiyacın Olan Her Şey, <br /> Tek Bir Dokunuşla.</h3>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Modern tasarımı ve hızıyla Seydişehir'in dijital dünyasını yeniden şekillendiriyoruz.</p>
         </div>
      </section>

      {/* Features Grid - Refined */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-emerald-200 hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.1)] transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-50 transition-colors" />
              <div className={`${f.bg} ${f.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10`}>
                {f.icon}
                {f.badge && (
                   <span className="absolute -top-3 -right-3 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">{f.badge}</span>
                )}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">{f.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed text-sm mb-6">{f.desc}</p>
              <div className="flex items-center text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Detaylı İncele <ArrowRight size={14} className="ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 text-center relative z-10">
          <div>
             <p className="text-6xl font-black text-blue-400 mb-2">12+</p>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Akıllı Servis</p>
          </div>
          <div>
             <p className="text-6xl font-black text-violet-400 mb-2">100%</p>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ücretsiz Hizmet</p>
          </div>
        </div>
      </section>

      {/* FAQ Section - Refined Accordion */}
      <section id="faq" className="py-40 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4 text-center">Bilgi Bankası</h2>
            <p className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 text-center">Merak Edilenler</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i} 
                initial={false}
                className={`rounded-[2rem] border transition-all duration-500 ${openFaq === i ? 'bg-slate-50 border-emerald-100 shadow-xl shadow-emerald-900/5' : 'bg-white border-slate-100'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-10 py-8 flex justify-between items-center text-left"
                >
                  <span className="text-xl font-bold text-slate-800">{faq.question}</span>
                  <div className={`p-2 rounded-full transition-all duration-500 ${openFaq === i ? 'bg-emerald-500 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown size={24} />
                  </div>
                </button>
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  className="px-10 overflow-hidden"
                >
                  <p className="text-lg text-slate-500 font-medium leading-relaxed pb-8">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Premium */}
      <section className="py-40 px-6 relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-slate-900 rounded-[4rem] p-12 lg:p-24 overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600 rounded-full blur-[180px] opacity-20 -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] opacity-10 -ml-40 -mb-40" />
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
               >
                 <h2 className="text-5xl lg:text-8xl font-black tracking-tighter text-white leading-none mb-10">
                   Seydişehir'i <br />
                   <span className="text-emerald-400 italic">Yeniden</span> Keşfet.
                 </h2>
                 <p className="text-xl text-slate-300 font-medium mb-12 leading-relaxed">
                   Hemen ücretsiz indir, şehrin dijital ekosistemine dahil ol. Tüm güncellemeler ve yenilikler anında cebinde.
                 </p>
                 
                 <div className="flex justify-center flex-wrap gap-6">
                    <a 
                      href="https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim"
                      target="_blank"
                      className="group bg-white text-slate-900 px-10 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-105 transition-all flex items-center gap-4"
                    >
                       <svg viewBox="0 0 512 512" className="w-8 h-8 fill-emerald-600">
                          <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-10.3 18-28.5-1.2-36.3zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                       </svg>
                       Google Play
                       <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Elegant */}
      <footer className="py-32 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col lg:flex-row justify-between items-start gap-20 mb-20">
              <div className="max-w-sm">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-xl">
                      <MapPin size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-slate-900">SEYDİREHBER</span>
                 </div>
                 <p className="text-slate-500 font-medium leading-relaxed mb-8">
                   Seydişehir'in dijital dönüşümüne öncülük eden, şehrin nabzını tutan tek kapsamlı rehber platformu.
                 </p>
                 <div className="flex gap-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-100 cursor-pointer transition-colors">
                        <Smartphone size={18} className="text-slate-400" />
                      </div>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-32">
                 <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Kurumsal</p>
                    <ul className="space-y-4 text-sm font-bold text-slate-600">
                       <li><Link to="/about" className="hover:text-emerald-600">Hakkımızda</Link></li>
                       <li><Link to="/politikalar" className="hover:text-emerald-600">Politikalar</Link></li>
                    </ul>
                 </div>
                 <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">İletişim</p>
                    <ul className="space-y-4 text-sm font-bold text-slate-600">
                       <li className="flex items-center gap-2"><Smartphone size={14} /> seydirehber@gmail.com</li>
                       <li className="flex items-center gap-2"><MapPin size={14} /> Seydişehir, Konya</li>
                    </ul>
                 </div>
              </div>
           </div>
           
           <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                © 2026 seydirehber.com.tr • Tüm Hakları Saklıdır
              </p>
              <div className="flex items-center gap-3 group">
                 <div className="w-8 h-8 bg-slate-900 text-emerald-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                   <Code size={16} />
                 </div>
                 <p className="text-lg font-black tracking-tight text-slate-900">MGVERSE<span className="text-emerald-600 italic">STUDIO</span></p>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
