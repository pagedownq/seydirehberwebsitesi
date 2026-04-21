import { motion } from 'framer-motion';
import { Shield, FileText, Lock, ChevronLeft, UserCheck, MapPin, Share2, Trash2, ShieldAlert, MessageCircle, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Policies = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-50 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-blue-50 blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12 lg:py-20">
        {/* Navigation */}
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-slate-500 font-semibold mb-12 hover:text-emerald-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
            <ChevronLeft size={18} />
          </div>
          Anasayfaya Dön
        </button>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Header */}
          <header className="text-center md:text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold mb-6">
              <Shield size={16} />
              Yasal Bilgilendirme
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
              Politikalar & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Koşullar</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
              SeydiRehber mobil uygulaması ve platformu üzerindeki haklarınızı, sorumluluklarınızı ve veri güvenliğiniz hakkındaki detayları aşağıda bulabilirsiniz.
            </motion.p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Table of Contents - Sticky on Desktop */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                <nav className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-6 px-2">Bölümler</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#privacy" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold transition-all group">
                        <Lock size={18} className="group-hover:scale-110 transition-transform" />
                        Gizlilik Politikası
                      </a>
                    </li>
                    <li>
                      <a href="#terms" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold transition-all group">
                        <FileText size={18} className="group-hover:scale-110 transition-transform" />
                        Kullanım Koşulları
                      </a>
                    </li>
                    <li>
                      <a href="#kvkk" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold transition-all group">
                        <UserCheck size={18} className="group-hover:scale-110 transition-transform" />
                        KVKK Aydınlatma
                      </a>
                    </li>
                  </ul>
                </nav>

                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-[2rem] text-white shadow-lg shadow-emerald-200/50">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                    <MessageCircle size={24} />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Sorunuz mu var?</h4>
                  <p className="text-emerald-50/80 text-sm font-medium mb-6 leading-relaxed">
                    Politikalarımız hakkında her türlü soru için bize ulaşabilirsiniz.
                  </p>
                  <a href="mailto:seydirehber@gmail.com" className="inline-flex w-full items-center justify-center py-3 px-6 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-sm">
                    E-posta Gönder
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* 1. Gizlilik Politikası */}
              <section id="privacy" className="scroll-mt-8">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                    <Lock size={28} />
                  </div>
                  <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tight">1. Gizlilik Politikası</h2>
                  
                  <div className="prose prose-slate max-w-none space-y-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <p className="text-slate-600 font-medium leading-relaxed m-0 italic">
                        "Kullanıcı verilerinin nasıl toplandığı ve güvenliği hakkında bilgiler içerir."
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                          <UserCheck size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">Google Giriş</h4>
                          <p className="text-slate-500 text-sm font-medium">Sadece e-posta ve isim-soyisim profil bilgileriniz için kullanılır.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">Konum Verisi</h4>
                          <p className="text-slate-500 text-sm font-medium">Sadece anlık mesafe hesaplama için kullanılır, sunucuya kaydedilmez.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                          <Share2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">Veri Paylaşımı</h4>
                          <p className="text-slate-500 text-sm font-medium">Veriler 3. şahıslara satılmaz, güvenli Firebase altyapısında saklanır.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                          <Trash2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">Hesap Silme</h4>
                          <p className="text-slate-500 text-sm font-medium">Kullanıcı istediği an hesabını ve tüm verilerini (yorumlar dahil) silebilir.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Kullanım Koşulları */}
              <section id="terms" className="scroll-mt-8">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
                    <FileText size={28} />
                  </div>
                  <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tight">2. Kullanım Koşulları</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <p className="text-slate-600 font-medium leading-relaxed m-0 italic">
                        "Kullanıcıların uyması gereken topluluk kurallarını belirler."
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-black">18+</div>
                        <div>
                          <h4 className="font-black text-slate-900 text-lg mb-2">Yaş Sınırı</h4>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Uygulama içindeki etkileşimli özellikler (yorum yapma, puan verme vb.) için 18 yaş sınırı bulunmaktadır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                          <ShieldAlert size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-lg mb-2">UGC (Kullanıcı İçeriği)</h4>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Küfür, hakaret, nefret söylemi kesinlikle yasaktır. Bu tür içerikler tespit edildiğinde veya raporlandığında <span className="text-rose-600 font-bold">24 saat içinde</span> moderasyonla kalıcı olarak silinir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <AlertCircle size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-lg mb-2">Raporlama ve Engelleme</h4>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Kullanıcıların birbirini engelleme ve uygunsuz içeriği anında rapor etme sistemi mevcuttur. Raporlar moderasyon ekibimizce titizlikle incelenir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                          <Info size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-lg mb-2">RSS Haberleri</h4>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Uygulamada sunulan haber içeriklerinin sorumluluğu, ilgili haberin alındığı kaynak sitelere aittir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. KVKK Aydınlatma Metni */}
              <section id="kvkk" className="scroll-mt-8">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8">
                    <UserCheck size={28} />
                  </div>
                  <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tight">3. KVKK Aydınlatma Metni</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <p className="text-slate-600 font-medium leading-relaxed m-0 italic">
                        "Türkiye'deki Kişisel Verilerin Korunması Kanunu'na uyum beyanıdır."
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl border border-slate-100 bg-emerald-50/30">
                        <h4 className="font-black text-slate-900 mb-2">Veri Sorumlusu</h4>
                        <p className="text-emerald-900 font-bold text-xl">Seydi Rehber</p>
                      </div>

                      <p className="text-slate-500 font-medium leading-relaxed">
                        Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, veri sorumlusu sıfatıyla Seydi Rehber tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                      </p>

                      <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <MessageCircle className="text-emerald-600 mt-1" size={24} />
                        <div>
                          <h4 className="font-black text-slate-900 mb-1">Hak Talepleri ve İletişim</h4>
                          <p className="text-slate-500 font-medium mb-4">
                            Kanun kapsamındaki haklarınıza ilişkin taleplerinizi e-posta yoluyla iletebilirsiniz.
                          </p>
                          <a href="mailto:seydirehber@gmail.com" className="text-emerald-600 font-black hover:underline">
                            seydirehber@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer info */}
              <footer className="text-center pt-8 border-t border-slate-200">
                <p className="text-slate-400 text-sm font-bold">
                  Son Güncelleme: 21 Nisan 2026 • SeydiRehber
                </p>
              </footer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Policies;
