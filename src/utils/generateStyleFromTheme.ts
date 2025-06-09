import type { StyleSpecification } from "maplibre-gl";

export type ThemeColorsType = {
    primary: string;
    secondary?: string;
    tertiary?: string;
}

// "fill-color"・"line-color"・"background-color" の値を正規表現で抽出
// rgba(...) → #HEX に変換
// 上記の方針に基づいてテーマカラーに差し替え
// 重要：各レイヤーで "match" や "step"、"interpolate" を使っているため、単純な置換では意図しない影響を及ぼすことがあるため注意

// 元の色の特徴	変換先の候補
// 濃い緑・自然系	primary
// 水色・青・道路背景など	secondary
// 薄色・背景色	tertiary
// 不透明度0や透明背景	保持 or rgba(0,0,0,0)


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
