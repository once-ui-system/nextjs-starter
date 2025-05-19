import { useState, useEffect } from 'react';

interface OgData {
  title: string;
  description: string;
  image: string;
  url: string;
  faviconUrl?: string;
}

export function useOgData(url: string | null) {
  const [ogData, setOgData] = useState<Partial<OgData> | null>(null);
  const [loading, setLoading] = useState(!!url);

  useEffect(() => {
    const fetchOgData = async () => {
      try {
        const response = await fetch(`/api/og/fetch?url=${encodeURIComponent(url!)}`);
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.message || data.error);
        }
        
        setOgData(data);
      } catch (error) {
        console.error('Error fetching og data:', error);
        setOgData(null);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchOgData();
    } else {
      setLoading(false);
      setOgData(null);
    }
  }, [url]);

  return { ogData, loading };
}

export function useOgImage(url: string | null) {
  const { ogData, loading } = useOgData(url);
  return { ogImage: ogData?.image || null, loading };
}