import type { StyleSpecification } from "maplibre-gl";

export type ThemeColorsType = {
    primary: string;
    secondary?: string;
    tertiary?: string;
}

export const sendToOpenAI = async (theme: ThemeColorsType, originalStyle: StyleSpecification) => {
  const res = await fetch('http://localhost:3001/api/transform-style', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme, style: originalStyle })
  });

  if (!res.ok) throw new Error('API error');

  const newStyle = await res.json();
  return newStyle;
};
