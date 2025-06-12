import type { LayerSpecification } from "maplibre-gl";

export function groupLayersByType(layers: LayerSpecification[]): Record<string, LayerSpecification[]> {
  const groups: Record<string, LayerSpecification[]> = {
    circle: [],
    line: [],
    fill: [],
    symbol: [],
    other: []
  };
  layers.forEach(layer => {
    if (groups[layer.type]) {
      groups[layer.type].push(layer);
    } else {
      groups.other.push(layer);
    }
  });
  return groups;
}