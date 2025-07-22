import type { StyleSpecification, LayerSpecification } from 'maplibre-gl';

type CategoryColors = {
  building: string;
  background: string;
  grass: string;
  road: string;
  highway: string;
  sea: string;
};


/**
 * レイヤーのidまたはsource-layer名が指定した正規表現にマッチするか判定する汎用関数
 * @param layer LayerSpecification
 * @param pattern RegExp
 * @returns boolean
 */
export function matchLayerByPattern(layer: LayerSpecification, pattern: RegExp): boolean {
  const sourceLayer = 'source-layer' in layer ? String(layer['source-layer']) : '';
  return pattern.test(layer.id) || pattern.test(sourceLayer);
}

/**
 * 指定したカテゴリごとの色でstyleを生成する
 */
export function generateCategoryColorStyle(
  colors: CategoryColors,
  style: StyleSpecification
): StyleSpecification {
  // レイヤー名やsource-layer名などでカテゴリを判定
  const isBuilding = (layer: LayerSpecification) => matchLayerByPattern(layer, /building/i);
  const isBackground = (layer: LayerSpecification) => matchLayerByPattern(layer, /background|land|landuse/i);
  const isGrass = (layer: LayerSpecification) => matchLayerByPattern(layer, /grass|park|green|vegetation/i);
  const isRoad = (layer: LayerSpecification) => matchLayerByPattern(layer, /road|street/i);
  const isHighway = (layer: LayerSpecification) => matchLayerByPattern(layer, /highway|motorway|expressway/i);
  const isSea = (layer: LayerSpecification) => matchLayerByPattern(layer, /sea|water|ocean|lake/i);

  const newLayers = style.layers?.map(layer => {
    let newLayer = { ...layer };

    // 建物
    if (isBuilding(layer) && newLayer.paint && 'fill-color' in newLayer.paint) {
      newLayer = {
        ...newLayer,
        paint: { 
            ...newLayer.paint, 
            'fill-color': colors.building 
        }
      };
    }
    // 背景
    if (isBackground(layer) && newLayer.paint && 'background-color' in newLayer.paint) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, 'background-color': colors.background }
      };
    }
    // 草原
    if (isGrass(layer) && newLayer.paint && 'fill-color' in newLayer.paint) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, 'fill-color': colors.grass }
      };
    }
    // 道
    if (isRoad(layer) && newLayer.paint && 'line-color' in newLayer.paint) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, 'line-color': colors.road }
      };
    }
    // 高速道路
    if (isHighway(layer) && newLayer.paint && 'line-color' in newLayer.paint) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, 'line-color': colors.highway }
      };
    }
    // 海
    if (isSea(layer) && newLayer.paint && 'fill-color' in newLayer.paint) {
      newLayer = {
        ...newLayer,
        paint: { ...newLayer.paint, 'fill-color': colors.sea }
      };
    }

    return newLayer;
  });

  return {
    ...style,
    layers: newLayers ?? style.layers
  };
}
