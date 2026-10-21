import { useCallback, useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getCountFromServer, query, where, Timestamp, type Query } from 'firebase/firestore';
import { Activity, RefreshCw, Smartphone, UserCheck } from 'lucide-react';

// Mobil admin paneli user_presence'in tamamını onSnapshot ile dinliyor (her açılışta tüm belgeler okunuyor).
// Burada sunucu taraflı sayım sorguları kullanılıyor: belge indirilmez, sorgu başına ~1000 kayıtta 1 okuma.
// lastSeen sadece uygulama açılışında yazıldığı için "son 5 dk" = son 5 dakikada uygulamayı açanlar.

const REFRESH_MS = 60_000;
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

interface Stats {
  total: number;
  last5m: number;
  last1h: number;
  today: number;
  last7d: number;
  last30d: number;
  registered: number;
  ios: number;
  android: number;
}

/** Türkiye saatiyle bugünün başlangıcı (UTC+3, 2016'dan beri yaz saati yok). */
function istanbulMidnight(now: number): number {
  const shifted = new Date(now + 3 * 60 * MINUTE);
  return Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - 3 * 60 * MINUTE;
}

async function fetchStats(): Promise<Stats> {
  const presence = collection(db, 'user_presence');
  const now = Date.now();
  const since = (ms: number) => query(presence, where('lastSeen', '>=', Timestamp.fromMillis(ms)));
  const count = async (q: Query) => (await getCountFromServer(q)).data().count;

  const [total, last5m, last1h, today, last7d, last30d, registered, ios, android] = await Promise.all([
    count(presence),
    count(since(now - 5 * MINUTE)),
    count(since(now - 60 * MINUTE)),
    count(since(istanbulMidnight(now))),
    count(since(now - 7 * DAY)),
    count(since(now - 30 * DAY)),
    // isAnonymous alanı olmayan eski kayıtlar mobil paneldeki gibi misafir sayılır.
    count(query(presence, where('isAnonymous', '==', false))),
    count(query(presence, where('platform', '==', 'ios'))),
    count(query(presence, where('platform', '==', 'android'))),
  ]);
  return { total, last5m, last1h, today, last7d, last30d, registered, ios, android };
}

const fmt = (n: number) => n.toLocaleString('tr-TR');
const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

const LiveStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  // İlk setState await'ten sonra: efektten çağrılınca senkron render tetiklemesin.
  const load = useCallback(async () => {
    try {
      setStats(await fetchStats());
      setUpdatedAt(new Date());
      setError(false);
    } catch (err) {
      console.error('Canlı istatistik hatası:', err);
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Sekme görünürken dakikada bir yenile; gizliyken sorgu atma, geri gelince hemen yenile.
  useEffect(() => {
    const first = setTimeout(() => void load(), 0);
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') void load();
    }, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  if (!stats) {
    return (
      <div className="card empty-state" style={{ marginBottom: '0.5rem' }}>
        {error ? 'Canlı istatistikler alınamadı.' : 'Canlı istatistikler yükleniyor...'}
      </div>
    );
  }

  const guests = stats.total - stats.registered;
  const otherPlatform = stats.total - stats.ios - stats.android;
  const dormant = stats.total - stats.last30d;
  const periods = [
    { label: 'Son 1 saat', value: stats.last1h },
    { label: 'Bugün', value: stats.today },
    { label: 'Son 7 gün', value: stats.last7d },
    { label: 'Son 30 gün', value: stats.last30d },
  ];

  return (
    <div className="card live-stats">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-5">
        <div>
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Activity size={18} style={{ color: 'var(--admin-primary)' }} />
            Uygulama kullanımı
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Kullanıcıların uygulamayı en son açtığı zamana göre · dakikada bir yenilenir
            {updatedAt && ` · son güncelleme ${updatedAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`}
          </p>
        </div>
        <button type="button" className="btn btn-outline" onClick={() => {
            setRefreshing(true);
            void load();
          }} disabled={refreshing} style={{ padding: '0.4rem 0.75rem' }}>
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
          Yenile
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          Son yenileme başarısız oldu; gösterilen sayılar bir önceki güncellemeye ait.
        </p>
      )}

      <div className="live-grid">
        <div className="live-now">
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--admin-primary-dark)' }}>
            <span className="live-dot" />
            Şu an
          </div>
          <p className="text-4xl font-extrabold text-gray-900 tabular-nums mt-1">{fmt(stats.last5m)}</p>
          <p className="text-xs text-gray-500 mt-1">son 5 dakikada uygulamayı açan</p>
        </div>
        {periods.map((p) => (
          <div key={p.label} className="live-period">
            <p className="text-2xl font-extrabold text-gray-900 tabular-nums">{fmt(p.value)}</p>
            <p className="text-sm text-gray-500 font-medium">{p.label}</p>
          </div>
        ))}
      </div>

      <div className="grid mt-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <SplitBar
          icon={<UserCheck size={15} />}
          title={`Toplam ${fmt(stats.total)} kullanıcı`}
          parts={[
            { label: 'Hesaplı', value: stats.registered, color: '#388e3c' },
            { label: 'Misafir', value: guests, color: '#a5d6a7' },
          ]}
          total={stats.total}
        />
        <SplitBar
          icon={<Smartphone size={15} />}
          title="Platform"
          parts={[
            { label: 'Android', value: stats.android, color: '#2e7d32' },
            { label: 'iOS', value: stats.ios, color: '#64748b' },
            ...(otherPlatform > 0 ? [{ label: 'Bilinmiyor', value: otherPlatform, color: '#d1d5db' }] : []),
          ]}
          total={stats.total}
        />
      </div>

      {dormant > 0 && (
        <p className="text-xs text-gray-500 mt-4">
          {fmt(dormant)} kullanıcı (%{pct(dormant, stats.total)}) 30 gündür uygulamayı açmadı.
        </p>
      )}
    </div>
  );
};

interface SplitBarProps {
  icon: React.ReactNode;
  title: string;
  parts: { label: string; value: number; color: string }[];
  total: number;
}

const SplitBar = ({ icon, title, parts, total }: SplitBarProps) => (
  <div className="live-split">
    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-2.5">
      <span className="text-gray-400">{icon}</span>
      {title}
    </p>
    <div className="live-bar">
      {parts.map((p) => (
        <div key={p.label} style={{ width: `${pct(p.value, total)}%`, background: p.color }} title={`${p.label}: ${fmt(p.value)}`} />
      ))}
    </div>
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
      {parts.map((p) => (
        <span key={p.label} className="text-xs text-gray-600 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
          {p.label} <b className="text-gray-900 tabular-nums">{fmt(p.value)}</b>
          <span className="text-gray-400">%{pct(p.value, total)}</span>
        </span>
      ))}
    </div>
  </div>
);

export default LiveStats;
