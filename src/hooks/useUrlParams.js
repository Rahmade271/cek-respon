//Mengambil user dan tutorial dari URL (versi Dicoding)
import { useMemo } from 'react';

export function useUrlParams() {
  return useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const userId = searchParams.get('user');          
    const tutorialId = searchParams.get('tutorial');  

    if (!userId || !tutorialId) {
      console.warn("Missing ?user= & ?tutorial= from URL iframe.");
      return null;
    }

    return { userId, tutorialId };
  }, []);
}