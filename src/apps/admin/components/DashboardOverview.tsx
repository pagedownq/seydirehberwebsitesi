import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import LiveStats from './LiveStats';
import { collection, query, getCountFromServer, where } from 'firebase/firestore';
import { Users, Calendar, Building2, LifeBuoy, Compass, Bus, Tag, MessageSquare, Flag, Image, Store, CheckCircle2, Gavel, MessagesSquare, EyeOff, RefreshCw, ChevronRight, type LucideIcon } from 'lucide-react';

interface DashboardOverviewProps {
  permissions: Record<string, boolean>;
  onNavigate: (tab: string) => void;
}

const DashboardOverview = ({ permissions, onNavigate }: DashboardOverviewProps) => {
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
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
      setLoaded(true);
    } catch (error) {
      console.error("İstatistikler yüklenirken genel hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [permissions]);

  // Bekleyen işler: sıfırdan büyükse dikkat çekecek şekilde gösterilir.
  const pending = [
    { perm: 'canManageSupport', tab: 'yardim_destek', icon: LifeBuoy, label: 'Bekleyen destek talebi', value: stats.destek_bekleyen },
    { perm: 'canManageReports', tab: 'sikayetler', icon: Flag, label: 'Bekleyen yorum şikayeti', value: stats.bekleyen_sikayetler },
    { perm: 'canManageForum', tab: 'forum_moderation', icon: EyeOff, label: 'Gizlenen forum gönderisi', value: stats.forum_gizli_gonderi },
  ].filter((p) => permissions[p.perm]);
  const pendingTotal = pending.reduce((sum, p) => sum + p.value, 0);

  const content = [
    { perm: 'canManageCompanies', tab: 'firmalar', icon: Building2, label: 'Firma', value: stats.firmalar, color: '#2e7d32' },
    { perm: 'canManageEvents', tab: 'etkinlikler', icon: Calendar, label: 'Etkinlik', value: stats.etkinlikler, color: '#db2777' },
    { perm: 'canManagePlaces', tab: 'gezilecek_yerler', icon: Compass, label: 'Gezilecek yer', value: stats.gezilecek_yerler, color: '#7c3aed' },
    { perm: 'canManageBanners', tab: 'banners', icon: Image, label: 'Banner', value: stats.banners, color: '#0891b2' },
    { perm: 'canManageNotaries', tab: 'noterler', icon: Gavel, label: 'Noter', value: stats.noterler, color: '#475569' },
    { perm: 'canManageMarkets', tab: 'pazarlar', icon: Store, label: 'Pazar', value: stats.pazarlar, color: '#ca8a04' },
    { perm: 'canManageBuses', tab: 'otobus_saatleri', icon: Bus, label: 'Otobüs güzergahı', value: stats.otobus_saatleri, color: '#2563eb' },
    { perm: 'canManageEsnaf', tab: 'esnaf_users', icon: Users, label: 'Esnaf hesabı', value: stats.esnaf_users, color: '#0d9488' },
    { perm: 'canManageCoupons', tab: 'coupons', icon: Tag, label: 'Kupon', value: stats.coupons, color: '#ea580c' },
    { perm: 'canManageCoupons', tab: 'coupons', icon: CheckCircle2, label: 'Kullanılan kupon kodu', value: stats.used_coupons, color: '#16a34a' },
    { perm: 'canManageReviews', tab: 'reviews', icon: MessageSquare, label: 'Yorum (toplam)', value: stats.reviews, color: '#4f46e5' },
    { perm: 'canManageReviews', tab: 'reviews', icon: Store, label: 'Firma yorumu', value: stats.firma_reviews, color: '#4f46e5' },
    { perm: 'canManageForum', tab: 'forum_moderation', icon: MessagesSquare, label: 'Forum gönderisi', value: stats.forum_gonderi, color: '#9333ea' },
  ].filter((c) => permissions[c.perm]);

  return (
    <div className="dashboard-overview">
      <div className="header">
        <div>
          <h1>Hoş geldiniz 👋</h1>
          <p className="text-muted">Panelde bekleyen işler ve uygulamadaki içeriklerin özeti.</p>
        </div>
        <button onClick={fetchStats} disabled={loading} className="btn btn-outline">
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          {loading ? 'Güncelleniyor...' : 'Yenile'}
        </button>
      </div>

      <LiveStats />

      {!loaded ? (
        <div className="card empty-state">İstatistikler yükleniyor...</div>
      ) : (
        <>
          {pending.length > 0 && (
            <>
              <h2 className="section-title">İlgilenmeniz gerekenler</h2>
              {pendingTotal === 0 ? (
                <div className="card flex items-center gap-3" style={{ background: 'var(--admin-primary-soft)', borderColor: '#c8e6c9' }}>
                  <CheckCircle2 size={22} style={{ color: 'var(--admin-primary)' }} />
                  <p className="font-semibold" style={{ color: 'var(--admin-primary-dark)' }}>
                    Bekleyen iş yok. Destek, şikayet ve forum tarafı temiz.
                  </p>
                </div>
              ) : (
                <div className="grid">
                  {pending.map((p) => (
                    <StatCard
                      key={p.tab}
                      icon={p.icon}
                      label={p.label}
                      value={p.value}
                      color={p.value > 0 ? '#d97706' : '#16a34a'}
                      highlight={p.value > 0}
                      onClick={() => onNavigate(p.tab)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {content.length > 0 && (
            <>
              <h2 className="section-title">Uygulamadaki içerikler</h2>
              <div className="grid">
                {content.map((c) => (
                  <StatCard
                    key={c.label}
                    icon={c.icon}
                    label={c.label}
                    value={c.value}
                    color={c.color}
                    onClick={() => onNavigate(c.tab)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
  highlight?: boolean;
  onClick: () => void;
}

const StatCard = ({ icon: Icon, label, value, color, highlight, onClick }: StatCardProps) => (
  <button
    type="button"
    className="stat-card group"
    onClick={onClick}
    style={highlight ? { borderColor: '#fcd34d', background: '#fffbeb' } : undefined}
  >
    <div className="stat-icon" style={{ background: `${color}14`, color }}>
      <Icon size={22} strokeWidth={2.2} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-2xl font-extrabold text-gray-900 leading-tight tabular-nums">{value.toLocaleString('tr-TR')}</p>
      <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
    </div>
    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
  </button>
);

export default DashboardOverview;
