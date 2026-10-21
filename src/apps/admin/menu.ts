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
  ClipboardList,
  MessagesSquare,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  perm?: string;
  description?: string;
}

// Menü, panelde ne yapıldığına göre gruplandı; id'ler ManageCollection / AdminApp sekme anahtarlarıdır.
export const MENU_GROUPS: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Genel',
    items: [
      { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard, description: 'Bekleyen işler ve içerik sayıları' },
    ],
  },
  {
    title: 'Uygulama İçeriği',
    items: [
      { id: 'banners', label: 'Bannerlar', icon: Image, perm: 'canManageBanners', description: 'Ana sayfadaki kayan görseller' },
      { id: 'etkinlikler', label: 'Etkinlikler', icon: Calendar, perm: 'canManageEvents', description: 'Şehirdeki etkinlikler' },
      { id: 'gezilecek_yerler', label: 'Gezilecek Yerler', icon: Compass, perm: 'canManagePlaces', description: 'Tarihi ve turistik yerler' },
      { id: 'firmalar', label: 'Firmalar', icon: Building2, perm: 'canManageCompanies', description: 'İşletme rehberi' },
      { id: 'is_ilanlari', label: 'İş İlanları', icon: Briefcase, perm: 'canManageJobs', description: 'Uygulamadaki iş ilanları' },
      { id: 'surveys', label: 'Anketler', icon: ClipboardList, perm: 'canManageSurveys', description: 'Kullanıcılara gösterilen anketler' },
    ],
  },
  {
    title: 'Şehir Hizmetleri',
    items: [
      { id: 'noterler', label: 'Noterler', icon: Gavel, perm: 'canManageNotaries', description: 'Noter bilgileri' },
      { id: 'pazarlar', label: 'Pazarlar', icon: Store, perm: 'canManageMarkets', description: 'Halk pazarları' },
      { id: 'otobus_saatleri', label: 'Otobüs Saatleri', icon: Bus, perm: 'canManageBuses', description: 'Güzergahlar ve sefer saatleri' },
    ],
  },
  {
    title: 'Kullanıcılar ve Topluluk',
    items: [
      { id: 'yardim_destek', label: 'Destek Talepleri', icon: LifeBuoy, perm: 'canManageSupport', description: 'Kullanıcılardan gelen mesajlar' },
      { id: 'reviews', label: 'Yorumlar', icon: MessageSquareText, perm: 'canManageReviews', description: 'Firma ve yer yorumları' },
      { id: 'sikayetler', label: 'Yorum Şikayetleri', icon: Flag, perm: 'canManageReports', description: 'Şikayet edilen yorumlar' },
      { id: 'forum_moderation', label: 'Forum Moderasyonu', icon: MessagesSquare, perm: 'canManageForum', description: 'Şikayet edilen forum içerikleri' },
    ],
  },
  {
    title: 'İşletmeler',
    items: [
      { id: 'esnaf_users', label: 'Esnaf Hesapları', icon: UserCog, perm: 'canManageEsnaf', description: 'Esnaf paneli girişleri' },
      { id: 'coupons', label: 'Kuponlar', icon: TicketPercent, perm: 'canManageCoupons', description: 'Firma kuponları' },
    ],
  },
  {
    title: 'Sistem',
    items: [
      { id: 'notifications', label: 'Bildirim Gönder', icon: BellRing, perm: 'canManageNotifications', description: 'Tüm kullanıcılara push bildirimi' },
      { id: 'admins', label: 'Yöneticiler', icon: ShieldCheck, perm: 'canManageAdmins', description: 'Panel erişimi ve yetkiler' },
    ],
  },
];

export const findMenuItem = (id: string) =>
  MENU_GROUPS.flatMap((g) => g.items).find((item) => item.id === id);
