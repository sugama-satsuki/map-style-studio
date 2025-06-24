import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";

export async function fetchSourceLayersFromTileJson(url: string): Promise<string[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const tilejson = await res.json();
    
    // もし、formatがpbfでvector_layersがない場合は、返ってきたpbfのURLをフェッチする
    if (tilejson.format === 'pbf' && !Array.isArray(tilejson.vector_layers)) {
      const pbfUrl = tilejson.tiles[0];
      console.log('Fetching PBF from URL:', pbfUrl);
      fetch(pbfUrl)
        .then(res => res.arrayBuffer())
        .then(buffer => {
            const tile = new VectorTile(new Pbf(buffer));
            console.log(Object.keys(tile.layers)); // ← sourceLayer名の一覧
        })
        .catch(err => console.error('Error fetching PBF:', err));
    }
    // tilejsonのvector_layersプロパティからsourceLayer名一覧を取得
    if (Array.isArray(tilejson.vector_layers)) {
      return tilejson.vector_layers.map((layer: maplibregl.LayerSpecification) => layer.id);
    }
    return [];
  } catch {
    return [];
  }
}
