import { useState, useEffect } from 'react';
import './Admin.css';
import Sidebar from './components/Sidebar';
import { findMenuItem } from './menu';
import DashboardOverview from './components/DashboardOverview';
import ManageCollection from './components/ManageCollection';
import NotificationManagement from './components/NotificationManagement';
import SupportNotificationWatcher from './components/SupportNotificationWatcher';
import ForumModeration from './components/ForumModeration';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { Loader2, LogOut, Menu } from 'lucide-react';

const ADMIN_EMAILS = [
  'mehmetirem305@gmail.com',
  'bilgimgverse@gmail.com',
  'seydirehber@gmail.com'
];

function AdminApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabChange = (tab: string, filterId: string | null = null) => {
    setActiveTab(tab);
    setSelectedFilter(filterId);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const checkAdminStatus = async (u: any): Promise<{ isAdmin: boolean; permissions: Record<string, boolean> }> => {
    const email = u.email?.toLowerCase() || '';
    let isAdmin = false;
    let permissions: Record<string, boolean> = {};

    if (ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email)) {
      isAdmin = true;
      permissions = {
        canManageBanners: true,
        canManageEvents: true,
        canManageNotaries: true,
        canManageMarkets: true,
        canManageBuses: true,
        canManagePlaces: true,
        canManageCompanies: true,
        canManageSupport: true,
        canManageReviews: true,
        canManageReports: true,
        canManageNotifications: true,
        canManageEsnaf: true,
        canManageCoupons: true,
        canManageAdmins: true,
        canManageSurveys: true,
        canManageForum: true,
        canManageJobs: true,
      };
    } else {
      try {
        const adminDoc = await getDoc(doc(db, 'admins', email));
        if (adminDoc.exists() && adminDoc.data()?.isActive !== false) {
          const data = adminDoc.data();
          isAdmin = true;
          permissions = {
            canManageBanners: data.canManageBanners || false,
            canManageEvents: data.canManageEvents || false,
            canManageNotaries: data.canManageNotaries || false,
            canManageMarkets: data.canManageMarkets || false,
            canManageBuses: data.canManageBuses || false,
            canManagePlaces: data.canManagePlaces || false,
            canManageCompanies: data.canManageCompanies || false,
            canManageSupport: data.canManageSupport || false,
            canManageReviews: data.canManageReviews || false,
            canManageReports: data.canManageReports || false,
            canManageNotifications: data.canManageNotifications || false,
            canManageEsnaf: data.canManageEsnaf || false,
            canManageCoupons: data.canManageCoupons || false,
            canManageAdmins: data.canManageAdmins || false,
            canManageSurveys: data.canManageSurveys || false,
            canManageForum: data.canManageForum || false,
            canManageJobs: data.canManageJobs || false,
          };
        }
      } catch (err) {
        console.error("Admin check error:", err);
      }
    }

    if (isAdmin) {
      // Save/Update admin info with UID for notification targeting
      try {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'admins', email), {
          uid: u.uid,
          email: email,
          lastLogin: new Date(),
          ...(permissions.canManageAdmins ? {} : { permissions }) // Don't overwrite if it's a superadmin from the list
        }, { merge: true });
      } catch (err) {
        console.error("Failed to update admin UID:", err);
      }
    }

    return { isAdmin, permissions };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setLoading(true);
        const { isAdmin, permissions: userPerms } = await checkAdminStatus(u);
        if (isAdmin) {
          setUser(u);
          setPermissions(userPerms);
        } else {
          await signOut(auth);
          setError('Bu hesabı kullanma yetkiniz yok.');
        }
      } else {
        setUser(null);
        setPermissions({});
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { isAdmin, permissions: userPerms } = await checkAdminStatus(result.user);
      if (!isAdmin) {
        await signOut(auth);
        setError('Yetkisiz giriş.');
      } else {
        setUser(result.user);
        setPermissions(userPerms);
      }
    } catch (err: any) {
      setError('Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-body h-screen flex flex-col items-center justify-center">
        <Loader2 className="spin mb-4" size={40} style={{ color: 'var(--admin-primary)' }} />
        <p className="text-gray-500 font-medium">Panel yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-body min-h-screen flex items-center justify-center p-6">
        <div className="card max-w-sm w-full text-center" style={{ padding: '2.5rem 2rem' }}>
          <img src="/icon.png" alt="Seydi Rehber" className="w-16 h-16 rounded-2xl mx-auto mb-5 shadow-sm" />
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Yönetim Paneli</h1>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Seydi Rehber yönetim paneline erişmek için yetkili Google hesabınızla giriş yapın.
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full"
            style={{ padding: '0.8rem 1rem', fontSize: '0.9375rem' }}
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
            Google ile Giriş Yap
          </button>
          <p className="mt-8 text-xs text-gray-400">© 2026 Seydi Rehber</p>
        </div>
      </div>
    );
  }

  const current = findMenuItem(activeTab);

  return (
    <div className="admin-body flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => handleTabChange(tab, null)}
        permissions={permissions}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <main className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="btn btn-outline icon-btn menu-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label="Menüyü aç"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 truncate">{current?.label ?? 'Yönetim Paneli'}</p>
            {current?.description && (
              <p className="text-xs text-gray-500 truncate hidden sm:block">{current.description}</p>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2.5 pl-3 pr-4 py-1.5 bg-white rounded-full border border-gray-200">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold">
                {(user.displayName || user.email || 'A').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="leading-tight">
              <p className="text-xs font-semibold text-gray-900">{user.displayName || 'Admin'}</p>
              <p className="text-[11px] text-gray-500">{user.email}</p>
            </div>
          </div>
          <button type="button" onClick={() => signOut(auth)} className="btn btn-outline" title="Çıkış Yap">
            <LogOut size={16} />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </header>

        <SupportNotificationWatcher />
        <div className="admin-content">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' ? <DashboardOverview permissions={permissions} onNavigate={handleTabChange} /> :
             activeTab === 'notifications' ? <NotificationManagement /> :
             activeTab === 'forum_moderation' ? <ForumModeration /> :
             <ManageCollection
                key={activeTab}
                collectionId={activeTab}
                initialFilterId={selectedFilter}
                onTabChange={handleTabChange}
             />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminApp;
