import type { LayerSpecification } from "maplibre-gl";

export function groupLayersByType(layers: LayerSpecification[]): Record<string, LayerSpecification[]> {
  const groups: Record<string, LayerSpecification[]> = {
    point: [],
    line: [],
    polygon: [],
    symbol: [],
  };
  layers.forEach(layer => {
    if (groups[layer.type]) {
      groups[layer.type].push(layer);
    }
  });
  return groups;
}