import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { Users, Activity, Award, Clock, MapPin, Bus, Tag, MessageSquare, ShieldCheck, Image, Store, CheckCircle2, Gavel } from 'lucide-react';

interface DashboardOverviewProps {
  permissions: Record<string, boolean>;
}

const DashboardOverview = ({ permissions }: DashboardOverviewProps) => {
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
    esnaf_users: 0,
    coupons: 0,
    bekleyen_sikayetler: 0
  });

  useEffect(() => {
    // Only fetch counts for allowed collections
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
    ].filter(col => permissions[col.perm]);

    const unsubscribes = collectionsToCount.map(col => {
      return onSnapshot(collection(db, col.key), (snap) => {
        setStats(prev => ({ ...prev, [col.key]: snap.size }));
      });
    });

    let unsubscribeSupport = () => {};
    if (permissions['canManageSupport']) {
      const qSupport = query(collection(db, 'yardim_destek'), where('durum', '==', 'Bekliyor'));
      unsubscribeSupport = onSnapshot(qSupport, (snap) => {
        setStats(prev => ({ ...prev, destek_bekleyen: snap.size }));
      });
    }

    let unsubscribeUsed = () => {};
    if (permissions['canManageCoupons']) {
      const qUsed = query(collection(db, 'generated_codes'), where('status', '==', 'used'));
      unsubscribeUsed = onSnapshot(qUsed, (snap) => {
        // @ts-ignore
        setStats(prev => ({ ...prev, used_coupons: snap.size }));
      });
    }

    let unsubscribeReports = () => {};
    if (permissions['canManageReports']) {
      const qReports = query(collection(db, 'sikayetler'), where('status', '==', 'pending'));
      unsubscribeReports = onSnapshot(qReports, (snap) => {
        setStats(prev => ({ ...prev, bekleyen_sikayetler: snap.size }));
      });
    }

    return () => {
      unsubscribes.forEach(unsub => unsub());
      unsubscribeSupport();
      unsubscribeUsed();
      unsubscribeReports();
    };
  }, [permissions]);

  return (
    <div className="dashboard-overview animate-in fade-in duration-500">
      <div className="header mb-10">
        <h1 className="text-3xl font-black tracking-tight text-white">Yönetim Özeti</h1>
        <p className="text-slate-400 font-medium">Sistemdeki güncel istatistikler ve genel durum.</p>
      </div>

      <div className="grid">
        {permissions['canManageCompanies'] && <StatCard icon={Award} label="Kayıtlı Firma" value={stats.firmalar} max={500} color="#6366f1" />}
        {permissions['canManageEvents'] && <StatCard icon={Activity} label="Aktif Etkinlik" value={stats.etkinlikler} max={50} color="#ec4899" />}
        {permissions['canManagePlaces'] && <StatCard icon={MapPin} label="Gezilecek Yer" value={stats.gezilecek_yerler} max={100} color="#a855f7" />}
        {permissions['canManageSupport'] && <StatCard icon={Clock} label="Bekleyen Destek" value={stats.destek_bekleyen} max={20} color="#f59e0b" />}
        {permissions['canManageNotaries'] && <StatCard icon={Gavel} label="Noterler" value={stats.noterler} max={30} color="#ef4444" />}
        {permissions['canManageMarkets'] && <StatCard icon={Store} label="Pazarlar" value={stats.pazarlar} max={10} color="#10b981" />}
        {permissions['canManageBuses'] && <StatCard icon={Bus} label="Otobüs Saatleri" value={stats.otobus_saatleri} max={200} color="#0ea5e9" />}
        {permissions['canManageCoupons'] && <StatCard icon={Tag} label="Kupon Sayısı" value={stats.coupons} max={1000} color="#f97316" />}
        {permissions['canManageCoupons'] && <StatCard icon={CheckCircle2} label="Kullanılan Kuponlar" value={(stats as any).used_coupons || 0} max={stats.coupons || 100} color="#22c55e" />}
        {permissions['canManageReviews'] && <StatCard icon={MessageSquare} label="Yorumlar" value={stats.reviews} max={1000} color="#8b5cf6" />}
        {permissions['canManageReports'] && <StatCard icon={ShieldCheck} label="Bekleyen Şikayet" value={stats.bekleyen_sikayetler} max={10} color="#f43f5e" />}
        {permissions['canManageEsnaf'] && <StatCard icon={Users} label="Esnaf Hesapları" value={stats.esnaf_users} max={100} color="#06b6d4" />}
        {permissions['canManageBanners'] && <StatCard icon={Image} label="Bannerler" value={stats.banners} max={10} color="#db2777" />}
      </div>

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
