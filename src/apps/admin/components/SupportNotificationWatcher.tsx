import { useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { sendFCMNotification } from '../../../lib/fcm';

const TARGET_ADMIN_EMAIL = 'mehmetirem305@gmail.com';

const SupportNotificationWatcher = () => {
  useEffect(() => {
    let isInitial = true;

    // Listen for support messages. We don't use a 'where' filter for 'notified' 
    // because we can't ensure new docs from the mobile app have it.
    // Instead, we filter in memory and only react to 'added' changes after the initial sync.
    const q = query(
      collection(db, 'yardim_destek'), 
      orderBy('tarih', 'desc'),
      limit(10) // Only watch recent ones to stay efficient
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (isInitial) {
        isInitial = false;
        console.log("Watcher: Initial sync complete. Watching for new support messages...");
        return;
      }

      for (const change of snapshot.docChanges()) {
        if (change.type === 'added') {
          const messageDoc = change.doc;
          const messageData = messageDoc.data();

          // Skip if already notified or if it's an old message that just entered our limit
          if (messageData.notified) continue;

          // Optional: Only notify if it's very recent (e.g., within the last 10 minutes)
          // This prevents notifications for old messages if the admin tab was closed for a long time
          const now = new Date().getTime();
          const msgTime = messageData.tarih?.toDate ? messageData.tarih.toDate().getTime() : now;
          if (now - msgTime > 10 * 60 * 1000) continue; 

          try {
            // 1. Mark as notified immediately to prevent other tabs/admins from sending
            await updateDoc(doc(db, 'yardim_destek', messageDoc.id), {
              notified: true
            });

            // 2. Get the target admin's UID
            const adminDoc = await getDoc(doc(db, 'admins', TARGET_ADMIN_EMAIL));
            if (!adminDoc.exists()) continue;

            const targetUid = adminDoc.data().uid;
            if (!targetUid) continue;

            // 3. Get FCM tokens for this UID
            const tokensQ = query(
              collection(db, 'user_tokens'),
              where('userId', '==', targetUid),
              where('isEnabled', '==', true)
            );
            const tokensSnapshot = await getDocs(tokensQ);
            
            if (tokensSnapshot.empty) continue;

            // 4. Send notifications
            const title = '🔔 Yeni Destek Mesajı';
            const body = `${messageData.ad_soyad || 'Bir kullanıcı'}: ${messageData.mesaj?.substring(0, 80) || ''}...`;
            const targetRoute = '/admin/support';

            const sendPromises = tokensSnapshot.docs.map(tokenDoc => {
              const token = tokenDoc.data().token;
              return sendFCMNotification(title, body, targetRoute, token);
            });

            await Promise.all(sendPromises);
            console.log(`Watcher: Notification sent to ${TARGET_ADMIN_EMAIL}`);

          } catch (err) {
            console.error('Watcher error:', err);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default SupportNotificationWatcher;
