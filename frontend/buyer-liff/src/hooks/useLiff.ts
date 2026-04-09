import { useEffect, useState } from 'react';
import liff from '@line/liff';

export interface LiffUser {
  id?: string; // Our Backend User ID
  userId: string; // LINE UID
  displayName: string;
  pictureUrl?: string;
  points?: number;
}

export function useLiff() {
  const [user, setUser] = useState<LiffUser | null>(null);
  const [isLiffLoading, setIsLiffLoading] = useState(true);

  useEffect(() => {
    const initLiff = async () => {
      try {
        // Change this liffId to your real LIFF ID when ready
        await liff.init({ liffId: 'mock-liff-id' });
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const syncRes = await fetch('http://localhost:5001/api/auth/line', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lineUid: profile.userId,
              displayName: profile.displayName,
              pictureUrl: profile.pictureUrl
            })
          });
          const dbUser = await syncRes.json();
          
          setUser({
            id: dbUser.id,
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            points: dbUser.points
          });
        } else {
          loadMockUser();
        }
      } catch (err) {
        console.error('LIFF Init Error:', err);
        loadMockUser();
      } finally {
        setIsLiffLoading(false);
      }
    };

    const loadMockUser = async () => {
      // For localhost testing, we'll sync a mock user too
      const syncRes = await fetch('http://localhost:5001/api/auth/line', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineUid: 'U1234567890',
          displayName: 'นักชิม (Mock)',
          pictureUrl: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        })
      });
      const dbUser = await syncRes.json();

      setUser({
        id: dbUser.id,
        userId: 'U1234567890',
        displayName: 'นักชิม (Mock)',
        pictureUrl: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        points: dbUser.points
      });
    };

    initLiff();
  }, []);

  return { user, isLiffLoading, liff };
}
