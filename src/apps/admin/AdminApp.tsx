import { useState, useEffect } from 'react';
import './Admin.css';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import ManageCollection from './components/ManageCollection';
import NotificationManagement from './components/NotificationManagement';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAILS = [
  'mehmetirem305@gmail.com',
  'bilgimgverse@gmail.com',
  'seydirehber@gmail.com'
];

function AdminApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-emerald-500" size={48} /></div>;

  if (!user) {
    return (
      <div className="admin-body h-screen flex items-center justify-center bg-slate-900 p-6">
        <div className="bg-slate-800 p-12 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-slate-700">
           <h1 className="text-4xl font-black text-white mb-4">Admin Girişi</h1>
           <p className="text-slate-400 mb-8 font-medium">Yönetim paneline erişmek için yetkili hesapla giriş yapın.</p>
           {error && <p className="text-rose-500 mb-6 font-bold">{error}</p>}
           <button onClick={handleGoogleLogin} className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center gap-4 hover:bg-slate-100 transition-all">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Google ile Giriş Yap
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-body min-h-screen bg-slate-950 text-white flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} permissions={permissions} />
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'dashboard' ? <DashboardOverview permissions={permissions} /> : 
         activeTab === 'notifications' ? <NotificationManagement /> : 
         <ManageCollection key={activeTab} collectionId={activeTab} />}
      </main>
    </div>
  );
}

export default AdminApp;
