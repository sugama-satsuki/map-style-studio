import { StyleSpecification } from "maplibre-gl";

export type MapLayerColorChangerOptions = {
    minzoom?: number;
    maxzoom?: number;
};

export type MapLayerColorChangerProps = {
    mapStyle: StyleSpecification | undefined;
    onChange: (style: StyleSpecification | undefined) => void;
    options?: MapLayerColorChangerOptions;
};
