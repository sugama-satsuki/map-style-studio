import type { StyleSpecification } from 'maplibre-gl';
import { atom } from "jotai";

export const styleAtom = atom<StyleSpecification | undefined>();
export const mapAtom = atom<maplibregl.Map | null>(null);