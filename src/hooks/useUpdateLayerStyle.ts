import { useState, useEffect } from 'react';
import { DataDrivenPropertyValueSpecification, PropertyValueSpecification, StyleSpecification } from 'maplibre-gl';
import { AggregationColor } from 'antd/es/color-picker/color';
import { MapLayerColorChangerOptions } from '../components/MapLayerColorChanger/types';

const useUpdateLayerStyle = (
  initialStyle: StyleSpecification | undefined, 
  layerColors: { [key: string]: AggregationColor | undefined } | undefined,
  options?: MapLayerColorChangerOptions
) => {
  const [updatedStyle, setUpdatedStyle] = useState<StyleSpecification | undefined>(undefined);

  useEffect(() => {
    if (!initialStyle || !layerColors) {
      return;
    }

    const newStyle = { ...initialStyle };

    newStyle.layers = newStyle.layers.map((layer) => {
      const layerColor = layerColors[layer.id];

      if (layerColor) {
        const { r, g, b, a } = (layerColor as AggregationColor).toRgb();
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

        // maxzoomがない場合は適切なデフォルト値を設定
        const maxzoom = options?.maxzoom ?? 24; // デフォルトで24（最大ズームレベル）を使用

        // レイヤーのタイプに応じて色を設定
        if (layer.type === 'fill') {
          const originalColor = layer.paint?.['fill-color'] ?? 'rgba(0, 0, 0, 0)';
          // TODO: 指定のズームレベルに対応したレイヤーを追加する（zoomレベル × ソースレイヤー）
          layer.paint = {
            ...layer.paint,
            'fill-color': options?.minzoom !== undefined
              ? ([
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  options.minzoom,
                  rgbaColor,
                  maxzoom,
                  originalColor, // ズーム範囲外では元の色を使用
                ] as unknown as DataDrivenPropertyValueSpecification<string>)
              : rgbaColor,
          };
          
        } else if (layer.type === 'background') {
          layer.paint = {
            ...layer.paint,
            'background-color': options?.minzoom !== undefined
              ? ([
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  options.minzoom,
                  rgbaColor,
                  maxzoom,
                  layer.paint?.['background-color'] ?? 'rgba(0, 0, 0, 0)', // ズーム範囲外では元の色を使用
                ]) as PropertyValueSpecification<string>
              : rgbaColor,
          };

        } else if (layer.type === 'line') {
          const originalColor = layer.paint?.['line-color'] ?? 'rgba(0, 0, 0, 0)';

          layer.paint = {
            ...layer.paint,
            'line-color': options?.minzoom !== undefined
              ? [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  options.minzoom,
                  rgbaColor,
                  maxzoom,
                  originalColor, // ズーム範囲外では元の色を使用
                ] as unknown as DataDrivenPropertyValueSpecification<string>
              : rgbaColor,
          };

        }

      }

      return layer;
    });

    setUpdatedStyle(newStyle);
  }, [initialStyle, layerColors, options]);

  return { updatedStyle };
};

export default useUpdateLayerStyle;
