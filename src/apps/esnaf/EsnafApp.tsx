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
  deleteDoc,
  increment,
  onSnapshot,
  orderBy,
  limit
} from "firebase/firestore";
import {
  KeyRound,
  LogOut,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Building2,
  Phone,
  MessageCircle,
  Tag,
  MessageSquare,
  MapPin,
  Star,
  ChevronRight,
  X,
  TrendingUp,
  Clock,
  ShieldCheck,
  Send,
  Zap,
  ShoppingBag,
  Store,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Percent,
  LifeBuoy,
  Eye,
  EyeOff,
  type LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUPPORT_PHONE = "905456962060";

// Ortak sınıflar: açık tema, uygulamanın yeşili.
const card = "bg-white rounded-2xl border border-gray-200 shadow-sm";
const label = "block text-sm font-semibold text-gray-700 mb-1.5";
const input = "block w-full bg-white rounded-xl border border-gray-300 text-gray-900 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/15 transition placeholder:text-gray-400";
const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnSoft = "inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm px-4 py-2.5 transition-colors";

function EsnafApp() {
  const [userId, setUserId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Kampanya kartlarında süre kontrolü için (render sırasında Date.now çağrılmasın).
  const [nowMs] = useState(() => Date.now());
  const [reviewFilter, setReviewFilter] = useState<'unanswered' | 'all'>('all');

  const [couponCode, setCouponCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

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
    dailyTrend: Array<{ date: string, count: number }>,
    recentUses: Array<{ id: string, code: string, usedAt: Date, couponTitle: string }>
  } | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    title: "",
    description: "",
    discountPercentage: "",
    expiryDate: "",
    totalLimit: "",
    isInformational: false
  });
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  const getDigitalInfo = () => {
    const category = (companyData?.kategori || "").toLowerCase();
    const url = (companyData?.menu_url || "").toLowerCase();

    if (url.includes("shopier.com")) {
      return {
        label: "Shopier Mağazası",
        description: "Müşterilerinizin ürünlerinizi satın alabileceği Shopier mağazanıza buradan erişin.",
        buttonText: "MAĞAZAYI GÖRÜNTÜLE",
        icon: ShoppingBag
      };
    }

    if (category.includes("restoran") || category.includes("kafe") || category.includes("lokanta") || category.includes("pastane")) {
      return {
        label: "Dijital QR Menü",
        description: "Müşterilerinizin masadan göreceği dijital menünüze buradan erişin.",
        buttonText: "MENÜYÜ GÖRÜNTÜLE",
        icon: Zap
      };
    }

    if (category.includes("giyim") || category.includes("mağaza") || category.includes("butik") || category.includes("ayakkabı") || category.includes("aksesuar")) {
      return {
        label: "Dijital Mağaza / Katalog",
        description: "Müşterilerinizin ürünlerinizi inceleyebileceği dijital kataloğunuza buradan erişin.",
        buttonText: "MAĞAZAYI GÖRÜNTÜLE",
        icon: Store
      };
    }

    return {
      label: "Dijital Katalog / Platform",
      description: "Müşterilerinizin göreceği dijital mağaza, menü veya kataloğunuza buradan erişin.",
      buttonText: "DİJİTALİ GÖRÜNTÜLE",
      icon: Zap
    };
  };

  const digitalInfo = getDigitalInfo();

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
    if (!fId) return () => { };
    const q = query(collection(db, "coupons"), where("companyId", "==", fId));
    return onSnapshot(q, (snapshot) => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLastSync(new Date());
    }, (err) => {
      console.error("Coupons fetch error:", err);
    });
  };

  const fetchReviews = (fId: string) => {
    if (!fId) return () => { };
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
    if (!fId) return () => { };
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
      const last7Days = Array.from({ length: 7 }, (_, i) => {
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
    if (!fId) return () => { };
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
        setVerifyStatus({ type: 'error', msg: "Geçersiz veya süresi dolmuş kupon." });
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
      setVerifyStatus({ type: 'success', msg: "Kupon başarıyla doğrulandı!" });
      setCouponCode("");
    } catch (err: any) {
      setVerifyStatus({ type: 'error', msg: err.message || "Hata oluştu." });
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

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !companyName) return;
    setIsAddingCoupon(true);
    try {
      const couponData = {
        title: newCoupon.title,
        description: newCoupon.description,
        discountPercentage: newCoupon.isInformational ? 0 : (Number(newCoupon.discountPercentage) || 0),
        companyId: companyId,
        companyName: companyName,
        expiry_date: newCoupon.expiryDate ? Timestamp.fromDate(new Date(newCoupon.expiryDate)) : null,
        total_limit: newCoupon.isInformational ? null : (newCoupon.totalLimit ? Number(newCoupon.totalLimit) : null),
        isInformational: !!newCoupon.isInformational,
        isActive: true,
        used_count: editingCouponId ? undefined : 0, // Don't reset count on edit
        created_at: editingCouponId ? undefined : Timestamp.now()
      };

      // Remove undefined fields for update
      const cleanData = Object.fromEntries(Object.entries(couponData).filter(([_, v]) => v !== undefined));

      if (editingCouponId) {
        await updateDoc(doc(db, "coupons", editingCouponId), cleanData);
      } else {
        await addDoc(collection(db, "coupons"), cleanData);
      }

      setShowAddCouponModal(false);
      setEditingCouponId(null);
      setNewCoupon({
        title: "",
        description: "",
        discountPercentage: "",
        expiryDate: "",
        totalLimit: "",
        isInformational: false
      });
    } catch (err) {
      console.error("Add/Update coupon error:", err);
      alert("Kupon kaydedilirken bir hata oluştu.");
    } finally {
      setIsAddingCoupon(false);
    }
  };

  const openEditModal = (coupon: any) => {
    setEditingCouponId(coupon.id);
    setNewCoupon({
      title: coupon.title,
      description: coupon.description,
      discountPercentage: String(coupon.discountPercentage || ""),
      expiryDate: coupon.expiry_date ? coupon.expiry_date.toDate().toISOString().split('T')[0] : "",
      totalLimit: coupon.total_limit ? String(coupon.total_limit) : "",
      isInformational: coupon.isInformational || false
    });
    setShowAddCouponModal(true);
  };

  const deleteCoupon = async (couponId: string) => {
    if (!window.confirm("Bu kampanyayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    try {
      await updateDoc(doc(db, "coupons", couponId), { isActive: false });
      // Or actually delete it:
      // await deleteDoc(doc(db, "coupons", couponId));
      // User might prefer marking as inactive or deleting. The admin panel seems to delete.
      await deleteDoc(doc(db, "coupons", couponId));
    } catch (err) {
      console.error("Delete coupon error:", err);
      alert("Kupon silinemedi.");
    }
  };


  const unansweredCount = reviews.filter((r) => !r.reply).length;
  const weekTotal = stats?.dailyTrend.reduce((sum, d) => sum + d.count, 0) ?? 0;
  const weekMax = Math.max(1, ...(stats?.dailyTrend.map((d) => d.count) ?? [0]));
  // fetchStats en fazla 100 kayıt getiriyor; 100'e ulaşınca gerçek sayı daha büyük olabilir.
  const totalUsedLabel = stats ? (stats.totalUsed >= 100 ? '100+' : String(stats.totalUsed)) : '0';
  const visibleReviews = reviewFilter === 'unanswered' ? reviews.filter((r) => !r.reply) : reviews;

  const openNewCouponModal = () => {
    setEditingCouponId(null);
    setNewCoupon({
      title: "",
      description: "",
      discountPercentage: "",
      expiryDate: "",
      totalLimit: "",
      isInformational: false
    });
    setShowAddCouponModal(true);
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Kupon Onayla', short: 'Onayla', icon: KeyRound },
    { id: 'coupons' as const, label: 'Kampanyalar', short: 'Kampanya', icon: Tag, count: coupons.length },
    { id: 'reviews' as const, label: 'Yorumlar', short: 'Yorumlar', icon: MessageSquare, badge: unansweredCount },
    { id: 'company' as const, label: 'İşletmem', short: 'İşletmem', icon: Building2 },
    { id: 'support' as const, label: 'Destek', short: 'Destek', icon: LifeBuoy },
  ];

  if (userId === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f5] p-4 font-sans">
        <div className="max-w-sm w-full">
          <div className={`${card} p-7 md:p-8`}>
            <div className="text-center mb-7">
              <img src="/icon.png" alt="Seydi Rehber" className="mx-auto w-16 h-16 rounded-2xl shadow-sm mb-4" />
              <h1 className="text-2xl font-extrabold text-gray-900">Esnaf Paneli</h1>
              <p className="text-gray-500 text-sm mt-1">Kupon onaylayın, kampanya açın, yorumlara yanıt verin.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={label} htmlFor="esnaf-user">Kullanıcı adı / e-posta</label>
                <input
                  id="esnaf-user"
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  className={input}
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="esnaf-pass">Şifre</label>
                <div className="relative">
                  <input
                    id="esnaf-pass"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className={`${input} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700"
                    aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-red-700 font-medium text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {loginError}
                </div>
              )}

              <button type="submit" disabled={isLoggingIn} className={`${btnPrimary} w-full py-3.5 text-base`}>
                {isLoggingIn ? <RefreshCw className="h-5 w-5 animate-spin" /> : <>Giriş Yap <ChevronRight className="w-5 h-5" /></>}
              </button>
            </form>

            <div className="mt-7 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500 mb-3">Şifrenizi mi unuttunuz? Bize ulaşın:</p>
              <div className="grid grid-cols-2 gap-2">
                <a href={`https://wa.me/${SUPPORT_PHONE}`} target="_blank" rel="noreferrer" className={`${btnSoft} bg-green-50 text-green-800 border-green-200 hover:bg-green-100`}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a href={`tel:+${SUPPORT_PHONE}`} className={btnSoft}>
                  <Phone className="h-4 w-4" /> Ara
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-gray-900 font-sans">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3">
          {companyData?.image_url || companyData?.gorsel ? (
            <img src={companyData.image_url || companyData.gorsel} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
          ) : (
            <img src="/icon.png" alt="" className="w-10 h-10 rounded-xl" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 truncate leading-tight">{companyName || 'İşletme Paneli'}</p>
            <p className="text-xs text-gray-500">Seydi Rehber Esnaf Paneli</p>
          </div>
          <button onClick={handleLogout} className={`${btnSoft} px-3`} title="Çıkış Yap">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>

        {companyId && (
          <nav className="hidden md:block max-w-6xl mx-auto px-6">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${activeTab === tab.id ? 'text-green-800' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {!!tab.badge && <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center">{tab.badge}</span>}
                  {activeTab === tab.id && <motion.span layoutId="esnaf-tab" className="absolute left-2 right-2 -bottom-px h-0.5 bg-green-700 rounded-full" />}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-8 pb-28 md:pb-12">
        {error && (
          <div className="mb-5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {!companyId ? (
          <div className={`${card} p-8 flex flex-col items-center text-center gap-4 max-w-md mx-auto`}>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Hesabınız bir işletmeye bağlı değil</h3>
              <p className="text-gray-500">Hesabınızın işletmenizle eşleştirilmesi için bizimle iletişime geçin.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.location.reload()} className={btnSoft}>Yeniden Dene</button>
              <a href={`https://wa.me/${SUPPORT_PHONE}`} target="_blank" rel="noreferrer" className={btnPrimary}>
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'dashboard' && (
                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5 md:gap-6">
                  <div className="space-y-5 md:space-y-6">
                    <section className={`${card} p-5 md:p-8`}>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="p-3 bg-green-50 rounded-xl text-green-700">
                          <KeyRound className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-extrabold">Kupon Onayla</h2>
                          <p className="text-sm text-gray-500">Müşterinin telefonundaki 6 haneli kodu yazın.</p>
                        </div>
                      </div>

                      <form onSubmit={handleVerify} className="space-y-4">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase().replace(/\s/g, ''));
                            setVerifyStatus(null);
                          }}
                          placeholder="______"
                          maxLength={6}
                          autoFocus
                          autoComplete="off"
                          autoCapitalize="characters"
                          spellCheck={false}
                          aria-label="Kupon kodu"
                          className="w-full text-center text-4xl md:text-6xl font-extrabold tracking-[0.3em] py-6 md:py-8 rounded-2xl border-2 border-gray-200 bg-gray-50 outline-none focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/15 transition-all placeholder:text-gray-300 font-mono"
                        />
                        <p className="text-center text-sm text-gray-400 tabular-nums">{couponCode.length}/6 karakter</p>

                        <button type="submit" disabled={isVerifying || couponCode.length !== 6} className={`${btnPrimary} w-full py-4 text-lg`}>
                          {isVerifying ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><CheckCircle2 className="w-6 h-6" /> Kuponu Onayla</>}
                        </button>

                        <AnimatePresence>
                          {verifyStatus && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.97 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className={`p-5 rounded-2xl border-2 flex items-center gap-4 ${verifyStatus.type === 'success'
                                ? 'bg-green-50 border-green-300 text-green-900'
                                : 'bg-red-50 border-red-300 text-red-900'
                                }`}
                            >
                              {verifyStatus.type === 'success' ? <CheckCircle2 className="w-10 h-10 text-green-600 flex-shrink-0" /> : <AlertCircle className="w-10 h-10 text-red-600 flex-shrink-0" />}
                              <div>
                                <p className="text-lg font-bold">{verifyStatus.type === 'success' ? 'Onaylandı' : 'Onaylanamadı'}</p>
                                <p className="text-sm">{verifyStatus.msg}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </form>
                    </section>

                    <section className={`${card} p-5 md:p-7`}>
                      <div className="flex items-start justify-between gap-3 mb-6">
                        <div>
                          <h3 className="font-bold text-gray-900">Son 7 gün</h3>
                          <p className="text-sm text-gray-500">Bu hafta <b className="text-gray-900">{weekTotal}</b> kupon kullanıldı</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-gray-300" />
                      </div>
                      <div className="flex items-end justify-between gap-2 h-36">
                        {stats?.dailyTrend.map((day) => {
                          const [d, m, y] = day.date.split('.').map(Number);
                          const weekday = new Date(y, m - 1, d).toLocaleDateString('tr-TR', { weekday: 'short' });
                          return (
                            <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full">
                              <span className="text-xs font-bold text-gray-700 tabular-nums">{day.count > 0 ? day.count : ''}</span>
                              <div className="w-full flex-1 flex items-end">
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: `${Math.max((day.count / weekMax) * 100, day.count > 0 ? 6 : 2)}%` }}
                                  className={`w-full rounded-t-lg ${day.count > 0 ? 'bg-green-600' : 'bg-gray-100'}`}
                                />
                              </div>
                              <span className="text-xs text-gray-500 font-medium">{weekday}</span>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  </div>

                  <div className="space-y-5 md:space-y-6">
                    <section className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                      {[
                        { label: 'Kullanılan kupon', value: totalUsedLabel, icon: CheckCircle2, color: 'text-green-700 bg-green-50' },
                        { label: 'Aktif kampanya', value: coupons.filter(c => c.isActive && !(c.expiry_date?.toDate && c.expiry_date.toDate().getTime() < nowMs)).length, icon: Tag, color: 'text-blue-700 bg-blue-50' },
                        { label: 'Ortalama puan', value: averageRating, icon: Star, color: 'text-amber-600 bg-amber-50' },
                      ].map((s) => (
                        <div key={s.label} className={`${card} p-4 flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4`}>
                          <div className={`p-2.5 rounded-xl w-fit ${s.color}`}><s.icon className="w-5 h-5" /></div>
                          <div>
                            <p className="text-2xl font-extrabold tabular-nums leading-tight">{s.value}</p>
                            <p className="text-xs md:text-sm text-gray-500">{s.label}</p>
                          </div>
                        </div>
                      ))}
                    </section>

                    {unansweredCount > 0 && (
                      <button onClick={() => { setReviewFilter('unanswered'); setActiveTab('reviews'); }} className="w-full text-left bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 hover:bg-amber-100 transition-colors">
                        <MessageSquare className="w-5 h-5 text-amber-700" />
                        <p className="flex-1 text-sm text-amber-900"><b>{unansweredCount} yorum</b> yanıtınızı bekliyor</p>
                        <ChevronRight className="w-5 h-5 text-amber-700" />
                      </button>
                    )}

                    <section className={`${card} p-5`}>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-gray-400" /> Son onaylanan kuponlar
                      </h3>
                      {!stats?.recentUses?.length ? (
                        <p className="text-center py-8 text-sm text-gray-400">Henüz kupon kullanılmadı.</p>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {stats.recentUses.map((use) => (
                            <li key={use.id} className="flex items-center gap-3 py-3">
                              <div className="p-2 rounded-lg bg-green-50 text-green-700"><CheckCircle2 className="w-4 h-4" /></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{use.couponTitle}</p>
                                <p className="text-xs text-gray-500 font-mono">{use.code}</p>
                              </div>
                              <p className="text-xs text-gray-500 text-right whitespace-nowrap">
                                {use.usedAt?.toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  </div>
                </div>
              )}

              {activeTab === 'coupons' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-2xl font-extrabold">Kampanyalar</h2>
                      <p className="text-gray-500">Uygulamada müşterilere gösterilen kuponlarınız.</p>
                    </div>
                    <button onClick={openNewCouponModal} className={`${btnPrimary} py-3`}>
                      <Plus className="w-5 h-5" /> Yeni Kampanya
                    </button>
                  </div>

                  {coupons.length === 0 ? (
                    <div className={`${card} py-16 px-6 text-center`}>
                      <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="font-bold text-gray-900">Henüz kampanyanız yok</p>
                      <p className="text-gray-500 text-sm mt-1 mb-5">İlk kampanyanızı oluşturun; uygulamada kuponlar bölümünde görünsün.</p>
                      <button onClick={openNewCouponModal} className={btnPrimary}><Plus className="w-4 h-4" /> Kampanya Oluştur</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {coupons.map((coupon) => {
                        const used = coupon.used_count || 0;
                        const limit = coupon.total_limit;
                        const expired = coupon.expiry_date?.toDate && coupon.expiry_date.toDate().getTime() < nowMs;
                        return (
                          <div key={coupon.id} className={`${card} p-5 flex flex-col`}>
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div>
                                {coupon.discountPercentage > 0 ? (
                                  <p className="text-3xl font-extrabold text-green-700">%{coupon.discountPercentage} <span className="text-sm font-semibold text-gray-500">indirim</span></p>
                                ) : (
                                  <p className="text-lg font-extrabold text-green-700">Özel fırsat</p>
                                )}
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${expired ? 'bg-red-50 text-red-700' : coupon.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {expired ? 'Süresi doldu' : coupon.isActive ? 'Yayında' : 'Pasif'}
                              </span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg leading-snug">{coupon.title}</h3>
                            {coupon.description && <p className="text-sm text-gray-500 mt-1 line-clamp-3">{coupon.description}</p>}

                            <div className="mt-auto pt-4">
                              <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-gray-500">Kullanım</span>
                                <span className="font-semibold tabular-nums">{used} / {limit || 'Sınırsız'}</span>
                              </div>
                              {limit ? (
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-600 rounded-full" style={{ width: `${Math.min((used / limit) * 100, 100)}%` }} />
                                </div>
                              ) : null}
                              {coupon.expiry_date?.toDate && (
                                <p className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" /> Son gün: {coupon.expiry_date.toDate().toLocaleDateString('tr-TR')}
                                </p>
                              )}
                              <div className="grid grid-cols-2 gap-2 mt-4">
                                <button onClick={() => openEditModal(coupon)} className={btnSoft}><Edit2 className="w-4 h-4" /> Düzenle</button>
                                <button onClick={() => deleteCoupon(coupon.id)} className={`${btnSoft} text-red-600 hover:bg-red-50 hover:border-red-200`}><Trash2 className="w-4 h-4" /> Sil</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <AnimatePresence>
                    {showAddCouponModal && (
                      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowAddCouponModal(false)}
                          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 40 }}
                          className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh]"
                        >
                          <div className="px-5 md:px-7 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                            <h3 className="text-lg font-extrabold">{editingCouponId ? 'Kampanyayı Düzenle' : 'Yeni Kampanya'}</h3>
                            <button onClick={() => setShowAddCouponModal(false)} className="p-2 hover:bg-gray-100 rounded-xl" aria-label="Kapat">
                              <X className="w-5 h-5 text-gray-500" />
                            </button>
                          </div>

                          <div className="px-5 md:px-7 py-5 overflow-y-auto flex-1">
                            <form id="add-coupon-form" onSubmit={handleAddCoupon} className="space-y-5">
                              <div>
                                <span className={label}>Kupon türü</span>
                                <div className="grid grid-cols-2 gap-2">
                                  {[
                                    { value: false, title: 'İndirim kuponu', desc: 'Yüzde indirim ve kod' },
                                    { value: true, title: 'Bilgilendirme', desc: 'Duyuru / özel fırsat' },
                                  ].map((opt) => (
                                    <button
                                      key={opt.title}
                                      type="button"
                                      onClick={() => setNewCoupon({ ...newCoupon, isInformational: opt.value })}
                                      className={`text-left p-3 rounded-xl border-2 transition-colors ${newCoupon.isInformational === opt.value ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                      <p className="font-semibold text-sm">{opt.title}</p>
                                      <p className="text-xs text-gray-500">{opt.desc}</p>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className={label} htmlFor="coupon-title">Kampanya başlığı</label>
                                <input
                                  id="coupon-title"
                                  type="text"
                                  required
                                  value={newCoupon.title}
                                  onChange={e => setNewCoupon({ ...newCoupon, title: e.target.value })}
                                  placeholder="Örn: Hafta sonu %20 indirim"
                                  className={input}
                                />
                              </div>

                              {!newCoupon.isInformational && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className={label} htmlFor="coupon-discount">İndirim (%)</label>
                                    <div className="relative">
                                      <input
                                        id="coupon-discount"
                                        type="number"
                                        inputMode="numeric"
                                        required={!newCoupon.isInformational}
                                        min="1"
                                        max="100"
                                        value={newCoupon.discountPercentage}
                                        onChange={e => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })}
                                        placeholder="20"
                                        className={`${input} pr-10`}
                                      />
                                      <Percent className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                  </div>
                                  <div>
                                    <label className={label} htmlFor="coupon-limit">Kupon adedi</label>
                                    <input
                                      id="coupon-limit"
                                      type="number"
                                      inputMode="numeric"
                                      min="1"
                                      value={newCoupon.totalLimit}
                                      onChange={e => setNewCoupon({ ...newCoupon, totalLimit: e.target.value })}
                                      placeholder="Sınırsız"
                                      className={input}
                                    />
                                  </div>
                                </div>
                              )}

                              <div>
                                <label className={label} htmlFor="coupon-expiry">Son geçerlilik tarihi <span className="font-normal text-gray-400">(boşsa süresiz)</span></label>
                                <input
                                  id="coupon-expiry"
                                  type="date"
                                  value={newCoupon.expiryDate}
                                  onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                  className={input}
                                />
                              </div>

                              <div>
                                <label className={label} htmlFor="coupon-desc">Kampanya detayları</label>
                                <textarea
                                  id="coupon-desc"
                                  value={newCoupon.description}
                                  onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                                  placeholder="Şartlar, geçerli ürünler vb."
                                  className={`${input} min-h-[110px] resize-y`}
                                />
                              </div>
                            </form>
                          </div>

                          <div className="px-5 md:px-7 py-4 border-t border-gray-100 shrink-0 flex gap-2">
                            <button type="button" onClick={() => setShowAddCouponModal(false)} className={btnSoft}>Vazgeç</button>
                            <button form="add-coupon-form" type="submit" disabled={isAddingCoupon} className={`${btnPrimary} flex-1 py-3`}>
                              {isAddingCoupon ? <RefreshCw className="w-5 h-5 animate-spin" /> : editingCouponId ? 'Değişiklikleri Kaydet' : 'Kampanyayı Yayınla'}
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {activeTab === 'reviews' && (
                <div className="max-w-3xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-2xl font-extrabold">Yorumlar</h2>
                      <p className="text-gray-500">
                        {reviews.length} yorum · ortalama <b className="text-gray-900">★ {averageRating}</b>
                      </p>
                    </div>
                    <div className="flex p-1 bg-white border border-gray-200 rounded-xl w-fit">
                      {([
                        { id: 'unanswered', label: `Yanıt bekleyen (${unansweredCount})` },
                        { id: 'all', label: `Tümü (${reviews.length})` },
                      ] as const).map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setReviewFilter(f.id)}
                          className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${reviewFilter === f.id ? 'bg-green-700 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {visibleReviews.length === 0 ? (
                    <div className={`${card} py-16 px-6 text-center`}>
                      {reviewFilter === 'unanswered' && reviews.length > 0 ? (
                        <>
                          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <p className="font-bold text-gray-900">Tüm yorumları yanıtladınız</p>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="font-bold text-gray-900">Henüz yorum yok</p>
                          <p className="text-gray-500 text-sm mt-1">Müşterileriniz uygulamada yorum yaptığında burada görünecek.</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visibleReviews.map((review) => (
                        <article key={review.id} className={`${card} p-5`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 flex-shrink-0">
                                {(review.userName?.[0] || 'M').toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{review.userName || 'Müşteri'}</p>
                                <p className="text-xs text-gray-500">{review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5 text-amber-500 flex-shrink-0" aria-label={`${review.rating || 0} yıldız`}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < (review.rating || 0) ? 'fill-current' : 'text-gray-200'}`} />
                              ))}
                            </div>
                          </div>

                          {review.comment && <p className="text-gray-700 leading-relaxed mt-3 whitespace-pre-wrap">{review.comment}</p>}

                          {replyingTo === review.id ? (
                            <div className="mt-4 space-y-3">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Müşterinize nazik bir yanıt yazın..."
                                autoFocus
                                className={`${input} h-28 resize-y`}
                              />
                              <p className="text-xs text-gray-500">Yanıtınız uygulamada herkese görünür; müşteriye bildirim gider.</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleReply(review.id, review.userId)}
                                  disabled={isSubmittingReply || !replyText.trim()}
                                  className={`${btnPrimary} flex-1 py-3`}
                                >
                                  {isSubmittingReply ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Yanıtı Gönder</>}
                                </button>
                                <button onClick={() => { setReplyingTo(null); setReplyText(""); }} className={btnSoft}>Vazgeç</button>
                              </div>
                            </div>
                          ) : review.reply ? (
                            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                              <p className="text-xs font-semibold text-green-800 mb-1">İşletme yanıtınız</p>
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">{review.reply.text}</p>
                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={() => {
                                    setReplyingTo(review.id);
                                    setReplyText(review.reply.text);
                                  }}
                                  className={`${btnSoft} py-1.5 text-xs`}
                                >
                                  <Edit2 className="w-3.5 h-3.5" /> Düzenle
                                </button>
                                <button onClick={() => deleteReply(review.id)} className={`${btnSoft} py-1.5 text-xs text-red-600 hover:bg-red-50`}>
                                  <Trash2 className="w-3.5 h-3.5" /> Sil
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => { setReplyingTo(review.id); setReplyText(""); }} className={`${btnSoft} mt-4`}>
                              <MessageSquare className="w-4 h-4" /> Yanıtla
                            </button>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'company' && companyData && (
                <div className="space-y-5">
                  <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                    <img
                      src={companyData.images?.[0] || companyData.image_url || companyData.gorsel || '/assets/fotoyok.png'}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-5 md:p-8">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {companyData.kategori && <span className="bg-white/90 text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-full">{companyData.kategori}</span>}
                          <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> {averageRating}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-extrabold text-white">{companyName}</h2>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <p className="flex-1 text-sm text-blue-900">
                      Bu bilgiler uygulamada müşterilerinize görünür. Fotoğraf, adres, telefon veya açıklama değişikliği için bize yazın; biz güncelleyelim.
                    </p>
                    <button
                      onClick={() => {
                        const message = encodeURIComponent(`${companyName} (${companyId}) işletme bilgilerimi güncellemek istiyorum.`);
                        window.open(`https://wa.me/${SUPPORT_PHONE}?text=${message}`, '_blank');
                      }}
                      className={`${btnPrimary} whitespace-nowrap`}
                    >
                      <MessageCircle className="w-4 h-4" /> Güncelleme İste
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-[1fr_2fr] gap-5">
                    <section className={`${card} p-5 space-y-4`}>
                      <h3 className="font-bold text-gray-900">İletişim</h3>
                      <InfoRow icon={Phone} label="Telefon" value={companyData.iletisim} />
                      <InfoRow icon={MapPin} label="Adres" value={companyData.adres} />
                      {companyData.menu_url && (
                        <a href={companyData.menu_url} target="_blank" rel="noreferrer" className={`${btnSoft} w-full`}>
                          <digitalInfo.icon className="w-4 h-4" /> {digitalInfo.label}
                        </a>
                      )}
                    </section>

                    <section className={`${card} p-5`}>
                      <h3 className="font-bold text-gray-900 mb-2">Hakkında</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {companyData.hakkinda || 'Henüz işletme açıklaması girilmemiş. Eklemek için bize yazabilirsiniz.'}
                      </p>
                    </section>
                  </div>

                  {companyData.images?.length > 0 && (
                    <section className={`${card} p-5`}>
                      <h3 className="font-bold text-gray-900 mb-3">Fotoğraflar <span className="text-gray-400 font-normal">({companyData.images.length})</span></h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {companyData.images.map((url: string, index: number) => (
                          <button
                            key={url + index}
                            onClick={() => setSelectedImage(url)}
                            className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 cursor-zoom-in"
                          >
                            <img src={url} className="w-full h-full object-cover hover:scale-105 transition-transform" alt={`Fotoğraf ${index + 1}`} />
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  <AnimatePresence>
                    {selectedImage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-12"
                        onClick={() => setSelectedImage(null)}
                      >
                        <button className="absolute top-4 right-4 text-white/80 hover:text-white p-3 bg-white/10 rounded-xl" onClick={() => setSelectedImage(null)} aria-label="Kapat">
                          <X className="w-6 h-6" />
                        </button>
                        <img
                          src={selectedImage}
                          className="max-w-full max-h-full rounded-xl object-contain"
                          alt=""
                          onClick={(e) => e.stopPropagation()}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeTab === 'support' && (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <LifeBuoy className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-extrabold">Yardım mı lazım?</h2>
                    <p className="text-gray-500 mt-1">Panel kullanımı, şifre veya işletme bilgileriniz için bize ulaşın.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <a href={`https://wa.me/${SUPPORT_PHONE}`} target="_blank" rel="noreferrer" className={`${card} p-6 flex items-center gap-4 hover:border-green-300 transition-colors`}>
                      <div className="p-3 bg-green-50 text-green-700 rounded-xl"><MessageCircle className="w-6 h-6" /></div>
                      <div>
                        <p className="font-bold text-gray-900">WhatsApp</p>
                        <p className="text-sm text-gray-500">En hızlı yanıt</p>
                      </div>
                    </a>
                    <a href={`tel:+${SUPPORT_PHONE}`} className={`${card} p-6 flex items-center gap-4 hover:border-gray-300 transition-colors`}>
                      <div className="p-3 bg-gray-100 text-gray-700 rounded-xl"><Phone className="w-6 h-6" /></div>
                      <div>
                        <p className="font-bold text-gray-900">Telefonla arayın</p>
                        <p className="text-sm text-gray-500">0545 696 20 60</p>
                      </div>
                    </a>
                  </div>

                  <div className={`${card} p-5 mt-5`}>
                    <h3 className="font-bold text-gray-900 mb-3">Sık sorulanlar</h3>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="font-semibold text-gray-900">Müşteri kuponu nasıl kullanır?</dt>
                        <dd className="text-gray-600">Müşteri uygulamada kuponu açıp kod alır. Siz bu koddaki 6 haneyi "Kupon Onayla" ekranına yazıp onaylarsınız. Kod kısa süre geçerlidir ve bir kez kullanılabilir.</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-900">"Geçersiz veya süresi dolmuş" diyor?</dt>
                        <dd className="text-gray-600">Kod daha önce kullanılmış, süresi geçmiş ya da başka bir işletmeye ait olabilir. Müşteriden uygulamada yeni kod almasını isteyin.</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-900">İşletme fotoğrafımı nasıl değiştiririm?</dt>
                        <dd className="text-gray-600">"İşletmem" sekmesinden "Güncelleme İste" ile bize yazın, yeni fotoğrafı WhatsApp'tan gönderin.</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {companyId && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${activeTab === tab.id ? 'text-green-800' : 'text-gray-500'}`}
              >
                <span className={`px-4 py-1 rounded-full ${activeTab === tab.id ? 'bg-green-100' : ''}`}>
                  <tab.icon className="w-5 h-5" />
                </span>
                {tab.short}
                {!!tab.badge && (
                  <span className="absolute top-1.5 left-1/2 ml-2 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

const InfoRow = ({ icon: Icon, label: rowLabel, value }: { icon: LucideIcon; label: string; value?: string }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Icon className="w-4 h-4" /></div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{rowLabel}</p>
      <p className="text-gray-900 font-medium break-words">{value || '—'}</p>
    </div>
  </div>
);

export default EsnafApp;
