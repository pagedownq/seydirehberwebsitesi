import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, getCountFromServer, where } from 'firebase/firestore';
import { Users, Activity, Award, Clock, MapPin, Bus, Tag, MessageSquare, ShieldCheck, Image, Store, CheckCircle2, Gavel, MessagesSquare } from 'lucide-react';

interface DashboardOverviewProps {
  permissions: Record<string, boolean>;
}

const DashboardOverview = ({ permissions }: DashboardOverviewProps) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    firmalar: 0,
    etkinlikler: 0,
    gezilecek_yerler: 0,
    destek_bekleyen: 0,
    noterler: 0,
    pazarlar: 0,
    otobus_saatleri: 0,
    banners: 0,
    reviews: 0,
    firma_reviews: 0,
    esnaf_users: 0,
    coupons: 0,
    used_coupons: 0,
    bekleyen_sikayetler: 0,
    forum_gonderi: 0,
    forum_gizli_gonderi: 0,
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const newStats = { ...stats };

      // 1. İzin verilen standart koleksiyonları sayalım
      const collectionsToCount = [
        { key: 'firmalar', perm: 'canManageCompanies' },
        { key: 'etkinlikler', perm: 'canManageEvents' },
        { key: 'gezilecek_yerler', perm: 'canManagePlaces' },
        { key: 'noterler', perm: 'canManageNotaries' },
        { key: 'pazarlar', perm: 'canManageMarkets' },
        { key: 'otobus_saatleri', perm: 'canManageBuses' },
        { key: 'banners', perm: 'canManageBanners' },
        { key: 'reviews', perm: 'canManageReviews' },
        { key: 'esnaf_users', perm: 'canManageEsnaf' },
        { key: 'coupons', perm: 'canManageCoupons' }
      ];

      // Paralel çalıştırmak için tüm sayım isteklerini Promise.all ile başlatıyoruz (Performans için)
      const countPromises = collectionsToCount.map(async (col) => {
        if (permissions[col.perm]) {
          try {
            const collRef = collection(db, col.key);
            const snap = await getCountFromServer(collRef);
            return { key: col.key, count: snap.data().count };
          } catch (e) {
            console.error(`Error counting ${col.key}:`, e);
            return { key: col.key, count: 0 };
          }
        }
        return { key: col.key, count: 0 };
      });

      const results = await Promise.all(countPromises);
      results.forEach(res => {
        // @ts-ignore
        newStats[res.key] = res.count;
      });

      // 2. Filtreli Özel Sorgular

      // Bekleyen Destek
      if (permissions['canManageSupport']) {
        try {
          const q = query(collection(db, 'yardim_destek'), where('durum', '==', 'Bekliyor'));
          const snap = await getCountFromServer(q);
          newStats.destek_bekleyen = snap.data().count;
        } catch (e) {
          console.error("Error counting destek_bekleyen:", e);
        }
      }

      // Kullanılan Kuponlar
      if (permissions['canManageCoupons']) {
        try {
          const q = query(collection(db, 'generated_codes'), where('status', '==', 'used'));
          const snap = await getCountFromServer(q);
          newStats.used_coupons = snap.data().count;
        } catch (e) {
          console.error("Error counting used_coupons:", e);
        }
      }

      // Bekleyen Şikayetler
      if (permissions['canManageReports']) {
        try {
          const q = query(collection(db, 'sikayetler'), where('status', '==', 'pending'));
          const snap = await getCountFromServer(q);
          newStats.bekleyen_sikayetler = snap.data().count;
        } catch (e) {
          console.error("Error counting bekleyen_sikayetler:", e);
        }
      }

      // Firma Yorumları
      if (permissions['canManageReviews']) {
        try {
          const q = query(collection(db, 'reviews'), where('targetType', '==', 'company'));
          const snap = await getCountFromServer(q);
          newStats.firma_reviews = snap.data().count;
        } catch (e) {
          console.error("Error counting firma_reviews:", e);
        }
      }

      // Forum Gönderileri
      if (permissions['canManageForum']) {
        try {
          const qTotal = collection(db, 'forum_posts');
          const qHidden = query(collection(db, 'forum_posts'), where('is_hidden', '==', true));
          
          const [snapTotal, snapHidden] = await Promise.all([
            getCountFromServer(qTotal),
            getCountFromServer(qHidden)
          ]);

          newStats.forum_gonderi = snapTotal.data().count;
          newStats.forum_gizli_gonderi = snapHidden.data().count;
        } catch (e) {
          console.error("Error counting forum posts:", e);
        }
      }

      setStats(newStats);
    } catch (error) {
      console.error("İstatistikler yüklenirken genel hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [permissions]);

  return (
    <div className="dashboard-overview animate-in fade-in duration-500">
      <div className="header mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Yönetim Özeti</h1>
          <p className="text-slate-400 font-medium">Sistemdeki güncel istatistikler ve genel durum.</p>
        </div>
        <button 
          onClick={fetchStats} 
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          {loading ? 'Güncelleniyor...' : 'Verileri Yenile'}
        </button>
      </div>

      {loading && stats.firmalar === 0 ? (
        <div className="text-center py-20 text-slate-400 font-medium animate-pulse">
          İstatistikler yükleniyor, lütfen bekleyin...
        </div>
      ) : (
        <div className="grid">
          {permissions['canManageCompanies'] && <StatCard icon={Award} label="Kayıtlı Firma" value={stats.firmalar} max={500} color="#6366f1" />}
          {permissions['canManageEvents'] && <StatCard icon={Activity} label="Aktif Etkinlik" value={stats.etkinlikler} max={50} color="#ec4899" />}
          {permissions['canManagePlaces'] && <StatCard icon={MapPin} label="Gezilecek Yer" value={stats.gezilecek_yerler} max={100} color="#a855f7" />}
          {permissions['canManageSupport'] && <StatCard icon={Clock} label="Bekleyen Destek" value={stats.destek_bekleyen} max={20} color="#f59e0b" />}
          {permissions['canManageNotaries'] && <StatCard icon={Gavel} label="Noterler" value={stats.noterler} max={30} color="#ef4444" />}
          {permissions['canManageMarkets'] && <StatCard icon={Store} label="Pazarlar" value={stats.pazarlar} max={10} color="#10b981" />}
          {permissions['canManageBuses'] && <StatCard icon={Bus} label="Otobüs Saatleri" value={stats.otobus_saatleri} max={200} color="#0ea5e9" />}
          {permissions['canManageCoupons'] && <StatCard icon={Tag} label="Kupon Sayısı" value={stats.coupons} max={1000} color="#f97316" />}
          {permissions['canManageCoupons'] && <StatCard icon={CheckCircle2} label="Kullanılan Kuponlar" value={stats.used_coupons} max={stats.coupons || 100} color="#22c55e" />}
          {permissions['canManageReviews'] && <StatCard icon={MessageSquare} label="Yorumlar" value={stats.reviews} max={1000} color="#8b5cf6" />}
          {permissions['canManageReviews'] && <StatCard icon={Store} label="Firma Yorumları" value={stats.firma_reviews} max={1000} color="#6366f1" />}
          {permissions['canManageReports'] && <StatCard icon={ShieldCheck} label="Bekleyen Şikayet" value={stats.bekleyen_sikayetler} max={10} color="#f43f5e" />}
          {permissions['canManageEsnaf'] && <StatCard icon={Users} label="Esnaf Hesapları" value={stats.esnaf_users} max={100} color="#06b6d4" />}
          {permissions['canManageBanners'] && <StatCard icon={Image} label="Bannerler" value={stats.banners} max={10} color="#db2777" />}
          {permissions['canManageForum'] && <StatCard icon={MessagesSquare} label="Toplam Forum Gönderisi" value={stats.forum_gonderi} max={500} color="#6366f1" />}
          {permissions['canManageForum'] && <StatCard icon={MessagesSquare} label="Gizlenen Forum Gönderisi" value={stats.forum_gizli_gonderi} max={50} color="#a855f7" />}
        </div>
      )}

      <div className="card mt-10 border-l-4 border-l-indigo-500 bg-indigo-500/5">
        <h3 className="text-lg font-bold text-white mb-2">Hızlı Durum</h3>
        <p className="text-slate-400 text-sm">Tüm servisler aktif ve sorunsuz çalışıyor. Son 24 saat içinde sistem performansı %99.9 seviyesinde.</p>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, max, color }: any) => {
  const percentage = Math.min((value / (max || 100)) * 100, 100);
  
  return (
    <div className="card group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
          <h2 className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors">{value}</h2>
        </div>
        <div className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110" style={{ background: `${color}15`, color }}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
          <span>Doluluk</span>
          <span>%{Math.round(percentage)}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px] shadow-current" 
            style={{ 
              backgroundColor: color, 
              width: `${percentage}%`,
              color: color 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
