import { motion } from 'framer-motion';
import { Target, Users, Code, ChevronLeft, Heart, Zap, Shield, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 font-sans relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header / Back Link */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 text-slate-500 font-bold mb-16 hover:text-emerald-600 transition-all"
        >
          <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
            <ChevronLeft size={18} />
          </div>
          <span className="text-sm tracking-widest uppercase">Geri Dön</span>
        </motion.button>

        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Zap size={14} /> Biz Kimiz?
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-slate-900">
              Şehrin Dijital <br />
              <span className="text-emerald-600">Rehberi.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              SeydiRehber, Seydişehir'in dijital dünyadaki yüzüdür. Halkımız ve yerel esnafımız arasındaki bağı modern bir vizyonla yeniden inşa ediyoruz. 
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <p className="text-sm font-bold text-slate-400">Binlerce Seydişehirli yanımızda!</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[120px] opacity-20 -z-10 animate-pulse" />
            <div className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-[3rem] shadow-2xl border border-white">
              <img src={heroImg} alt="About SeydiRehber" className="w-full rounded-[2.5rem] object-cover" />
            </div>
          </motion.div>
        </section>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-10 mb-32">
            {[
                { icon: <Target className="w-7 h-7"/>, title: "Hedefimiz", desc: "Şehrin tüm dinamiklerini dijital bir ekosistemde toplamak.", color: "bg-blue-50 text-blue-600" },
                { icon: <Heart className="w-7 h-7"/>, title: "Çözüm Odaklı", desc: "Her yaştan vatandaşın kolayca kullanabileceği samimi arayüz.", color: "bg-rose-50 text-rose-600" },
                { icon: <Shield className="w-7 h-7"/>, title: "Güvenli Yapı", desc: "Veri güvenliği ve şeffaflık ilkelerimizden taviz vermiyoruz.", color: "bg-amber-50 text-amber-600" }
            ].map((item, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group"
                >
                    <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                        {item.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-slate-800">{item.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
            ))}
        </div>

        {/* Studio Branding */}
        <section className="bg-slate-950 rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-10">
                <div className="w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:rotate-12 transition-transform">
                  <Code className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter italic">MGVerse Studio İmzalı</h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                    SeydiRehber, MGVerse Studio tarafından en güncel web teknolojileri ve kullanıcı deneyimi standartları ile geliştirilmiştir. Biz, teknolojiyle yerel yaşamı birleştiriyoruz.
                </p>
                <div className="flex flex-col items-center gap-6">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                  <div className="flex items-center gap-4 text-emerald-500 font-black tracking-[0.2em] uppercase text-xs">
                    <span>Yazılım</span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>Tasarım</span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>Strateji</span>
                  </div>
                </div>
            </div>
        </section>

        {/* Footer info */}
        <div className="mt-20 text-center">
          <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">© 2026 SeydiRehber • Seydişehir</p>
        </div>
      </div>
    </div>
  );
};

export default About;
