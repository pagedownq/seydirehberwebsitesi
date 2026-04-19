import { motion } from 'framer-motion';
import { MapPin, Target, Users, Code, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-emerald-600 font-bold mb-12 hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} /> Anasayfaya Dön
        </button>

        <section className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h1 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
              Seydişehir İçin <br />
              <span className="text-emerald-600">En İyisini Yapıyoruz.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
              SeydiRehber, şehrimizin dijital dönüşümüne katkı sağlamak, halkımız ile esnafımız arasındaki bağı güçlendirmek için hayata geçirilmiş bir projedir. 
              Amacımız, aradığınız her şeye tek bir ekrandan ulaşmanızı sağlamaktır.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-200 rounded-full blur-[120px] opacity-30 -z-10" />
            <img src="/src/assets/hero.png" alt="About SeydiRehber" className="w-full max-w-lg mx-auto drop-shadow-2xl rounded-3xl" />
          </motion.div>
        </section>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
            {[
                { icon: <Target className="w-8 h-8"/>, title: "Vizyonumuz", desc: "Şehrin tüm dinamiklerini dijital platformda birleştirmek." },
                { icon: <Users className="w-8 h-8"/>, title: "Halk Odaklı", desc: "Her yaştan vatandaşın kolayca kullanabileceği arayüz." },
                { icon: <Code className="w-8 h-8"/>, title: "Teknoloji", desc: "Modern ve güvenilir altyapı ile kesintisiz hizmet." }
            ].map((item, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all"
                >
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
                        {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
            ))}
        </div>

        <section className="bg-slate-900 rounded-[4rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)]" />
            <div className="relative z-10">
                <Code className="w-12 h-12 text-emerald-500 mx-auto mb-8" />
                <h2 className="text-4xl font-black mb-6 italic">MGVerse Studio İmzalı</h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    SeydiRehber, MGVerse Studio tarafından en güncel teknolojilerle geliştirilmiştir. Şehrimize katma değer yaratmaya devam ediyoruz.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-full font-bold text-sm">
                    Seydişehir • 2026
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default About;
