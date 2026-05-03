import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { sendFCMNotification } from "../../lib/fcm";
import { 
  getDocs, 
  collection, 
  query, 
  where, 
  Timestamp, 
  runTransaction, 
  doc, 
  updateDoc,
  addDoc,
  increment, 
  onSnapshot,
  orderBy,
  limit
} from "firebase/firestore";
import { 
  KeyRound, 
  LogOut, 
  AlertCircle, 
  BarChart3, 
  RefreshCw, 
  CheckCircle2, 
  Building2, 
  Phone, 
  MessageCircle, 
  Tag, 
  MessageSquare, 
  MapPin, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2,
  TrendingUp,
  Clock,
  Settings,
  ShieldCheck,
  Send,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [stats, setStats] = useState<{
    totalUsed: number,
    dailyTrend: Array<{date: string, count: number}>,
    recentUses: Array<{id: string, code: string, usedAt: Date, couponTitle: string}>
  } | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const galleryRef = React.useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const scrollAmount = 400;
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
    // 1. Check URL params for auto-login from Admin
    const params = new URLSearchParams(window.location.search);
    const autoUser = params.get("auto_user");
    const autoCompany = params.get("auto_company");

    if (autoUser && autoCompany) {
      setUserId(autoUser);
      setCompanyId(autoCompany);
      localStorage.setItem("esnaf_user_id", autoUser);
      localStorage.setItem("esnaf_firma_id", autoCompany);
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      return;
    }

    // 2. Check LocalStorage
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

  const handleReply = async (reviewId: string, reviewerId: string) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, {
        reply: {
          text: replyText.trim(),
          createdAt: Timestamp.now()
        }
      });

      // ADD NOTIFICATION RECORD (FOR HISTORY)
      await addDoc(collection(db, "duyurular"), {
        baslik: "İşletme Yanıtı 💬",
        icerik: `${companyName} yorumunuza yanıt verdi: "${replyText.trim().substring(0, 50)}${replyText.length > 50 ? '...' : ''}"`,
        tarih: Timestamp.now(),
        targetUserId: reviewerId,
        type: "review_reply"
      });

      // SEND PUSH NOTIFICATION (FCM)
      try {
        const tokensQ = query(
          collection(db, "user_tokens"), 
          where("userId", "==", reviewerId),
          where("isEnabled", "==", true)
        );
        const tokensSnapshot = await getDocs(tokensQ);
        
        const pushPromises = tokensSnapshot.docs.map(tokenDoc => {
          const token = tokenDoc.data().token;
          return sendFCMNotification(
            "İşletme Yanıtı 💬",
            `${companyName} yorumunuza yanıt verdi.`,
            '/notifications', // Redirect to notifications screen on mobile
            token
          );
        });

        await Promise.all(pushPromises);
      } catch (fcmErr) {
        console.error("FCM Send error:", fcmErr);
        // Don't block the UI if push fails
      }

      setReplyingTo(null);
      setReplyText("");
    } catch (err) {
      console.error("Reply error:", err);
      alert("Yanıt gönderilemedi.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const deleteReply = async (reviewId: string) => {
    if (!window.confirm("Yanıtınızı silmek istediğinize emin misiniz?")) return;
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, {
        reply: null
      });
    } catch (err) {
      console.error("Delete reply error:", err);
    }
  };

  if (userId === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] p-4 relative overflow-hidden font-sans">
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px]" 
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl p-10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="text-center mb-10">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/40 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                <Building2 className="h-10 w-10 text-white relative z-10" />
              </motion.div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">Esnaf Paneli</h1>
              <p className="text-slate-400 text-sm font-medium tracking-wide">Yönetim ve Kupon Doğrulama</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Kullanıcı Adı</label>
                <input 
                  type="text" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="isletme_adi" 
                  className="block w-full bg-white/[0.05] rounded-2xl border border-white/10 text-white px-6 py-4 focus:bg-white/[0.08] focus:border-indigo-500/50 transition-all outline-none placeholder:text-slate-600" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Şifre</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="block w-full bg-white/[0.05] rounded-2xl border border-white/10 text-white px-6 py-4 focus:bg-white/[0.08] focus:border-indigo-500/50 transition-all outline-none placeholder:text-slate-600" 
                  required 
                />
              </div>

              <AnimatePresence>
                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 font-bold text-xs flex items-center gap-3"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {loginError}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={isLoggingIn} 
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoggingIn ? (
                  <RefreshCw className="h-6 w-6 animate-spin" />
                ) : (
                  <>Giriş Yap <ChevronRight className="w-5 h-5" /></>
                )}
              </motion.button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Destek Hattı</p>
              <div className="flex gap-4 w-full">
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="https://wa.me/905456962060" 
                  target="_blank" 
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl border border-emerald-500/20 font-black text-[10px] uppercase tracking-wider"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="tel:+905456962060" 
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-slate-300 p-4 rounded-2xl border border-white/10 font-black text-[10px] uppercase tracking-wider"
                >
                  <Phone className="h-4 w-4" /> Telefon
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans selection:bg-indigo-100 relative overflow-hidden">
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-5">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="bg-gradient-to-br from-indigo-600 to-violet-700 p-3 rounded-2xl shadow-lg shadow-indigo-500/20"
            >
              <Building2 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">{companyName || 'İşletme Paneli'}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-100">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">KURUMSAL SİSTEM</p>
                </div>
              </div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: '#fee2e2' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout} 
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-black text-slate-600 hover:text-red-600 bg-slate-100 rounded-xl transition-all border border-slate-200"
          >
            <LogOut className="w-4 h-4" /> ÇIKIŞ YAP
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 relative z-10 max-w-7xl">
        {!companyId ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center gap-6 max-w-lg mx-auto"
          >
            <div className="p-6 bg-amber-50 text-amber-500 rounded-3xl">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Yetki Bekleniyor</h3>
              <p className="text-slate-500 font-medium">Bu işlem için yönetici onayı veya bir işletme eşleşmesi gerekiyor.</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              Yeniden Dene
            </button>
          </motion.div>
        ) : (
          <div className="space-y-10">
            <div className="flex justify-center">
              <nav className="flex items-center gap-1 p-1.5 bg-white rounded-full shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden">
                {[
                  { id: 'dashboard', label: 'DASHBOARD', icon: BarChart3 },
                  { id: 'coupons', label: `KUPONLAR (${coupons.length})`, icon: Tag },
                  { id: 'reviews', label: `YORUMLAR (${reviews.length})`, icon: MessageSquare },
                  { id: 'company', label: 'İŞLETME', icon: Building2 },
                  { id: 'support', label: 'DESTEK', icon: MessageCircle },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`relative px-6 py-3 rounded-full text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <tab.icon className={`w-3.5 h-3.5 relative z-10 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >

            {activeTab === 'dashboard' && (
              <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                  <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap className="w-40 h-40 text-indigo-600" />
                    </div>
                    
                    <div className="flex items-center gap-6 mb-12 relative z-10">
                      <div className="p-5 bg-indigo-50 rounded-3xl text-indigo-600 border border-indigo-100 shadow-inner">
                        <KeyRound className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900">Kupon Doğrulama</h2>
                        <p className="text-slate-500 font-medium">6 haneli kupon kodunu onaylayarak kullanımı gerçekleştirin.</p>
                      </div>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-10 relative z-10">
                      <div className="relative">
                        <input 
                          type="text" 
                          value={couponCode} 
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                          placeholder="• • • • • •" 
                          maxLength={6} 
                          className="w-full text-center text-7xl font-black tracking-[0.4em] py-14 rounded-[2.5rem] border-2 border-slate-100 bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white focus:shadow-2xl focus:shadow-indigo-500/10 transition-all placeholder:text-slate-200" 
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 left-10 pointer-events-none opacity-20">
                          <Tag className="w-10 h-10 text-slate-400" />
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={isVerifying || couponCode.length !== 6} 
                        className="w-full bg-slate-900 text-white py-7 rounded-[2rem] font-black text-xl shadow-2xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex items-center gap-4">
                          {isVerifying ? (
                            <RefreshCw className="w-8 h-8 animate-spin" />
                          ) : (
                            <><CheckCircle2 className="w-8 h-8" /> KUPONU KULLAN</>
                          )}
                        </div>
                      </motion.button>

                      <AnimatePresence>
                        {verifyStatus && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-6 rounded-3xl border-2 font-black text-sm text-center flex items-center justify-center gap-4 ${
                              verifyStatus.type === 'success' 
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                : 'bg-rose-50 border-rose-100 text-rose-700'
                            }`}
                          >
                            {verifyStatus.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                            {verifyStatus.msg}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </section>

                  <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Haftalık Trend</h3>
                      <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-indigo-100">
                        <TrendingUp className="w-3.5 h-3.5" /> %12 ARTIŞ
                      </div>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-48">
                      {stats?.dailyTrend.map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                          <div className="w-full relative flex flex-col justify-end h-32">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${(day.count / (Math.max(...stats.dailyTrend.map(d => d.count)) || 1)) * 100}%` }}
                              className="w-full bg-slate-100 group-hover:bg-indigo-500 rounded-t-xl transition-all relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                            </motion.div>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md">
                              {day.count}
                            </div>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                            {day.date.split('.')[0]} {['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'][parseInt(day.date.split('.')[1])-1]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="lg:col-span-4 space-y-10">
                  <section className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-lg font-black text-slate-900 flex items-center gap-3">
                         <BarChart3 className="w-5 h-5 text-indigo-600" /> ÖZET
                       </h2>
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20">
                         CANLI
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       {[
                         { label: 'TOPLAM KULLANIM', value: stats?.totalUsed || 0, color: 'indigo', icon: CheckCircle2 },
                         { label: 'AKTİF KAMPANYA', value: coupons.filter(c => c.isActive).length, color: 'emerald', icon: Zap },
                         { label: 'ORTALAMA PUAN', value: `★ ${averageRating}`, color: 'amber', icon: Star },
                       ].map((stat, idx) => (
                         <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-100 transition-all">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                              <stat.icon className={`w-4 h-4 text-${stat.color}-500 opacity-50`} />
                            </div>
                            <p className={`text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors`}>{stat.value}</p>
                         </div>
                       ))}
                    </div>
                  </section>

                  <section className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-600" /> SON İŞLEMLER
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {stats?.recentUses?.length === 0 ? (
                        <p className="text-center py-10 text-xs font-bold text-slate-400">Henüz işlem yok.</p>
                      ) : stats?.recentUses?.map((use, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all"
                        >
                          <div className="bg-white p-2.5 rounded-xl shadow-sm group-hover:text-indigo-600">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{use.couponTitle}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{use.code} • {use.usedAt?.toLocaleTimeString()}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}
            {activeTab === 'coupons' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coupons.length === 0 ? (
                  <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <Tag className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Henüz kampanya bulunmuyor.</p>
                  </div>
                ) : coupons.map((coupon, idx) => (
                  <motion.div 
                    key={coupon.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
                    <div className="relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full overflow-hidden">
                      <div className="flex justify-between items-start mb-8">
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] border ${
                          coupon.isActive 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
                          {coupon.isActive ? 'AKTİF KAMPANYA' : 'PASİF'}
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <Tag className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                        {coupon.title || 'İsimsiz Kupon'}
                      </h3>
                      <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed font-medium">
                        {coupon.description}
                      </p>

                      <div className="pt-8 border-t border-slate-100 mt-auto">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">
                          <span>KULLANIM ORANI</span>
                          <span className="text-slate-900">{coupon.used_count || 0} / {coupon.total_limit || '∞'}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(((coupon.used_count || 0) / (coupon.total_limit || 1)) * 100, 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full shadow-sm" 
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-4xl mx-auto space-y-8">
                {reviews.length === 0 ? (
                  <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Henüz değerlendirme yok.</p>
                  </div>
                ) : reviews.map((review, idx) => (
                  <motion.div 
                    key={review.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8 relative group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Star className="w-32 h-32 text-amber-500" />
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl border border-white">
                          {review.userName?.[0] || 'A'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg">{review.userName || 'Anonim Müşteri'}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString('tr-TR') : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 text-amber-500 gap-1 shadow-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < (review.rating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>

                    <div className="relative z-10">
                      <p className="text-slate-600 text-lg leading-relaxed italic font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        "{review.comment}"
                      </p>
                    </div>

                    <AnimatePresence>
                      {review.reply ? (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="ml-10 p-8 bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100/50 relative overflow-hidden group/reply"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <img 
                              src={companyData?.image_url || companyData?.gorsel || '/assets/fotoyok.png'} 
                              className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md shadow-indigo-200"
                              alt="İşletme"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{companyName}</p>
                                <span className="bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full">YÖNETİCİ</span>
                              </div>
                              <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-tighter">İŞLETME YANITI</p>
                            </div>
                          </div>
                          <p className="text-slate-700 leading-relaxed font-medium">{review.reply.text}</p>
                          
                          <div className="mt-6 flex gap-4 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                             <button 
                              onClick={() => {
                                setReplyingTo(review.id);
                                setReplyText(review.reply.text);
                              }}
                              className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-[10px] font-black border border-indigo-100 shadow-sm hover:bg-indigo-50"
                            >
                              DÜZENLE
                            </button>
                            <button 
                              onClick={() => deleteReply(review.id)}
                              className="px-4 py-2 bg-white text-rose-500 rounded-xl text-[10px] font-black border border-rose-100 shadow-sm hover:bg-rose-50"
                            >
                              SİL
                            </button>
                          </div>
                        </motion.div>
                      ) : replyingTo === review.id ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="ml-10 space-y-4"
                        >
                          <div className="relative">
                            <textarea 
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Müşterinize profesyonel bir yanıt verin..."
                              className="w-full p-8 rounded-[2rem] bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all h-32 shadow-inner font-medium"
                            />
                            <div className="absolute top-4 right-4 text-indigo-200">
                              <MessageCircle className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleReply(review.id, review.userId)}
                              disabled={isSubmittingReply || !replyText.trim()}
                              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 uppercase tracking-widest"
                            >
                              {isSubmittingReply ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> YANITI GÖNDER</>}
                            </motion.button>
                            <button 
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              className="px-8 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all uppercase tracking-widest"
                            >
                              İPTAL
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="ml-10 pt-4">
                          <motion.button 
                            whileHover={{ x: 5 }}
                            onClick={() => setReplyingTo(review.id)}
                            className="flex items-center gap-3 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-all group/btn"
                          >
                            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center group-hover/btn:bg-indigo-600 group-hover/btn:text-white transition-colors">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            BU YORUMU YANITLA
                          </motion.button>
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'company' && companyData && (
              <div className="max-w-6xl mx-auto space-y-12 pb-20">
                {/* HERO SECTION */}
                <div className="relative h-80 rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white">
                  <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={companyData.images?.[0] || companyData.image_url || companyData.gorsel || '/assets/fotoyok.png'} 
                    className="w-full h-full object-cover"
                    alt="Kapak"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-14">
                    <div className="w-full flex justify-between items-end">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                            {companyData.kategori || 'İşletme'}
                          </span>
                          <div className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg shadow-amber-500/20">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{averageRating} PUAN</span>
                          </div>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">{companyName}</h1>
                      </div>
                      <motion.button 
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => setActiveTab('support')}
                         className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-slate-50 transition-colors"
                      >
                        BİLGİLERİ GÜNCELLE
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4 space-y-8">
                    <section className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Phone className="w-24 h-24 text-indigo-600" />
                      </div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50 pb-6 relative z-10">İLETİŞİM</h3>
                      
                      <div className="space-y-8 relative z-10">
                        <div className="flex items-start gap-5 group">
                          <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <Phone className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">TELEFON HATTI</p>
                            <p className="font-black text-slate-900 text-lg">{companyData.iletisim || '-'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-5 group">
                          <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">KONUM / ADRES</p>
                            <p className="font-bold text-slate-600 text-sm leading-relaxed">{companyData.adres || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-950/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                      <h3 className="font-black text-2xl mb-4 tracking-tighter">İşletme Yönetimi</h3>
                      <p className="text-indigo-200/80 text-sm mb-10 leading-relaxed font-medium">Fotoğraf eklemek, çalışma saatlerini düzenlemek veya kampanya oluşturmak için WhatsApp hattımızdan talep oluşturabilirsiniz.</p>
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const adminPhone = "905456962060";
                          const message = encodeURIComponent(`${companyName} (${companyId}) işletme bilgilerimi güncellemek istiyorum.`);
                          window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
                        }}
                        className="w-full bg-white text-indigo-950 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 shadow-xl"
                      >
                        <MessageCircle className="w-5 h-5" /> WHATSAPP TALEP
                      </motion.button>
                    </section>
                  </div>

                  <div className="lg:col-span-8 space-y-12">
                    <section className="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                        <Building2 className="w-60 h-60 text-indigo-950" />
                      </div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b border-slate-50 pb-6">HAKKINDA</h3>
                      <p className="text-slate-600 leading-relaxed text-xl font-medium italic relative z-10">
                        "{companyData.hakkinda || 'Bu işletme hakkında detaylı bilgi henüz girilmemiş.'}"
                      </p>
                    </section>

                    <section className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">MEDYA GALERİSİ</h3>
                        <div className="flex gap-3">
                           <button onClick={() => scrollGallery('left')} className="p-3 bg-white rounded-2xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all border border-slate-100">
                             <ChevronLeft className="w-5 h-5" />
                           </button>
                           <button onClick={() => scrollGallery('right')} className="p-3 bg-white rounded-2xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all border border-slate-100">
                             <ChevronRight className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                      
                      <div 
                        ref={galleryRef}
                        className="flex gap-8 overflow-x-auto pb-10 px-2 no-scrollbar scroll-smooth" 
                      >
                        {companyData.images?.map((url: string, index: number) => (
                          <motion.div 
                            key={index} 
                            whileHover={{ scale: 1.05, y: -5 }}
                            onClick={() => setSelectedImage(url)}
                            className="flex-none w-[400px] aspect-video rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl cursor-zoom-in group relative"
                          >
                            <img src={url} className="w-full h-full object-cover" alt={`Medya ${index + 1}`} />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                               <div className="bg-white text-slate-900 p-4 rounded-full shadow-2xl">
                                 <Maximize2 className="w-6 h-6" />
                               </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
                
                <AnimatePresence>
                  {selectedImage && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-20"
                      onClick={() => setSelectedImage(null)}
                    >
                      <button 
                        className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors p-4 bg-white/5 rounded-2xl border border-white/10"
                        onClick={() => setSelectedImage(null)}
                      >
                        <X className="w-8 h-8" />
                      </button>
                      <motion.img 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        src={selectedImage} 
                        className="max-w-full max-h-full rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] object-contain border-4 border-white/10"
                        alt="Medya Detay"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTab === 'support' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto bg-white p-16 rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />
                 
                 <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                   <MessageCircle className="w-12 h-12" />
                 </div>
                 
                 <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Kurumsal Destek Merkezi</h2>
                 <p className="text-slate-500 font-medium mb-16 text-lg max-w-2xl mx-auto">Sistem kullanımı, teknik sorunlar veya işletme bilgilerinizdeki güncellemeler için yanınızdayız.</p>
                 
                 <div className="grid sm:grid-cols-2 gap-8">
                    <motion.a 
                      whileHover={{ y: -10, scale: 1.02 }}
                      href="https://wa.me/905456962060" 
                      target="_blank" 
                      className="p-12 bg-emerald-50 rounded-[3rem] border border-emerald-100 hover:border-emerald-200 transition-all group relative overflow-hidden"
                    >
                       <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                       <MessageCircle className="w-12 h-12 text-emerald-600 mx-auto mb-6 group-hover:animate-bounce" />
                       <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em] mb-2">HIZLI YANIT</p>
                       <p className="font-black text-emerald-950 text-xl">WhatsApp Hattı</p>
                    </motion.a>

                    <motion.a 
                      whileHover={{ y: -10, scale: 1.02 }}
                      href="tel:+905456962060" 
                      className="p-12 bg-slate-900 rounded-[3rem] text-white hover:bg-slate-800 transition-all group relative overflow-hidden shadow-2xl shadow-slate-900/20"
                    >
                       <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                       <Phone className="w-12 h-12 text-white mx-auto mb-6 group-hover:animate-bounce" />
                       <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">BİZE ULAŞIN</p>
                       <p className="font-black text-white text-xl">Müşteri Temsilcisi</p>
                    </motion.a>
                 </div>

                 <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col items-center gap-4">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">SEYDİ REHBER KURUMSAL SİSTEM</p>
                 </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    )}
      </main>
    </div>
  );
}

export default EsnafApp;
