import { motion } from 'framer-motion';
import { Target, Users, Code, ChevronLeft, Heart, Zap, Shield, Smartphone, ArrowUpRight, Globe, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const About = () => {
  const navigate = useNavigate();

  const coreValues = [
    { 
      icon: <Target />, 
      title: "Vizyonumuz", 
      desc: "Seydişehir'in her köşesini dijital bir ekosistemde birleştirerek şehri cebinize sığdırmak.", 
      color: "text-blue-600", bg: "bg-blue-50" 
    },
    { 
      icon: <Award />, 
      title: "Kalite Standardı", 
      desc: "Kullanıcı deneyimini en üst seviyede tutarak, en hızlı ve doğru bilgi akışını sağlamak.", 
      color: "text-emerald-600", bg: "bg-emerald-50" 
    },
    { 
      icon: <Shield />, 
      title: "Güven ve Şeffaflık", 
      desc: "Veri güvenliği ve şeffaflık ilkelerimizle kullanıcılarımıza güvenli bir ortam sunmak.", 
      color: "text-violet-600", bg: "bg-violet-50" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-emerald-100 font-sans relative overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation */}
        <header className="flex justify-between items-center mb-24">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 text-slate-500 font-bold hover:text-emerald-600 transition-all"
          >
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
              <ChevronLeft size={18} />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase">Ana Sayfaya Dön</span>
          </motion.button>
          <div className="hidden md:flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">
            <Globe size={14} /> seydirehber.com.tr
          </div>
        </header>

        {/* Hero Section */}
        <section className="grid lg:grid-cols-[1.2fr,1fr] gap-20 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 shadow-sm mb-8">
              <Sparkles size={12} className="animate-pulse" /> Kurumsal Kimliğimiz
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-slate-900">
              Şehrin Yeni <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">Dijital Yüzü.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
              SeydiRehber, yerel yaşamı teknolojiyle harmanlayan, Seydişehir halkının ihtiyaçlarını tek bir çatı altında toplayan inovatif bir platformdur. 
            </p>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-3xl font-black text-slate-900">5K+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">İndirme</p>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block" />
              <div>
                <p className="text-3xl font-black text-slate-900">12+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hizmet Modülü</p>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block" />
              <div>
                <p className="text-3xl font-black text-slate-900">%100</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Yerel Girişim</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] -z-10" />
            <div className="p-3 bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src={heroImg} alt="SeydiRehber Corporate" className="w-full h-[500px] object-cover rounded-[3rem]" />
            </div>
          </motion.div>
        </section>

        {/* Core Values */}
        <section className="mb-40">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">Temel İlkelerimiz</h2>
            <p className="text-4xl font-black tracking-tighter text-slate-900">Değerlerimizle Fark Yaratıyoruz</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -12 }}
                className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group"
              >
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Studio Branding Section - Refined */}
        <section className="relative overflow-hidden bg-slate-900 rounded-[4rem] p-12 lg:p-24 text-white group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl mb-10">
                <Code className="text-emerald-400" size={24} />
                <span className="text-xs font-black tracking-[0.2em] uppercase">Geliştirici Ekip</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter leading-none">
                MGVerse Studio <br /> 
                <span className="text-emerald-400 italic">Geleceği Tasarlar.</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed mb-10 text-center lg:text-left">
                SeydiRehber, MGVerse Studio'nun yerel toplulukları dijitalleşmeyle güçlendirme vizyonunun bir parçasıdır. En güncel teknolojileri, estetik ve işlevsellikle birleştiriyoruz.
              </p>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
               {[
                 { label: "Yazılım Mimari", value: "React & Firebase" },
                 { label: "Tasarım Sistemi", value: "Modern UI/UX" },
                 { label: "Mobil Deneyim", value: "Responsive Tasarım" },
                 { label: "Stratejik Veri", value: "Canlı Senkronizasyon" }
               ].map((stat, i) => (
                 <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem]">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Closing Info */}
        <footer className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            © 2026 SeydiRehber Dijital Platformu
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#fafafa] bg-slate-200" />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-500">Bize Güvenen <span className="text-slate-900">Binlerce Kişi</span></p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;
