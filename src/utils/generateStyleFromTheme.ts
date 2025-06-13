import type { StyleSpecification, LayerSpecification } from "maplibre-gl";

export type ThemeColorsType = {
    primary: string;
    secondary?: string;
    tertiary?: string;
};

// ユーティリティ: rgba()→HEX変換
function rgbaToHex(rgba: string): string {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return rgba;
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  const a = match[4] !== undefined ? Math.round(Number(match[4]) * 255) : 255;
  return (
    "#" +
    [r, g, b, a]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("")
      .replace(/ff$/, "") // アルファがffなら省略
  );
}

// レイヤー名から種別を推測
function guessLayerType(layer: LayerSpecification): "building" | "road" | "background" | "other" {
  const id = layer.id.toLowerCase();
  if (id.includes("building") || id.includes("建物")) return "building";
  if (id.includes("road") || id.includes("highway") || id.includes("道路")) return "road";
  if (id.includes("background") || id.includes("bg") || id.includes("背景")) return "background";
  return "other";
}

// 色をテーマに置換
function getThemeColor(type: "building" | "road" | "background" | "other", theme: ThemeColorsType) {
  if (type === "building") return theme.primary;
  if (type === "road") return theme.secondary || theme.primary;
  if (type === "background") return theme.tertiary || theme.secondary || theme.primary;
  return theme.primary;
}

// "fill-color"・"line-color"・"background-color" の値を置換
function replaceColorValue(value: unknown, themeColor: string): unknown {
  // match/step/interpolateなど式の場合はそのまま返す
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    // rgba()→HEX変換
    let color = value;
    if (/^rgba?\(/.test(color)) color = rgbaToHex(color);
    // HEXやrgb/rgba/hsl/hslaならテーマカラーに置換
    if (
      /^#([0-9a-f]{3,8})$/i.test(color) ||
      /^rgba?\(/.test(color) ||
      /^hsla?\(/.test(color)
    ) {
      return themeColor;
    }
  }
  return value;
}

// テーマカラーを薄めるユーティリティ
function lightenColor(hex: string, amount = 0.5): string {
  // hex: "#rrggbb" or "#rgb"
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.round(r + (255 - r) * amount);
  g = Math.round(g + (255 - g) * amount);
  b = Math.round(b + (255 - b) * amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const generateStyleFromTheme = async (theme: ThemeColorsType, originalStyle: StyleSpecification) => {
  const newStyle: StyleSpecification = JSON.parse(JSON.stringify(originalStyle));

  newStyle.layers = newStyle.layers.map(layer => {
    const type = guessLayerType(layer);
    const themeColor = getThemeColor(type, theme);

    const paint = { ...layer.paint } as Record<string, unknown>;

    if (layer.type === "background") {
      const baseColor = getThemeColor("background", theme);
      paint["background-color"] = lightenColor(baseColor, 0.6);
    } else {
      ["fill-color", "line-color", "background-color"].forEach(key => {
        if (paint && paint[key] !== undefined) {
          paint[key] = replaceColorValue(paint[key], themeColor);
        }
      });
    }

    // layoutがundefinedなら空オブジェクトに
    const layout = layer.layout === undefined ? {} : layer.layout;

    return { ...layer, paint, layout };
  });

  return newStyle;
};
