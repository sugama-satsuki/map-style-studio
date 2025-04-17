import { useState, useEffect } from 'react';
import { StyleSpecification } from 'maplibre-gl';

interface Colors {
  [key: string]: string;
}

const useUpdateMapStyle = (initialStyle: StyleSpecification | undefined, colors: Colors) => {
    
  const [updatedStyle, setUpdatedStyle] = useState<StyleSpecification | undefined>(initialStyle);

  useEffect(() => {
    if(!initialStyle) { return; }
    
    const newStyle = { ...initialStyle };

    newStyle.layers = newStyle.layers.map((layer) => {
      if (layer.paint) {
        if (colors.color1 && (layer.paint as Record<string, string>)['fill-color']) {
          (layer.paint as Record<string, string>)['fill-color'] = colors.color1;
        }
        if (colors.color2 && (layer.paint as Record<string, string>)['line-color']) {
          (layer.paint as Record<string, string>)['line-color'] = colors.color2;
        }
        if (colors.color3 && (layer.paint as Record<string, string>)['background-color']) {
            (layer.paint as Record<string, string>)['background-color'] = colors.color3;
        }
      }
      return layer;
    });

    setUpdatedStyle(newStyle);
  }, [colors, initialStyle]);

  return updatedStyle;
};

export default useUpdateMapStyle;
