import { useEffect, useState } from 'react';
import liff from '@line/liff';

export interface LiffUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
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
          setUser({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
          });
        } else {
          // Fallback to MOCK when not logged in inside LIFF (e.g. Chrome on localhost)
          loadMockUser();
        }
      } catch (err) {
        console.error('LIFF Init Error:', err);
        // Fallback to MOCK if initialization fails
        loadMockUser();
      } finally {
        setIsLiffLoading(false);
      }
    };

    const loadMockUser = () => {
      setUser({
        userId: 'U1234567890',
        displayName: 'นักชิม (Mock)',
        pictureUrl: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      });
    };

    initLiff();
  }, []);

  return { user, isLiffLoading, liff };
}
