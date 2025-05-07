import { useState, useEffect, useMemo } from 'react';
import { StyleSpecification } from 'maplibre-gl';
import { Color } from '../components/ColorInput';
import { AggregationColor } from 'antd/es/color-picker/color';
import { adjustBackgroundColor, adjustRoadColor, adjustWaterColor } from '../util/colorController';


const useUpdateMapStyle = (initialStyle: StyleSpecification | undefined, primary: Color | undefined, layerColors: { [key: string]: AggregationColor | undefined } | undefined) => {
    
  const [updatedStyle, setUpdatedStyle] = useState<StyleSpecification | undefined>(initialStyle);

  const color = useMemo(() => { 
    if (!primary) { return ""; }
    const { r, g, b, a } = (primary as AggregationColor).toRgb();
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }, [primary]);

  useEffect(() => {
    if(!initialStyle || primary === "" || !primary) { return; }
    
    const newStyle = { ...initialStyle };

    newStyle.layers = newStyle.layers.map((layer) => {
      if (layer.id === 'background') {
        console.log('background layer: ', color);
        layer.paint = {
          ...layer.paint,
          'background-color': adjustBackgroundColor(color),
        };
      }

      if (layer.id === 'road-primary-highway') {
        layer.paint = {
          ...layer.paint,
          'line-color': color,
        };
      }
  
      if (layer.id === 'water-default') {
        layer.paint = {
          ...layer.paint,
          'fill-color': adjustWaterColor(color),
        };
      }
  
      if (layer.id === 'road-primary') {
        layer.paint = {
          ...layer.paint,
          'line-color': adjustRoadColor(color),
        };
      }
  
      if (layer.id === 'building-default') {
        layer.paint = {
          ...layer.paint,
          'fill-color': adjustRoadColor(color),
        };
      }
      return layer;
    });
    
    setUpdatedStyle(newStyle);

  }, [initialStyle, color]);



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

export default useUpdateMapStyle;
