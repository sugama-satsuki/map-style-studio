import { useState, useEffect } from 'react';
import { StyleSpecification } from 'maplibre-gl';
import { TinyColor } from '@ctrl/tinycolor';


interface Colors {
  [key: string]: string;
}

const useUpdateMapStyle = (initialStyle: StyleSpecification | undefined, colors: Colors) => {
    
  const [updatedStyle, setUpdatedStyle] = useState<StyleSpecification | undefined>(initialStyle);
  const { primary, secondary } = colors;

  const adjustBackgroundColor = (primaryColor: string): string => {
    // 例: primaryColorを少し薄くする
    return new TinyColor(primaryColor).lighten(50).desaturate(10).toString();
  };

  const adjustWaterColor = (primaryColor: string, secondaryColor?: string): string => {
    // 例: primaryColorに青みを加える
    return new TinyColor(primaryColor).desaturate(60).lighten(35).toString();
  };

  const adjustRoadColor = (secondaryColor: string): string => {
    // 例: secondaryColorを少し濃くする
    return new TinyColor(secondaryColor).darken(10).desaturate(50).toString();
  };

  useEffect(() => {
    if(!initialStyle) { return; }
    
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
          'fill-color': adjustWaterColor(primary, secondary),
        };
      }
  
      if (layer.id === 'road-primary') {
        layer.paint = {
          ...layer.paint,
          'line-color': adjustRoadColor(secondary || primary),
        };
      }
  
      if (layer.id === 'building-default') {
        layer.paint = {
          ...layer.paint,
          'fill-color': adjustRoadColor(secondary || primary),
        };
      }
      return layer;
    });

    setUpdatedStyle(newStyle);
  }, [colors, initialStyle, primary, secondary]);

  return updatedStyle;
};

export default useUpdateMapStyle;
