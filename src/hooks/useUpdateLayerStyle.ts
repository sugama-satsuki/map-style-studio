import { useState, useEffect } from 'react';
import { StyleSpecification } from 'maplibre-gl';
import { AggregationColor } from 'antd/es/color-picker/color';


const useUpdateLayerStyle = (initialStyle: StyleSpecification | undefined, layerColors: { [key: string]: AggregationColor | undefined } | undefined) => {
    
  const [updatedStyle, setUpdatedStyle] = useState<StyleSpecification | undefined>(initialStyle);

  useEffect(() => {
    if(!initialStyle || !layerColors) { return; }
    
    const newStyle = { ...initialStyle };

    newStyle.layers = newStyle.layers.map((layer) => {
      const layerColor = layerColors[layer.id];

      if (layerColor) {
        const { r, g, b, a } = (layerColor as AggregationColor).toRgb();
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

        // レイヤーのタイプに応じて色を設定
        if (layer.type === 'fill') {
          layer.paint = {
            ...layer.paint,
            'fill-color': rgbaColor,
          };
        } else if (layer.type === 'line') {
          layer.paint = {
            ...layer.paint,
            'line-color': rgbaColor,
          };
        }
      }

      return layer;
    });
    
    setUpdatedStyle(newStyle);

  }, [initialStyle, layerColors]);

  return { updatedStyle };
};

export default useUpdateLayerStyle;
