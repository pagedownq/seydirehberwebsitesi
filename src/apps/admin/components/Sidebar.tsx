import { 
  LayoutDashboard, 
  Image, 
  Calendar, 
  Gavel, 
  Store, 
  Bus, 
  Compass, 
  Building2, 
  LifeBuoy, 
  MessageSquareText, 
  Flag, 
  UserCog, 
  TicketPercent, 
  BellRing, 
  ShieldCheck,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  permissions: Record<string, boolean>;
  userName?: string;
  userPhoto?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, permissions, userName, userPhoto }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'banners', label: 'Banner Yönetimi', icon: Image, perm: 'canManageBanners' },
    { id: 'etkinlikler', label: 'Etkinlikler', icon: Calendar, perm: 'canManageEvents' },
    { id: 'noterler', label: 'Noterler', icon: Gavel, perm: 'canManageNotaries' },
    { id: 'pazarlar', label: 'Pazarlar', icon: Store, perm: 'canManageMarkets' },
    { id: 'otobus_saatleri', label: 'Otobüs Saatleri', icon: Bus, perm: 'canManageBuses' },
    { id: 'gezilecek_yerler', label: 'Gezilecek Yerler', icon: Compass, perm: 'canManagePlaces' },
    { id: 'firmalar', label: 'Firmalar', icon: Building2, perm: 'canManageCompanies' },
    { id: 'yardim_destek', label: 'Yardım ve Destek', icon: LifeBuoy, perm: 'canManageSupport' },
    { id: 'reviews', label: 'Yorum Yönetimi', icon: MessageSquareText, perm: 'canManageReviews' },
    { id: 'sikayetler', label: 'Yorum Şikayetleri', icon: Flag, perm: 'canManageReports' },
    { id: 'esnaf_users', label: 'Esnaf Hesapları', icon: UserCog, perm: 'canManageEsnaf' },
    { id: 'coupons', label: 'Kupon Yönetimi', icon: TicketPercent, perm: 'canManageCoupons' },
    { id: 'notifications', label: 'Bildirim Yönetimi', icon: BellRing, perm: 'canManageNotifications' },
    { id: 'admins', label: 'Admin Yönetimi', icon: ShieldCheck, perm: 'canManageAdmins' },
  ];

  const filteredItems = menuItems.filter(item => !item.perm || permissions[item.perm]);

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-2 shadow-lg shadow-indigo-500/20">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          Seydi Admin
        </span>
      </div>
      
      <nav style={{ flex: 1, overflowY: 'auto' }} className="sidebar-nav">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4 px-3">
          Menü
        </div>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-3 px-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 overflow-hidden shadow-inner">
            {userPhoto ? (
              <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <Users size={18} className="text-indigo-400" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{userName || 'Sistem Yöneticisi'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <p className="text-[10px] text-slate-500 font-medium">Aktif</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
