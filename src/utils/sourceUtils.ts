import type { StyleSpecification } from "maplibre-gl";

export const getSourcesFromStyle = (style: StyleSpecification): { [key: string]: string[] } => {
  const sources: { [key: string]: string[] } = {};
  if (!style || !style.layers) return sources;
  style.layers.forEach(layer => {
    if ("source" in layer && typeof layer.source === "string") {
      const source = layer.source;
      if (!sources[source]) {
        sources[source] = [];
      }
      sources[source].push(layer.id);
    }
  });
  return sources;
}
