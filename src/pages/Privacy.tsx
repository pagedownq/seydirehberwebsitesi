import { motion } from 'framer-motion';
import { Shield, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-emerald-600 font-bold mb-12 hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} /> Anasayfaya Dön
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
            <Shield size={32} />
          </div>
          
          <h1 className="text-4xl font-black tracking-tight mb-8">Gizlilik Politikası</h1>
          
          <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
            <p>
              SeydiRehber olarak, kullanıcılarımızın gizliliğine ve verilerinin korunmasına büyük önem veriyoruz. 
              Bu politika, SeydiRehber mobil uygulaması ve web sitesini kullandığınızda hangi verileri topladığımızı ve bunları nasıl kullandığımızı açıklar.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">1. Toplanan Veriler</h2>
            <p>
              Uygulamamızın temel işlevlerini yerine getirebilmesi için cihaz kimliği, konum verileri (isteğe bağlı), 
              bildirim almak için tercih edilen dil ve benzeri teknik bilgiler toplanabilir.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">2. Verilerin Kullanımı</h2>
            <p>
              Toplanan veriler yalnızca size en yakın esnafları göstermek, nöbetçi eczane rotalarını oluşturmak 
              ve Seydişehir ile ilgili önemli bildirimleri iletmek amacıyla kullanılır. Hiçbir veriniz üçüncü şahıslara reklam amaçlı satılmaz.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">3. Güvenlik</h2>
            <p>
              Verileriniz modern şifreleme yöntemleri ile korunmaktadır. Firebase ve Supabase güvenli altyapıları kullanılarak verilerinizin izinsiz erişime karşı korunması sağlanır.
            </p>

            <div className="mt-12 pt-8 border-t border-slate-100 text-sm text-slate-400">
              Son Güncelleme: 19 Nisan 2026
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
