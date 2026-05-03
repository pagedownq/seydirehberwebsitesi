import { useState, useEffect } from 'react';
import './Admin.css';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import ManageCollection from './components/ManageCollection';
import NotificationManagement from './components/NotificationManagement';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { Loader2, LogOut, ShieldCheck } from 'lucide-react';

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

  const handleTabChange = (tab: string, filterId: string | null = null) => {
    setActiveTab(tab);
    setSelectedFilter(filterId);
  };

  const checkAdminStatus = async (u: any): Promise<{ isAdmin: boolean; permissions: Record<string, boolean> }> => {
    const email = u.email?.toLowerCase() || '';
    if (ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email)) {
      return {
        isAdmin: true,
        permissions: {
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
        }
      };
    }
    try {
      const adminDoc = await getDoc(doc(db, 'admins', email));
      if (adminDoc.exists() && adminDoc.data()?.isActive !== false) {
        const data = adminDoc.data();
        return {
          isAdmin: true,
          permissions: {
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
          }
        };
      }
      return { isAdmin: false, permissions: {} };
    } catch (err) {
      return { isAdmin: false, permissions: {} };
    }
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
      <div className="h-screen flex flex-col items-center justify-center bg-[#0b0f1a]">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
        <p className="text-slate-400 font-medium animate-pulse">Sistem yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-body h-screen flex items-center justify-center bg-[#0b0f1a] p-6">
        <div className="bg-[#161c2d] p-10 rounded-[2rem] shadow-2xl text-center max-w-md w-full border border-slate-800/50 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-indigo-500 via-purple-500 to-pink-500"></div>
           <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
              <ShieldCheck className="text-indigo-500" size={40} />
           </div>
           <h1 className="text-3xl font-extrabold text-white mb-3">Yönetim Paneli</h1>
           <p className="text-slate-400 mb-10 text-sm leading-relaxed">
             Seydi Rehber yönetim sistemine erişmek için<br />yetkili Google hesabınızla giriş yapın.
           </p>
           {error && (
             <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl mb-8 text-sm font-medium">
               {error}
             </div>
           )}
           <button 
             onClick={handleGoogleLogin} 
             className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
           >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Google ile Güvenli Giriş
           </button>
           <p className="mt-8 text-xs text-slate-500">
             © 2026 Seydi Rehber. Tüm hakları saklıdır.
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-body min-h-screen bg-[#0b0f1a] text-white flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => handleTabChange(tab, null)} 
        permissions={permissions} 
        userName={user.displayName}
        userPhoto={user.photoURL}
      />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
        {/* Top Header / Logout Section */}
        <div className="flex justify-end items-center gap-6 mb-8 sticky top-0 z-10">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/30 rounded-xl border border-slate-700/50">
            {user.photoURL && (
              <img src={user.photoURL} alt={user.displayName} className="w-6 h-6 rounded-full border border-indigo-500/30" />
            )}
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-white leading-none">{user.displayName || 'Admin'}</span>
              <span className="text-[10px] text-slate-500 leading-tight mt-0.5">{user.email}</span>
            </div>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/20 text-slate-400 hover:text-rose-500 rounded-xl transition-all font-medium text-sm shadow-sm"
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' ? <DashboardOverview permissions={permissions} /> : 
           activeTab === 'notifications' ? <NotificationManagement /> : 
           <ManageCollection 
              key={activeTab} 
              collectionId={activeTab} 
              initialFilterId={selectedFilter}
              onTabChange={handleTabChange}
           />}
        </div>
      </main>
    </div>
  );
}

export default AdminApp;
