import type { Map as MaplibreMap, StyleSpecification } from 'maplibre-gl';
import { atom } from "jotai";

export const styleAtom = atom<string | StyleSpecification | undefined>();
export const mapAtom = atom<MaplibreMap | null>(null);
