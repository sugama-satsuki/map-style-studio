import type { StyleSpecification, LayerSpecification } from 'maplibre-gl';

export type CategoryColors = {
  building: string;
  background: string;
  grass: string;
  road: string;
  highway: string;
  water: string;
};

/**
 * レイヤー名やsource-layer名からカテゴリ判定し、色を変更する
 */
export function generateCategoryColorStyle(
  colors: CategoryColors,
  style: StyleSpecification
): StyleSpecification {
  // カテゴリ判定関数
  const matchLayer = (layer: LayerSpecification, pattern: RegExp) => {
    const sourceLayer = 'source-layer' in layer ? String(layer['source-layer']) : '';
    return pattern.test(layer.id) || pattern.test(sourceLayer);
  };

  const newLayers = style.layers?.map(layer => {
    let newLayer = { ...layer };

    // 建物
    if (
      matchLayer(layer, /building|建物|建築物|ビル/i) &&
      layer.type === "fill" &&
      newLayer.paint &&
      "fill-color" in newLayer.paint
    ) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, "fill-color": colors.building }
      } as LayerSpecification;
      console.log('Building color changed:', colors.building);
    }

    // 背景
    if (
      matchLayer(layer, /background|land|landuse/i) &&
      layer.type === "background" &&
      newLayer.paint &&
      "background-color" in newLayer.paint
    ) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, "background-color": colors.background }
      } as LayerSpecification;
      console.log('Background color changed:', colors.background);
    }

    // 草原
    if (
      matchLayer(layer, /grass|park|green|vegetation|草原|野原|荒野/i) &&
      layer.type === "fill" &&
      newLayer.paint &&
      "fill-color" in newLayer.paint
    ) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, "fill-color": colors.grass }
      } as LayerSpecification;
      console.log('Grass color changed:', colors.grass);
    }

    // 道
    if (
      matchLayer(layer, /road|street|道|道路|みち/i) &&
      layer.type === "line" &&
      newLayer.paint &&
      "line-color" in newLayer.paint
    ) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, "line-color": colors.road }
      } as LayerSpecification;
      console.log('Road color changed:', colors.road);
    }

    // 高速道路
    if (
      matchLayer(layer, /highway|motorway|expressway|高速|高速道路|こうそくどうろ/i) &&
      layer.type === "line" &&
      newLayer.paint &&
      "line-color" in newLayer.paint
    ) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, "line-color": colors.highway }
      } as LayerSpecification;
      console.log('Highway color changed:', colors.highway);
    }

    // 水域・海
    if (
      matchLayer(layer, /water|水域|海|sea|ocean|lake|river|pond|reservoir|canal|stream|bay|lagoon|pool|wetland|marsh|creek|channel|湖|川|池|貯水池|運河|小川|湾|湿地|沼地|水路/i) &&
      layer.type === "fill" &&
      newLayer.paint &&
      "fill-color" in newLayer.paint
    ) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, "fill-color": colors.water }
      } as LayerSpecification;
      console.log('Water color changed:', colors.water);
    }

    return newLayer;

  });

  return {
    ...style,
    layers: newLayers ?? style.layers
  };
}
