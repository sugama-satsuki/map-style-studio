import type { StyleSpecification } from 'maplibre-gl';
import { atom } from "jotai";

export const styleAtom = atom<StyleSpecification | undefined>()