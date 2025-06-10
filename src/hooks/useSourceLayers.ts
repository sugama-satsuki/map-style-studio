import { useState } from "react";

export function useSourceLayers(url: string) {
  const [loading, setLoading] = useState(false);
  const [layers, setLayers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.vector_layers) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLayers(data.vector_layers.map((l: any) => l.id));
      } else {
        setError('vector_layersが見つかりません');
      }
    } catch (e) {
      setError(`取得に失敗しました。${e}`);
    }
    setLoading(false);
  };

  return { layers, loading, error, fetchLayers };
}
