import type { StyleSpecification } from 'maplibre-gl';
import { atom } from "jotai";

export const styleAtom = atom<string | StyleSpecification | undefined>();
export const mapAtom = atom<maplibregl.Map | null>(null);

export const openExpressionCreatorAtom = atom<boolean>(false);
