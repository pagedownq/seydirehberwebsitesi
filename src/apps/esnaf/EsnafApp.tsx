import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { 
  getDocs, 
  collection, 
  query, 
  where, 
  Timestamp, 
  runTransaction, 
  doc, 
  increment, 
  onSnapshot,
  orderBy,
  limit
} from "firebase/firestore";
import { KeyRound, LogOut, AlertCircle, BarChart3, RefreshCw, CheckCircle2, Building2, Phone, MessageCircle, Tag, MessageSquare, MapPin, Star } from "lucide-react";

function EsnafApp() {
  const [userId, setUserId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'coupons' | 'reviews' | 'support' | 'company'>('dashboard');
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalUsed: number,
    dailyTrend: Array<{date: string, count: number}>,
    recentUses: Array<{id: string, code: string, usedAt: Date, couponTitle: string}>
  } | null>(null);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  useEffect(() => {
    let unsub: (() => void) | undefined;
    
    if (companyId) {
      const unsubCompany = fetchCompanyName(companyId, (exists) => {
        if (!exists) {
          handleLogout();
        }
      });
      const unsubStats = fetchStats(companyId);
      const unsubCoupons = fetchCoupons(companyId);
      const unsubReviews = fetchReviews(companyId);
      unsub = () => {
        unsubCompany();
        unsubStats();
        unsubCoupons();
        unsubReviews();
      };
    } else {
      setStats(null);
      setCompanyName("");
    }

    return () => {
      if (unsub) unsub();
    };
  }, [companyId]);

  useEffect(() => {
    if (!userId) return;
    const userDocRef = doc(db, "esnaf_users", userId);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (!snapshot.exists()) {
        handleLogout();
      }
    });
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const storedUser = localStorage.getItem("esnaf_user_id");
    const storedFirma = localStorage.getItem("esnaf_firma_id");
    if (storedUser && storedFirma) {
      setUserId(storedUser);
      setCompanyId(storedFirma);
    }
  }, []);

  const fetchCoupons = (fId: string) => {
    if (!fId) return () => {};
    const q = query(collection(db, "coupons"), where("companyId", "==", fId));
    return onSnapshot(q, (snapshot) => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLastSync(new Date());
    }, (err) => {
      console.error("Coupons fetch error:", err);
    });
  };

  const fetchReviews = (fId: string) => {
    if (!fId) return () => {};
    const q = query(collection(db, "reviews"), where("targetId", "==", fId), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLastSync(new Date());
    }, (err) => {
      console.error("Reviews fetch error:", err);
      if (err.code === 'failed-precondition') {
        setError("Yorumlar için dizin oluşturuluyor, lütfen bekleyin...");
      }
    });
  };

  const fetchStats = (fId: string) => {
    if (!fId) return () => {};
    const q = query(
      collection(db, "generated_codes"),
      where("companyId", "==", fId),
      where("status", "==", "used"),
      orderBy("usedAt", "desc"),
      limit(100)
    );

    return onSnapshot(q, (snapshot) => {
      const dailyTrend: Record<string, number> = {};
      const now = new Date();
      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - i);
        return d.toLocaleDateString('tr-TR');
      }).reverse();

      snapshot.docs.forEach((d: any) => {
        const data = d.data();
        if (data.usedAt) {
          const dateStr = data.usedAt.toDate().toLocaleDateString('tr-TR');
          if (last7Days.includes(dateStr)) {
            dailyTrend[dateStr] = (dailyTrend[dateStr] || 0) + 1;
          }
        }
      });

      setStats({
        totalUsed: snapshot.size,
        dailyTrend: last7Days.map(date => ({ date, count: dailyTrend[date] || 0 })),
        recentUses: snapshot.docs.slice(0, 10).map(d => ({
          id: d.id,
          code: d.data().code,
          usedAt: d.data().usedAt?.toDate(),
          couponTitle: d.data().couponTitle || "Kupon"
        }))
      });
    });
  };

  const fetchCompanyName = (fId: string, onUpdate?: (exists: boolean) => void) => {
    if (!fId) return () => {};
    const docRef = doc(db, "firmalar", fId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCompanyName(data.ad || "");
        setCompanyData({ ...data, id: snapshot.id });
        setLastSync(new Date());
        setError(null);
        onUpdate?.(true);
      } else {
        onUpdate?.(false);
      }
    }, (err) => {
      console.error("Company fetch error:", err);
      setError("Firma bilgileri alınamadı.");
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const q = query(
        collection(db, "esnaf_users"), 
        where("username", "==", email),
        where("password", "==", password)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setLoginError("Kullanıcı adı veya şifre hatalı.");
      } else {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();
        localStorage.setItem("esnaf_user_id", docSnap.id);
        localStorage.setItem("esnaf_firma_id", data.companyId || "");
        setUserId(docSnap.id);
        setCompanyId(data.companyId || null);
        fetchCompanyName(data.companyId || "");
      }
    } catch (err: any) {
      setLoginError("Sunucuya bağlanılamadı.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("esnaf_user_id");
    localStorage.removeItem("esnaf_firma_id");
    setUserId(null);
    setCompanyId(null);
    setCompanyName("");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || couponCode.length !== 6) return;
    setIsVerifying(true);
    setVerifyStatus(null);
    try {
      const q = query(
        collection(db, "generated_codes"),
        where("code", "==", couponCode.toUpperCase()),
        where("companyId", "==", companyId)
      );
      const res = await getDocs(q);
      const docs = res.docs.filter(doc => {
        const data = doc.data();
        return data.status === "pending" && data.expiresAt.toMillis() > Date.now();
      });
      if (docs.length === 0) {
        setVerifyStatus({type: 'error', msg: "Geçersiz veya süresi dolmuş kupon."});
        return;
      }
      const docRef = docs[0].ref;
      await runTransaction(db, async (transaction) => {
        const freshDoc = await transaction.get(docRef);
        const data = freshDoc.data() as any;
        const couponDocRef = doc(db, "coupons", data.couponId);
        transaction.update(docRef, { status: "used", usedAt: Timestamp.now() });
        transaction.update(couponDocRef, { used_count: increment(1) });
      });
      setVerifyStatus({type: 'success', msg: "Kupon başarıyla doğrulandı!"});
      setCouponCode("");
    } catch (err: any) {
      setVerifyStatus({type: 'error', msg: err.message || "Hata oluştu."});
    } finally {
      setIsVerifying(false);
    }
  };

  if (userId === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden font-sans">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-xl p-10 relative z-10">
          <div className="text-center mb-10">
            <div className="mx-auto h-24 w-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Esnaf Girişi</h1>
            <p className="text-slate-500 mt-3 text-sm font-medium">Seydi Rehber İşletme Yönetimi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="isletme_adi" className="block w-full bg-slate-50/50 rounded-2xl border border-slate-200 text-slate-900 px-5 py-4 focus:bg-white focus:border-indigo-500 transition-all outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Şifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="block w-full bg-slate-50/50 rounded-2xl border border-slate-200 text-slate-900 px-5 py-4 focus:bg-white focus:border-indigo-500 transition-all outline-none" required />
            </div>
            {loginError && <div className="bg-rose-50 border border-emerald-100 p-4 rounded-2xl text-rose-600 font-semibold text-sm">{loginError}</div>}
            <button type="submit" disabled={isLoggingIn} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-3">
              {isLoggingIn ? <RefreshCw className="h-6 w-6 animate-spin text-white/50" /> : "Sisteme Giriş Yap"}
            </button>
          </form>
          <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center gap-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Destek ve İletişim</p>
             <div className="flex gap-4 w-full">
               <a href="https://wa.me/905456962060" target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100/50 font-bold text-xs">
                 <MessageCircle className="h-4 w-4" /> WhatsApp
               </a>
               <a href="tel:+905456962060" className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 p-4 rounded-2xl border border-slate-200/50 font-bold text-xs">
                 <Phone className="h-4 w-4" /> Ara
               </a>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">{companyName || 'Yükleniyor...'}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 rounded-md">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.15em] leading-none">KURUMSAL PANEL</p>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 relative z-10 max-w-7xl">
        {!companyId ? (
          <div className="bg-white/80 backdrop-blur-md border border-amber-100 p-8 rounded-[2.5rem] shadow-xl flex items-center gap-6 max-w-2xl mx-auto">
            <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl"><AlertCircle className="w-10 h-10" /></div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">Yetki Bekleniyor</h3>
              <p className="text-slate-600 font-medium">Hesabınıza atanmış bir firma bulunamadı.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <nav className="flex items-center gap-2 p-1.5 bg-white/50 backdrop-blur-sm rounded-3xl border border-white max-w-fit mx-auto lg:mx-0 overflow-x-auto whitespace-nowrap">
              <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Panel</button>
              <button onClick={() => setActiveTab('coupons')} className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeTab === 'coupons' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Kuponlarım ({coupons.length})</button>
              <button onClick={() => setActiveTab('reviews')} className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeTab === 'reviews' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Yorumlar ({reviews.length})</button>
              <button onClick={() => setActiveTab('company')} className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeTab === 'company' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>İşletme Bilgileri</button>
              <button onClick={() => setActiveTab('support')} className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeTab === 'support' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Destek</button>
            </nav>

            {activeTab === 'dashboard' && (
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  <section className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-sm border border-white">
                    <div className="flex items-center gap-5 mb-10">
                      <div className="p-4 bg-indigo-50 rounded-[1.5rem] text-indigo-600"><KeyRound className="w-8 h-8" /></div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Kupon Doğrulama</h2>
                        <p className="text-slate-500 font-medium">Müşterinin getirdiği 6 haneli kodu doğrulayın.</p>
                      </div>
                    </div>
                    <form onSubmit={handleVerify} className="space-y-8">
                      <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="• • • • • •" maxLength={6} className="w-full text-center text-6xl font-black tracking-[0.3em] py-10 rounded-[2rem] border-2 border-slate-100 bg-slate-50/30 outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                      <button type="submit" disabled={isVerifying || couponCode.length !== 6} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-6 rounded-[1.75rem] font-bold text-xl shadow-2xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4">
                        {isVerifying ? <RefreshCw className="w-8 h-8 animate-spin" /> : <><CheckCircle2 className="w-8 h-8" /> Doğrula ve Kuponu Kullan</>}
                      </button>
                      {verifyStatus && (
                        <div className={`p-6 rounded-[1.5rem] border font-bold text-sm text-center ${verifyStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                          {verifyStatus.msg}
                        </div>
                      )}
                    </form>
                  </section>
                </div>
                <div className="space-y-10">
                  <section className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-white">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3"><BarChart3 className="text-emerald-600" /> Raporlar</h2>
                       <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">CANLI</div>
                    </div>
                    <div className="space-y-10">
                       <div className="grid grid-cols-3 gap-4">
                          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Toplam</p>
                             <p className="text-xl font-black text-slate-900">{stats?.totalUsed || 0}</p>
                          </div>
                          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aktif</p>
                             <p className="text-xl font-black text-slate-900">{coupons.filter(c => c.isActive).length}</p>
                          </div>
                          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Puan</p>
                             <p className="text-xl font-black text-amber-500">★ {averageRating}</p>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] px-2">Son İşlemler</h3>
                          {stats?.recentUses?.map((use, idx) => (
                             <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50/30 rounded-2xl border border-slate-100/30">
                                <div className="bg-white p-2 rounded-xl"><CheckCircle2 className="w-4 h-4" /></div>
                                <div className="flex-1 min-w-0">
                                   <p className="text-xs font-bold text-slate-900 truncate">{use.couponTitle}</p>
                                   <p className="text-[10px] text-slate-400 font-medium">{use.code} • {use.usedAt?.toLocaleTimeString()}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  </section>
                </div>
              </div>
            )}
            {activeTab === 'coupons' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Henüz oluşturulmuş kuponunuz bulunmuyor.</p>
                  </div>
                ) : coupons.map(coupon => (
                  <div key={coupon.id} className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${coupon.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {coupon.isActive ? 'AKTİF' : 'PASİF'}
                      </div>
                      <Tag className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{coupon.title || 'İsimsiz Kupon'}</h3>
                    <p className="text-sm text-slate-500 mb-6 flex-1">{coupon.description}</p>
                    <div className="pt-6 border-t border-slate-100 mt-auto">
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                        <span>KULLANIM</span>
                        <span>{coupon.used_count || 0} / {coupon.total_limit || '∞'}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-1000" 
                          style={{ width: `${Math.min(((coupon.used_count || 0) / (coupon.total_limit || 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl mx-auto space-y-6">
                {reviews.length === 0 ? (
                  <div className="py-20 text-center bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Henüz yorum yapılmamış.</p>
                  </div>
                ) : reviews.map(review => (
                  <div key={review.id} className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-slate-900">{review.userName || 'Anonim Kullanıcı'}</p>
                        <p className="text-xs text-slate-400">{review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString('tr-TR') : ''}</p>
                      </div>
                      <div className="flex text-amber-400 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < (review.rating || 0) ? 'fill-current' : 'text-slate-200'}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'company' && companyData && (
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-sm border border-white space-y-8">
                   <div>
                     <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">İşletme Görseli</h3>
                     <div className="aspect-video rounded-3xl overflow-hidden border border-slate-100">
                        <img 
                          src={companyData.image_url || companyData.gorsel || '/assets/fotoyok.png'} 
                          alt={companyName}
                          className="w-full h-full object-cover"
                        />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kategori</p>
                        <p className="font-bold text-slate-900">{companyData.kategori || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Puan</p>
                        <p className="font-bold text-amber-500 text-lg">★ {averageRating}</p>
                      </div>
                   </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-sm border border-white space-y-8">
                   <div>
                     <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Hakkında</h3>
                     <p className="text-slate-600 leading-relaxed">{companyData.hakkinda || 'Açıklama belirtilmemiş.'}</p>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-50 rounded-lg"><Phone className="w-4 h-4 text-slate-400" /></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">İletişim</p>
                          <p className="font-bold text-slate-900">{companyData.iletisim || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-50 rounded-lg"><MapPin className="w-4 h-4 text-slate-400" /></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Adres</p>
                          <p className="font-bold text-slate-900">{companyData.adres || '-'}</p>
                        </div>
                      </div>
                   </div>
                   <div className="pt-6 border-t border-slate-100">
                     <p className="text-[10px] text-slate-400 font-medium">Bu bilgilerde hata varsa lütfen yönetici ile iletişime geçin.</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-10 rounded-[3rem] shadow-xl border border-white text-center">
                 <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                   <MessageCircle className="w-10 h-10" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 mb-4">Destek Merkezi</h2>
                 <p className="text-slate-500 font-medium mb-10">Sorunlarınız, talepleriniz veya bilgilerinizdeki güncellemeler için bize her zaman ulaşabilirsiniz.</p>
                 
                 <div className="grid sm:grid-cols-2 gap-6">
                    <a href="https://wa.me/905456962060" target="_blank" className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 hover:scale-105 transition-transform group">
                       <MessageCircle className="w-10 h-10 text-emerald-600 mx-auto mb-4 group-hover:animate-bounce" />
                       <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">WhatsApp</p>
                       <p className="font-bold text-emerald-900 mt-1">Hızlı Destek</p>
                    </a>
                    <a href="tel:+905456962060" className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 hover:scale-105 transition-transform group">
                       <Phone className="w-10 h-10 text-indigo-600 mx-auto mb-4 group-hover:animate-bounce" />
                       <p className="text-xs font-black text-indigo-700 uppercase tracking-widest">Telefon</p>
                       <p className="font-bold text-indigo-900 mt-1">Müşteri Hizmetleri</p>
                    </a>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default EsnafApp;
