import { MENU_GROUPS } from '../menu';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  permissions: Record<string, boolean>;
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, permissions, open, onClose }) => {
  const groups = MENU_GROUPS
    .map((group) => ({ ...group, items: group.items.filter((item) => !item.perm || permissions[item.perm]) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="logo">
          <img src="/icon.png" alt="" className="w-9 h-9 rounded-xl" />
          <div className="leading-tight">
            <p className="font-extrabold text-[15px] text-gray-900">Seydi Rehber</p>
            <p className="text-xs text-gray-500 font-medium">Yönetim Paneli</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="nav-group-title">{group.title}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
