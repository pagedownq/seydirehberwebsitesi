import { motion } from 'framer-motion';
import { Smartphone, ShieldCheck, MapPin, Search, Calendar, Bell, ArrowRight, Download, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-emerald-100">
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
            <span className="text-xl font-black tracking-tighter text-emerald-900">SEYDİREHBER</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Özellikler</a>
            <Link to="/about" className="hover:text-emerald-600 transition-colors">Hakkımızda</Link>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all text-sm"
            >
              Uygulamayı İndir
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8">
            <Bell className="w-4 h-4" /> Yenilikleri Keşfet
          </div>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8">
            Seydişehir'in <br />
            <span className="text-emerald-600 underline decoration-emerald-100 underline-offset-8">Dijital Rehberi.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg mb-10">
            Nöbetçi eczanelerden otobüs saatlerine, yerel haberlerden özel indirimlere kadar her şey tek bir uygulamada. Seydişehir cebinizde.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all active:scale-95 group"
            >
              <Smartphone className="w-6 h-6" />
              Android İçin İndir
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative"
        >
          <img 
            src="/src/assets/mock.png" 
            alt="SeydiRehber App Mockup" 
            className="w-full max-w-2xl mx-auto drop-shadow-[0_45px_45px_rgba(16,185,129,0.15)] rounded-[3rem]"
          />
          <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-slate-50 hidden xl:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">Etkinlikler</p>
                <p className="text-lg font-bold text-slate-900">Yarınki Halk Pazarı</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Uygulama İçeriği</h2>
            <p className="text-4xl font-black tracking-tight text-slate-900">Aradığınız Her Şeye Saniyeler İçinde Ulaşın</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck className="w-8 h-8"/>, title: "Nöbetçi Eczaneler", desc: "En güncel nöbetçi eczane listesi ve konumu." },
              { icon: <Search className="w-8 h-8"/>, title: "Firma Rehberi", desc: "Şehirdeki tüm esnaflar ve iletişim bilgileri." },
              { icon: <Smartphone className="w-8 h-8"/>, title: "Otobüs Saatleri", desc: "Konya-Seydişehir ve şehir içi ulaşım saatleri." },
              { icon: <Calendar className="w-8 h-8"/>, title: "Yerel Haberler", desc: "Seydişehir'den en sıcak ve doğru haber akışı." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all h-full"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Store CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-emerald-600 rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] opacity-20 -z-10 group-hover:scale-110 transition-transform duration-700" />
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 italic">Seydişehir için Şimdi İndir!</h2>
          <p className="text-xl text-emerald-100 font-medium mb-12 max-w-xl mx-auto">Android işletim sistemine özel olarak geliştirilen SeydiRehber ile şehri keşfetmeye başla.</p>
          <div className="flex justify-center flex-wrap gap-6">
            <a 
              href="https://play.google.com/store/apps/details?id=com.mgverse.seydirehberim"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-emerald-600 px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-2xl hover:bg-emerald-50 transition-all active:scale-95"
            >
              <Download className="w-6 h-6" /> Play Store'da Bul
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left group cursor-default">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Designed & Developed By</p>
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
