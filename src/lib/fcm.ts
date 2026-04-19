import * as jose from 'jose';

async function getAccessToken() {
  const rawKey = import.meta.env.VITE_FIREBASE_PRIVATE_KEY || '';
  const cleaned = rawKey.trim().replace(/^"+|"+$/g, '');
  const finalBase64 = cleaned
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/[^A-Za-z0-9+/=]/g, '');

  if (finalBase64.length < 1000) {
    console.warn("FCM Private key is missing or invalid in .env");
    return null;
  }

  const pkcs8 = `-----BEGIN PRIVATE KEY-----\n${finalBase64}\n-----END PRIVATE KEY-----`;

  try {
    const alg = 'RS256';
    const privateKey = await jose.importPKCS8(pkcs8, alg);
    const now = Math.floor(Date.now() / 1000);

    const jwt = await new jose.SignJWT({
      iss: import.meta.env.VITE_FIREBASE_CLIENT_EMAIL,
      sub: import.meta.env.VITE_FIREBASE_CLIENT_EMAIL,
      aud: 'https://oauth2.googleapis.com/token',
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      iat: now,
      exp: now + 3600
    })
      .setProtectedHeader({ alg })
      .sign(privateKey);

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error_description || data.error);
    return data.access_token;
  } catch (err: any) {
    console.error('TOKEN ERROR:', err);
    return null;
  }
}

export async function sendFCMNotification(
  title: string, 
  body: string, 
  targetRoute: string = '/', 
  targetToken?: string
) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error("FCM Access Token could not be retrieved");
    
    const url = `https://fcm.googleapis.com/v1/projects/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/messages:send`;
    
    const message = {
      message: {
        ...(targetToken ? { token: targetToken } : { topic: 'all' }),
        notification: { title, body },
        data: { 
          screen: targetRoute,
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        android: {
          priority: 'high',
          notification: { 
            channel_id: 'seydirehberim_notifications',
            sound: 'default'
          },
        },
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    return await response.json();
  } catch (error: any) {
    console.error('FCM Send Error:', error);
    throw error;
  }
}
