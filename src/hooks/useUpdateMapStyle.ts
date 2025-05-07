import { useState, useEffect } from 'react';
import { StyleSpecification } from 'maplibre-gl';
import { TinyColor } from '@ctrl/tinycolor';


const useUpdateMapStyle = (initialStyle: StyleSpecification | undefined, primary: string) => {
    
  const [updatedStyle, setUpdatedStyle] = useState<StyleSpecification | undefined>(initialStyle);

  const adjustBackgroundColor = (primaryColor: string): string => {
    const color = new TinyColor(primaryColor);
    const brightness = color.getBrightness(); // 明度

    const lightenValue = brightness < 128 ? 50 : 25; // 暗い色はより明るく
    const desaturateValue = brightness < 128 ? 5 : 10; // 暗い色は少し彩度を下げる
    console.log("lightenValue: ", lightenValue, desaturateValue);
  
    return color.lighten(lightenValue).desaturate(desaturateValue).toString();
  
  };

  const adjustWaterColor = (primaryColor: string): string => {
    const color = new TinyColor(primaryColor);
    const brightness = color.getBrightness();

    const lightenValue = brightness < 128 ? 35 : 10;
    const desaturateValue = brightness < 128 ? 60 : 40;

    return color.lighten(lightenValue).desaturate(desaturateValue).toString();
  };

  const adjustRoadColor = (secondaryColor: string): string => {
    const color = new TinyColor(secondaryColor);
    const brightness = color.getBrightness();

    const darkenValue = brightness > 128 ? 10 : 20;
    const desaturateValue = brightness > 128 ? 50 : 30;

    return color.darken(darkenValue).desaturate(desaturateValue).toString();
  };

  useEffect(() => {
    if(!initialStyle || primary === "") { return; }
    
    const newStyle = { ...initialStyle };

    newStyle.layers = newStyle.layers.map((layer) => {
      if (layer.id === 'background') {
        layer.paint = {
          ...layer.paint,
          'background-color': adjustBackgroundColor(primary),
        };
      }

      if (layer.id === 'road-primary-highway') {
        layer.paint = {
          ...layer.paint,
          'line-color': primary,
        };
      }
  
      if (layer.id === 'water-default') {
        layer.paint = {
          ...layer.paint,
          'fill-color': adjustWaterColor(primary),
        };
      }
  
      if (layer.id === 'road-primary') {
        layer.paint = {
          ...layer.paint,
          'line-color': adjustRoadColor(primary),
        };
      }
  
      if (layer.id === 'building-default') {
        layer.paint = {
          ...layer.paint,
          'fill-color': adjustRoadColor(primary),
        };
      }
      return layer;
    });
    
    setUpdatedStyle(newStyle);

  }, [initialStyle, primary]);

  return updatedStyle;
};

export default useUpdateMapStyle;
