import { useEffect, useState } from 'react';

export function useDeviceFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>('');

  useEffect(() => {
    const generateFingerprint = async () => {
      const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width,
        screen.height,
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage,
      ];

      const fingerprintString = components.join('|');
      
      // Simple hash function
      let hash = 0;
      for (let i = 0; i < fingerprintString.length; i++) {
        const char = fingerprintString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }

      setFingerprint(Math.abs(hash).toString(16));
    };

    generateFingerprint();
  }, []);

  return fingerprint;
}
