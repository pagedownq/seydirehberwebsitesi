import { motion } from 'framer-motion';
import { Gavel, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KVKK = () => {
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
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-8">
            <Gavel size={32} />
          </div>
          
          <h1 className="text-4xl font-black tracking-tight mb-8">KVKK Aydınlatma Metni</h1>
          
          <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
            <p>
              6698 Sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, SeydiRehber olarak kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">Veri Sorumlusu</h2>
            <p>
              Kişisel verileriniz, veri sorumlusu sıfatıyla SeydiRehber (MGVerse Studio) tarafından aşağıda açıklanan kapsamda işlenmektedir.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">Hangi Verileriniz İşleniyor?</h2>
            <p>
              Uygulamamıza kayıt olduğunuzda veya kullandığınızda; ad-soyad, e-posta adresi, cihaz konumu ve uygulama içi etkileşim bilgileriniz işlenebilmektedir.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">Haklarınız</h2>
            <p>
              KVKK’nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, yanlış işlenmişse düzeltilmesini talep etme ve verilerinizin silinmesini isteme hakkına sahipsiniz.
            </p>

            <div className="mt-12 pt-8 border-t border-slate-100 text-sm text-slate-400">
              © 2026 SeydiRehber (MGVerse Studio)
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KVKK;
