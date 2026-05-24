import { useState, useEffect, useCallback } from 'react';
import { db } from '../../../lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  runTransaction,
  writeBatch,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import {
  Flag,
  Trash2,
  CheckCircle2,
  MessageSquare,
  MessageSquareOff,
  User,
  UserX,
  Clock,
  AlertTriangle,
  Eye,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ForumPost {
  id: string;
  user_id: string;
  display_name: string;
  is_anonymous: boolean;
  title: string;
  content: string;
  category: string;
  reply_count: number;
  report_count: number;
  is_hidden: boolean;
  reporter_ids: string[];
  created_at: Timestamp | null;
}

interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  display_name: string;
  is_anonymous: boolean;
  content: string;
  report_count: number;
  is_hidden: boolean;
  reporter_ids: string[];
  created_at: Timestamp | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(ts: Timestamp | null): string {
  if (!ts) return '';
  const diff = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (diff < 60) return 'Az önce';
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  return `${Math.floor(diff / 86400)} gün önce`;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  soru: { label: '❓ Soru', color: '#3b82f6' },
  tavsiye: { label: '💡 Tavsiye', color: '#22c55e' },
  etkinlik: { label: '📅 Etkinlik', color: '#f97316' },
  genel: { label: '💬 Genel', color: '#64748b' },
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ForumModeration = () => {
  const [tab, setTab] = useState<'posts' | 'replies'>('posts');
  const [hiddenPosts, setHiddenPosts] = useState<ForumPost[]>([]);
  const [hiddenReplies, setHiddenReplies] = useState<ForumReply[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [postReplies, setPostReplies] = useState<ForumReply[]>([]);

  // ── Live streams ────────────────────────────────────────────────────────────

  useEffect(() => {
    const q = query(
      collection(db, 'forum_posts'),
      where('report_count', '>', 0),
      orderBy('report_count', 'desc')
    );
    return onSnapshot(q, (snap) => {
      setHiddenPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumPost)));
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'forum_replies'),
      where('report_count', '>', 0),
      orderBy('report_count', 'desc')
    );
    return onSnapshot(q, (snap) => {
      setHiddenReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumReply)));
    });
  }, []);

  // ── Toast ───────────────────────────────────────────────────────────────────

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Actions ─────────────────────────────────────────────────────────────────

  const approvePost = useCallback(async (postId: string) => {
    setLoadingAction(postId);
    try {
      await runTransaction(db, async (tx) => {
        const ref = doc(db, 'forum_posts', postId);
        tx.update(ref, {
          is_hidden: false,
          report_count: 0,
          reporter_ids: [],
        });
      });
      showToast('Gönderi onaylandı ve yayına alındı.');
    } catch {
      showToast('İşlem başarısız.', 'error');
    } finally {
      setLoadingAction(null);
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    if (!confirm('Bu gönderiyi kalıcı olarak silmek istediğinize emin misiniz? Tüm yanıtlar da silinecek.')) return;
    setLoadingAction(postId);
    try {
      const batch = writeBatch(db);
      // Delete all replies
      const replies = await getDocs(query(collection(db, 'forum_replies'), where('post_id', '==', postId)));
      replies.docs.forEach((d) => batch.delete(d.ref));
      batch.delete(doc(db, 'forum_posts', postId));
      await batch.commit();
      showToast('Gönderi ve yanıtları kalıcı olarak silindi.');
      if (selectedPost?.id === postId) setSelectedPost(null);
    } catch {
      showToast('Silme işlemi başarısız.', 'error');
    } finally {
      setLoadingAction(null);
    }
  }, [selectedPost]);

  const approveReply = useCallback(async (replyId: string) => {
    setLoadingAction(replyId);
    try {
      await runTransaction(db, async (tx) => {
        tx.update(doc(db, 'forum_replies', replyId), {
          is_hidden: false,
          report_count: 0,
          reporter_ids: [],
        });
      });
      showToast('Yanıt onaylandı.');
    } catch {
      showToast('İşlem başarısız.', 'error');
    } finally {
      setLoadingAction(null);
    }
  }, []);

  const deleteReply = useCallback(async (replyId: string, postId: string) => {
    if (!confirm('Bu yanıtı kalıcı olarak silmek istediğinize emin misiniz?')) return;
    setLoadingAction(replyId);
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'forum_replies', replyId));
      batch.update(doc(db, 'forum_posts', postId), {
        reply_count: (postReplies.length > 0 ? postReplies.length - 1 : 0),
      });
      await batch.commit();
      showToast('Yanıt kalıcı olarak silindi.');
    } catch {
      showToast('Silme işlemi başarısız.', 'error');
    } finally {
      setLoadingAction(null);
    }
  }, [postReplies]);

  // ── View post replies (popup) ────────────────────────────────────────────────

  const viewPost = useCallback(async (post: ForumPost) => {
    setSelectedPost(post);
    const q = query(
      collection(db, 'forum_replies'),
      where('post_id', '==', post.id),
      orderBy('created_at', 'asc')
    );
    const snap = await getDocs(q);
    setPostReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumReply)));
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white">Forum Moderasyonu</h1>
        <p className="text-slate-400 font-medium mt-1">
          Şikayet edilen ve gizlenen içerikleri inceleyin, onaylayın veya kalıcı silin.
        </p>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div
          className="card flex items-center gap-4 cursor-pointer transition-all hover:border-indigo-500/50"
          style={{ borderColor: tab === 'posts' ? '#6366f1' : undefined, borderWidth: 1, borderStyle: 'solid' }}
          onClick={() => setTab('posts')}
        >
          <div className="p-3 rounded-2xl" style={{ background: '#6366f115', color: '#6366f1' }}>
            <MessageSquareOff size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Şikayetli Gönderi</p>
            <h2 className="text-3xl font-black text-white">{hiddenPosts.length}</h2>
          </div>
        </div>
        <div
          className="card flex items-center gap-4 cursor-pointer transition-all"
          style={{ borderColor: tab === 'replies' ? '#ec4899' : undefined, borderWidth: 1, borderStyle: 'solid' }}
          onClick={() => setTab('replies')}
        >
          <div className="p-3 rounded-2xl" style={{ background: '#ec489915', color: '#ec4899' }}>
            <Flag size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Şikayetli Yanıt</p>
            <h2 className="text-3xl font-black text-white">{hiddenReplies.length}</h2>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-2 mb-6 p-1 bg-slate-900 rounded-xl w-fit">
        {(['posts', 'replies'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg font-bold text-sm transition-all"
            style={{
              background: tab === t ? '#6366f1' : 'transparent',
              color: tab === t ? 'white' : '#64748b',
            }}
          >
            {t === 'posts' ? `Gönderiler (${hiddenPosts.length})` : `Yanıtlar (${hiddenReplies.length})`}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {tab === 'posts' ? (
        <PostsTab
          posts={hiddenPosts}
          loadingAction={loadingAction}
          onApprove={approvePost}
          onDelete={deletePost}
          onView={viewPost}
        />
      ) : (
        <RepliesTab
          replies={hiddenReplies}
          loadingAction={loadingAction}
          onApprove={approveReply}
          onDelete={deleteReply}
        />
      )}

      {/* ── Post Detail Modal ── */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          replies={postReplies}
          onClose={() => setSelectedPost(null)}
          loadingAction={loadingAction}
          onApprovePost={approvePost}
          onDeletePost={deletePost}
          onApproveReply={approveReply}
          onDeleteReply={deleteReply}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl font-semibold text-sm shadow-2xl flex items-center gap-2 transition-all"
          style={{
            background: toast.type === 'success' ? '#22c55e22' : '#ef444422',
            border: `1px solid ${toast.type === 'success' ? '#22c55e50' : '#ef444450'}`,
            color: toast.type === 'success' ? '#22c55e' : '#ef4444',
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

// ─── Posts Tab ────────────────────────────────────────────────────────────────

const PostsTab = ({
  posts,
  loadingAction,
  onApprove,
  onDelete,
  onView,
}: {
  posts: ForumPost[];
  loadingAction: string | null;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (post: ForumPost) => void;
}) => {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle2 size={40} />}
        title="İncelenecek gönderi yok 🎉"
        desc="Şu anda şikayet edilen gizlenmiş gönderi bulunmuyor."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        const cat = CATEGORY_LABELS[post.category] ?? { label: post.category, color: '#64748b' };
        const isLoading = loadingAction === post.id;
        return (
          <div key={post.id} className="card" style={{ borderLeft: '4px solid #ef4444' }}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Rapor badge */}
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ background: '#ef444420', color: '#ef4444' }}
                >
                  🚩 {post.report_count} Rapor
                </span>
                {/* Kategori */}
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ background: `${cat.color}20`, color: cat.color }}
                >
                  {cat.label}
                </span>
                {/* Anonim */}
                {post.is_anonymous && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 flex items-center gap-1">
                    <UserX size={11} /> Anonim
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
                <Clock size={11} /> {timeAgo(post.created_at)}
              </span>
            </div>

            {/* Kullanıcı */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center">
                {post.is_anonymous ? <UserX size={13} className="text-slate-500" /> : <User size={13} className="text-indigo-400" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-300">
                  {post.is_anonymous ? `Anonim (Gerçek: ${post.display_name})` : post.display_name}
                </span>
                <p className="text-[10px] text-slate-600 font-mono">{post.user_id}</p>
              </div>
            </div>

            {/* Başlık + içerik */}
            <p className="font-bold text-white mb-1.5">{post.title}</p>
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{post.content}</p>

            {/* Reply count */}
            <div className="flex items-center gap-1 mt-2 text-slate-600">
              <MessageSquare size={12} />
              <span className="text-xs">{post.reply_count} yanıt</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                onClick={() => onView(post)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{ background: '#6366f115', color: '#6366f1', border: '1px solid #6366f130' }}
              >
                <Eye size={13} /> Detay Gör
              </button>
              <button
                onClick={() => onApprove(post.id)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                style={{ background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e30' }}
              >
                {isLoading ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                Onayla & Yayına Al
              </button>
              <button
                onClick={() => onDelete(post.id)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                style={{ background: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}
              >
                {isLoading ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Kalıcı Sil
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Replies Tab ──────────────────────────────────────────────────────────────

const RepliesTab = ({
  replies,
  loadingAction,
  onApprove,
  onDelete,
}: {
  replies: ForumReply[];
  loadingAction: string | null;
  onApprove: (id: string) => void;
  onDelete: (id: string, postId: string) => void;
}) => {
  if (replies.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle2 size={40} />}
        title="İncelenecek yanıt yok 🎉"
        desc="Şu anda şikayet edilen gizlenmiş yanıt bulunmuyor."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {replies.map((reply) => {
        const isLoading = loadingAction === reply.id;
        return (
          <div key={reply.id} className="card" style={{ borderLeft: '4px solid #f97316' }}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ background: '#f9731620', color: '#f97316' }}
                >
                  🚩 {reply.report_count} Rapor
                </span>
                {reply.is_anonymous && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 flex items-center gap-1">
                    <UserX size={11} /> Anonim
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={11} /> {timeAgo(reply.created_at)}
              </span>
            </div>

            {/* Kullanıcı */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center">
                {reply.is_anonymous ? <UserX size={13} className="text-slate-500" /> : <User size={13} className="text-indigo-400" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-300">
                  {reply.is_anonymous ? `Anonim (Gerçek: ${reply.display_name})` : reply.display_name}
                </span>
                <p className="text-[10px] text-slate-600 font-mono">{reply.user_id}</p>
              </div>
            </div>

            {/* Post referansı */}
            <div className="flex items-center gap-1.5 mb-2 text-slate-600">
              <ChevronRight size={12} />
              <span className="text-[10px] font-mono">Gönderi: {reply.post_id}</span>
            </div>

            {/* İçerik */}
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">{reply.content}</p>

            {/* Actions */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                onClick={() => onApprove(reply.id)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                style={{ background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e30' }}
              >
                {isLoading ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                Onayla & Yayına Al
              </button>
              <button
                onClick={() => onDelete(reply.id, reply.post_id)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                style={{ background: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}
              >
                {isLoading ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Kalıcı Sil
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Post Detail Modal ────────────────────────────────────────────────────────

const PostDetailModal = ({
  post,
  replies,
  onClose,
  loadingAction,
  onApprovePost,
  onDeletePost,
  onApproveReply,
  onDeleteReply,
}: {
  post: ForumPost;
  replies: ForumReply[];
  onClose: () => void;
  loadingAction: string | null;
  onApprovePost: (id: string) => void;
  onDeletePost: (id: string) => void;
  onApproveReply: (id: string) => void;
  onDeleteReply: (id: string, postId: string) => void;
}) => {
  const cat = CATEGORY_LABELS[post.category] ?? { label: post.category, color: '#64748b' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: '#161c2d', border: '1px solid #1e293b' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="font-black text-white text-lg">Gönderi Detayı</h2>
            <p className="text-slate-500 text-xs mt-0.5">{post.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors text-lg font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>
              🚩 {post.report_count} Rapor
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: `${cat.color}20`, color: cat.color }}>
              {cat.label}
            </span>
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ background: post.is_hidden ? '#ef444415' : '#22c55e15', color: post.is_hidden ? '#ef4444' : '#22c55e' }}
            >
              {post.is_hidden ? 'Gizli' : 'Yayında'}
            </span>
          </div>

          {/* Kullanıcı bilgisi */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Gönderen</p>
            <p className="text-white font-bold">{post.display_name}</p>
            <p className="text-[10px] text-slate-500 font-mono">{post.user_id}</p>
            {post.is_anonymous && (
              <p className="text-xs text-orange-400 mt-1 flex items-center gap-1">
                <UserX size={11} /> Anonim olarak paylaştı
              </p>
            )}
          </div>

          {/* İçerik */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Gönderi İçeriği</p>
            <p className="font-bold text-white mb-2">{post.title}</p>
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => { onApprovePost(post.id); onClose(); }}
              disabled={loadingAction === post.id}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: '#22c55e20', color: '#22c55e', border: '1px solid #22c55e40' }}
            >
              <CheckCircle2 size={15} /> Onayla & Yayına Al
            </button>
            <button
              onClick={() => { onDeletePost(post.id); }}
              disabled={loadingAction === post.id}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: '#ef444420', color: '#ef4444', border: '1px solid #ef444440' }}
            >
              <Trash2 size={15} /> Kalıcı Sil
            </button>
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">
                Yanıtlar ({replies.length})
              </p>
              <div className="flex flex-col gap-2">
                {replies.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl border"
                    style={{
                      background: r.is_hidden ? '#ef444408' : '#1e293b50',
                      borderColor: r.is_hidden ? '#ef444430' : '#1e293b',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-300">
                        {r.is_anonymous ? `Anonim (${r.display_name})` : r.display_name}
                      </span>
                      <div className="flex gap-1.5">
                        {r.is_hidden && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                            Gizli • {r.report_count} rapor
                          </span>
                        )}
                        {r.is_hidden && (
                          <>
                            <button
                              onClick={() => onApproveReply(r.id)}
                              className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-bold hover:bg-green-500/30 transition-colors"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => onDeleteReply(r.id, r.post_id)}
                              className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold hover:bg-rose-500/30 transition-colors"
                            >
                              Sil
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{r.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="card flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 text-slate-700">{icon}</div>
    <p className="text-white font-bold text-lg mb-1">{title}</p>
    <p className="text-slate-500 text-sm">{desc}</p>
  </div>
);

export default ForumModeration;
